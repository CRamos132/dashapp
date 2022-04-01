import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBe9rq5pD6XLW1WAFSaz_cL4VyOaDkzOE4",
    authDomain: "dash-app-87d27.firebaseapp.com",
    databaseURL: "https://dash-app-87d27.firebaseio.com",
    projectId: "dash-app-87d27",
    storageBucket: "dash-app-87d27.appspot.com",
    messagingSenderId: "240448851525",
    appId: "1:240448851525:web:ceddcabb3a0f7fec709d2c",
    measurementId: "G-JL2HZWCXFT"
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export const auth = getAuth();

export const firestore = getFirestore();
export const storage = firebase.storage()