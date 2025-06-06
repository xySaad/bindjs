export type HtmlElements = {
  [K in keyof HTMLElementTagNameMap]: (
    attributes?: Partial<HTMLElementTagNameMap[K]>
  ) => HTMLElementTagNameMap[K];
};
