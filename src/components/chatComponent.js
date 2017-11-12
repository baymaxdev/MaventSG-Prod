import React, { Component } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.2.5
import LoadingComponent from '../components/loadingComponent';
import Firebase from '../helper/firebasehelper';

class Chat extends Component {
  state = {
    messages: [],
    requestLoading: true
  };

  componentWillMount() {
    Firebase.initialize();
  }

  componentDidMount() {
    if (this.props.bookingMessage) {
      Firebase.pushMessage(this.props.bookingMessage);
      Firebase.setLastMessage(this.props.bookingMessage.maven, this.props.bookingMessage.sender, this.props.bookingMessage.text);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.maven != undefined && nextProps.activity.initChat !== true) {
      let maven = nextProps.maven.maven;
      var user = maven.userID;
      if (this.props.userID !== undefined) {
        user = this.props.userID;
      }

      this.setState({maven: maven, user: user, requestLoading: false});

      Firebase.getMessages((snapshot) => {
        var m = {};
        let val = snapshot.val();
        if (val.maven === maven._id && 
          ((val.sender === this.props.profile.myInfo.userId && val.receiver === user._id) || (val.sender === user._id && val.receiver === this.props.profile.myInfo.userId))) {
          m._id = snapshot.key;
          m.text = val.text;
          m.createdAt = new Date(val.createdAt);
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
      });
    }
  }

  onSend(messages = []) {
    var m = {};
    m.sender = this.props.profile.myInfo.userId;
    m.receiver = this.state.user._id;
    m.maven = this.state.maven._id;
    m.text = messages[0].text;
    m.createdAt = messages[0].createdAt.toISOString();
    Firebase.pushMessage(m);
    if (this.props.userID !== undefined) {
      Firebase.setLastMessage(m.maven, m.receiver, m.text);
    } else {
      Firebase.setLastMessage(m.maven, m.sender, m.text);
    }
    if (this.state.messages.length === 0) {
      this.props.initChat(this.state.maven._id, this.props.auth.token);
    }
  }

  render() {
    return (
      this.state.requestLoading ?
      <LoadingComponent/>
      :
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => {
          this.props.getMavenDetails(this.state.maven._id, this.props.profile.location, this.props.auth.token);
          var isMe = this.props.userID !== undefined?true:false;
          Actions.skillPage({ title: this.state.maven.userID.firstName + ' ' + this.state.maven.userID.lastName, isMe: isMe, from: 'chats' });
        }}>
          <View style={{flexDirection: 'row', height: 70, alignItems: 'center'}}>
            <Image source={{uri: this.state.maven.userID.displayPicture}} style={{width: 50, height: 50, marginHorizontal: 10, borderRadius: 18, borderWidth: 2, borderColor: 'white'}}/>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{flex: 1, fontSize: 20, marginTop: 10}}>{this.state.maven.userID.firstName + ' ' + this.state.maven.userID.lastName}</Text>
              <Text style={{flex: 1, fontSize: 16}}>{this.state.maven.title}</Text>
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
  maven: state.explore.maven,
  activity: state.activity,
});

const mapDispatchToProps = (dispatch) =>({
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  initChat: (mavenId, token) => dispatch(actions.initChat(mavenId, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);