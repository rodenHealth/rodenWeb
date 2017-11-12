import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import Counter from './containers/counter';
import Controls from './containers/controls';
import webcam from './webcam';
// import App from './components/app';

import './style.scss';

// this creates the store with the reducers, and does some other stuff to initialize devtools
const store = createStore(reducers, {}, compose(
  applyMiddleware(),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));

const Nav = (props) => {
  return (
    <div className="mainNavBar">
      <div>roden test bench</div>
    </div>
  );
};

const About = (props) => {
  return <div> All there is to know about me </div>;
};
const Welcome = (props) => {
  return (
    <div>
      <Counter />
      <Controls />
    </div>
  );
};
const Test = (props) => {
  return <div> ID: {props.match.params.id} </div>;
};

const App = (props) => {
  return (
    <Router>
      <div>
        <Nav />
        <Route exact path="/" component={webcam} />
        <Route path="/about" component={About} />
        <Route exact path="/test/:id" component={Test} />
      </div>
    </Router>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('main'));
