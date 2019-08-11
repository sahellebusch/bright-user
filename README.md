# Bright User Service

My code challenge! There's a lot going on in here so I'll do my best to include everything.

### Prerequisites

#### Development

* docker
* docker-compose
* node/npm

#### For deployment

* stackery
* aws-cli
* aws-sam-cli

### Tests

This project utilizes docker-compose to run the service locally as well as running the integration tests. 

* to run locally: `npm run start`
* to run the tests: `npm run test`

Note: the tests run in a container that is watching and rebuilding the code as you save. To rerun the tests, simply run `npm run test:run`. See `package.json#scripts` for more details.


### API Documentation

Documentation is first class for this API. To view the documentation, start the service locally and then head to `0.0.0.0:3000/documentation` in a browser to view.

### Architecture

#### The Happiest of Lambdas

The design of this lambda is something I'm  pretty proud of. It utilizes the [HapiJS](https://github.com/hapijs/hapi) server framework which provides a useful `inject` method. `inject` is not only useful for integration tests, but it also useful _inside of a lambda_. This sounds questionable at first, but it means we don't actually have to _start_ the server in the lambda, nor maintain an interface with ECR, ECS, EKS, etc. At lambda warmup, it will build the server once. The cool thing about this design is that if you do need to scale out to a server farm, then you already have the server written and simply have to build out the infrastructure! 

#### Infrastructure

Because writing CloudFormation is a pain, I chose to give [Stackery](https://www.stackery.io/) a try. It allowed me to define the infrastructure I wanted without having to be an expert devops engineer. So what do we have here?

The hapi lambda "server" is the brains behind the entire service. It interfaces with AWS Secrets Manager, which stores the DB connection string. The lambda is accessible through a public facing API, which is powered by AWS API Gateway. The datastore is a RDS Postgres instance.

#### Using the API

Currently there are only two routes:

##### POST /user

``` bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name": "test", "username":"test", "email":"test@test.com", "phone": "123-456-7890"}' \
  https://swqbh8ulm5.execute-api.us-west-2.amazonaws.com/brightmd/user
```

##### GET /user/{email}

``` bash
curl --header "Content-Type: application/json" \
  --request GET \
  https://swqbh8ulm5.execute-api.us-west-2.amazonaws.com/brightmd/user/test@test.com
```

### TODOs

* email, username, phone should be unique
* dynamic query params for GET user route
* make types and joi schemas reusable
* authentication via access keys and secrets
* general cleanup, but I'm tired
