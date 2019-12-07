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
      }
    }
  }

  render() {
    return (
      <Investment investment={this.state.investment}/>
    );
  }
}

export default App;
