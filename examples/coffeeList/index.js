import htmlElements from "../../src/html/index.js";
import { query } from "../../src/html/native.js";
const { div, select, option } = htmlElements;

const coffeeOptions = (...options) => {
  const selectElement = select();
  const coffeeList = div();

  selectElement.onchange = async (e) => {
    coffeeList.innerHTML = "";
    const coffeeType = e.target.value;
    if (!coffeeType) return;
    const resp = await fetch(`https://api.sampleapis.com/coffee/${coffeeType}`);
    const coffeeData = await resp.json();
    for (const coffee of coffeeData) {
      coffeeList.append(
        div({ class: "coffee" }).add(
          div({ class: "title", textContent: coffee.title }),
          div({ class: "desc", textContent: coffee.description })
        )
      );
    }
  };

  return div({ class: "container" }).add(
    selectElement.add(...options),
    coffeeList
  );
};

query("app").append(
  div({ class: "parent" }).add(
    div({ class: "some class", textContent: "hello world!" }),
    coffeeOptions(
      option({ value: "", textContent: "Please choose coffee type" }),
      option({ value: "iced", textContent: "Iced Coffee" }),
      option({ value: "hot", textContent: "Hot Coffee" })
    )
  )
);
