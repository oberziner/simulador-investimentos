import React, { Component } from 'react';
import Investment from './Investment';
import './main.css';
import { newRate } from './simulation/interest-rates';
import { newLCI } from './simulation/lci';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      investment: newLCI(
        new Date('2019-04-01'),
        10000,
        newRate(0.04, 'year252'),
        new Date('2019-12-01'),
      ),
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
