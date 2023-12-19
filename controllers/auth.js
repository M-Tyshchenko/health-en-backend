const bcrypt = require("bcrypt");

const crypto = require("node:crypto");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const ElasticEmail = require("@elasticemail/elasticemail-client");

const gravatar = require("gravatar");

const User = require("../models/user");

const { HTTPError, ctrlWrapper } = require("../helpers");

const {
  authSchema,
  loginSchema,
  forgotSchema,
} = require("../routes/schemas/auth");

const { calories, drink, elements } = require("../helpers/calculations");

const SECRET_KEY = process.env.SECRET_KEY;

const FROM_EMAIL = process.env.FROM_EMAIL;
const defaultClient = ElasticEmail.ApiClient.instance;
const { apikey } = defaultClient.authentications;
apikey.apiKey = process.env.ELASTIC_API_KEY;
const api = new ElasticEmail.EmailsApi();

// --------------- REGISTRATION ---------------------//
async function register(req, res) {
  const body = authSchema.validate(req.body);
  const userBody = body.value;

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const { email, password, goal, gender, age, height, weight, activity } =
    req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const bmr = calories(gender, age, height, weight, activity);
  const water = drink(weight, activity);
  const nutrients = elements(goal, bmr);

  const newUser = await User.create({
    ...userBody,
    password: hashPassword,
    avatarURL,
    bmr,
    water,
    nutrients: {
      protein: nutrients.protein,
      fat: nutrients.fat,
      carbonohidrates: nutrients.carbonohidrates,
    },
  });

  res.status(201).json({
    user: { name: newUser.name, email: newUser.email },
  });
}

// --------------- LOGIN ---------------------//
async function login(req, res) {
  const body = loginSchema.validate(req.body);

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HTTPError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HTTPError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1w" });
  await User.findByIdAndUpdate(user._id, { token });

  jwt.verify(token, SECRET_KEY);

  res.json({
    token,
    user: { email: user.email },
  });
}

// --------------- FORGOT PASSWORD ---------------------//
async function forgotPsw(req, res) {
  const newPassword = crypto.randomUUID();
  const hashPassword = await bcrypt.hash(newPassword, 10);

  const body = forgotSchema.validate(req.body);

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const { email } = req.body;

  const user = await User.findOne({ email }).exec();

  if (user === null) {
    throw HTTPError(404, "User not found");
  }

  if (user.token !== "") {
    throw HTTPError(400, "User has already logged in");
  }

  await User.findByIdAndUpdate(user._id, { password: hashPassword });

  const forgotPswEmail = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [new ElasticEmail.EmailRecipient(email)],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: `If you forgot your password, use this one: ${newPassword}`,
        }),
      ],
      Subject: "You forgot your password for login in Health app",
      From: FROM_EMAIL,
    },
  });

  api.emailsPost(forgotPswEmail);

  res.json({ message: "New password sent" });
}

// --------------- LOGOUT ---------------------//
async function logout(req, res) {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  forgotPsw: ctrlWrapper(forgotPsw),
  logout: ctrlWrapper(logout),
};
