import React, { Component } from 'react';
import Investment from './Investment';
import { InputList } from './InputList';
import { CdbAndCdi } from './CdbAndCdi';
import './main.css';
import { newRate } from './simulation/interest-rates';
import { newCDB } from './simulation/cdb';
import { newTesouro } from './simulation/tesouro';

class App extends Component {
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
    this.addCDB = this.createInvestment.bind(this, App.cdbFactory);
    this.addTesouro = this.createInvestment.bind(this, App.tesouroFactory);
    this.addInvestment = this.addInvestment.bind(this);

    this.state = {
      investments: [],
      values: {
        percentCDI: '90',
      },
    };
  }

  addInvestment(investment) {
    this.setState((state) => ({
      investments: [...state.investments, investment],
    }));
  }

  createInvestment(investmentFactory) {
    this.setState((state) => ({
      investments: [...state.investments, investmentFactory(state.values)],
    }));
  }

  handleOnChange(e) {
    this.setState((state) => ({
      values: { ...state.values, [e.id]: App.parseInputChange(e) },
    }));
  }

  render() {
    const { investments } = this.state;
    const { values } = this.state;
    // console.log('render app', this.state.values);
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
        <CdbAndCdi
          values={values}
          onChange={this.handleOnChange}
          onInvestmentAdd={this.addInvestment}
        />

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
