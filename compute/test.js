// const io = require('socket.io')();
//
// io.on('connection', (client) => {
//
//   // Recieve path
//   client.on('data', (data) => {
//     console.log('data: ', data);
//     // TODO: Pass this path to another process
//   });
//
//   client.emit('complete', new Date());
// });
//
// const port = 3000;
// io.listen(port);
// console.log('listening on port ', port);

const id = 123;
const admin = require("firebase-admin");
var serviceAccount = require("./bin/rodenweb-firebase-adminsdk-r1dak-04935483b0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rodenweb.firebaseio.com"
});
const db = admin.database();

// Create firebase record
const currentTime = Date.now();
var ref = db.ref(`videos/${id}`);
ref.set({ timestamp: `${currentTime}`});
