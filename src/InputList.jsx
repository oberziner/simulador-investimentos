import React, { Component } from 'react';

export class InputList extends Component {
  constructor(props) {
    super(props);

    this.onChange = props.onChange;
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      initialValue: '',
      startDate: '',
      endDate: '',
      selicValue: '',
      ...props.values,
    };

    Object.keys(props.values).forEach((k) => {
      this.onChange({ id: k, value: props.values[k] });
    });
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
    this.onChange({ id: e.target.id, value: e.target.value });
  }

  render() {
    const { state } = this;
    return (
      <div className="input-list">
        <label htmlFor="initialValue">
          Valor:
          <input
            type="text"
            id="initialValue"
            onChange={this.handleChange}
            value={state.initialValue}
          />
        </label>
        <label htmlFor="startDate">
          Data Inicial:
          <input
            type="date"
            id="startDate"
            onChange={this.handleChange}
            value={state.startDate}
          />
        </label>
        <label htmlFor="endDate">
          Data Final:
          <input
            type="date"
            id="endDate"
            onChange={this.handleChange}
            value={state.endDate}
          />
        </label>
        <label htmlFor="selicValue">
          SELIC:
          <input
            type="text"
            id="selicValue"
            onChange={this.handleChange}
            value={state.selicValue}
          />
        </label>
      </div>
    );
  }
}
