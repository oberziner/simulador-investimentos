import React from 'react';
import f from './format';

const Investment = ({ investment }) => (
  <div>
    <h2 className="title">
      {investment.title}
    </h2>
    <p>
      {`Data inicio: ${f.formatDate(investment.startDate)}`}
    </p>
    <p>
      {`Data fim: ${f.formatDate(investment.endDate)}`}
    </p>
    <p>
      {`Valor inicial: ${f.formatMoney(investment.initialValue)}`}
    </p>
  </div>
);

export default Investment;
