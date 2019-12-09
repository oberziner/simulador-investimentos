import React, { Component } from 'react';
import Investment from './Investment';
import './main.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      investment: {
        title: 'LCI',
        startDate: new Date('2019-04-01'),
        endDate: new Date('2019-12-01'),
        initialValue: 9999,
        steps: [
          { date: new Date('2019-04-01'), value: 10000 },
        ],
      },
    };
  }

  render() {
    const { investment } = this.state;
    return (
      <Investment investment={investment} />
    );
  }
}

export default App;
