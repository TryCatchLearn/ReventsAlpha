import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC0xo8wJyCFFzAMp7CEDaTA9FiFgQXFRvY",
    authDomain: "reventsalpha.firebaseapp.com",
    databaseURL: "https://reventsalpha.firebaseio.com",
    projectId: "reventsalpha",
    storageBucket: "reventsalpha.appspot.com",
    messagingSenderId: "119755408370",
    appId: "1:119755408370:web:499a8bd405a73b39"
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;