import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';


describe('app', () => {
  it('should render investments correctly', () => {
    expect.hasAssertions();
    const { getByRole, container } = render(<App />);

    expect(container).toHaveTextContent(/^LCIData inicio: 2019-04-01Data fim: 2019-12-01Valor inicial: R\$|u00A09.999,00$/);

    expect(getByRole('table')).toHaveTextContent(/^1 - 2019-11-30R\$ 10.268,122/,
      { normalizeWhitespace: true });
    expect(getByRole('table')).toHaveTextContent(/244 - 2019-04-01R\$ 10.000,00$/,
      { normalizeWhitespace: true });
  });
});
