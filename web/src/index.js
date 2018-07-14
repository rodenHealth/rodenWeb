import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import webcam from './components/webcam';
import datavis from './components/datavis';

import './style.scss';

// Main nav
const Nav = (props) => {
  return (
    <div className="mainNavBar">
      <div>roden test bench</div>
    </div>
  );
};

// Main app
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // const videoRef = this.firebaseApp.database().ref('videos');
    document.title = 'Roden Test Bench';
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Route exact path="/" component={webcam} />
          <Route exact path="/:id" component={datavis} />
        </div>
      </Router>
    );
  }
}


ReactDOM.render(
  <App />
  , document.getElementById('main'));
