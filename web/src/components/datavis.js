import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import * as firebasedb from '../firebase';
import LineChart from './LineChart';
import '../style.scss';

// Used to generate video IDs
const uuidv1 = require('uuid/v1');


export default class datavis extends Component {
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
      frames: [],
      videoId: '',
      anger: [],
      contempt: [],
      disgust: [],
      fear: [],
      happiness: [],
      neutral: [],
      sadness: [],
      surprise: [],
      speech: '',
      currentRecord: 0,
    };
  }

  componentWillMount() {
    // const videoRef = this.firebaseApp.database().ref('videos');

    firebasedb.handleDataForRecord(this.props.match.params.id, (key, snapshot) => {
      this.setState({ video: snapshot.val() });
      this.getFrameData();
      this.getEmotionData();
      this.getSpeechData();
    });

    // const videoRef = firebase.database().ref(`videos/${this.props.match.params.id}`);
    // videoRef.on('value', (snapshot) => {
    //   // debugger; // eslint-disable-line
    //   console.log('received data bitch');
    //
    //   // debugger; // eslint-disable-line
    // });
  }

  getSpeechData() {
    const speech = this.state.video.speech;

    this.setState({
      speech,
    });
  }

  getEmotionData() {
    const video = this.state.video;
    const anger = [];
    const contempt = [];
    const disgust = [];
    const fear = [];
    const happiness = [];
    const neutral = [];
    const sadness = [];
    const surprise = [];


    for (const key in video) {
      // debugger // eslint-disable-line
      if (video[key]) {
        if (video[key].emotion) {
          anger.push(video[key].emotion.anger * 1000);
          contempt.push(video[key].emotion.contempt * 1000);
          disgust.push(video[key].emotion.disgust * 1000);
          fear.push(video[key].emotion.fear * 1000);
          happiness.push(video[key].emotion.happiness * 1000);
          neutral.push(video[key].emotion.neutral * 1000);
          sadness.push(video[key].emotion.sadness * 1000);
          surprise.push(video[key].emotion.surprise * 1000);
        }
      }
    }
    this.setState({
      anger, contempt, disgust, fear, happiness, neutral, sadness, surprise,
    });
    // debugger; // eslint-disable-line
  }

  getFrameData() {
    const video = this.state.video;
    const frames = [];

    for (const key in video) {
      if (video[key].emotion !== undefined) {
        video[key].frameTime = datavis.convertFrameTime(key);
        frames.push(video[key]);
      }
    }
    this.setState({ frames });
  }

  // TODO: Ben "normalized" this, we need to verify
  render() {
    console.log(`TEST: ${this.state.currentRecord}`);
    // console.log(JSON.stringify(this.state.data));
    // this.getEmotionData('BernieNurseSpeech');
    return (
      <div>
        <div className="frameTitle">
          frame: {this.state.currentRecord}
        </div>
        <LineChart handleFrameChange={(x) => { this.setState({ currentRecord: x.x }); }}
          anger={this.state.anger.map((val) => {
            return (val / 1000) < 0.09 ? val : 0.09;
          })}
          contempt={this.state.contempt.map((val) => {
            return (val / 1000) < 0.09 ? val : 0.09;
          })}
          disgust={this.state.disgust.map((val) => {
            return (val / 1000) < 0.09 ? val : 0.09;
          })}
          fear={this.state.fear.map((val) => {
            return (val / 1000) < 0.09 ? val : 0.09;
          })}
          happiness={this.state.happiness.map((val) => {
            return (val / 1000) < 0.09 ? val : 0.09;
          })}
          neutral={this.state.neutral.map((val) => {
            return (val / 1000) / 1000;
          })}
          sadness={this.state.sadness.map((val) => {
            return (val / 1000) < 0.09 ? val : 0.09;
          })}
          surprise={this.state.surprise.map((val) => {
            return (val / 1000) < 0.09 ? val : 0.09;
          })}
        />
        <center>
          <div className="wordSpace">
            <div className="title">speech analysis</div>
            <div className="speech">{this.state.speech}</div>
          </div>
        </center>

        <center>
          {/* --- making sure this worked --- */}
          <h6>Anger: {this.state.anger[this.state.currentRecord]}</h6>
          <h6>Contempt: {this.state.contempt[this.state.currentRecord]}</h6>
          <h6>Disgust: {this.state.disgust[this.state.currentRecord]}</h6>
          <h6>Fear: {this.state.fear[this.state.currentRecord]}</h6>
          <h6>Happiness: {this.state.happiness[this.state.currentRecord]}</h6>
          <h6>Neutral: {this.state.neutral[this.state.currentRecord] / 1000}</h6>
          <h6>Sadness: {this.state.sadness[this.state.currentRecord]}</h6>
          <h6>Surprise: {this.state.surprise[this.state.currentRecord]}</h6>
        </center>
      </div>
    );
  }
}
