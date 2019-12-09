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
      steps: [
        { date: new Date('2019-04-01'), value: 10000 },
        { date: new Date('2019-08-01'), value: 11000 },
        { date: new Date('2019-12-01'), value: 12000 },
      ],
    };

    const { container } = render(<Investment investment={investment} />);
    const div = container.firstChild;
    expect(div.children[0]).toHaveTextContent('LCI');
    expect(div.children[1]).toHaveTextContent('Data inicio: 2019-04-01');
    expect(div.children[2]).toHaveTextContent('Data fim: 2019-12-01');
    expect(div.children[3]).toHaveTextContent('Valor inicial: R$ 10.000,00',
      { normalizeWhitespace: true });
    expect(div.children).toHaveLength(5);

    const steps = div.children[4].children[0].children;
    expect(steps[0]).toHaveTextContent('1 - 2019-12-01R$ 12.000,00',
      { normalizeWhitespace: true });
    expect(steps[1]).toHaveTextContent('2 - 2019-08-01R$ 11.000,00',
      { normalizeWhitespace: true });
    expect(steps[2]).toHaveTextContent('3 - 2019-04-01R$ 10.000,00',
      { normalizeWhitespace: true });
    expect(steps).toHaveLength(3);
  });
});
