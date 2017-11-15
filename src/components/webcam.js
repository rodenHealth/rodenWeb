import React from 'react';
import RecordRTC from 'recordrtc';
import { BrowserRouter as Link } from 'react-router-dom';
import { Router } from 'react-router';
import uuidv4 from 'uuid/v4';
import openSocket from 'socket.io-client';

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

class webcam extends React.Component {
  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super();

    this.state = {
      recordVideo: null,
      src: null,
      recording: false,
      videoId: -1,
      response: false,
      socket: openSocket('http://localhost:3000'),
    };
    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.renderRecordButton = this.renderRecordButton.bind(this);
  }

  componentDidMount() {
    // Handle the user doens't support this video
    // TODO: Be cool
    if (!hasGetUserMedia) {
      console.log('Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.');
      return;
    }
    this.requestUserMedia();
  }


  // Get usermedia types for navigator
  captureUserMedia(callback) {
    const params = { audio: true, video: true };
    this.setState({ x: 1 });
    navigator.getUserMedia(params, callback, (error) => {
      console.log(JSON.stringify(error));
    });
  }

  // Create stream
  requestUserMedia() {
    console.log('requestUserMedia');
    this.captureUserMedia((stream) => {
      this.setState({ src: window.URL.createObjectURL(stream) });
      console.log('setting state', this.state);
    });
  }

  // Begin recording
  startRecord() {
    this.setState({ recording: true });

    // Handle record stream
    this.captureUserMedia((stream) => {
      const options = {
        mimeType: 'video/webm',
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: (256 * 8 * 1023),
        bitsPerSecond: (256 * 8 * 1023),
      };
      this.state.recordVideo = RecordRTC(stream, options);
      this.state.recordVideo.startRecording();
    });
  }

  // Stops recording
  stopRecord() {
    // Stop recording
    this.setState({ recording: false });

    // Generate video ID
    const videoID = uuidv4();
    this.setState({ videoId: videoID });

    // Save the video to file
    this.state.recordVideo.stopRecording(() => {
      // TODO: Here is our save
      this.state.recordVideo.save(`${videoID}.webm`);
      // Notify
      const fileData = { path: `${videoID}.webm`, id: videoID };
      this.state.socket.emit('data', fileData);
      this.state.socket.on('complete', (data) => {});
    });


    //
    // const data = { id: '234' };
    // socket.emit('path', data);
    // // this.state.socket.on('1', null);
    // socket.emit('id', data);
    // console.log('complete');
    // this.state.socket.on('1', null);


    // this.context.router.history.push(`/${videoID}`);
  }

  // Display 'record' or 'stop' button
  renderRecordButton() {
    if (this.state.recording) {
      return (
        <button className="recordingButton" onClick={this.stopRecord}>stop</button>
      );
    } else {
      return (
        <button className="recordingButton" onClick={this.startRecord}>record</button>
      );
    }
  }

  // Final redner
  render() {
    return (
      <div>
        <div className="videoRecordDiv">
          <video autoPlay muted src={this.state.src} />
          <div>{this.renderRecordButton()}</div>
        </div>
      </div>
    );
  }
}

export default webcam;
