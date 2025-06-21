import { bindProto } from "./core/createElement.js";

export type HtmlElements = {
  [K in keyof HTMLElementTagNameMap]: (
    attributes?: Partial<HTMLElementTagNameMap[K]>
  ) => typeof bindProto & HTMLElementTagNameMap[K];
};
