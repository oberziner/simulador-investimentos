import factory from './sequence-factory';

describe('sequence factory', () => {
  it('should return a new sequence', () => {
    expect.hasAssertions();
    const instance = factory.newSequence();
    expect(instance).toBeInstanceOf(Object);
    expect(instance.next).toBeInstanceOf(Function);
  });
});

describe('sequence', () => {
  const incrementPrev = (prev) => (prev ? prev + 1 : 1);

  it('.next should call function passed as a parameter and return generated value', () => {
    expect.hasAssertions();
    const sequence = factory.newSequence(incrementPrev);
    expect(sequence.next()).toBe(1);
    expect(sequence.next()).toBe(2);
    expect(sequence.next()).toBe(3);
    expect(sequence.next()).toBe(4);
  });
});
