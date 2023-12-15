const bcrypt = require("bcrypt");

const crypto = require("node:crypto");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const ElasticEmail = require("@elasticemail/elasticemail-client");

const gravatar = require("gravatar");

const User = require("../models/user");

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
async function register(req, res, next) {
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

  try {
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
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res.status(409).json({ message: "Email in use" });
    }
    next(err);
  }
}

// --------------- LOGIN ---------------------//
async function login(req, res, next) {
  const body = loginSchema.validate(req.body);

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1w" });
  await User.findByIdAndUpdate(user._id, { token });

  try {
    jwt.verify(token, SECRET_KEY);

    res.json({
      token,
      user: { email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

// --------------- FORGOT PASSWORD ---------------------//
async function forgotPsw(req, res, next) {
  const newPassword = crypto.randomUUID();
  const hashPassword = await bcrypt.hash(newPassword, 10);

  const body = forgotSchema.validate(req.body);

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.token !== "") {
      return res.status(400).json({ message: "User has already been passed" });
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
  } catch (error) {
    next(error);
  }
}

// --------------- LOGOUT ---------------------//
async function logout(req, res) {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
}

module.exports = {
  register,
  login,
  forgotPsw,
  logout,
};
