import React, { Component } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.2.5
import LoadingComponent from '../components/loadingComponent';

class Chat extends Component {
  state = {
    messages: [],
    requestLoading: true
  };

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    console.log("Props =      ", this.props);
    console.log("nextProps =      ", nextProps);
    if (nextProps.maven != undefined) {
      var m = nextProps.maven.maven;
      this.setState({maven: nextProps.maven, user: m.userID, description: m.description, price: m.price, requestLoading: false});

      if (this.props.date != undefined) {
        this.setState({
          messages: [
            {
              _id: 1,
              text: 'I would like to make you an offer of $' + this.props.price + ', for your advertised service on ' + this.props.date + '. \nAdditional information: ' + this.props.message,
              createdAt: new Date(),
              user: {
                _id: 1,
                name: m.userID.firstName + ' ' + m.userID.lastName,
                avatar: m.userID.displayPicture,
              },
            },
          ],
        });
      }
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      this.state.requestLoading ?
      <LoadingComponent/>
      :
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => {
          this.props.getMavenDetails(this.state.maven._id, this.props.profile.location, this.props.auth.token);
          Actions.skillPage({ title: this.props.title, isMe: false })
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
          user={{
            _id: 1,
            name: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName,
            avatar: this.props.profile.myInfo.displayPicture,
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