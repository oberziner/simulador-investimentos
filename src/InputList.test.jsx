import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { InputList } from './InputList';

describe('inputlist component', () => {
  it('should accept render values passed by props', () => {
    const values = {
      initialValue: 4444,
      startDate: '2015-01-01',
      endDate: '2016-01-01',
      selicValue: '5',
    };

    const { getByLabelText } = render(<InputList
      values={values}
      onChange={() => {}}
    />);

    expect(getByLabelText('Valor:')).toHaveValue('4444');
    expect(getByLabelText('Data Inicial:')).toHaveValue('2015-01-01');
    expect(getByLabelText('Data Final:')).toHaveValue('2016-01-01');
    expect(getByLabelText('SELIC:')).toHaveValue('5');
  });

  it('should call callback on value change', () => {
    const mockCallback = jest.fn();

    const { getByLabelText } = render(<InputList
      values={{}}
      onChange={mockCallback}
    />);

    fireEvent.change(getByLabelText('Valor:'), { target: { value: '9999' } });
    expect(getByLabelText('Valor:')).toHaveValue('9999');

    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toStrictEqual({ id: 'initialValue', value: '9999' });
  });

  it('should call callback with initial values', () => {
    const values = {
      initialValue: '4444',
      startDate: '2015-01-01',
      endDate: '2016-01-01',
      selicValue: '5',
    };

    const mockCallback = jest.fn();

    render(<InputList
      values={values}
      onChange={mockCallback}
    />);

    expect(mockCallback.mock.calls).toHaveLength(4);
    expect(mockCallback.mock.calls[0][0]).toStrictEqual({ id: 'initialValue', value: '4444' });
    expect(mockCallback.mock.calls[1][0]).toStrictEqual({ id: 'startDate', value: '2015-01-01' });
    expect(mockCallback.mock.calls[2][0]).toStrictEqual({ id: 'endDate', value: '2016-01-01' });
    expect(mockCallback.mock.calls[3][0]).toStrictEqual({ id: 'selicValue', value: '5' });
  });
});
