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
        new Date('2019-04-01'),
        9999,
        newRate(0.04, 'year252'),
        new Date('2019-12-01'),
      )],
    }));
  }

  addInvestmentCDB() {
    this.setState((state) => ({
      investments: [...state.investments, newCDB(
        new Date('2019-04-01'),
        8888,
        newRate(0.04, 'year252'),
        new Date('2019-12-01'),
      )],
    }));
  }

  addInvestmentTesouro() {
    this.setState((state) => ({
      investments: [...state.investments, newTesouro(
        new Date('2019-04-01'),
        5000,
        newRate(0.05, 'year252'),
        new Date('2019-12-01'),
      )],
    }));
  }

  render() {
    const { investments } = this.state;
    return (
      <div>
        <button type="button" onClick={this.addLCI}>LCI</button>
        <button type="button" onClick={this.addCDB}>CDB</button>
        <button type="button" onClick={this.addTesouro}>Tesouro</button>
        {investments.map((i) => (
          <div key={Math.random()}>
            <Investment investment={i} />
          </div>
        ))}
      </div>
    );
  }
}

export default App;
