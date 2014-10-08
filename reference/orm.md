Log
===

```
Log{
  _id: ID()
  action: 'insert'||'upadte'||'delete'
  actor: '' // typically username, but could be system or another value
  user_id: Null||ID()
  project_id: Null||ID()
  class: 'project'||'item'||'edge'...
  object: {}
}
```

Project
=======

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
====

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
====

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
====

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
