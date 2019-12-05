import React, {Component} from 'react';
import logic from './logic.js';
import './main.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      message: logic.getHelloMessage()
    };
  }

  render() {
    return (
      <h2 className="title">Welcome to React - {this.state.message}</h2>
    );
  }
}

export default App;
