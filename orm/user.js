var ORM = require('prodio-orm');

var User = new ORM('user', {
  username: ORM.String(),
  password: ORM.String(),
  email: ORM.Email(),
  defaultRights: ORM.Object({
    project: ORM.Object({
      read: ORM.Boolean(),
      write: ORM.Boolean(),
      create: ORM.Boolean(),
      delete: ORM.Boolean(),
      admin: ORM.Boolean()
    }),
    item: ORM.Object({
      read: ORM.Boolean(),
      write: ORM.Boolean(),
      create: ORM.Boolean(),
      delete: ORM.Boolean()
    })
  }),
  projects: ORM.Default([], ORM.Array(
      ORM.Object({
        project_id: ORM.ID(),
        rights: ORM.Optional({
          read: ORM.Boolean(),
          write: ORM.Boolean(),
          create: ORM.Boolean(),
          delete: ORM.Boolean(),
          admin: ORM.Boolean()
        })
      })
    ))
});

module.exports = User;
