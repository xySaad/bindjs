import { BindElement } from "./core/createElement.js";

export type HtmlElements = {
  [K in keyof HTMLElementTagNameMap]: (
    attributes?: Partial<HTMLElementTagNameMap[K]>
  ) => BindElement & HTMLElementTagNameMap[K];
};
