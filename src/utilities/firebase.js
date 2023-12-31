import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7Ww6tN1P-d1MEnuJUetYtQ3pmPwz91Cc",
  authDomain: "pantree-baf7d.firebaseapp.com",
  databaseURL: "https://pantree-baf7d-default-rtdb.firebaseio.com",
  projectId: "pantree-baf7d",
  storageBucket: "pantree-baf7d.appspot.com",
  messagingSenderId: "530085380611",
  appId: "1:530085380611:web:417b99b5e0f77741668436"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);



export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
  };

  export const setData = (path, value) => (
    set(ref(database, path), value)
  );

  export const deleteFromFirebase = async (foodie, user) => {
    if (foodie) {
      try {
        await setData(`users/${user.uid}/foods/${foodie.id}/`, null);
      } catch (error) {
        alert(error);
      }
    }
  };

  export const pushToFirebase = async (foodie, user) => {
    if (foodie) {
      try {
        await setData(`users/${user.uid}/foods/${foodie.id}/`, foodie);
      } catch (error) {
        alert(error);
      }
    }
  };
  

  export const useUserState = () => {
    const [user, setUser] = useState();
  
    useEffect(() => {
      onIdTokenChanged(getAuth(firebase), setUser);
    }, []);
    if(user){
      console.log(user.email)
    }    
    return user;
  };
  
  export const signInWithG = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
  };

  export const signOutOfG = () => signOut(getAuth(firebase));

