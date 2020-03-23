import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { CdbAndCdi } from './CdbAndCdi';
import { newRate } from './simulation/interest-rates';

describe('cdbAndCdi component', () => {
  it('should accept render values passed by props', () => {
    const values = {
      percentCDI: '75',
    };

    const { getByLabelText } = render(<CdbAndCdi
      values={values}
      onChange={() => {}}
    />);

    expect(getByLabelText('% CDI:')).toHaveValue('75');
  });

  it('should call callback on value change', () => {
    const mockCallback = jest.fn();

    const { getByLabelText } = render(<CdbAndCdi
      values={{}}
      onChange={mockCallback}
    />);

    fireEvent.change(getByLabelText('% CDI:'), { target: { value: '9999' } });
    expect(getByLabelText('% CDI:')).toHaveValue('9999');

    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toStrictEqual({ id: 'percentCDI', value: '9999' });
  });

  it('should call callback with initial values', () => {
    const values = {
      percentCDI: '90',
    };

    const mockCallback = jest.fn();

    render(<CdbAndCdi
      values={values}
      onChange={mockCallback}
    />);

    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toStrictEqual({ id: 'percentCDI', value: '90' });
  });
  it('should call callback on investment button click', () => {
    const mockCallback2 = jest.fn();
    const mockCallback = jest.fn();

    const values = {
      initialValue: 10524.89,
      startDate: new Date('2020-02-21'),
      endDate: new Date('2020-02-26'),
      selicValue: newRate(0.0415, 'year252'),
      percentCDI: '90',
    };

    const { getByText } = render(<CdbAndCdi
      values={values}
      onChange={mockCallback}
      onInvestmentAdd={mockCallback2}
    />);

    const lciButton = getByText('LCI');
    lciButton.click();

    expect(mockCallback2.mock.calls).toHaveLength(1);
    expect(mockCallback2.mock.calls[0][0]).toMatchObject({ title: 'LCI 90% SELIC 4.15% a.a.' });
  });
});
