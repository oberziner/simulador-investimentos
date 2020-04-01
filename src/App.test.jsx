import { render, waitForElement, fireEvent } from '@testing-library/react';
import React from 'react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

describe('app', () => {
  it('should have a button to add a new LCI investment', () => new Promise((done) => {
    const { getByRole, getByText, getByLabelText } = render(<App />);
    fireEvent.change(getByLabelText('Valor:'), { target: { value: '9999' } });
    fireEvent.change(getByLabelText('Data Inicial:'), { target: { value: '2019-04-01' } });
    fireEvent.change(getByLabelText('Data Final:'), { target: { value: '2019-12-01' } });
    fireEvent.change(getByLabelText('SELIC:'), { target: { value: '6' } });
    fireEvent.change(getByLabelText('% CDI:'), { target: { value: '90' } });
    const lciButton = getByText((text, element) => (text === '(L)CI')
      && (element.tagName === 'BUTTON'));

    lciButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode.parentNode).toHaveClass('investment-container');
        expect(element.parentNode).toHaveTextContent(/^LCI 90% SELIC 6% a.a.Data inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$ 9.999,00/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2019-11-30R\$ 10.360,12/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/244 - 2019-04-01R\$ 9.999,00$/,
          { normalizeWhitespace: true });
        done();
      });
  }));

  it('should add 2 LCIs when LCI button is clicked 2 times', () => new Promise((done) => {
    const { getAllByRole, getByText, getByLabelText } = render(<App />);
    fireEvent.change(getByLabelText('Valor:'), { target: { value: '9999' } });
    fireEvent.change(getByLabelText('Data Inicial:'), { target: { value: '2019-04-01' } });
    fireEvent.change(getByLabelText('Data Final:'), { target: { value: '2019-12-01' } });
    fireEvent.change(getByLabelText('SELIC:'), { target: { value: '4' } });
    fireEvent.change(getByLabelText('% CDI:'), { target: { value: '100' } });
    const lciButton = getByText((text, element) => (text === '(L)CI')
      && (element.tagName === 'BUTTON'));

    lciButton.click();
    lciButton.click();

    waitForElement(() => getAllByRole('heading'))
      .then((elements) => {
        expect(elements).toHaveLength(2);

        expect(elements[0].parentNode).toHaveTextContent(/^LCI 100% SELIC 4% a.a.Data inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$ 9.999,00/,
          { normalizeWhitespace: true });
        expect(elements[1].parentNode).toHaveTextContent(/^LCI 100% SELIC 4% a.a.Data inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$ 9.999,00/,
          { normalizeWhitespace: true });
        done();
      });
  }));

  it('should have a button to add a new CDB investment', () => new Promise((done) => {
    const { getByRole, getByText, getByLabelText } = render(<App />);
    fireEvent.change(getByLabelText('Valor:'), { target: { value: '8888' } });
    fireEvent.change(getByLabelText('Data Inicial:'), { target: { value: '2018-04-01' } });
    fireEvent.change(getByLabelText('Data Final:'), { target: { value: '2018-12-01' } });
    fireEvent.change(getByLabelText('SELIC:'), { target: { value: '4' } });
    fireEvent.change(getByLabelText('% CDI:'), { target: { value: '90' } });
    const cdbButton = getByText((text, element) => (text === '(C)DB')
      && (element.tagName === 'BUTTON'));

    cdbButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode).toHaveTextContent(/^CDB 90% SELIC 4% a.a.Data inicio: 2018-04-01Data fim: 2018-12-01Valor inicial: R\$ 8.888,00/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2018-11-30R\$ 9.101,33/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/244 - 2018-04-01R\$ 8.888,00$/,
          { normalizeWhitespace: true });
        done();
      });
  }));

  it('should have a button to add a new Tesouro investment', () => new Promise((done) => {
    const { getByRole, getByText, getByLabelText } = render(<App />);
    fireEvent.change(getByLabelText('Valor:'), { target: { value: '5000' } });
    fireEvent.change(getByLabelText('Data Inicial:'), { target: { value: '2019-05-01' } });
    fireEvent.change(getByLabelText('Data Final:'), { target: { value: '2019-12-01' } });
    fireEvent.change(getByLabelText('SELIC:'), { target: { value: '5' } });
    const tesouroButton = getByText((text, element) => (text === '(T)esouro')
      && (element.tagName === 'BUTTON'));

    tesouroButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode).toHaveTextContent(/^Tesouro Direto 5% a.a.Data inicio: 2019-05-01Data fim: 2019-12-01Valor inicial: R\$ 5.000,00/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2019-11-30R\$ 5.173,35/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/214 - 2019-05-01R\$ 4.999,70$/,
          { normalizeWhitespace: true });
        done();
      });
  }));
});
