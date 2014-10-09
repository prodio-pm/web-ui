var ORM = require('prodio-orm');

var Edge = new ORM('edge', {
  project_id: ORM.ID(),
  source_id: ORM.ID(),
  destination_id: ORM.ID(),
  type: ORM.String(),
  _type: ORM.Value('edge'),
});

module.exports = Edge;
