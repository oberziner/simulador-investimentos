import React from 'react';
import f from './format';

const stepDetails = (step) => (step.sellTax ? `Taxa de venda: ${step.sellTax}` : '');

const Investment = ({ investment, onRemoveClick }) => (
  <div className="investment">
    <h2 className="investment-title">
      {investment.title}
    </h2>
    <div className="investment-line">
      <p>Data inicio: </p>
      <p>{`${f.formatDate(investment.startDate)}`}</p>
    </div>
    <div className="investment-line">
      <p>Data fim: </p>
      <p>{`${f.formatDate(investment.endDate)}`}</p>
    </div>
    <div className="investment-line">
      <p>Valor inicial: </p>
      <p>{`${f.formatMoney(investment.initialValue)}`}</p>
    </div>
    <div className="investment-line">
      <p>Taxa de compra: </p>
      <p>{`${(investment.buyTax || 0) * 100}%`}</p>
    </div>
    <div className="investment-line">
      <p>Valor Bruto: </p>
      <p>{`${f.formatMoney(investment.grossValue)}`}</p>
    </div>
    <div className="investment-line">
      <p>Impostos: </p>
      <p>{`${f.formatMoney(investment.totalTaxes)}`}</p>
    </div>
    <div className="investment-line">
      <p>Taxa de Custodia: </p>
      <p>{`${f.formatMoney(investment.totalCustodyFee)}`}</p>
    </div>
    <div className="investment-line net-value">
      <p>Valor Liquido: </p>
      <p>{`${f.formatMoney(investment.netValue)}`}</p>
    </div>
    <button className="remove-button" type="button" onClick={onRemoveClick.bind(null, investment)}>Remover</button>
  </div>
);

export default Investment;
