const Sequelize = require("sequelize");
const { db } = require("../config/database");

const User = db.define("user", {
  nama: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  notelp: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fotoId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = {
  User,
};
