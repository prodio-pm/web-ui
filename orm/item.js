var ORM = require('./orm');

var Item = new ORM('item', {
  project_id: ORM.ID(),
  name: ORM.String(),
  description: ORM.String(),
  version: ORM.Semver(),
  type: ORM.String(),
  status: ORM.String(),
  size: ORM.Number()
});

module.exports = Item;
