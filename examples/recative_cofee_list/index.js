import { div, query, select, option } from "../../src/core/native.js";
import { useReference } from "../../src/core/reference.js";

const coffeeOptions = (...options) => {
  const coffeeData = useReference([]);

  const handleListChange = async (e) => {
    const coffeeType = e.target.value;
    if (!coffeeType) return coffeeData([]);
    const resp = await fetch(`https://api.sampleapis.com/coffee/${coffeeType}`);
    coffeeData(await resp.json());
  };

  return div("container").add(
    select("", { onchange: handleListChange }).add(...options),
    coffeeData.map((coffee) =>
      div("coffee").add(
        div("title", coffee.title),
        div("desc", coffee.description)
      )
    )
  );
};

query("app").append(
  div("parent").add(
    div("some class", "hello world!"),
    coffeeOptions(
      option("", "Please choose coffee type"),
      option("iced", "Iced Coffee"),
      option("hot", "Hot Coffee")
    )
  )
);
