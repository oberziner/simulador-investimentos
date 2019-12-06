import logic from './logic';

describe('logic should', () => {
  test('return Hello', () => {
    expect(logic.getHelloMessage()).toBe('Hello');
  });
});
