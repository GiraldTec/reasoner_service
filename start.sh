#!/bin/bash
node myapi.js > app.log &
echo $! > procesoID
