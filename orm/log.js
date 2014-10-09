var ORM = require('prodio-orm');

var Log = new ORM('log', {
  action: ORM.String(),
  actor: ORM.String(),
  Log_id: ORM.Nullable(ORM.ID()),
  actor_id: ORM.Nullable(ORM.ID()),
  class: ORM.String(),
  object: ORM.Object(),
  _type: ORM.Value('log'),
});

module.exports = Log;
