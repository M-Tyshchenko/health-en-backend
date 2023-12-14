
async function getCurrentUser (req, res, next) {
    console.log(req.user)
    res.status(200).json({ 'message': 'this is current user :)' });
};

async function updateUser (req, res, next) {
    res.status(200).json({ 'message': 'this is updated user :)' });
};

async function updateGoal (req, res, next) {
    res.status(200).json({ 'message': 'this is new goal :)' });
};

async function updateWeight (req, res, next) {
    res.status(200).json({ 'message': 'this is new weight :)' });
};

async function saveFoodIntake (req, res, next) {
    res.status(200).json({ 'message': 'food is intaked' });
};

async function updateFoodIntake (req, res, next) {
    const { id } = req.params;
    res.status(200).json({ 'message': `food intake ${id} updated` });
};

async function deleteFoodIntake (req, res, next) {
    res.status(200).json({ 'message': `food intake deleted` });
};

module.exports = { 
    getCurrentUser, 
    updateUser, 
    updateGoal,
    updateWeight, 
    saveFoodIntake,
    updateFoodIntake,
    deleteFoodIntake
};