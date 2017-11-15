'use strict';

import { React, Component } from 'react';
import ReactDOM from 'react-dom';
import { LineTooltip } from 'react-d3-tooltip';
import PropTypes from 'prop-types';
import SimpleTooltipStyle from './SimpleTooltipStyle';


export default class line extends Component {
  render() {
    const width = 700;
    const height = 300;
    const margins = { left: 100, right: 100, top: 50, bottom: 50 };
    const title = 'title';

    const chartSeries = [
      {
        field: 'emotion.anger',
        name: 'Anger',
        color: '#ff7f0e',
      },
    ];

    // your x accessor
    const x = (d) => {
      return d.frameTime;
    };

    const xScale = 'time';
    return (
      <div>
        <LineTooltip
          title={title}
          data={this.props.data}
          width={width}
          height={height}
          margins={margins}
          chartSeries={chartSeries}
          x={x}
          xScale={xScale}
        >
          <SimpleTooltipStyle />
        </LineTooltip>
      </div>
    );
  }
}

line.propTypes = {
  data: PropTypes.array.isRequired, // eslint-disable-line
};
