import React from 'react';
import RecordRTC from 'recordrtc';


const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

class webcam extends React.Component {
  constructor(props) {
    super();

    this.state = {
      recordVideo: null,
      src: null,
      uploadSuccess: null,
      uploading: false,
      recording: false,
    };

    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.getSignedUrl = this.getSignedUrl.bind(this);
    this.renderRecordButton = this.renderRecordButton.bind(this);
  }

  componentDidMount() {
    if (!hasGetUserMedia) {
      alert('Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.');
      return;
    }
    this.requestUserMedia();
  }

  captureUserMedia(callback) {
    const params = { audio: true, video: true };
    this.setState({ x: 1 });
    navigator.getUserMedia(params, callback, (error) => {
      console.log(JSON.stringify(error));
    });
  }

  getSignedUrl(file) {
    const queryString = `?objectName=${file.id}&contentType=${encodeURIComponent(file.type)}`;
    return fetch(`/s3/sign${queryString}`)
      .then((response) => {
        console.log(response.json());
        return response.json();
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  }

  requestUserMedia() {
    console.log('requestUserMedia');
    this.captureUserMedia((stream) => {
      this.setState({ src: window.URL.createObjectURL(stream) });
      console.log('setting state', this.state);
    });
  }

  startRecord() {
    this.setState({ recording: true });
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

  stopRecord() {
    this.state.recordVideo.stopRecording(() => {
      // const params = {
      //   type: 'video/webm',
      //   data: this.state.recordVideo.blob,
      //   id: Math.floor(Math.random() * 90000) + 10000,
      // };
      this.setState({ uploading: true });

      // TODO: Here is our save
      this.state.recordVideo.save('test.webm');
    });
  }

  render() {
    return (
      <div>
        <div className="videoRecordDiv">
          <video autoPlay muted src={this.state.src} />
          {this.state.uploading ?
            <div>Uploading...</div> : null}
          <div>{this.renderRecordButton()}</div>
        </div>
      </div>
    );
  }
}

export default webcam;
