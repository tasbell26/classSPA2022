const express = require("express");
const mongoose = require("mongoose");
// Require dotenv to load environment variables

const dotenv = require("dotenv");
// Require models
const pizzas = require("./routers/pizzas");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4040; // we use || to provide a default value

mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
// this is important to show you there was an error
db.on("error", console.error.bind(console, "Connection Error:"));
db.once(
  "open",
  console.log.bind(console, "Successfully opened connection to Mongo!")
);

// CORS Middleware
const cors = (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

const logging = (request, response, next) => {
  console.log(`${request.method} ${request.url} ${Date.now()}`);
  next();
};
// middleware goes here
// cors needs to go first
app.use(cors);
app.use(express.json());
app.use(logging);
// middleware goes above routers
// use routers
app.use("/pizzas", pizzas);
// Handle the request with HTTP GET method from http://localhost:4040/status
app.get("/status", (request, response) => {
  // Create the headers for response by default 200
  // End and return the response
  response.send(JSON.stringify({ message: "Service healthy" }));
});
// .get takes the place of route
// the parameter after get defines the route
// is looking for the parameters in the url to initiate the route
app.get("/", (request, response) => {
  response
    .status(418)
    .json({ message: "No Resource Found Here, Please see instructions" });
});
app.post("/", (request, response) => {
  response.json(request.body);
});
// adding a new attribute to the Object
app.post("/", (request, response) => {
  console.log("matsinet-request:", request);
  const body = request.body;
  body.date = Date.now();
  response.json(body);
});
// all routes go above the listen
// Tell the Express app to start listening
// Let the humans know I am running and listening on 4040
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
