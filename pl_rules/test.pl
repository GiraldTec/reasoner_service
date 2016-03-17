state(meeting):-
	number_people(X),
	X > 5,
	light(on),!.
state(party):-
	number_people(X),
	X > 10,
	music(on),!.
state(empty1).
state(empty2).
state(empty3).

number_people(6).
light(off).
music(off).

main:-
setof((X,Y),(state(X),number_people(Y)),R),
write(R).
