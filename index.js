/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable prettier/prettier */
import { Header, Footer, Main, Nav } from "./components";
import * as state from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

// for api key
import dotenv from "dotenv";
dotenv.config();

// nav bar navigator
const router = new Navigo("/");
function render(st) {
  document.querySelector("#root").innerHTML = `
      ${Header(st)}
      ${Nav(state.Links)}
      ${Main(st)}
      ${Footer()}
    `;

  router.updatePageLinks();

  addEventListener(st);
}

// render(state.Home);

// eventlistener for nav bar
function addEventListener(st) {
  // toggle for hamburger
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );
  console.log(st);
  // using state to make sure code only runs on that specific page

  if (st.view === "Orders") {
    document.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();

      const inputList = event.target.elements;
      console.log("Input Element List", inputList);

      const toppings = [];
      // Interate over the toppings input group elements
      for (let input of inputList.toppings) {
        // If the value of the checked attribute is true then add the value to the toppings array
        if (input.checked) {
          toppings.push(input.value);
        }
      }

      const requestData = {
        customer: inputList.customer.value,
        crust: inputList.crust.value,
        cheese: inputList.cheese.value,
        sauce: inputList.sauce.value,
        toppings: toppings,
      };
      console.log("request Body", requestData);

      axios
        .post(`${process.env.PIZZA_PLACE_API_URL}`, requestData)
        .then((response) => {
          // Push the new pizza onto the Pizza state pizzas attribute, so it can be displayed in the pizza list
          state.Pizza.pizzas.push(response.data);
          router.navigate("/Pizza");
        })
        .catch((error) => {
          console.log("It puked", error);
        });
    });
  }
}

// router hooks function to help with organization and reduce race errors
router.hooks({
  before: (done, params) => {
    const page =
      params && params.data && params.data.page
        ? capitalize(params.data.page)
        : "Home";

    if (page === "Home") {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=st.%20louis&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`
        )
        .then((response) => {
          state.Home.weather = {};
          state.Home.weather.city = response.data.name;
          state.Home.weather.temp = response.data.main.temp;
          state.Home.weather.feelsLike = response.data.main.feels_like;
          state.Home.weather.description = response.data.weather[0].main;
          done();
        })
        .catch((err) => console.log(err));
    } else if (page === "Pizza") {
      axios
        .get(`${process.env.PIZZA_PLACE_API_URL}`)
        .then((response) => {
          console.log(response.data);
          state.Pizza.pizzas = response.data;
          done();
        })
        .catch((error) => {
          console.log("It puked", error);
        });
    } else {
      done();
    }
  },
});

router
  .on({
    "/": () => render(state.Home),
    ":page": (params) => {
      let page = capitalize(params.data.page);
      render(state[page]);
    },
  })
  .resolve();
