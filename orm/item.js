var ORM = require('prodio-orm');

var Item = new ORM('item', {
  project_id: ORM.ID(),
  parent_id: ORM.Optional(ORM.ID()),
  name: ORM.String(),
  description: ORM.Default('', ORM.String()),
  version: ORM.Optional(ORM.Semver()),
  type: ORM.String(),
  status: ORM.Optional(ORM.String()),
  size: ORM.Optional(ORM.Number()),
  _type: ORM.Value('item'),
});

module.exports = Item;
