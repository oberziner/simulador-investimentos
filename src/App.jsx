import React, { Component } from 'react';
import { v4 as randomUUID } from 'uuid';
import Investment from './Investment';
import { InputList } from './InputList';
import { CdbAndCdi } from './CdbAndCdi';
import { Tesouro } from './Tesouro';
import './main.css';
import { newRate } from './simulation/interest-rates';

class App extends Component {
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
    this.addInvestment = this.addInvestment.bind(this);
    this.removeInvestment = this.removeInvestment.bind(this);

    this.state = {
      investments: [],
      values: {
        percentCDI: '90',
      },
    };
  }

  addInvestment(investment) {
    this.setState((state) => ({
      investments: [...state.investments, { ...investment, id: randomUUID() }],
    }));
  }

  removeInvestment(investment) {
    this.setState((state) => ({
      investments: state.investments.filter((i) => i !== investment),
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
    return (
      <div>
        <div className="input-box">
          <InputList
            onChange={this.handleOnChange}
            values={{
              initialValue: 10000,
              startDate: '2020-01-01',
              endDate: '2021-01-01',
              selicValue: '5',
            }}
          />
          <CdbAndCdi
            values={values}
            onChange={this.handleOnChange}
            onInvestmentAdd={this.addInvestment}
          />

          <Tesouro
            values={values}
            onInvestmentAdd={this.addInvestment}
          />
        </div>

        <div>
          {investments.map((i) => (
            <div key={i.id} className="investment-container">
              <Investment investment={i} onRemoveClick={this.removeInvestment} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
