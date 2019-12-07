import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import Investment from './Investment';

test('Should render investment correctly', () => {

  const investment = {
    title: 'LCI',
    startDate: new Date('2019-04-01'),
    endDate: new Date('2019-12-01'),
  }

  const {  container } = render(<Investment investment={investment}/>);
  const div = container.firstChild;
  expect(div.children[0]).toHaveTextContent('LCI')
  expect(div.children[1]).toHaveTextContent('Data inicio: 2019-04-01')
  expect(div.children[2]).toHaveTextContent('Data fim: 2019-12-01')


});
