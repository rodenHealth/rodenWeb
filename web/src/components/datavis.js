import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import DB_CONFIG from '../config';
import '../style.scss';

// Used to generate video IDs
const uuidv1 = require('uuid/v1');


export default class datavis extends Component {
  constructor(props) {
    super(props);
    this.firebaseApp = firebase.initializeApp(DB_CONFIG);
    // console.log(this.firebaseApp.getAllRecords());
    this.state = {
      videos: [],
      data: [],
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
    const videoRef = this.firebaseApp.database().ref(`videos/${this.props.match.params.id}`);

    // TODO: Loop this until correct value is received
    videoRef.once('value').then((snapshot) => {
      // debugger; // eslint-disable-line
      this.setState({ videos: snapshot.val() });
      snapshot.forEach((data) => {
        // Only grab our target record
        if (data.key === this.props.match.params.id) {
          console.log(data.key, data.val()); // Debug
          this.setState({ data: data.val() });
          this.getEmotionData();
        }
      });
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

  render() {
    // console.log(JSON.stringify(this.state.data));
    // this.getEmotionData('BernieNurseSpeech');
    return (
      <div>
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
