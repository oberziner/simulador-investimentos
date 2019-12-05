import logic from './logic.js';

describe('logic should', () => {
  test('return Hello', () => {
    expect(logic.getHelloMessage()).toBe("Hello")
  })

})
