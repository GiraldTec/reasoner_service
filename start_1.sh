#!/bin/bash
node myapi_1.js > app.log &
echo $! > procesoID
