import { useReference } from "../../src/core/reference.js";
import htmlElements from "../../src/html/index.js";
import { query } from "../../src/html/native.js";
const { div, select, option } = htmlElements;

const getCoffeeList = (coffeeData) => async (e) => {
  const coffeeType = e.target.value;
  if (!coffeeType) return coffeeData([]);
  const resp = await fetch(`https://api.sampleapis.com/coffee/${coffeeType}`);
  coffeeData(await resp.json());
};

const coffeeOptions = (...options) => {
  const coffeeData = useReference([]);
  return div().add(
    select({ onchange: getCoffeeList(coffeeData) }).add(...options),
    coffeeData.map((coffee) =>
      div({ class: "coffee" }).add(
        div({ class: "title", textContent: coffee.title }),
        div({ class: "desc", textContent: coffee.description })
      )
    )
  );
};

query("app").append(
  div({ class: "some class", textContent: "hello world!" }),
  coffeeOptions(
    option({ value: "", textContent: "Please choose coffee type" }),
    option({ value: "iced", textContent: "Iced Coffee" }),
    option({ value: "hot", textContent: "Hot Coffee" })
  )
);
