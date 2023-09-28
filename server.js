//Importing Express.js module
const express = require('express');

//Importing the contents of the routes folder
const routes = require('./routes');

// Import the sequelize connection to the database
const sequelize = require('./config/connection');

//Initializing the Express app (server)
const app = express();

//Stipulating the port at which the server should be listening
const port = process.env.PORT || 3001;

//Middleware for JSON and URL-encoded data that can be passed whithin the body of the request object in put and post routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware to connect with the routers created in the 'routes' folder
app.use(routes);

// Synchronize sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() =>
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
}));
