
import * as firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyAvySMQHEbrfjTIsirs0U2XEublh-oOKko",
    authDomain: "maventsg.firebaseapp.com",
    databaseURL: "https://maventsg.firebaseio.com",
    projectId: "maventsg",
    storageBucket: "maventsg.appspot.com",
    messagingSenderId: "682641010963"
};

class Firebase {
    static initialize() {
      if (firebase.apps.length === 0)
        firebase.initializeApp(firebaseConfig);
    }

    static signup(email, password, callback) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
            callback(null);
        })
        .catch(function(error) {
            callback(error.message);
        });
    }

    static login(email, password, callback) {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            callback(null);
        })
        .catch(function(error) {
            callback(error.message);
        });
    }

    static getMessages(callback) {
      firebase.database().ref('/messages').on('child_added', (snapshot) => {callback(snapshot)});
    }

    static pushMessage(message, callback) {
      firebase.database().ref('/messages').push(message, callback);
    }

    static setLastMessage(maven, user, activity, text, callback) {
      firebase.database().ref('/lastMessages/' + maven + '-' + user + '-' + activity).set({text: text});
    }

    static getLastMessages(data, callback) {
        firebase.database().ref('lastMessages/').once('value', (snapshot) => {
            var temp = [];
            for (var i = 0; i < data.length; i++) {
                temp[i] = '';
            }
            snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                let index = data.indexOf(childKey);
                if (index !== -1) {
                    temp[index] = childData.text;
                }
            });
            callback(temp);
        }, (err) => {
            alert(err);
        })
    }
}

export default Firebase;