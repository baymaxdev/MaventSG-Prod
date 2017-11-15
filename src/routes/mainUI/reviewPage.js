import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Animated, RefreshControl, Keyboard, Button } from 'react-native';
import {ImagePicker} from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import {Actions} from 'react-native-router-flux';
import {Container, Content, Icon, Form} from 'native-base';
import StarRating from 'react-native-star-rating';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const sampleText = ['Great buyer to deal with!', 'Punctual!', 'Pleasant transaction!'];

class ReviewPage extends Component {
  constructor() {
    super();
    this.state = {
      rating: 0,
      message: '',
    };
  }
  // This is to remove fb token for retry purposes
  componentDidMount() {
    Actions.refresh({onRight: this.onSubmit});
  }

  onSubmit() {
    this.props.reviewActivity(this.props.actId, this.props.type, this.state.rating, this.state.message, this.props.auth.token, () => {
      Actions.pop();
    });
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
              return <TouchableOpacity style={styles.sampleText} onPress={() => {
                var temp = this.state.message;
                temp += value + ' ';
                this.setState({message: temp});
              }}>
                <Text style={{fontSize: 18, color: '#9799A0'}}>{value}</Text>
              </TouchableOpacity>
            })
          }
        </View>
      </View>
    );
  }
}

const styles = {
  sampleText: {justifyContent: 'center', alignItems: 'center', marginTop:10, marginHorizontal:5, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: '#9799A0'},
};

const mapStateToProps = (state) =>({
  auth: state.auth,
  activity: state.activity,
});
const mapDispatchToProps = (dispatch) =>({
  reviewActivity: (actId, type, rating, description, token, next) => dispatch(actions.reviewActivity(actId, type, rating, description, token, next)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewPage);
