#!/usr/bin/env bash -e

docker-compose down -v --rmi all --remove-orphans
docker-compose -f docker-compose.test.yml -p user-api-test down -v --rmi all --remove-orphans

rm -rf node_modules || true
rm -rf postgres/data || true
rm -rf coverage || true
