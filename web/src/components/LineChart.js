import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, Hint } from 'react-vis';
import '../style.scss';

export default class LineChart extends Component {
  static convertFrameTime(key) {
    const frame = key.slice(5);
    const seconds = ((frame.length - 1) * 26) + (frame.charCodeAt(frame.length - 1) - 65);
    const time = new Date(seconds * 1000).toISOString().substr(11, 8);
    console.log(key + ' -> ' + time); // eslint-disable-line
    return time;
  }

  constructor(props) {
    super(props);


    // console.log(this.firebaseApp.getAllRecords());
    this.state = {
      video: [],
    };

    this.renderEmotionLines = this.renderEmotionLines.bind(this);
  }


  renderEmotionLines(emotionArray) {
    const data = [];
    for (let i = 0; i < emotionArray.length; i++) {
      const newObject = {
        x: i,
        y: emotionArray[i] * 1000,
      };
      data.push(newObject);
    }

    console.log(data);
    return data;
  }

  render() {
    // console.log(JSON.stringify(this.state.data));
    // this.getEmotionData('BernieNurseSpeech');
    return (
      <div>
        <center>
          <XYPlot
            width={1200}
            height={300}
          >
            <HorizontalGridLines />
            <LineSeries
              data={this.renderEmotionLines(this.props.anger)}
            />
            <LineSeries
              data={this.renderEmotionLines(this.props.contempt)}
            />
            <LineSeries
              data={this.renderEmotionLines(this.props.disgust)}
            />
            <LineSeries
              data={this.renderEmotionLines(this.props.fear)}
            />
            <LineSeries
              data={this.renderEmotionLines(this.props.happiness)}
            />
            <LineSeries
              data={this.renderEmotionLines(this.props.neutral)}
            />
            <LineSeries
              data={this.renderEmotionLines(this.props.surprise)}
            />
            <LineSeries
              data={this.renderEmotionLines(this.props.sadness)}
            />
            <XAxis title="Frames" />
            <YAxis title="Emotions" />
          </XYPlot>
        </center>
      </div>
    );
  }
}
