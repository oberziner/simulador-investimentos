import React, { Component } from 'react';
import f from './format';

class Investment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {investment} = this.props;
    return (
      <div>
        <h2 className="title">
          {investment.title}
        </h2>
        <p>
          {`Data inicio: ${f.formatDate(investment.startDate)}`}
        </p>
        <p>
          {`Data fim: ${f.formatDate(investment.endDate)}`}
        </p>
      </div>
    );
  }
}

export default Investment;
