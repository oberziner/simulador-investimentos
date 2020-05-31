import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import Investment from './Investment';

describe('investment component', () => {
  it('should render investment correctly', () => {
    expect.hasAssertions();

    const investment = {
      title: 'Random investment',
      startDate: new Date('2019-04-01'),
      endDate: new Date('2019-12-01'),
      initialValue: 10000,
      totalTaxes: 199.88,
      buyTax: 0.0152,
      grossValue: 12000,
      netValue: 11800.22,
      steps: [
        { date: new Date('2019-04-01'), value: 10000 },
        { date: new Date('2019-08-01'), value: 11000 },
        { date: new Date('2019-12-01'), value: 12000 },
      ],
    };

    const { container } = render(<Investment investment={investment} onRemoveClick={jest.fn()} />);
    const div = container.firstChild;
    expect(div).toHaveClass('investment');
    expect(div.children[0]).toHaveTextContent('Random investment');
    expect(div.children[1]).toHaveTextContent('Data inicio: 2019-04-01');
    expect(div.children[2]).toHaveTextContent('Data fim: 2019-12-01');
    expect(div.children[3]).toHaveTextContent('Valor inicial: R$ 10.000,00',
      { normalizeWhitespace: true });
    expect(div.children[4]).toHaveTextContent('Taxa de compra: 1.52%');
    expect(div.children[5]).toHaveTextContent('Valor Bruto: R$ 12.000,00',
      { normalizeWhitespace: true });
    expect(div.children[6]).toHaveTextContent('Impostos: R$ 199,88',
      { normalizeWhitespace: true });
    expect(div.children[7]).toHaveTextContent('Taxa de Custodia: R$ 0,00',
      { normalizeWhitespace: true });
    expect(div.children[8]).toHaveTextContent('Valor Liquido: R$ 11.800,22',
      { normalizeWhitespace: true });
    expect(div.children).toHaveLength(11);

    const steps = div.children[10].children[0].children;
    expect(steps[0]).toHaveTextContent('1 - 2019-12-01R$ 12.000,00',
      { normalizeWhitespace: true });
    expect(steps[1]).toHaveTextContent('2 - 2019-08-01R$ 11.000,00',
      { normalizeWhitespace: true });
    expect(steps[2]).toHaveTextContent('3 - 2019-04-01R$ 10.000,00',
      { normalizeWhitespace: true });
    expect(steps).toHaveLength(3);
  });
});
