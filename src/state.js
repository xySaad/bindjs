export const newState = (defaultValue) => {
  return {
    value: defaultValue,
    setValue(newValue) {
      this.value = newValue;
      this.obj.forEach((e) => {
        e();
      });
    },

    getValue() {
      return this.value;
    },
    onCHange(action) {
      this.obj.push(action);
    },
    obj: [],
  };
};
