import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback, TextInput, Animated, RefreshControl, Keyboard, Button } from 'react-native';
import {ImagePicker} from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import {Actions} from 'react-native-router-flux';
import {Container, Content, Icon, Form} from 'native-base';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import Firebase from '../../helper/firebasehelper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const sampleText = ['Great buyer to deal with!', 'Punctual!', 'Pleasant transaction!'];

class ReviewPage extends Component {
  constructor() {
    super();
    this.state = {
      rating: 0,
      message: '',
      successModalVisible: false,
    };
  }
  // This is to remove fb token for retry purposes
  componentDidMount() {
    Actions.refresh({onRight: this.onSubmit.bind(this)});
    Firebase.initialize();
  }

  onSubmit() {
    var m = {};
    m.sender = this.props.profile.myInfo.userId;
    m.receiver = this.props.userId;
    m.maven = this.props.mavenId;
    m.activity = this.props.actId;
    m.text = this.props.type===1?'Maven left a review!':'Customer left a review!';
    m.createdAt = new Date().toISOString();
    Firebase.pushMessage(m, this.props.type);
    this.props.reviewActivity(this.props.actId, this.props.type, this.state.rating, this.state.message, this.props.auth.token, () => {});
    this.props.sendPushNotification([this.props.userId], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' left review.', {type: 'chat', maven: this.props.mavenId, user: this.props.user}, this.props.auth.token);
    Actions.pop();
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={{marginVertical: 10, fontSize: 16}}>How was your experience?</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={this.state.rating}
          selectedStar={(rating) => this.setState({rating})}
          starSize={40}
          starColor="#FFA838"
          starStyle={{ paddingHorizontal: 5 }}
        />
        <View style={{ marginTop: 10, width: '100%', backgroundColor: 'white', alignItems: 'center', padding: 8 }}>
          <TextInput
            placeholderTextColor="rgba(0,0,0,0.3)"
            placeholder="Tell me more about the experience."
            keyboardType="default"
            autoCorrect
            autoCapitalize="sentences"
            multiline
            returnKeyType='next'
            value={this.state.message}
            onChangeText={(message) => this.setState({message})}
            maxLength={140}
            autoCorrect={false}
            style={{ height: 200, width: '100%', alignItems: 'center', padding: 8, justifyContent: 'center', fontSize: 16, }}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', width: '90%', flexDirection: 'row', flexWrap: 'wrap' }} >
          {
            sampleText.map((value, index) => {
              return <TouchableOpacity key={index} style={styles.sampleText} onPress={() => {
                var temp = this.state.message;
                temp += value + ' ';
                this.setState({message: temp});
              }}>
                <Text style={{fontSize: 18, color: '#9799A0'}}>{value}</Text>
              </TouchableOpacity>
            })
          }
        </View>
        <Modal
          isVisible={this.state.successModalVisible}
          animationIn={'slideInLeft'}
          animationOut={'slideOutRight'}
          animationInTiming={500}
          animationOutTiming={500}
          >
          <View style={styles.modalContent}>
            <Icon name='md-checkmark-circle' style={{fontSize:40, paddingHorizontal: 8, color: 'green' }}/>
            <Text>Success!</Text>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = {
  sampleText: {justifyContent: 'center', alignItems: 'center', marginTop:10, marginHorizontal:5, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: '#9799A0'},
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
};

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  activity: state.activity,
});
const mapDispatchToProps = (dispatch) =>({
  reviewActivity: (actId, type, rating, description, token, next) => dispatch(actions.reviewActivity(actId, type, rating, description, token, next)),
  sendPushNotification: (ids, message, data, token) => dispatch(actions.sendPushNotification(ids, message, data, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewPage);
