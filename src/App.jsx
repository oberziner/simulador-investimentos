import React, { Component } from 'react';
import Investment from './Investment';
import './main.css';
import { newRate } from './simulation/interest-rates';
import { newLCI } from './simulation/lci';
import { newCDB } from './simulation/cdb';
import { newTesouro } from './simulation/tesouro';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.addLCI = this.addInvestment.bind(this);
    this.addCDB = this.addInvestmentCDB.bind(this);
    this.addTesouro = this.addInvestmentTesouro.bind(this);

    this.state = {
      investments: [],
    };
  }

  addInvestment() {
    this.setState((state) => ({
      investments: [...state.investments, newLCI(
        new Date(state.startDate),
        state.initialValue,
        newRate(0.04, 'year252'),
        new Date(state.endDate),
      )],
    }));
  }

  addInvestmentCDB() {
    this.setState((state) => ({
      investments: [...state.investments, newCDB(
        new Date(state.startDate),
        state.initialValue,
        newRate(0.04, 'year252'),
        new Date(state.endDate),
      )],
    }));
  }

  addInvestmentTesouro() {
    this.setState((state) => ({
      investments: [...state.investments, newTesouro(
        new Date(state.startDate),
        state.initialValue,
        newRate(0.05, 'year252'),
        new Date(state.endDate),
      )],
    }));
  }

  handleOnChange(e) {
    this.setState({ [e.target.id]: e.target.value });
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
