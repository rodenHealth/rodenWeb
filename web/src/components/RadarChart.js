import { Radar as RadChart } from 'react-chartjs';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../style.scss';


export default class RadarChart extends Component {

  static convertFrameTime(seconds) {
    const time = new Date(seconds * 1000).toISOString().substr(14, 5);
    return time;
  }

  static scaleData(data) {
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const scaled = data.map(((val) => {
      return (avg + ((1 / 3) * (val - avg))).toFixed(5);
    }));
    return scaled;
  }

  constructor(props) {
    super(props);
  }

  render() {
    const anger = RadarChart.scaleData(this.props.anger);
    const contempt = RadarChart.scaleData(this.props.contempt);
    const disgust = RadarChart.scaleData(this.props.disgust);
    const fear = RadarChart.scaleData(this.props.fear);
    const happiness = RadarChart.scaleData(this.props.happiness);
    const neutral = RadarChart.scaleData(this.props.neutral);
    const sadness = RadarChart.scaleData(this.props.sadness);
    const surprise = RadarChart.scaleData(this.props.surprise);

    const colors = [
      'rgba(156, 51, 3, 0.2)', 'rgba(223, 107, 54, 0.2)',
      'rgba(223, 153, 54, 0.2)', 'rgba(156, 93, 3, 0.2)',
      'rgba(2, 105, 66, 0.2)', 'rgba(36, 150, 107, 0.08)',
      'rgba(9, 57, 101, 0.2)', 'rgba(43, 96, 144, 0.2)',
    ];

    const chartData = {
      labels: this.props.frames.map((frame) => {
        return frame.frameTime.substr(3, 7);
      }),

      datasets: [
        {
          label: 'Anger',
          fill: false,
          pointRadius: 1,
          fillColor: colors[0],
          pointHitRadius: 1,
          data: anger,
          spanGaps: false,
        },
        {
          label: 'Contempt',
          fill: false,
          pointRadius: 1,
          fillColor: colors[1],
          pointHitRadius: 1,
          data: contempt,
          spanGaps: false,
        },
        {
          label: 'Disgust',
          fill: false,
          pointRadius: 1,
          fillColor: colors[2],
          pointHitRadius: 1,
          data: disgust,
          spanGaps: false,
        },
        {
          label: 'Fear',
          fill: false,
          pointRadius: 1,
          fillColor: colors[3],
          pointHitRadius: 1,
          data: fear,
          spanGaps: false,
        },
        {
          label: 'Happiness',
          fill: false,
          pointRadius: 1,
          fillColor: colors[4],
          pointHitRadius: 1,
          data: happiness,
          spanGaps: false,
        },
        {
          label: 'Neutral',
          fill: false,
          pointRadius: 1,
          fillColor: colors[5],
          pointHitRadius: 1,
          data: neutral,
          spanGaps: false,
        },
        {
          label: 'Sadness',
          fill: false,
          pointRadius: 1,
          fillColor: colors[6],
          pointHitRadius: 1,
          data: sadness,
          spanGaps: false,
        },
        {
          label: 'Surprise',
          fill: false,
          pointRadius: 1,
          fillColor: colors[7],
          pointHitRadius: 1,
          data: surprise,
          spanGaps: false,
        },
      ],
    };
    return (
      <div>
        <center>
          <RadChart data={chartData} options={null} width="1200" height="250" />
        </center>
      </div>
    );
  }
}
