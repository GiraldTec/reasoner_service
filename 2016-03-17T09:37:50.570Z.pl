result(open_window):-
room_temperature(X0),
X0 > 25,
window(X1),
X1 == closed.
result(meeting):-
number_people(X0),
X0 > 2.
result(party):-
number_people(X0),
X0 > 2,
music_system(X1),
X1 == on.

number_people(3).