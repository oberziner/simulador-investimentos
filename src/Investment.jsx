import React from 'react';
import f from './format';

const Investment = ({ investment }) => (
  <div className="investment">
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
    <table>
      <tbody>
        {investment.steps.slice().reverse().map((obj, i) => (
          <tr key={obj.date}>
            <td>
              {`${i + 1} - ${f.formatDate(obj.date)}`}
            </td>
            <td>
              {f.formatMoney(obj.value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Investment;
