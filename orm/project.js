var ORM = require('./orm');

var Project = new ORM('project', {
  name: ORM.String(),
  description: ORM.String(),
  version: ORM.Semver(),
});

module.exports = Project;
