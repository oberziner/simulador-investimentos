import React, { Component } from 'react';
import { newTesouro } from './simulation/tesouro';
import { newTesouroIPCA } from './simulation/tesouroipca';
import { newTesouroPrefixado } from './simulation/tesouroprefixado';

export class Tesouro extends Component {
  static tesouroFactory({ startDate, initialValue, endDate, selicValue }, tesouroType) {
    switch (tesouroType) {
      case 'selic':
        return newTesouro(startDate, initialValue, selicValue, new Date('2025-03-01'), endDate, 0.0002, 0.0003);
      case 'ipca':
        return newTesouroIPCA(startDate, initialValue, selicValue, new Date('2024-08-15'), endDate, 2.28, 2.28);
      case 'prefix':
        return newTesouroPrefixado(startDate, initialValue, selicValue, new Date('2023-01-01'), endDate, 4.28, 4.28);
      default:
        throw new Error(`Invalid tesouroType: ${tesouroType}`);
    }
  }

  static getButtonText(tesouroType) {
    switch (tesouroType) {
      case 'selic':
        return '(T)esouro SELIC 2025';
      case 'ipca':
        return '(T)esouro IPCA 2024';
      case 'prefix':
        return '(T)esouro Prefixado 2023';
      default:
        throw new Error(`Invalid tesouroType: ${tesouroType}`);
    }
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
    return (
      <div className="input-list">
        <button type="button" accessKey="t" onClick={this.addTesouro.bind(this, values)}>{Tesouro.getButtonText(type)}</button>
      </div>
    );
  }
}
