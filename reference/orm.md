ORM Overview
============

The ORM for Prodio is not your standard implementation, it allows for member
upgrades and downgrades.  To account for this you should check for a member
on the root and then in the meta segment if it is not found there.

You can post all of your data on the root of your ojbect and the backend will
automatically migrate data that isn't within the ORM root to the meta segment.

Anything posted to the meta segment will NOT be automatically moved to the root.

Log
---

```
Log{
  _id: ID()
  action: 'insert'||'upadte'||'delete'
  actor: '' // typically username, but could be system or another value
  user_id: Null||ID()
  actor_id: Null||ID() // ID of the object being acted upon
  class: 'project'||'item'||'edge'...
  object: {}
}
```

Project
-------

```
Project{
  _id: ID()
  name: ''
  description: ''
  version: ''
  _created: Date()
  _updated: Date()
  _deleted: Null||Date()
  meta: {}
}
```

Item
----

```
Item{
  _id: ID()
  project_id: ID()
  name: ''
  description: ''
  version: ''
  type: ''
  status: ''
  size: Number
  _created: Date()
  _updated: Date()
  _deleted: Null||Date()
  meta: {}
}
```

Edge
----

```
Edge{
  project_id: ID()
  source_id: ID()
  destination_id: ID()
  type: 'parent'||'predecessor'||''
  _created: Date()
  _updated: Date()
  _deleted: Null||Date()
  meta: {}
}
```

User
----

```
User{
  username: ''
  password: Hash('')
  email: ''
  defaultRights: {
    project: {
      read: Boolean
      write: Boolean
      create: Boolean
      delete: Boolean
      admin: Boolean
    }
    item: {
      read: Boolean
      write: Boolean
      create: Boolean
      delete: Boolean
    }
  }
  projects: [
      {
        project_id: ID(),
        rights: {
          read: Boolean
          write: Boolean
          create: Boolean
          delete: Boolean
          admin: Boolean
        }
      },
      ...
    ]
  _created: Date()
  _updated: Date()
  _deleted: Null||Date()
}
```
