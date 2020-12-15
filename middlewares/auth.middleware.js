const jsonwebtoken = require("jsonwebtoken");
const { getDBUser } = require("../db/dbUtils");

exports.authMiddleWare = async (req, res, next) => {
  try {
    const authorization = await req.header("Authorization");

    if (!authorization) {
      res.status(401).send({
        message: "Not authorized to do this action",
      });
    }

    const token = authorization.replace("Bearer ", "");

    const data = jsonwebtoken.verify(token, "secret");

    const user = getDBUser({ id: data.id });

    if (!user) {
      return res.status(401).send({
        message: "Not authorized to do this action",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: `${JSON.stringify(error)}` });
  }
};
