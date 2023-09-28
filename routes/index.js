//Importing Express in order to initialize a router
const router = require('express').Router();

//Importing the routes defined inside the "api" folder
const apiRoutes = require('./api');

//Use the router as middleware for the routes starting with '/api'
router.use('/api', apiRoutes);

//Wildcard route sending a 404 ('resource not found') status code and a message to be rendered by the browser as an alert to the user.
router.use('*', (req, res) => {
  res.status(404).send("<h1>Wrong Route!</h1>")
});

//Shipping the router so that other modules can require it.
module.exports = router;