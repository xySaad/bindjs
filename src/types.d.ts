import { bindProto } from "./html/native";

export type HtmlElements = {
  [K in keyof HTMLElementTagNameMap]: (
    attributes?: Partial<HTMLElementTagNameMap[K]>
  ) => typeof bindProto & HTMLElementTagNameMap[K];
};
