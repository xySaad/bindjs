export class Reference {
  #value = null;
  #triggers = [];
  constructor(defaultValue) {
    this.#value = defaultValue;
  }

  onUpdate(action) {    
    this.#triggers.push(action);
    return action 
  }
  get value() {
    return this.#value;
  }
  set value(newValue) {
    this.#value = newValue;
    this.#triggers.forEach((e) => {
      e();
    });
  }
  Push(pushable){
    this.#value.push(pushable)
     this.#triggers.forEach((e) => {
      e();
    });
  }

   destroy(action) {
    console.log("before",this.#triggers);
    
    this.#triggers = this.#triggers.filter((fn) => fn !== action);
    console.log("after",this.#triggers);

  }
}

export const ref = (defaultValue) => {
  return new Reference(defaultValue);
};
