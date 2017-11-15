'use strict';

import { React, Component } from 'react';
import PropTypes from 'prop-types';


export default class SimpleTooltipStyle extends Component {  // eslint-disable-line

  constructor(props) {  // eslint-disable-line
    super(props);
  }

  render() {
    const {
      title,
      color,  // eslint-disable-line
      fieldTitle,
      value,
    } = this.props.contentTooltip;

    const tooltipBkgStyle = {
      backgroundColor: 'rgba(50, 50, 50, 0.8)',
      borderRadius: '4px',
      padding: '10px',
      border: '0',
    };

    const tooltipTitle = {
      color: 'white',
      fontWeight: 'bold',
      marginBottom: '5px',
    };

    const tooltipContent = {
      color: 'white',
    };

    return (
      <div className="tooltip_bkg" style={tooltipBkgStyle} key="tooltip">
        <div style={tooltipTitle}>{title}</div>
        <div style={tooltipContent}>
          {fieldTitle}: {value}
        </div>
      </div>
    );
  }
}

SimpleTooltipStyle.propTypes = {
  title: PropTypes.any,         // eslint-disable-line
  color: PropTypes.any,         // eslint-disable-line
  fieldTitle: PropTypes.string, // eslint-disable-line
  value: PropTypes.any          // eslint-disable-line
};
