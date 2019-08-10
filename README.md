# Bright User Service

My code challenge! There's a lot going on in here so I'll do my best to include everything.

### Prerequisites

* docker
* docker-compose
* node/npm

### Tests

This project utilizes docker-compose to run the service locally as well as running the integration tests. 

* to run locally: `npm run start`
* to run the tests: `npm run test`

Note: the tests run in a container that is watching and rebuilding the code as you save. To rerun the tests, simply run `npm run test:run`. See `package.json#scripts` for more details.


### API Documentation

Documentation is first class for this API. To view the documentation, start the service locally and then head to `0.0.0.0:3000/documentation` in a browser to view.


### TODOs

email, username, phone should be unique. 
