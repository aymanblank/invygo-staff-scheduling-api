#!/bin/bash
yarn typeorm migration:run --dataSource ./dist/data/databases/mysql.js && yarn start
