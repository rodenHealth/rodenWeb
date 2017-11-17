import { Bar as Barchart } from 'react-chartjs';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../style.scss';

export default class BarChart extends Component {

  static scaleData(data) {
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const scaled = data.map(((val) => {
      return avg + ((1 / 2) * (val - avg));
    }));
    return scaled;
  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    // TODO
  }

  render() {
    const frame = this.props.frame;
    const noData = [0, 0, 0, 0, 0, 0, 0, 0];
    let values = [];

    if (frame) {
      console.log(Object.values(frame)[0]);
      const emotion = Object.values(frame)[0];
      values = BarChart.scaleData(
        [emotion.anger, emotion.contempt, emotion.disgust, emotion.fear,
          emotion.happiness, emotion.neutral / 15, emotion.sadness, emotion.surprise]);
    }

    const chartData = {
      labels: ['Anger', 'Contempt', 'Disgust', 'Fear',
        'Happiness', 'Neutral', 'Sadness', 'Surprise'],
      datasets: [
        {
          label: 'Frame View',
          fill: false,
          pointHoverRadius: 5,
          pointRadius: 1,
          backgroundColor: '#cc65fe',
          borderColor: '#36a2eb',
          fillColor: ['#1a3277', '#79c7e3', '#129399', '#ef5d28', '#ff9833', '#1a3277', '#79c7e3', '#129399'],
          pointHitRadius: 10,
          data: (this.props.frame ? values : noData),
          spanGaps: false,
        },
      ],
    };
    return (
      <div>
        <center>
          <Barchart data={chartData} options={null} width="600" height="250" />
        </center>
      </div>
    );
  }
}
