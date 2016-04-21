#!/bin/bash

pidFile="reasonerPID"

while IFS=' ' read pidREAD
do

kill -9 $pidREAD

done < $pidFile

rm $pidFile
