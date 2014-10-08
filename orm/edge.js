var ORM = require('./orm');

var Edge = new ORM('edge', {
  project_id: ORM.ID(),
  source_id: ORM.ID(),
  destination_id: ORM.ID(),
  type: ORM.String()
});

module.exports = Edge;
