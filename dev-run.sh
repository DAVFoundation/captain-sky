#!/bin/bash

cp -R /build/dav-js/src/. /app/node_modules/dav-js/src
cp -R /build/dav-js/build/. /app/node_modules/dav-js/build
cp /build/dav-js/package.json ./node_modules/dav-js
mkdir -p ./app/temp-dav
cp -R ./temp-dav ./app/temp-dav
cd ./node_modules/dav-js
npm i
cd ../..
nodemon --inspect=0.0.0.0:9229 src/index.js
