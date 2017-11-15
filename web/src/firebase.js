const firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyDvnbAxj7NWOyZua8V9b91lRgCy7wyVVjc',
  authDomain: 'rodenweb.firebaseapp.com',
  databaseURL: 'https://rodenweb.firebaseio.com',
  projectId: 'rodenweb',
  storageBucket: 'rodenweb.appspot.com',
  messagingSenderId: '895970700996',
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
