
import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCcexnaTt2VfTvrZeqlNvtX5RTb4zy_2Ss",
  authDomain: "maven-f51d7.firebaseapp.com",
  databaseURL: "https://maven-f51d7.firebaseio.com",
  projectId: "maven-f51d7",
  storageBucket: "maven-f51d7.appspot.com",
  messagingSenderId: "488636641011"
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

    static setLastMessage(maven, user, text, callback) {
      firebase.database().ref('/lastMessages/' + maven + '-' + user).set({text: text});
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
        })
    }
}

export default Firebase;