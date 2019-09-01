import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAggASGnLzxfqGbZQIGSwBbn6wkBAhVmOQ",
    authDomain: "dypemobiledb.firebaseapp.com",
    databaseURL: "https://dypemobiledb.firebaseio.com",
    projectId: "dypemobiledb",
    storageBucket: "dypemobiledb.appspot.com",
    messagingSenderId: "107827052463",
    appId: "1:107827052463:web:2bf1e1bc5318d651"
};

firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();