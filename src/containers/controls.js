import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


import { increment, decrement } from '../actions';

const Controls = (props) => {
  return (
    <div>
      <button onClick={props.increment} className="btn btn-info">+</button>
      <button onClick={props.decrement} className="btn btn-warning">-</button>
    </div>
  );
};

// react-redux glue -- outputs Container that knows how to call actions
  // new way to connect with react router 4
export default withRouter(connect(null, { increment, decrement })(Controls));
