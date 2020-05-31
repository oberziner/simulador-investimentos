import React, { Component } from 'react';
import { newTesouro } from './simulation/tesouro';
import { newTesouroIPCA } from './simulation/tesouroipca';

export class Tesouro extends Component {
  static tesouroFactory({ startDate, initialValue, endDate, selicValue }, type) {
    if (type === 'selic') {
      return newTesouro(startDate, initialValue, selicValue, new Date('2025-03-01'), endDate);
    }
    return newTesouroIPCA(startDate, initialValue, selicValue, new Date('2024-08-15'), endDate, 2.28, 2.28);
  }

  constructor(props) {
    super(props);

    this.notifyInvestmentAdded = props.onInvestmentAdd;
    this.addTesouro = this.addInvestment.bind(this, Tesouro.tesouroFactory);

    this.state = {
      ...props.values,
      type: props.type,
    };
  }

  addInvestment(investmentFactory, values) {
    const { type } = this.state;
    this.notifyInvestmentAdded(investmentFactory({ ...this.state, ...values }, type));
  }

  render() {
    const { values, type } = this.props;
    const buttonTitle = type === 'selic' ? '(T)esouro SELIC 2025' : '(T)esouro IPCA 2024';
    return (
      <div className="input-list">
        <button type="button" accessKey="t" onClick={this.addTesouro.bind(this, values)}>{buttonTitle}</button>
      </div>
    );
  }
}
