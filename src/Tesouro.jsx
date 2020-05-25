import React, { Component } from 'react';
import { newTesouro } from './simulation/tesouro';

export class Tesouro extends Component {
  static tesouroFactory({ startDate, initialValue, endDate, selicValue }) {
    return newTesouro(startDate, initialValue, selicValue, new Date('2025-03-01'), endDate);
  }

  constructor(props) {
    super(props);

    this.notifyInvestmentAdded = props.onInvestmentAdd;
    this.addTesouro = this.addInvestment.bind(this, Tesouro.tesouroFactory);

    this.state = {
      ...props.values,
    };
  }

  addInvestment(investmentFactory, values) {
    this.notifyInvestmentAdded(investmentFactory({ ...this.state, ...values }));
  }

  render() {
    const { values } = this.props;
    return (
      <div className="input-list">
        <button type="button" accessKey="t" onClick={this.addTesouro.bind(this, values)}>(T)esouro SELIC 2025</button>
      </div>
    );
  }
}
