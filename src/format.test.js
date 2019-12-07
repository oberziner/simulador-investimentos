import format from './format';

describe('format should', () => {
  it('format Date', () => {
    expect.assertions(2);
    expect(format.formatDate(new Date(2019, 11, 1))).toBe('2019-12-01');
    expect(format.formatDate(new Date(2019, 4, 1))).toBe('2019-05-01');
  });
  it('format money', () => {
    expect.hasAssertions();
    expect(format.formatMoney(0)).toBe('R$\u00A00,00');
    expect(format.formatMoney(100)).toBe('R$\u00A0100,00');
    expect(format.formatMoney(100.567)).toBe('R$\u00A0100,57');
    expect(format.formatMoney(9999.888)).toBe('R$\u00A09.999,89');
  });
});
