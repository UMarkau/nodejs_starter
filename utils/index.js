const jsonwebtoken = require("jsonwebtoken");

const generateAuthToken = function (user) {
  const token = jsonwebtoken.sign(
    {
      id: user.id,
      username: user.username,
      isAdmin: user.role === "admin",
    },
    "secret"
  );
  return token;
};

exports.generateAuthToken = generateAuthToken;
