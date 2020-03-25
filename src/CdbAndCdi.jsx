import React, { Component } from 'react';
import { newLCI } from './simulation/lci';
import { newCDB } from './simulation/cdb';

export class CdbAndCdi extends Component {
  static cdbFactory({ startDate, initialValue, endDate, selicValue, percentCDI }) {
    return newCDB(startDate, initialValue, selicValue, percentCDI, endDate);
  }

  static lciFactory({ startDate, initialValue, endDate, selicValue, percentCDI }) {
    return newLCI(startDate, initialValue, selicValue, percentCDI, endDate);
  }

  constructor(props) {
    super(props);

    this.notifyInvestmentAdded = props.onInvestmentAdd;
    this.onChange = props.onChange;
    this.addLCI = this.addInvestment.bind(this, CdbAndCdi.lciFactory);
    this.addCDB = this.addInvestment.bind(this, CdbAndCdi.cdbFactory);
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
      <div className="input-list">
        <label htmlFor="percentCDI">
          % CDI:
          <input
            type="text"
            id="percentCDI"
            onChange={this.handleChange}
            value={state.percentCDI}
          />
        </label>
        <button type="button" accessKey="l" onClick={this.addLCI.bind(this, values)}>(L)CI</button>
        <button type="button" accessKey="c" onClick={this.addCDB.bind(this, values)}>(C)DB</button>
      </div>
    );
  }
}
