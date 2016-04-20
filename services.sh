#!/bin/bash
now=$(date +"%m_%d_%Y")
node apis/reasoner_api.js > logs/reasoner_$now.log &
echo $! > reasonerPID
