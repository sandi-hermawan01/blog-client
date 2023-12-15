/* eslint-disable no-unused-vars */
import { initializeApp } from "firebase/app";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyayoexpKIGYyItBwGf6XY5Lc9FFnsYcc",
  authDomain: "blog-publisher-v2.firebaseapp.com",
  projectId: "blog-publisher-v2",
  storageBucket: "blog-publisher-v2.appspot.com",
  messagingSenderId: "361690733425",
  appId: "1:361690733425:web:4ce9cb5efe3ce2dfbc74d0",
};

const app = initializeApp(firebaseConfig);

// Google Auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((error) => {
      console.log(error);
    });

  return user;
};
