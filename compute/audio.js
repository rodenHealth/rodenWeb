// Imports the Google Cloud client library

// BUILD STEP
// export GOOGLE_APPLICATION_CREDENTIALS="./bin/roden-864e2-firebase-adminsdk-8sagx-0322824252.json"

// The name of the audio file to transcribe
// const filePath = '/Users/tylerburnam/dev/rodenWeb/compute/tmp/1446e323-49a1-47e2-8336-4e13c38f3b6d/1446e323-49a1-47e2-8336-4e13c38f3b6d.flac';
const build = require('./build.json');
const io = require('socket.io')();
const speech = require('@google-cloud/speech');
const PORTNUMBER = 3001;


// const audio = require('./audio.js');
const projectId = 'roden-864e2';
const client = new speech.SpeechClient({
  projectId: projectId,
});

function logger(message)
{
  console.log(`[S4:${Date.now()}]: ${message}`);
}

const admin = require("firebase-admin");
var serviceAccount = require("./bin/roden-864e2-firebase-adminsdk-8sagx-0322824252.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://roden-864e2.firebaseio.com"
});
var db = admin.database();


function updateRecord(db, id, data)
{
  // Create firebase record
  var ref = db.ref(`videos/${id}`);
  ref.update(data);
}



io.on('connection', (client) => {
  logger(`client ${client.handshake.headers.host} connected`);

  // Recieve file data from client
  client.on('audio', (data) => {
    logger(`client ${client.handshake.headers.host} sent: ${JSON.stringify(data)}`);

    // notify manager
    processSpeech(data, db);

      //
      // var d = {"path":"expressions.mp4","id":"expressions"}
      // klyng.send({ to: P.Manager, data: d });

    // notify client
    client.emit('complete', 1);
  });
});

// Listen to port
const port = PORTNUMBER;
io.listen(port);

function processSpeech(id, db) {

  const fs = require('fs');
  const sleep = require('sleep');

  // Reads a local audio file and converts it to base64
  const filePath = `/${build.pathToTemp}${id}/${id}.flac`;


  var fileFound = false;

  while (!fileFound)
  {
    try {
      var stats = fs.statSync(filePath);
      fileFound = true;
    }
    catch(err) {
      fileFound = false;
    }
    sleep.sleep(1);
  }

  const file = fs.readFileSync(filePath);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'FLAC',
    sampleRateHertz: 44100,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      var text = {
        speech: transcription
      }
      updateRecord(db, id, text);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

// processSpeech("fae26987-e476-4120-a169-9b51b5ebe9d");
