import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, Hint } from 'react-vis';
import '../style.scss';

export default class LineChart extends Component {
  constructor(props) {
    super(props);


    // console.log(this.firebaseApp.getAllRecords());
    this.state = {
      video: [],
      anger: [],
      contempt: [],
      disgust: [],
      fear: [],
      happiness: [],
      neutral: [],
      sadness: [],
      surprise: [],
    };

    this.renderEmotionLines = this.renderEmotionLines.bind(this);
    this.convertFrameTime = this.convertFrameTime.bind(this);
  }

  convertFrameTime(seconds) {
    const time = new Date(seconds * 1000).toISOString().substr(14, 5);
    return time;
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

    return data;
  }

  render() {
    const anger = this.renderEmotionLines(this.props.anger);
    const contempt = this.renderEmotionLines(this.props.contempt);
    const disgust = this.renderEmotionLines(this.props.disgust);
    const fear = this.renderEmotionLines(this.props.fear);
    const happiness = this.renderEmotionLines(this.props.happiness);
    const neutral = this.renderEmotionLines(this.props.neutral);
    const sadness = this.renderEmotionLines(this.props.sadness);
    const surprise = this.renderEmotionLines(this.props.surprise);
    // console.log(JSON.stringify(this.state.data));
    // this.getEmotionData('BernieNurseSpeech');
    return (
      <div>
        <center>
          <XYPlot
            width={1200}
            height={300}
            yPadding={10}
            xPadding={1}
          >
            <HorizontalGridLines />
            <LineSeries
              data={anger}
              onNearestX={this.props.handleFrameChange}
            />
            <LineSeries
              data={contempt}
            />
            <LineSeries
              data={disgust}
            />
            <LineSeries
              data={fear}
            />
            <LineSeries
              data={happiness}
            />
            <LineSeries
              data={neutral}
            />
            <LineSeries
              data={surprise}
            />
            <LineSeries
              data={sadness}
            />
            <XAxis title="Frame time" tickFormat={v => `${this.convertFrameTime(v)}`} />
            <YAxis title="Emotions"tickFormat={v => `${v / 100}`} />
          </XYPlot>
        </center>
      </div>
    );
  }
}
