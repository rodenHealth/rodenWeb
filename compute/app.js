const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg');
const klyng = require('klyng');
const io = require('socket.io')();
const sleep = require('sleep');
const request = require('request');


function frameObject() {
  this.path = "";
  this.attempts = 0;
  this.id = 0;
  this.videoID = "";
}

frameObject.prototype.set = function(path, attempts, id, videoID) {
  this.path = path;
  this.attempts = attempts;
  this.id = id;
  this.videoID = videoID;
};

frameObject.prototype.getPath = function() {
  return this.path;
};

frameObject.prototype.getAttempts = function() {
  return this.attempts
}

frameObject.prototype.getId = function() {
  return this.id
}

// Frame - subclass
function Frame() {
  frameObject.call(this);
}

// subclass extends superclass
Frame.prototype = Object.create(frameObject.prototype);
Frame.prototype.constructor = Frame;

const P = {
  Manager: 0,
  Communicator: 1,
  Firebase: 2,
  Video: 3,
}

const Status = {
  Return: 0,
  Request: 1,
}

// Global constants
const PORTNUMBER = 3000;
const uploadsPath = './tmp/';

// Entry point
function main() {
  // Setup
  const size = klyng.size();
  const rank = klyng.rank();

  // Manager
  if (rank == 0) {
    managerProcess();
  }
  // Communicator
  else if (rank == 1) {
    listenerProcess();
  }
  // Firebase
  else if (rank == 2) {
    firebaseProcess();
  }
  // Video
  else if (rank == 3) {
    videoProcess();
  }
  // Worker
  else {
    workerProcess(rank)

    // TODO: Work

    klyng.end();
  }
}

// Video
function videoProcess()
{
  while (1)
  {
    // Receive video from manager
    var data = klyng.recv({ from: P.Manager });

    sleep.sleep(3);
    extractAudio(data.path, data.id);
    extractFrames(data.path, data.id);
  }
}

function workerProcess(rank)
{
  var allDataProcessed = true;
  var data = null;
  const subKey = getSubscriptionKey(rank);

  // Intitial call
  while (1)
  {
    // Get data
    data = receiveData(rank);

    // TODO: Process data
    for (var i = 0; i < data.frames.length; i++)
    {
      sendFile(i, data, subKey, rank);
    }
  }
}

// Manager
function managerProcess()
{
  const size = klyng.size();
  let frameQueue = [];
  var anotherIteration = false;
  var id;
  var totalFrames = 0;
  var totalFailed = 0;

  while (1)
  {
      // Blocks on receive from communicator
      const data = klyng.recv({ from: P.Communicator });
      logger(0, `received data: ${JSON.stringify(data)}`);

      // Let everyone know
      id = data.id;

      // Tell firebase to create the record
      klyng.send({ to: P.Firebase, data: {id: data.id, status: 0 }});

      // Tell video to process the video (frames / audio)
      klyng.send({ to: P.Video, data});

      // Get total frames
      totalFrames = klyng.recv({ from: P.Video})
      logger(P.Manager, totalFrames);

      frameQueue = buildFrames(data.id, totalFrames);
      const framePerProcess = totalFrames / (size - 4);

      var completeWorkers = 0;
      // While the queue is still getting processed
      while (completeWorkers != (size - 4))
      {
        // Request from client
        var request = klyng.recv({});

        switch (request.status)
        {
          case Status.Return:
            while (request.records.length != 0)
            {
              var tmpFrame = request.records.shift();
              tmpFrame.attempts++;

              if (tmpFrame.attempts < 5) {
                frameQueue.push(tmpFrame);
              }
              else {
                totalFailed++;
              }

            }
            break;
          case Status.Request:
            // Send values

            var frames = popN(frameQueue, framePerProcess);


            if (frames.length > 0)
            {
              klyng.send({to: request.id, data: {id: id, frames: frames}});
            }
            else
            {
              completeWorkers++;
            }
            break;
          default:
            break;
        }
      }
      totalFrames = totalFrames - 2; // I don't know why it counts 2 extra
      logger(P.Manager, `Process of video ${id} complete.`);
      logger(P.Manager, `${totalFrames - totalFailed}/${totalFrames} frames processed`);
  }
}

// Listens to client
function listenerProcess() {



  io.on('connection', (client) => {
    logger(1, `client ${client.handshake.headers.host} connected`);

    // Recieve file data from client
    client.on('data', (data) => {
      logger(1, `client ${client.handshake.headers.host} sent: ${JSON.stringify(data)}`);

      // notify manager
      klyng.send({ to: P.Manager, data });


        // var d = {"path":"expressions.mp4","id":"expressions"}
        // klyng.send({ to: P.Manager, data: d });

      // notify client
      client.emit('complete', 1);
    });
  });

  // Listen to port
  const port = PORTNUMBER;
  io.listen(port);

  logger(1, `listening on port: ${PORTNUMBER}`);
}

// Send to firebase
function firebaseProcess()
{
  // Build firebase
  const admin = require("firebase-admin");
  var serviceAccount = require("./bin/rodenweb-firebase-adminsdk-r1dak-04935483b0.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rodenweb.firebaseio.com"
  });
  var db = admin.database();

  // Receive and create records
  while (1)
  {
    const data = klyng.recv({});

    switch (data.status) {
      case 0: // Create record
        createRecord(db, data.id);
        break;
      case 1: // Update record
        updateRecord(db, data.id, data.data);
        break;
    }

  }
}


// Get audio file
function extractAudio(path, id) {
  try {

    // Download path
    logger(1, `path: /Users/tylerburnam/Downloads/${path}`);

    const process = new ffmpeg(`/Users/tylerburnam/Downloads/${path}`);

    // Process video
    process.then((video) => {

        // Extract audio
        video.fnExtractSoundToMP3(`${getUploadsPath(id)}/${id}.flac`,
          (error, file) => {
            if (!error) {
              logger(1, `audio file: ${file}`);
              // speechToText(videoID);
            } else {
              logger(1, error);
            }
          });
      },
      (err) => {
        logger(1, `Error: ${uploadsPath}audio_${id}.flac`);
        logger(1, `Error: ${err}`);
      });
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
  }
}

// Split video
function extractFrames(path, id) {
  var totalFrames = 0;

  try {
    logger(1, `path: /Users/tylerburnam/Downloads/${path}`);

    // FFMPEG Process
    const process = new ffmpeg(`/Users/tylerburnam/Downloads/${path}`);

    // Once the process is started
    process.then((video) => {

      // Extract JPGs from video
      video.fnExtractFrameToJPG(getUploadsPath(id), {
        frame_rate: 1,
        file_name: `${id}%d.jpg`,
      }, (error, files) => {
        if (!error) {
          fs.writeFile(`${getUploadsPath(id)}/emotion.txt`, '', () => {
            console.log('done');
          });

          totalFrames = files.length;

          // Notify manager that frames are split
          klyng.send({ to: P.Manager, data: totalFrames });
        }
      });
    }, (err) => {
      console.log(`Error: ${err}`);
    });
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
  }
}

function getUploadsPath(id)
{
  return `${uploadsPath}${id}/`
}

// Utility method to keep track of logging
function logger(id, message)
{
  console.log(`[P${id}:${Date.now()}]: ${message}`);
}

function createRecord(db, id)
{
  // Create firebase record
  const currentTime = Date.now();
  var ref = db.ref(`videos/${id}`);
  ref.set({ timestamp: `${currentTime}`});
}

function updateRecord(db, id, data)
{
  // Create firebase record
  var ref = db.ref(`videos/${id}`);
  ref.update(data);
}

function buildFrames(id, total)
{
  var frames = []

  var framePathBase = `${uploadsPath}${id}/${id}_`;
  for (var i = 1; i < total - 1; i++)
  {
    var frame = new Frame();
    var path = `${framePathBase}${i}.jpg`;
    frame.set(path, 0, i, id);
    frames.push(frame);
  }
  return frames;
}

function popN(frameQueue, n)
{
  var result = []
  for (var i = 0; i <= n; i++)
  {
    if (frameQueue.length > 0)
    {
      result.push(frameQueue.shift());
    }
  }

  return result;
}

function receiveData(rank)
{
  klyng.send({to: P.Manager, data: {id: rank, status: 1}});
  data = klyng.recv({from: P.Manager});
  return data;
}

function sendBackData(rank, data)
{
  klyng.send({to: P.Manager, data: {id: rank, status: 0, records: data}});
}


function getSubscriptionKey(rank)
{

  const subKeys = [
      "566d7088f7bc40e2b9afdfc521f957e1",
      "ee39b7d84ada4c26859bbb51b391386f",
      "c2efe8fdff2244e6afeee461e28a6aa2",
      "d1b30e5430a048b1bc3e84c984a2e51e",
      "3a40a65192204751b51095bdfa18accc",
      "ae99acc5ec754d359c58234614aed1d4",
      "01e7e1fab05d4ca8adef35d61f0fd044",
      "39824523dc9545758d1d74013d5916fa",
      "a4b2f96e978b4416a50ac39ac54a6f18",
      "53b3740d68974de98ea2aec7d6829460",
      "6c60e73cd18448868257b9f45bd3bbe9",
      "28dbad4b47464eb5b6249bb7db649ca1",
      "778c330e45ac46919d436bf0202bbfbf",
      "3a328c58863f4d12884b2ca14df2e85c",
      "a7eee687ba384d45b3cc38ae7500a431",
      "87306db53de94f6fa31e50790cefd1ff",
      "79efab9d06ab4f01ac0794ff3cbd2b02",
      "3a6da3cc48074681bd7070d92f53b1a6",
      "cb87b7c38e9747f394b2acee6b3b8e21",
      "16488476e7ca4c51b93d64979b2603ef",
    ];

  return subKeys[rank - 4];
}

function getFrameName(frameNumber) {
	const frame = [];
	const iterations = Math.ceil(frameNumber / 25);
	frameNumber %= 26;
	for (let i = 0; i < iterations - 1; i++) {
		frame.push('Z');
	}
	frame.push(String.fromCharCode(65 + frameNumber));
	const resultNumber = frame.join('');
	const tag = `frame${resultNumber}`;

  return tag;
}

function sendFile(frameId, data, subKey, rank) {
  // Replace with any file name in /routes
  let resultData = '';
  let pathName = data.frames[frameId].path
  let frameNum = data.frames[frameId].id;
  let videoID = data.id;

  fs.readFile(path.join(pathName), (err, data) => {

    // Prepare request options
    const options = {
      url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': subKey,
      },
    };

    // Send request
    request(options, (error, response, body) => {
      if (error) {
        console.log('API call failed.');
        return;
      }
      if (response.statusCode != 200) {
        console.log(`API call returned status code ${response.statusCode}: ${body}`);
        sendBackData(rank, data.frames[frameId]);
        return;
      }

      const arr = JSON.parse(body);

      // TODO: This isn't always right
      if (arr[0] === undefined || arr[0].faceRectangle === undefined || arr[0].scores === undefined) {
        console.log(`API call returned unexpected value: ${body}`);
      }
      else {
        const tag = getFrameName(frameNum);
        const faceRect = arr[0].faceRectangle;
        const emotion = arr[0].scores;

        // Build object
        const newObject = {};
        newObject[tag] = {
          emotion,
          faceRect
        }

        // console.log(newObject);

        // TODO: Send this to firebase
        klyng.send({ to: P.Firebase, data: {id: videoID, status: 1, data: newObject} });
        fs.appendFile(`${getUploadsPath(videoID)}emotion.txt`, `${JSON.stringify(newObject)}\n`, (err) => {});
      }
    });
  });
}

// Start
klyng.init(main);
