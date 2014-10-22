#!/bin/bash

git pull origin

node bin/data.js development

if [ -f "./node.pid" ]
then
kill -9 $(cat ./node.pid)
fi

nohup node bin/app.js > ./node.log 2>&1 & echo $! > ./node.pid
