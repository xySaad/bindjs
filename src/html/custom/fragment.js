export const frag = (...children) => {
  const fragment = document.createDocumentFragment();
  fragment.append(...children);
  return fragment;
};
