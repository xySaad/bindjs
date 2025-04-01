import { useReference, isReference } from "./reference.js";
// Conditional rendering
export const useDependency = (dependency, resolver) => {
  const newRefernce = useReference(
    undefined,
    "dependency of " + dependency.VarName
  );
  dependency.addTrigger((value) => {
    // console.log("updating", newRefernce(), "because", value, "has changed");
    newRefernce(resolver(value));
  });
  return newRefernce;
};

class ConditionalElement {
  getActive() {
    let lastVisited = this;
    let i = 0;
    while (lastVisited.active?.active && i < 10) {
      lastVisited = lastVisited.active;
      i++;
    }
    return lastVisited;
  }
  setActive(value) {
    let lastVisited = this;
    let i = 0;
    while (lastVisited.active?.active) {
      lastVisited = lastVisited.active;
      i++;
    }
    lastVisited.active = value;
  }
}
export const isConditionalElement = (value) =>
  value instanceof ConditionalElement;

export const When = (reference, condition) => {
  const isTruthy = (v) => {
    if (condition !== undefined) {
      if (typeof condition === "function") {
        return condition(v);
      } else {
        return condition === v;
      }
    }
    return v;
  };

  return {
    show: (trueElement, falseElement) => {
      const element = new ConditionalElement();
      element.name = reference.VarName;
      reference.addTrigger((value) => {
        const nextElement = isTruthy(value) ? trueElement : falseElement;
        const toRender = isConditionalElement(nextElement)
          ? nextElement.getActive()
          : nextElement;

        // console.log(element.getActive(), "=>", toRender.active);

        element.getActive().active?.replaceWith(toRender.active);
        element.active = nextElement;
        
      });

      return element;
    },
    do: (trueValue, falseValue) =>
      useDependency(reference, (v) => {
        if (isTruthy(v)) {
          return isReference(trueValue) ? trueValue() : trueValue;
        } else {
          return isReference(falseValue) ? falseValue() : falseValue;
        }
      }),
  };
};

export const WhenFunctionBased = (reference) => {
  let element = {};
  return (resolver) => {
    reference.addTrigger((value) => {
      const resolvedElement = resolver(value);
      element.active?.replaceWith(resolvedElement.active);
      element.active = resolvedElement.active;
    });
    return resolver(reference());
  };
};
// example
// When(isLoading)((v) =>
//   v
//     ? div("loading", "loading...")
//     : When(pairCode)((v) =>
//         v ? div("pairCode", pairCode) : phoneInput
//       )
// ),
///////////////////////////

// Loading state
//should use reference to update all elements that depend on the single loading states
// export const useLoading = (asynFunc) => {
//   let _loadingElement = null;
//   let _resolveElement = null;
//   let _fallbackElement = null;

//   const fn = (...args) => {
//     _resolveElement.active.replaceWith(_loadingElement.active);
//     _fallbackElement?.active.replaceWith(_loadingElement.active);

//     const result = asynFunc(...args);

//     result.catch(() => {
//       _loadingElement.active.replaceWith(_fallbackElement?.active);
//     });

//     result.then(() => {
//       _loadingElement.active.replaceWith(_resolveElement.active);
//     });

//     return result;
//   };

//   const loadingFn = (loadingElement) => {
//     _loadingElement = loadingElement;

//     _loadingElement.then = (resolveElement) => {
//       _resolveElement = resolveElement;
//       _resolveElement.catch = (fallbackElement) => {
//         _fallbackElement = fallbackElement;
//         return _resolveElement;
//       };

//       return _resolveElement;
//     };

//     return _loadingElement;
//   };

//   return [fn, loadingFn];
// };
