/* eslint-disable prettier/prettier */
// routers are always plural and representing the route your using
const { Router } = require("express");
const Pizza = require("../models/Pizza");

const router = Router();
// Create record in MongoDB Atlas using Mongoose.js ORM
router.post("/", (request, response) => {
  const newPizza = new Pizza.model(request.body);
  newPizza.save((error, record) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(record);
  });
});

router.get("/", (request, response) => {
  Pizza.model.find({}, (error, record) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(record);
  });
});

// Get a single record by ID using a query parameter
router.get("/:id", (request, response) => {
  Pizza.model.findById(request.params.id, (error, record) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(record);
  });
});

router.get("/crust/:crust", (request, response) => {
  Pizza.model.find({ crust: request.params.crust }, (error, record) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(record);
  });
});

router.delete("/:id", (request, response) => {
  Pizza.model.findByIdAndRemove(request.params.id, {}, (error, record) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(record);
  });
});

router.put("/:id", (request, response) => {
  // so you don't have to type request.body all the time
  const body = request.body;
  // method name
  Pizza.model.findByIdAndUpdate(
    // id looking at the id in the route next to put
    request.params.id,
    {
      // $ needed for compound instruction
      $set: {
        // Take note that the customer is not included, so it can't
        crust: body.crust,
        cheese: body.cheese,
        sauce: body.sauce,
        toppings: body.toppings,
      },
    },
    {
      //
      new: true,
      upsert: true,
    },
    (error, record) => {
      if (error) return response.sendStatus(500).json(error);
      return response.json(record);
    }
  );
});

module.exports = router;
