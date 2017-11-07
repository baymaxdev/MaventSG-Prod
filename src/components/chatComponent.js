import React, { Component } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.2.5
import LoadingComponent from '../components/loadingComponent';
import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCcexnaTt2VfTvrZeqlNvtX5RTb4zy_2Ss",
  authDomain: "maven-f51d7.firebaseapp.com",
  databaseURL: "https://maven-f51d7.firebaseio.com",
  projectId: "maven-f51d7",
  storageBucket: "maven-f51d7.appspot.com",
  messagingSenderId: "488636641011"
};

class Chat extends Component {
  state = {
    messages: [],
    requestLoading: true
  };

  componentWillMount() {
    if (firebase.apps.length === 0)
      firebase.initializeApp(firebaseConfig);

    if (this.props.date != undefined) {
      this.setState({
        messages: [
          {
            _id: 1,
            text: 'I would like to make you an offer of $' + this.props.price + ', for your advertised service on ' + this.props.date + '. \nAdditional information: ' + this.props.message,
            createdAt: new Date(),
            user: {
              _id: 1,
              name: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName,
              avatar: this.props.profile.myInfo.displayPicture,
            },
          },
        ],
      });
    }

    // firebase.database().ref('/messages').once('value', (snapshot) => {
    //   snapshot.forEach((childSnapshot) => {
    //     var temp = this.state.messages;
    //     temp.push(childSnapshot.val());
    //     this.setState({messages: temp});
    //     console.log('initial messages', temp);
    //   });
    // });
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.maven != undefined) {
      let m = nextProps.maven.maven;
      let user = m.userID;
      this.setState({maven: nextProps.maven, user: m.userID, description: m.description, price: m.price, requestLoading: false});

      firebase.database().ref('/messages').on('child_added', (snapshot) => {
        console.log('snapshot', snapshot);
        var m = {};
        let val = snapshot.val();
        m._id = snapshot.key;
        m.text = val.text;
        m.createdAt = new Date(val.createdAt);
        if ((val.sender === this.props.profile.myInfo.userId && val.receiver === user._id) || (val.sender === user._id && val.receiver === this.props.profile.myInfo.userId)) {
          if (val.sender === this.props.profile.myInfo.userId) {
            var u = {};
            u._id = val.sender;
            u.name = this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName;
            u.avatar = this.props.profile.myInfo.displayPicture;
            m.user = u;
          } else if (val.sender === user._id) {
            var u = {};
            u._id = val.sender;
            u.name = user.firstName + ' ' + user.lastName;
            u.avatar = user.displayPicture;
            m.user = u;
          }
          this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, m),
          }));
        }
        // var temp = this.state.messages;
        // temp.push(m);
        // this.setState({messages: temp});
        // console.log('messages', temp);
      });
    }
  }

  onSend(messages = []) {
    var m = {};
    // m.sender = this.props.profile.myInfo.userID;
    m.sender = this.props.profile.myInfo.userId;
    m.receiver = this.state.user._id;
    m.text = messages[0].text;
    m.createdAt = messages[0].createdAt.toISOString();
    
    //m.createdAt = messages[0].createdAt.toISOString();
    firebase.database().ref('/messages').push(m);
    // this.setState((previousState) => ({
    //   messages: GiftedChat.append(previousState.messages, m),
    // }));
  }

  render() {
    return (
      this.state.requestLoading ?
      <LoadingComponent/>
      :
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => {
          this.props.getMavenDetails(this.state.maven._id, this.props.profile.location, this.props.auth.token);
          Actions.skillPage({ title: this.props.title, isMe: false });
        }}>
          <View style={{flexDirection: 'row', height: 70, alignItems: 'center'}}>
            <Image source={{uri: this.state.user.displayPicture}} style={{width: 50, height: 50, marginHorizontal: 10, borderRadius: 18, borderWidth: 2, borderColor: 'white'}}/>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{flex: 1, fontSize: 20, marginTop: 10}}>{this.props.title}</Text>
              <Text style={{flex: 1, fontSize: 16}}>{this.props.title}</Text>
            </View>
            <Icon name="ios-arrow-forward" style={{ fontSize: 25, color: '#90939B', marginHorizontal: 10}} />
          </View>
        </TouchableOpacity>
        <View style={{height: 50, flexDirection: 'row'}}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#90939B'}}>
            <Text style={{color: 'white'}}>Cancel Offer</Text>
          </TouchableOpacity>
          <View style={{width: 1, height: 40, backgroundColor: 'white'}}></View>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#90939B'}}>
            <Text style={{color: 'white'}}>Edit Offer</Text>
        </TouchableOpacity>
        </View>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          showUserAvatar
          user={{
            // _id: this.props.profile.myInfo.userID,
            _id: this.props.profile.myInfo.userId
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  maven: state.explore.maven
});

const mapDispatchToProps = (dispatch) =>({
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);