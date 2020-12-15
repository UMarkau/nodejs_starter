const { db } = require("../db/db");
const {
  getDBUsers,
  getDBUser,
  updateDBUser,
  deleteDBUser,
  addDBUser,
} = require("../db/dbUtils");
const { generateAuthToken } = require("../utils");

exports.userController = () => {
  const register = async (req, res, next) => {
    try {
      const { login, password, email } = await req.body;
      const users = getDBUsers();
      const id = users.length;
      const token = generateAuthToken({ login, password, email });
      const data = { login, password, email, id, token, role: "user" };
      addDBUser(data);
      return res.status(200).json(data);
    } catch (error) {
      return res
        .status(404)
        .json({ message: "Some fields are not corrected!" });
    }
  };

  const login = async (req, res, next) => {
    try {
      const { login, password } = await req.body;
      const users = getDBUsers();
      const user = getDBUser({ login });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Your account is not corrected!" });
      }

      const isPasswordMatch = password === user.password;

      if (!isPasswordMatch) {
        return res
          .status(404)
          .json({ message: "Your password is not corrected!" });
      }

      const generatedToken = generateAuthToken(user);

      const userIndex = users.findIndex((u) => u.login === login);
      users[userIndex].token = generatedToken;

      db.push("/users", users);

      const data = {
        login: user.login,
        email: user.email,
        role: user.role,
        id: user.id,
        token: generatedToken,
      };

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const logout = async (req, res, next) => {
    try {
      const { id } = await req.body;
      const users = db.getData("/users");
      const userIndex = users.findIndex((u) => u.id === id);
      users[userIndex].token = null;
      db.push("/users", users);
      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const getAllUser = async (req, res, next) => {
    try {
      const users = db.getData("/users");
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const getUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = getDBUser({ id });

      if (!user) {
        return res
          .status(404)
          .json({ message: "There is no user with this id!" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const updateUser = async (req, res, next) => {
    try {
      const { id } = await req.params;
      const { login, password, email } = await req.body;
      const user = getDBUser({ id });

      if (!user) {
        return res
          .status(404)
          .json({ message: "There is no user with this id!" });
      }

      const updates = {
        login: login || user.login,
        email: email || user.email,
        password: password || user.password,
      };

      updateDBUser({ ...user, ...updates });
      return res.status(200).json(updates);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = getDBUser(id);

      if (!user) {
        return res
          .status(404)
          .json({ message: "There is no user with this id!" });
      }

      deleteDBUser(id);

      return res.status(200).json({ message: "DONE!" });
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  return {
    register,
    login,
    logout,
    getAllUser,
    deleteUser,
    updateUser,
    getUser,
  };
};
