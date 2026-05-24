const userModel = require('../models/user.model');
const providerModel = require('../models/sprovider.model');

function getModelByRole(role) {
  if (role === "user") return userModel;
  if (role === "provider") return providerModel;

  return null;
}

module.exports = getModelByRole;
