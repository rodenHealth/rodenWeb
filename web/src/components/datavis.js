import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import DB_CONFIG from '../config';
import Chart from './chart';
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
    this.firebaseApp = firebase.initializeApp(DB_CONFIG);
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
    // const videoRef = this.firebaseApp.database().ref('videos');
    const videoRef = this.firebaseApp.database().ref(`videos/${this.props.match.params.id}`);

    // TODO: Loop this until correct value is received
    videoRef.once('value').then((snapshot) => {
      // debugger; // eslint-disable-line
      this.setState({ video: snapshot.val() });
      // debugger; // eslint-disable-line
      this.getEmotionData();
      this.getFrameData();
      // debugger; // eslint-disable-line
    });
  }

  componentDidMount() {
    // Will open socket here?
    console.log(this.props);
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
        <Chart
          title="please work"
          data={{
            labels: this.state.frames.map((frame) => {
              return frame.frameTime;
            }),
            datasets: [
              {
                title: 'Anger',
                color: 'grey',
                values: this.state.anger,
              },
              {
                title: 'Contempt',
                color: 'green',
                values: this.state.anger,
              },
              {
                title: 'Disgust',
                color: 'gold',
                values: this.state.disgust,
              },
              {
                title: 'Fear',
                color: 'lime',
                values: this.state.fear,
              },
              {
                title: 'Happiness',
                color: 'maroon',
                values: this.state.happiness,
              },
              {
                title: 'Neutral',
                color: 'olive',
                values: this.state.neutral,
              },
              {
                title: 'Sadness',
                color: 'orange',
                values: this.state.sadness,
              },
              {
                title: 'Surprise',
                color: 'pink',
                values: this.state.surprise,
              },
            ],
          }}
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
