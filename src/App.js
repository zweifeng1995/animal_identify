import React, { Component } from 'react';
import './App.css';
import Animal_Identity from "./Animal_Identity.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">Animal_Identify</header>
        <Animal_Identity />
        <footer className="App-footer"></footer>
      </div>
    );
  }
}

export default App;
