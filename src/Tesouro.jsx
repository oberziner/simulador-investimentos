import React, { Component } from 'react';
import { newTesouro } from './simulation/tesouro';
import { newTesouroIPCA } from './simulation/tesouroipca';
import { newTesouroPrefixado } from './simulation/tesouroprefixado';

export class Tesouro extends Component {
  static tesouroFactory({ startDate, initialValue, endDate, selicValue, buyTax, sellTax },
    tesouroType) {
    switch (tesouroType) {
      case 'selic':
        return newTesouro(startDate, initialValue, selicValue, new Date('2025-03-01'), endDate, +buyTax / 100, +sellTax / 100);
      case 'ipca':
        return newTesouroIPCA(startDate, initialValue, selicValue, new Date('2024-08-15'), endDate, +buyTax / 100, +sellTax / 100);
      case 'prefix':
        return newTesouroPrefixado(startDate, initialValue, selicValue, new Date('2023-01-01'), endDate, +buyTax / 100, +sellTax / 100);
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
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      ...props.values,
      type: props.type,
      buyTax: 0,
      sellTax: 0,
    };
  }

  addInvestment(investmentFactory, values) {
    const { type } = this.state;
    this.notifyInvestmentAdded(investmentFactory({ ...this.state, ...values }, type));
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    const { values, type } = this.props;
    const { state } = this;
    return (
      <div className="input-list">
        <label htmlFor="buyTax">
          Taxa Compra:
          <input
            type="text"
            id="buyTax"
            onChange={this.handleChange}
            value={state.buyTax}
          />
        </label>
        <label htmlFor="sellTax">
          Taxa Venda:
          <input
            type="text"
            id="sellTax"
            onChange={this.handleChange}
            value={state.sellTax}
          />
        </label>
        <button type="button" accessKey="t" onClick={this.addTesouro.bind(this, values)}>{Tesouro.getButtonText(type)}</button>
      </div>
    );
  }
}
