import { getNextDay } from './dates';

describe('getNextDay', () => {
  it('should return the next day', () => {
    expect.hasAssertions();
    expect(getNextDay(new Date('2019-01-01'))).toStrictEqual(new Date('2019-01-02'));
    expect(getNextDay(new Date('2018-12-31'))).toStrictEqual(new Date('2019-01-01'));
    expect(getNextDay(new Date('2020-02-28'))).toStrictEqual(new Date('2020-02-29'));
    expect(getNextDay(new Date('2020-02-29'))).toStrictEqual(new Date('2020-03-01'));
  });
});
