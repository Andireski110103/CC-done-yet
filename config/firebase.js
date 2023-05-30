const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require('firebase/database');

// Add Firebase SDK Snippet
const firebaseConfig = {
  apiKey: "AIzaSyDJgl3xKB4TsYEm2MiFuWSpsrSCXO5D0oY",
  authDomain: "andireski-110103.firebaseapp.com",
  projectId: "andireski-110103",
  databaseURL : "https://andireski-110103-default-rtdb.firebaseio.com",
  storageBucket: "andireski-110103.appspot.com",
  messagingSenderId: "370541913030",
  appId: "1:370541913030:web:14c48531b76feb28e588c7",
  measurementId: "G-GZSJH2K8WS"
};

firebase.initializeApp(firebaseConfig);

module.exports = firebase;
