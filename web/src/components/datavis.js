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
    };
  }

  componentDidMount() {
    // const videoRef = this.firebaseApp.database().ref('videos');
    firebasedb.handleDataForRecord(this.props.match.params.id, (key, snapshot) => {
      this.setState({ video: snapshot.val() });
      // debugger; // eslint-disable-line
      this.getFrameData();
      this.getEmotionData();
    });

    // const videoRef = firebase.database().ref(`videos/${this.props.match.params.id}`);
    // videoRef.on('value', (snapshot) => {
    //   // debugger; // eslint-disable-line
    //   console.log('received data bitch');
    //
    //   // debugger; // eslint-disable-line
    // });
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
      if (video[key]) {
        if (video[key].emotion) {
          anger.push(video[key].emotion.anger);
          contempt.push(video[key].emotion.contempt);
          disgust.push(video[key].emotion.disgust);
          fear.push(video[key].emotion.fear);
          happiness.push(video[key].emotion.happiness);
          neutral.push(video[key].emotion.neutral);
          sadness.push(video[key].emotion.sadness);
          surprise.push(video[key].emotion.surprise);
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


  render() {
    // console.log(JSON.stringify(this.state.data));
    // this.getEmotionData('BernieNurseSpeech');
    return (
      <div>
        <LineChart anger={this.state.anger}
          contempt={this.state.contempt}
          disgust={this.state.disgust}
          fear={this.state.fear}
          happiness={this.state.happiness}
          neutral={this.state.neutral}
          sadness={this.state.sadness}
          surprise={this.state.surprise}
        />
        <center>
          {/* --- making sure this worked --- */}
          <h6>Anger: {this.state.anger[0]}</h6>
          <h6>Contempt: {this.state.contempt[0]}</h6>
          <h6>Disgust: {this.state.disgust[0]}</h6>
          <h6>Fear: {this.state.fear[0]}</h6>
          <h6>Happiness: {this.state.happiness[0]}</h6>
          <h6>Neutral: {this.state.neutral[0]}</h6>
          <h6>Sadness: {this.state.sadness[0]}</h6>
          <h6>Surprise: {this.state.surprise[0]}</h6>
        </center>
      </div>
    );
  }
}
