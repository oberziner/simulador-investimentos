import React, { Component } from 'react';
import { newTesouro } from './simulation/tesouro';

export class Tesouro extends Component {
  static tesouroFactory({ startDate, initialValue, endDate, selicValue, dueDate }) {
    return newTesouro(startDate, initialValue, selicValue, new Date(dueDate), endDate);
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.notifyInvestmentAdded = props.onInvestmentAdd;
    this.addTesouro = this.addInvestment.bind(this, Tesouro.tesouroFactory);

    this.state = {
      dueDate: '2025-03-01',
      ...props.values,
    };
  }

  addInvestment(investmentFactory, values) {
    this.notifyInvestmentAdded(investmentFactory({ ...this.state, ...values }));
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    const { state } = this;
    const { values } = this.props;
    return (
      <div className="input-list">
        <label htmlFor="dueDate">
          Data de vencimento:
          <input
            type="date"
            id="dueDate"
            onChange={this.handleChange}
            value={state.dueDate}
          />
        </label>
        <button type="button" accessKey="t" onClick={this.addTesouro.bind(this, values)}>(T)esouro</button>
      </div>
    );
  }
}
