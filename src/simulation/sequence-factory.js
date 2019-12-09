export default {
  newSequence: (initialValue, nextFunc) => {
    let currentValue = null;

    return {
      first: () => initialValue,
      next: () => {
        if (currentValue === null) {
          currentValue = initialValue;
        } else {
          currentValue = nextFunc(currentValue);
        }
        return currentValue;
      },
    };
  },
};
