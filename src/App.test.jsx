import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';


describe('app', () => {
  it('should add backend value to welcome message', () => {
    expect.hasAssertions();
    const { container } = render(<App />);

    expect(container).toHaveTextContent(/^LCIData inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$|u00A09.999,00$/);
  });
});
