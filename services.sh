#!/bin/bash
now=$(date +"%m_%d_%Y_%H:%M:%S")
node apis/reasoner_api.js > logs/reasoner/$now.log &
echo $! > reasonerPID
