import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import logic from './logic';
import '@testing-library/jest-dom/extend-expect';


test('Should add backend value to welcome message', () => {

  const { container } = render(<App />);

  expect(container).toHaveTextContent(/^LCIData inicio: 2019-04-01Data fim: 2019-12-01$/);

});
