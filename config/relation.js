const { User } = require("../models/user");
const { Team } = require("../models/team");

Team.hasMany(User);
User.belongsTo(Team);
