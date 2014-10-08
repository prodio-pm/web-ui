Critical Path Analysis
======================

https://www.youtube.com/watch?v=acSKQmVsVPg
Activity Diagram displaying Forward Pass and Backward Pass estimation based
on earliest start, latest start, earliest finish, and latest finish.

Where

ES A EF

LS T LF

Where
    ES = Earliest Start
    LS = Latest Start
    A = Activity
    T = Time
    EF = Earliest Finish
    LF = Latest Finish

ES is the Earliest time you could start on the activity (max) Predecessors EF

LS is calculated as LF - T

T the time that the activity will take

EF is calculated as ES + T

LF is the latest time you could finish to hit your goal. Calculated as (min)
LS of predecessors.

ES can equal LS, thus EF can equal LF

ES will actually be the largest of the EF's of all its predecessors since it
can not be started until all its predecessors are complete.

Dependency Tree
===============

Shows what needs to be completed to complete a particular task.
