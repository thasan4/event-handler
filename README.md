# Event-Handler

## Description

The Event-Handler is a router-app that handles incoming events and routes them to one or multiple destinations. It exposes a simple HTTP-endpoint for authorized clients to send HTTP-requests. The app operates based on the specified destinations config and routing strategy. Clients can specify a custom strategy in their request.

## Configuration

The Event-Handler is configured via environment variables. The following variables are available:

- `PORT`: The port the app listens on. Defaults to `8080`.
- `MONGODB_URI`: The URI of the MongoDB instance to use.
- `JWT_SECRET`: The secret used to sign and verify JWTs.
- `MONGO_INITDB_ROOT_USERNAME`: The username of the MongoDB root user.
- `MONGO_INITDB_ROOT_PASSWORD`: The password of the MongoDB root user.
- `MONGO_INITDB_DATABASE`: The name of the MongoDB database to use.

## Installation

The Event-Handler is a Node.js app. To install it, run `yarn install` in the root directory of the app.

## Running

### Local

Create a `.env`-file in the root directory of the app and set the environment variables described in the configuration section. Then run `yarn start` to start the app.

### Docker Compose

The Event-Handler can be run as a Docker container. To do so, run `docker-compose up` in the root directory of the app. This will start the app and a MongoDB instance. The MongoDB instance will be initialized with the root user and the database specified in the environment variables. The MongoDB instance will be exposed on port `27017`. The Event-Handler will be exposed on port `8080`.
> Note: If you run `docker-compose up` `docker-compose.override.yml` file will be injected into the `docker-compose.yml` file. That is used for development purposes. If you want to run the app in production mode, you should run `docker-compose -f docker-compose.yml up`.

## Usage

The Event-Handler exposes a single HTTP-endpoint at `/events`. Clients can send HTTP-requests to this endpoint to trigger the event handling. The endpoint expects a JSON-body with the following structure:

```json
{
  "payload": {
    "key": "value"
  },
  "strategy": "strategy-name",
  "possibleDestinations": [
    {
      "destination1": true,
      "destination2": false
    },
    ...
  ]
}
```

The `payload`-field contains the data that should be sent to the destinations. The `strategy`-field specifies the strategy to use for routing the event. The `possibleDestinations`-field contains a list of possible destinations. The keys of the objects in the list are the names of the destinations. The values are booleans that indicate whether the destination should be used or not.
