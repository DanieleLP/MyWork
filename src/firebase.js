/* 
  file di configurazione per firebase
*/

import firebase from "firebase";
import "firebase/auth";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD4BUWOEKTSJsJy9gkI274DEpFoxEvwXGE",
    authDomain: "mywork-final.firebaseapp.com",
    databaseURL: "https://mywork-final.firebaseio.com",
    projectId: "mywork-final",
    storageBucket: "mywork-final.appspot.com",
    messagingSenderId: "589847703373",
    appId: "1:589847703373:web:a1a1219b7ac1d97f101104"
});

const db = firebaseApp.firestore();
const Timestamp = firebase.firestore.FieldValue.serverTimestamp();

export {
    db,
    Timestamp,
};

export default firebaseApp;