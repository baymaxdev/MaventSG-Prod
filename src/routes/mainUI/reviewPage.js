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
      <View style={{flex: 1, alignItems: 'center', backgroundColor: '#EFEEF3'}}>
        <Text style={{marginVertical: 10, fontSize: 16}}>How was your experience?</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={this.state.rating}
          selectedStar={(rating) => this.setState({rating})}
          starSize={40}
          starColor="#FFA838"
          starStyle={{ paddingHorizontal: 2 }}
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
      </View>
    );
  }
}

const styles = {
  emptyImage: {
    marginTop: 120
  },
  emptyText: {
    width: '70%', fontSize: 18, marginTop: 30, color: '#7F7F7F', textAlign: 'center'
  },
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
