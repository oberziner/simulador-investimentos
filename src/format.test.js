import format from './format';

describe('format should', () => {
  it('format Date', () => {
    expect.assertions(2);
    expect(format.formatDate(new Date(2019, 11, 1))).toBe('2019-12-01');
    expect(format.formatDate(new Date(2019, 4, 1))).toBe('2019-05-01');
  });
});
