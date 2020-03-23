import React, { Component } from 'react';
import { newLCI } from './simulation/lci';

export class CdbAndCdi extends Component {
  static lciFactory({ startDate, initialValue, endDate, selicValue, percentCDI }) {
    return newLCI(startDate, initialValue, selicValue, percentCDI, endDate);
  }

  constructor(props) {
    super(props);

    this.notifyInvestmentAdded = props.onInvestmentAdd;
    this.onChange = props.onChange;
    this.addLCI = this.addInvestment.bind(this, CdbAndCdi.lciFactory);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      percentCDI: '',
      ...props.values,
    };

    Object.keys(props.values).forEach((k) => {
      this.onChange({ id: k, value: props.values[k] });
    });
  }

  addInvestment(investmentFactory, values) {
    this.notifyInvestmentAdded(investmentFactory({ ...this.state, ...values }));
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
    this.onChange({ id: e.target.id, value: e.target.value });
  }

  render() {
    const { state } = this;
    const { values } = this.props;
    // console.log('render cdb', this.props.values);
    return (
      <div>
        <label htmlFor="percentCDI">
          % CDI:
          <input
            type="text"
            id="percentCDI"
            onChange={this.handleChange}
            value={state.percentCDI}
          />
        </label>
        <button type="button" onClick={this.addLCI.bind(this, values)}>LCI</button>
      </div>
    );
  }
}
