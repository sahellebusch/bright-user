#!/bin/bash

npm install
npm run test
npm run compile
rm -rf node_modules
npm install --production
