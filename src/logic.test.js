import logic from './logic';

describe('logic should', () => {
  it('return Hello', () => {
    expect.assertions(1);
    expect(logic.getHelloMessage()).toBe('Hello');
  });
});
