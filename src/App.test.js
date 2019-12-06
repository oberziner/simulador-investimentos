import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import logic from './logic';
import '@testing-library/jest-dom/extend-expect';

jest.mock('./logic.js');

test('Should add backend value to welcome message', () => {
  logic.getHelloMessage.mockReturnValue('Mocked value');

  const { getByRole } = render(<App />);

  expect(getByRole('heading')).toHaveTextContent('Welcome to React - Mocked value');
});
