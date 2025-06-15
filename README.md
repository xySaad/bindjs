# bindjs - a library that shouldn't exist
### Introduction
bindjs is a lightweight library for building reactive websites, featuring a built-in router, image/SVG caching, and a state management mechanism.

### Usage
### creating elements:
```ts
import {ce} from "bindjs/native"
ce(<tagName>, <attributes>)
```
#### or
```ts
import html from "bindjs/native"
const { div } = html

div(<className>, <textContent>, <attributes>)
```
### example:
```js
import html, {query} from "bindjs/native"
const { div } = html

const handleClick = ()=> alert("hello world")
query("body").append(
    div("randomClass", "Halo", {onclick: handleClick}).add(
        div("child", "halo again"),
        div("child 2", "halo again")
    )
)
```
📘 [BindJS Journey](./docs/BINDJS-JOURNEY.md)
