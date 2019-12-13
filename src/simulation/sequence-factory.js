export default {
  newSequence: (nextFunc) => {
    let currentValue = null;

    return {
      next: () => {
        currentValue = nextFunc(currentValue);
        return currentValue;
      },
    };
  },
};
