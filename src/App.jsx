import React, { Component } from 'react';
import Investment from './Investment';
import './main.css';
import { newRate } from './simulation/interest-rates';
import { newLCI } from './simulation/lci';
import { newCDB } from './simulation/cdb';
import { newTesouro } from './simulation/tesouro';

class App extends Component {
  static lciFactory({ startDate, initialValue, endDate }) {
    return newLCI(startDate, initialValue, newRate(0.04, 'year252'), endDate);
  }

  static cdbFactory({ startDate, initialValue, endDate }) {
    return newCDB(startDate, initialValue, newRate(0.04, 'year252'), endDate);
  }

  static tesouroFactory({ startDate, initialValue, endDate }) {
    return newTesouro(startDate, initialValue, newRate(0.05, 'year252'), endDate);
  }

  static parseInputChange(e) {
    switch (e.target.id) {
      case 'startDate':
      case 'endDate': return new Date(e.target.value);
      case 'initialValue': return e.target.value;
      default: return e.target.value;
    }
  }

  constructor(props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.addLCI = this.addInvestment.bind(this, App.lciFactory);
    this.addCDB = this.addInvestment.bind(this, App.cdbFactory);
    this.addTesouro = this.addInvestment.bind(this, App.tesouroFactory);

    this.state = {
      investments: [],
    };
  }

  addInvestment(investmentFactory) {
    this.setState((state) => ({
      investments: [...state.investments, investmentFactory(state)],
    }));
  }

  handleOnChange(e) {
    this.setState({ [e.target.id]: App.parseInputChange(e) });
  }

  render() {
    const { investments } = this.state;
    return (
      <div>
        <label htmlFor="initialValue">
          Valor:
          <input
            type="text"
            id="initialValue"
            onChange={this.handleOnChange}
          />
        </label>
        <label htmlFor="startDate">
          Data Inicial:
          <input
            type="date"
            id="startDate"
            onChange={this.handleOnChange}
          />
        </label>
        <label htmlFor="endDate">
          Data Final:
          <input
            type="date"
            id="endDate"
            onChange={this.handleOnChange}
          />
        </label>

        <button type="button" onClick={this.addLCI}>LCI</button>
        <button type="button" onClick={this.addCDB}>CDB</button>
        <button type="button" onClick={this.addTesouro}>Tesouro</button>
        <div>
          {investments.map((i) => (
            <div key={Math.random()} className="investment-container">
              <Investment investment={i} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
