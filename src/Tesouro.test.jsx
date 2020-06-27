import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { Tesouro } from './Tesouro';
import { newRate } from './simulation/interest-rates';

describe('tesouro component', () => {
  it('should call callback on investment button click with Tesouro Selic', () => {
    const mockCallback = jest.fn();

    const values = {
      initialValue: 10524.89,
      startDate: new Date('2022-02-21'),
      endDate: new Date('2022-10-26'),
      selicValue: newRate(0.0415, 'year252'),
    };

    const { getByText, getByLabelText } = render(<Tesouro
      type="selic"
      values={values}
      onInvestmentAdd={mockCallback}
    />);

    fireEvent.change(getByLabelText('Taxa Compra:'), { target: { value: '0.05' } });
    fireEvent.change(getByLabelText('Taxa Venda:'), { target: { value: '0.07' } });
    const tesouroButton = getByText('(T)esouro SELIC 2025');
    tesouroButton.click();

    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toMatchObject({
      title: 'Tesouro Direto 4.15% a.a.',
      endDate: new Date('2022-10-26'),
      dueDate: new Date('2025-03-01'),
      buyTax: 0.05 / 100,
    });
    const lastStep = mockCallback.mock.calls[0][0]
      .steps[mockCallback.mock.calls[0][0].steps.length - 1];
    expect(lastStep).toMatchObject({ sellTax: 1 + 0.07 / 100 });
  });

  it('should call callback on investment button click with tesouro IPCA', () => {
    const mockCallback = jest.fn();

    const values = {
      initialValue: 2955.867824,
      startDate: new Date('2022-01-02'),
      endDate: new Date('2022-06-01'),
      selicValue: newRate(0.04, 'year252'),
    };

    const { getByText, getByLabelText } = render(<Tesouro
      type="ipca"
      values={values}
      onInvestmentAdd={mockCallback}
    />);

    fireEvent.change(getByLabelText('Taxa Compra:'), { target: { value: '2.39' } });
    fireEvent.change(getByLabelText('Taxa Venda:'), { target: { value: '2.54' } });
    const tesouroButton = getByText('(T)esouro IPCA 2024');
    tesouroButton.click();

    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toMatchObject({
      title: 'Tesouro Direto IPCA 4% a.a.',
      endDate: new Date('2022-06-01'),
      dueDate: new Date('2024-08-15'),
      buyTax: 2.39 / 100,
    });
    const lastStep = mockCallback.mock.calls[0][0]
      .steps[mockCallback.mock.calls[0][0].steps.length - 1];
    expect(lastStep).toMatchObject({ sellTax: 1 + 2.54 / 100 });
  });

  it('should call callback on investment button click with tesouro Prefixado', () => {
    const mockCallback = jest.fn();

    const values = {
      initialValue: 846.338,
      startDate: new Date('2022-01-02'),
      endDate: new Date('2022-06-01'),
      selicValue: newRate(0.04, 'year252'),
    };

    const { getByText, getByLabelText } = render(<Tesouro
      type="prefix"
      values={values}
      onInvestmentAdd={mockCallback}
    />);

    fireEvent.change(getByLabelText('Taxa Compra:'), { target: { value: '4.32' } });
    fireEvent.change(getByLabelText('Taxa Venda:'), { target: { value: '4.44' } });
    const tesouroButton = getByText('(T)esouro Prefixado 2023');
    tesouroButton.click();

    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toMatchObject({
      title: 'Tesouro Direto Prefixado',
      endDate: new Date('2022-06-01'),
      dueDate: new Date('2023-01-01'),
      buyTax: 4.32 / 100,
    });
    const lastStep = mockCallback.mock.calls[0][0]
      .steps[mockCallback.mock.calls[0][0].steps.length - 1];
    expect(lastStep).toMatchObject({ sellTax: 1 + 4.44 / 100 });
  });
});
