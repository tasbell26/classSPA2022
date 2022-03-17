/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
// schema defines a valid document
const pizzaSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  crust: {
    type: String,
    required: true,
  },
  cheese: String,
  sauce: {
    type: String,
    required: true,
  },
  toppings: [String],
});

const Pizza = mongoose.model("Pizza", pizzaSchema);

module.exports = {
  schema: pizzaSchema,
  model: Pizza,
};
