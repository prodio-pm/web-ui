Proj
====

API
===

/api/v1/projects
----------------

/api/v1/project/{id}
--------------------

/api/v1/project/{id}/tree
-------------------------

/api/v1/project/{id}/branch/{id}
--------------------------------

/api/v1/project/{id}/item/{id}
------------------------------

/api/v1/project/{id}/find?q={expression}&u={under}
--------------------------------------------------

/api/v1/users
-------------

/api/v1/user/{id}
-----------------

Web UI
======

CLI
===

To use the CLI you will need to install it:

```
npm install -g proj-cli
```

proj init
---------

proj init [name] [version] [host] [-d Description]

```
Project Name:
Project Description:
Project Version:
Project Host:
Project Username:
```

proj set [key] [value]

```
Key:
Value:
```

Examples:
```
proj set username jdarling
proj set global username jdarling
```

proj add
--------

proj add [type] [value]

```
Type (user, task, group, note):
Value:
```

proj add note to [type] [value]
```
Type (user, task, group, note):
Value:
```

Examples:
```
proj add user jdarling
proj add task Document things better
proj add note to "Document things better" This is my note
```

proj remove
-----------

proj remove [type] [id]

```
Type (user, task, group, note):
ID:
```

Examples:
```
proj remove note This is my note
proj remove task Document things better
proj remove user jdarling
```

proj assign
-----------

proj assign [type] [id] [user] [user...]

```
Type (user, task, group, note):
ID:
User(s):
```

proj assigned to
----------------

proj assigned to <who>

Examples:
```
proj assigned to me
proj assigned to jdarling
```

proj unassing
-------------

proj unassign [type] [id] [user] [user...]

```
Type (user, task, group, note):
ID:
User(s):
```

proj update
-----------

proj update [id] [status]

```
ID:
Status (started, completed, in progress):
```

proj link
---------

proj link [id] to [id]

proj unlink
-----------

proj unlink [id] from [id]

proj list
---------

proj list [id]

Sample Output: proj list
```
0) My Project
  1) My Group
    2) Task 1
    3) Task 2
      4) Note: ...
      5) Note: ...
  6) Group 2
    7) Task 1
    8) Another Task
      9) Sub task
        10) Note: Sub task note
      11) Note: Some Note
```

proj find
---------

proj find <expression> [under id]
or
proj find <expression>

Sample Output: proj find task
```
2) Task 1
3) Task 2
7) Task 1
8) Another Task
9) Sub task
10) Note: Sub task note
```

Sample Output: proj find task under 8
```
9) Sub task
10) Note: Sub task note
```

proj detail
-----------

proj detail <id> [full]

Sample Output: proj detail 8
```
0) My Project
  6) Group 2
    8) Another Task
```
Sample Output: proj detail 8 full

```
0) My Project
  6) Group 2
    8) Another Task
      9) Sub task
        10) Note: Sub task note
      11) Note: Some Note
```
