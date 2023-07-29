//config/firebase.ts
import firebase from '@react-native-firebase/app';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

let firebaseInstance: firebase.app.App | undefined;

export const initializeFirebase = () => {
  console.log('Apps before init:', firebase.apps); // Debug line
  const firebaseConfig = {
    apiKey: "AIzaSyB5PAcGIcaOrYMD7j44EkAHcVxzs6WZSd0",
    authDomain: "vitalinker-01.firebaseapp.com",
    databaseURL: "https://vitalinker-01.firebaseio.com",
    projectId: "vitalinker-01",
    storageBucket: "vitalinker-01.appspot.com",
    messagingSenderId: "1042213474660",
    appId: "1:1042213474660:web:a07ccce474b912608bea71",
    measurementId: "G-WKZ9E9GMRW"
  };
  console.log('Apps after init:', firebase.apps); 
  console.log('Firebase initialization started');
  if (!firebase.apps.length) {
    console.log('Firebase not yet initialized. Initializing now...');
    firebaseInstance = firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    firebaseInstance = firebase.app(); // Get the existing app instance
    console.log('Firebase already initialized.');
  }
};

export const getFirebaseInstance = (): firebase.app.App => {
  console.log('Getting app instance, apps:', firebase.apps); // Debug line
  if (!firebaseInstance) {
    throw new Error('Firebase is not initialized. Please call initializeFirebase() first.');
  }
  return firebaseInstance;
};

export const fetchCollectionData = async (collectionName: string) => {
  const firebase = getFirebaseInstance();
  const collectionRef = firebase.firestore().collection(collectionName);
  const snapshot = await collectionRef.get();

  const data: { id: string; }[] = [];
  snapshot.forEach((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  return data;
};

export const addDocumentToCollection = async (collectionName: string, document: object) => {
  const firebase = getFirebaseInstance();
  const collectionRef = firebase.firestore().collection(collectionName);
  const newDocumentRef = await collectionRef.add(document);
  const newDocumentSnapshot = await newDocumentRef.get();

  return { id: newDocumentSnapshot.id, ...newDocumentSnapshot.data() };
};