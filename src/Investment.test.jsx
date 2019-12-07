import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import Investment from './Investment';

describe('investment component', () => {
  it('should render investment correctly', () => {
    expect.hasAssertions();

    const investment = {
      title: 'LCI',
      startDate: new Date('2019-04-01'),
      endDate: new Date('2019-12-01'),
      initialValue: 10000,
    };

    const { container } = render(<Investment investment={investment} />);
    const div = container.firstChild;
    expect(div.children[0]).toHaveTextContent('LCI');
    expect(div.children[1]).toHaveTextContent('Data inicio: 2019-04-01');
    expect(div.children[2]).toHaveTextContent('Data fim: 2019-12-01');
    expect(div.children[3]).toHaveTextContent('Valor inicial: R$ 10.000,00', { normalizeWhitespace: true });
  });
});
