# ScalyShop Backend

Scaly Shop is a three-tier Web application built using [Vue.js](https://vuejs.org/) in combination with [BootstrapVue](https://bootstrap-vue.org) on the frontend and [Express](https://expressjs.com) on the backend that provides the basic infrastructure for a JSON API with MongoDB persistency with [Mongoose](https://mongoosejs.com/).

## Backend Structure

| File        | Purpose           | What you do?  |
| ------------- | ------------- | ----- |
| [README.md](./README.md) | Everything about the backend server | **READ ME** carefully! |
| [app.js](./app.js) | JavaScript entry point for Express application | Import new routes/controllers |
| [controllers/orders.js](controllers/orders.js) and [controllers/products.js](controllers/products.js) | Implementation of Express endpoints | Define new route handlers |
| [models/order.js](models/order.js) and [models/product.js](models/product.js) | [Mongoose](https://mongoosejs.com/) models | Define data schema |
| [tests/server.postman_collection.json](tests/server.postman_collection.json) | [Postman test scripts](https://learning.postman.com/docs/postman/scripts/test-scripts/) | - |
| [stress_data/stress_test_product.json](stress_data/stress_test_product.json) | Product test example for stress tests | — |
| [dummy_data/](dummy_data/) | Product test data | — |
| [package.json](package.json) | Project meta-information | — |

## Requirements

* [Node.js](https://nodejs.org/en/download/) (v12) => installation instructions for [Linux](https://github.com/nodesource/distributions), use installers for macOS and Windows (don't forget to restart your Bash shell)
* [MongoDB](https://www.mongodb.com/download-center/community?jmp=nav) (v4) must be running locally on port 27017 => installation instructions for [macOS](https://github.com/joe4dev/dit032-setup/blob/master/macOS.md#mongodb), [Windows](https://github.com/joe4dev/dit032-setup/blob/master/Windows.md#mongodb), [Linux](https://github.com/joe4dev/dit032-setup/blob/master/Linux.md#mongodb)
* [Docker](https://www.docker.com) => installation instructions for [macOS](https://docs.docker.com/desktop/mac/install/), [Linux](https://docs.docker.com/engine/install/) and [Windows](https://docs.docker.com/desktop/windows/install/)

## Project setup

Make sure, you are in the backend directory `cd scalyshop-backend`

Installs all project dependencies specified in [package.json](./package.json).

```bash
npm install
```

## Start the server with auto-restarts for development

Automatically restarts your server if you save any changes to local files.

```bash
npm run dev
```

## Start the server
```bash
npm start
```

## MongoDB Setup
#### Run Mongo Daemon in the background
```bash
mongod
```
#### Connect to Mongo Shell
```bash
mongo # On Windows
mongosh # On MacOS
```
#### Create a New Database with Authentication
```bash
use scalyDB 
db.createUser({user:"<<USERNAME>>", pwd:"<<PASSWORD>>", roles:["readWrite"]})
```
#### Connect to Mongo Shell with authentication
```bash
mongo -u <</USERNAME/>> -p <</PASSWORD/>> scalyDB # On Windows
mongo -u <</USERNAME/>> -p <</PASSWORD/>> scalyDB # On MacOS
```
## Debugging with VSCode

Set a breakpoint and click *Debug > Start Debugging*

> Learn more in the [VSCode Debugging Docs](https://code.visualstudio.com/docs/editor/debugging).
