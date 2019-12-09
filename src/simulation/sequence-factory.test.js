import factory from './sequence-factory';

describe('sequence factory', () => {
  it('should return a new sequence', () => {
    expect.hasAssertions();
    const instance = factory.newSequence();
    expect(instance).toBeInstanceOf(Object);
    expect(instance.first).toBeInstanceOf(Function);
    expect(instance.next).toBeInstanceOf(Function);
  });
});

describe('sequence', () => {
  const incrementPrev = (prev) => prev + 1;

  it('should return the first value', () => {
    expect.hasAssertions();
    const sequence = factory.newSequence(1, incrementPrev);
    expect(sequence.first()).toBe(1);
  });

  it('should return the initial value on the first .next call', () => {
    expect.hasAssertions();
    const sequence = factory.newSequence(1, incrementPrev);
    expect(sequence.next()).toBe(1);
  });

  it('.next should call function passed as a parameter and return next generated value', () => {
    expect.hasAssertions();
    const sequence = factory.newSequence(1, incrementPrev);
    expect(sequence.next()).toBe(1);
    expect(sequence.next()).toBe(2);
    expect(sequence.next()).toBe(3);
    expect(sequence.next()).toBe(4);
  });
});
