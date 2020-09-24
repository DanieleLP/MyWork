import firebase from "firebase";
import "firebase/auth";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAxnRT7PCOzxVGMCrCeRn-yAjiNc12UO0U",
    authDomain: "mywork-92c2b.firebaseapp.com",
    databaseURL: "https://mywork-92c2b.firebaseio.com",
    projectId: "mywork-92c2b",
    storageBucket: "mywork-92c2b.appspot.com",
    messagingSenderId: "409311604436",
    appId: "1:409311604436:web:8e9564fdd64c4546305541",
    measurementId: "G-GS7L4PYYSE"
});

const db = firebaseApp.firestore();

export {
    db
};

export default firebaseApp;