const firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyCkTdVvkHkp6drWj-r0tIOzRq2JKT27bOs',
  authDomain: 'roden-864e2.firebaseapp.com',
  databaseURL: 'https://roden-864e2.firebaseio.com',
  projectId: 'roden-864e2',
  storageBucket: 'roden-864e2.appspot.com',
  messagingSenderId: '250808707384',
};
firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();


export function handleDataForRecord(id, callback) {
  // Attach an asynchronous callback to read the data at our posts reference
  const ref = database.ref(`videos/${id}`);
  ref.on('value', (snapshot) => {
    callback(snapshot.key, snapshot);
  }, (errorObject) => {
    console.log(`The read failed: ${errorObject.code}`);
  });
}
