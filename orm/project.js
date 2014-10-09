var ORM = require('prodio-orm');

var Project = new ORM('project', {
  name: ORM.String(1),
  description: ORM.Optional(ORM.String()),
  version: ORM.Default('0.0.1', ORM.Semver()),
  _type: ORM.Value('project'),
});

module.exports = Project;
