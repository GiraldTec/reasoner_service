#!/bin/bash

pidFile="procesoID"
logFile="app.log"

while IFS=' ' read pidREAD
do

kill -9 $pidREAD

done < $pidFile

rm $pidFile
rm $logFile
