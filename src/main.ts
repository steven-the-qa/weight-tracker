import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'
import './index.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt0Dv4RLQAXuNRVOVrkce2du9qGxbRLz8",
  authDomain: "dead-simple-weight-tracker.firebaseapp.com",
  projectId: "dead-simple-weight-tracker",
  storageBucket: "dead-simple-weight-tracker.appspot.com",
  messagingSenderId: "492938673700",
  appId: "1:492938673700:web:6a015b5a503431d9d862b1",
  measurementId: "G-L477V2THTE"
};


initializeApp(firebaseConfig);
const app = createApp(App)
// getAnalytics(app);

app.use(createPinia())
app.use(router)
app.use(vue3GoogleLogin, {
    clientId: 'YOUR_GOOGLE_CLIENT_ID'
})

app.mount('#app')
