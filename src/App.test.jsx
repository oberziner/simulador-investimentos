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
    const lciButton = getByText((text, element) => (text === 'LCI')
      && (element.tagName === 'BUTTON'));

    lciButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode.parentNode).toHaveClass('investment-container');
        expect(element.parentNode).toHaveTextContent(/^LCIData inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$ 9.999,00/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2019-11-30R\$ 10.267,092/,
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
    const lciButton = getByText((text, element) => (text === 'LCI')
      && (element.tagName === 'BUTTON'));

    lciButton.click();
    lciButton.click();

    waitForElement(() => getAllByRole('heading'))
      .then((elements) => {
        expect(elements).toHaveLength(2);

        expect(elements[0].parentNode).toHaveTextContent(/^LCIData inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$ 9.999,00/,
          { normalizeWhitespace: true });
        expect(elements[1].parentNode).toHaveTextContent(/^LCIData inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$ 9.999,00/,
          { normalizeWhitespace: true });
        done();
      });
  }));

  it('should have a button to add a new CDB investment', () => new Promise((done) => {
    const { getByRole, getByText, getByLabelText } = render(<App />);
    fireEvent.change(getByLabelText('Valor:'), { target: { value: '8888' } });
    fireEvent.change(getByLabelText('Data Inicial:'), { target: { value: '2018-04-01' } });
    fireEvent.change(getByLabelText('Data Final:'), { target: { value: '2018-12-01' } });
    const cdbButton = getByText((text, element) => (text === 'CDB')
      && (element.tagName === 'BUTTON'));

    cdbButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode).toHaveTextContent(/^CDBData inicio: 2018-04-01Data fim: 2018-12-01Valor inicial: R\$ 8.888,00/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2018-11-30R\$ 9.124,88/,
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
    const tesouroButton = getByText((text, element) => (text === 'Tesouro')
      && (element.tagName === 'BUTTON'));

    tesouroButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode).toHaveTextContent(/^Tesouro DiretoData inicio: 2019-05-01Data fim: 2019-12-01Valor inicial: R\$ 5.000,00/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2019-11-30R\$ 5.147,342/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/214 - 2019-05-01R\$ 5.000,00$/,
          { normalizeWhitespace: true });
        done();
      });
  }));
});
