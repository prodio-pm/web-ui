var ORM = require('prodio-orm');

var Item = new ORM('item', {
  project_id: ORM.ID(),
  parent_id: ORM.Optional(ORM.ID()),
  name: ORM.String(),
  description: ORM.String(),
  version: ORM.Semver(),
  type: ORM.String(),
  status: ORM.String(),
  size: ORM.Number()
});

module.exports = Item;
