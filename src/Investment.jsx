import React from 'react';
import f from './format';

const Investment = ({ investment, onRemoveClick }) => (
  <div className="investment">
    <h2 className="investment-title">
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
    <p>
      {`Valor Bruto: ${f.formatMoney(investment.grossValue)}`}
    </p>
    <p>
      {`Impostos: ${f.formatMoney(investment.totalTaxes)}`}
    </p>
    <p>
      {`Taxa de Custodia: ${f.formatMoney(investment.totalCustodyFee)}`}
    </p>
    <p>
      {`Valor Liquido: ${f.formatMoney(investment.netValue)}`}
    </p>
    <button type="button" onClick={onRemoveClick.bind(null, investment)}>Remover</button>
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
