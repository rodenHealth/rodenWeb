import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, Hint, DiscreteColorLegend, Crosshair } from 'react-vis';
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
    // debugger; // eslint-disable-line
    const time = new Date(seconds * 1000).toISOString().substr(14, 8);

    return time;
  }

  renderEmotionLines(emotionArray) {
    const data = [];
    for (let i = 0; i < emotionArray.length; i++) {
      const newObject = {
        x: i,
        y: emotionArray[i],
      };
      data.push(newObject);
    }

    return data;
  }

  render() {
    const LABELS = [
      'Anger',
      'Contempt',
      'Disgust',
      'Fear',
      'Happiness',
      'Neutral',
      'Surprise',
      'Sadness',
    ];

    const anger = this.renderEmotionLines(this.props.anger);
    const contempt = this.renderEmotionLines(this.props.contempt);
    const disgust = this.renderEmotionLines(this.props.disgust);
    const fear = this.renderEmotionLines(this.props.fear);
    const happiness = this.renderEmotionLines(this.props.happiness);
    const neutral = this.renderEmotionLines(this.props.neutral);
    const sadness = this.renderEmotionLines(this.props.sadness);
    const surprise = this.renderEmotionLines(this.props.surprise);

    const generateXAxis = (size) => {
    	const result = [];
    	for (let x = 0; x < size; x++) {
    		result.push(x);
    	}

    	return result;
    };
    // debugger // eslint-disable-line
    const totalFrames = generateXAxis(anger.length);
    console.log(totalFrames);

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
            <XAxis title="Frame time" tickFormat={v => `${this.convertFrameTime(v)}`} tickValues={totalFrames} />
            <YAxis title="Emotions" tickFormat={v => `${v / 100}`} />
          </XYPlot>
          <DiscreteColorLegend
            orientation="horizontal"
            width={500}
            items={LABELS}
          />
        </center>
      </div>
    );
  }
}
