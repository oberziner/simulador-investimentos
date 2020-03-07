import React, { Component } from 'react';
import Investment from './Investment';
import { InputList } from './InputList';
import './main.css';
import { newRate } from './simulation/interest-rates';
import { newLCI } from './simulation/lci';
import { newCDB } from './simulation/cdb';
import { newTesouro } from './simulation/tesouro';

class App extends Component {
  static lciFactory({ startDate, initialValue, endDate, selicValue, percentCDI }) {
    return newLCI(startDate, initialValue, selicValue, percentCDI, endDate);
  }

  static cdbFactory({ startDate, initialValue, endDate, selicValue, percentCDI }) {
    return newCDB(startDate, initialValue, selicValue, percentCDI, endDate);
  }

  static tesouroFactory({ startDate, initialValue, endDate, selicValue }) {
    return newTesouro(startDate, initialValue, selicValue, endDate);
  }

  static parseInputChange(e) {
    switch (e.id) {
      case 'startDate':
      case 'endDate': return new Date(e.value);
      case 'selicValue': return newRate(e.value / 100, 'year252');
      default: return e.value;
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
    this.setState({ [e.id]: App.parseInputChange(e) });
  }

  render() {
    const { investments } = this.state;
    return (
      <div>
        <InputList
          onChange={this.handleOnChange}
          values={{
            initialValue: 4444,
            startDate: '2015-01-01',
            endDate: '2016-01-01',
            selicValue: '5',
            percentCDI: '90',
          }}
        />

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
