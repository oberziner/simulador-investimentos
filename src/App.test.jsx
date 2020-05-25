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
    const lciButton = getByText((text) => (text === '(L)CI'));

    lciButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode.parentNode).toHaveClass('investment-container');
        expect(element.parentNode).toHaveTextContent(/^LCI 90% SELIC 6% a.a.Data inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$ 9.999,00/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2019-12-01R\$ 10.355,68/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/245 - 2019-04-01R\$ 9.999,00$/,
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
    const lciButton = getByText((text) => (text === '(L)CI'));

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
    const cdbButton = getByText((text) => (text === '(C)DB'));

    cdbButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode).toHaveTextContent(/^CDB 90% SELIC 4% a.a.Data inicio: 2018-04-01Data fim: 2018-12-01Valor inicial: R\$ 8.888,00/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2018-11-30R\$ 9.227,10/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/244 - 2018-04-01R\$ 8.888,00$/,
          { normalizeWhitespace: true });
        done();
      });
  }));

  it('should have a button to add a new Tesouro investment', () => new Promise((done) => {
    const { getByRole, getByText, getByLabelText } = render(<App />);
    fireEvent.change(getByLabelText('Valor:'), { target: { value: '10524.89' } });
    fireEvent.change(getByLabelText('Data Inicial:'), { target: { value: '2020-02-21' } });
    fireEvent.change(getByLabelText('Data Final:'), { target: { value: '2020-10-26' } });
    fireEvent.change(getByLabelText('SELIC:'), { target: { value: '4.15' } });
    const tesouroButton = getByText((text, element) => (text === '(T)esouro SELIC 2025')
      && (element.tagName === 'BUTTON'));

    tesouroButton.click();

    waitForElement(() => getByRole('heading'))
      .then((element) => {
        expect(element.parentNode).toHaveTextContent(/^Tesouro Direto 4.15% a.a.Data inicio: 2020-02-21Data fim: 2020-10-26Valor inicial: R\$ 10.524,89/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/^1 - 2020-10-26R\$ 10.807,55/,
          { normalizeWhitespace: true });
        expect(getByRole('table')).toHaveTextContent(/249 - 2020-02-21R\$ 10.519,63$/,
          { normalizeWhitespace: true });
        done();
      });
  }));


  it('should remove an investment when the remove button is clicked', () => new Promise((done) => {
    const { getAllByRole, getByText, getAllByText, getByLabelText } = render(<App />);
    const lciButton = getByText((text) => (text === '(L)CI'));

    fireEvent.change(getByLabelText('Valor:'), { target: { value: '9999' } });
    fireEvent.change(getByLabelText('Data Inicial:'), { target: { value: '2019-04-01' } });
    fireEvent.change(getByLabelText('Data Final:'), { target: { value: '2019-12-01' } });
    fireEvent.change(getByLabelText('SELIC:'), { target: { value: '4' } });
    fireEvent.change(getByLabelText('% CDI:'), { target: { value: '100' } });
    lciButton.click();

    fireEvent.change(getByLabelText('SELIC:'), { target: { value: '5' } });
    lciButton.click();

    fireEvent.change(getByLabelText('SELIC:'), { target: { value: '6' } });
    lciButton.click();

    waitForElement(() => getAllByRole('heading'))
      .then((elements) => {
        expect(elements).toHaveLength(3);

        expect(elements[0].parentNode).toHaveTextContent(/^LCI 100% SELIC 4%/, { normalizeWhitespace: true });
        expect(elements[1].parentNode).toHaveTextContent(/^LCI 100% SELIC 5%/, { normalizeWhitespace: true });
        expect(elements[2].parentNode).toHaveTextContent(/^LCI 100% SELIC 6%/, { normalizeWhitespace: true });

        const removeButtons = getAllByText((text) => (text === 'Remover'));
        removeButtons[1].click();

        waitForElement(() => getAllByRole('heading'))
          .then((elementsAfterRemove) => {
            expect(elementsAfterRemove).toHaveLength(2);

            expect(elementsAfterRemove[0].parentNode).toHaveTextContent(/^LCI 100% SELIC 4%/, { normalizeWhitespace: true });
            expect(elementsAfterRemove[1].parentNode).toHaveTextContent(/^LCI 100% SELIC 6%/, { normalizeWhitespace: true });
          });

        done();
      });
  }));
});
