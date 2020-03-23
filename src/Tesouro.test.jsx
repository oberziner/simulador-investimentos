import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { Tesouro } from './Tesouro';
import { newRate } from './simulation/interest-rates';

describe('tesouro component', () => {
  it('should call callback on investment button click', () => {
    const mockCallback = jest.fn();

    const values = {
      initialValue: 10524.89,
      startDate: new Date('2020-02-21'),
      endDate: new Date('2020-02-26'),
      selicValue: newRate(0.0415, 'year252'),
    };

    const { getByText } = render(<Tesouro
      values={values}
      onInvestmentAdd={mockCallback}
    />);

    const tesouroButton = getByText('Tesouro');
    tesouroButton.click();

    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toMatchObject({ title: 'Tesouro Direto 4.15% a.a.' });
  });
});
