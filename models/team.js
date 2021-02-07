const Sequelize = require("sequelize");
const { db } = require("../config/database");

const Team = db.define("team", {
  namaTeam: {
    type: Sequelize.STRING,
  },
  daerah: {
    type: Sequelize.STRING,
  },
  namaSekolah: {
    type: Sequelize.STRING,
  },
  logoSekolah: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
});

module.exports = {
  Team,
};
