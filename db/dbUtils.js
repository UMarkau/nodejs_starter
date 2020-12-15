const { db } = require("./db");

const getDBUsers = () => db.getData("/users");

const getDBUser = ({ login, id }) => {
  if (login) {
    return getDBUsers().find((dbUser) => dbUser.login === login);
  }
  if (id) {
    return getDBUsers().find((dbUser) => dbUser.id === id);
  }
};

const addDBUser = (user) => {
  const users = getDBUsers();
  db.push("/users", [...users, user]);
};

const updateDBUser = (updatedUser) => {
  const users = getDBUsers();
  const updatedUserIndex = users.findIndex(
    (user) => user.id === updatedUser.id
  );
  users[updatedUserIndex] = updatedUser;
  db.push("/users", users);
};

const deleteDBUser = (id) => {
  const users = getDBUsers();
  const updatedUsers = users.filter((user) => user.id === id);
  db.push("/users", updatedUsers);
};

exports.getDBUser = getDBUser;
exports.getDBUsers = getDBUsers;
exports.addDBUser = addDBUser;
exports.updateDBUser = updateDBUser;
exports.deleteDBUser = deleteDBUser;
