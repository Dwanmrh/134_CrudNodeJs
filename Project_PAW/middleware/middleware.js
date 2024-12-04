function validateUserData(req, res, next) {
  const { id, email, username, password } = req.body;

  if (!id || !email || !username || !password) {
    return res.status(400).send("All fields are required!");
  }
  next();
}

module.exports = { validateUserData };
