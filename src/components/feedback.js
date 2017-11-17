import React, { Component } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput } from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';

const feelingText = ['Needs Help :(', 'Needs Improvement :(', 'OK!', 'Good Effort!', 'Excellent! :D']
const improveText = ['Music or Sounds', 'Story', 'Length', 'Voice', 'Pace', 'Other'];
const improveTextColor = ['#EB6256', '#6B67C1', '#5AB09D', '#4090C7', '#77B743', '#A87A27'];

class Feedback extends Component {

  constructor() {
    super();
    this.state = {
      rating: 0,
      message: '',
      modalVisible: false,
    };
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
        <Text style={{marginVertical: 30, fontSize: 20, color: '#0B486B'}}>Rate us!</Text>
        <Text style={{marginBottom: 15, fontSize: 18, color: 'black'}}>{feelingText[this.state.rating - 1]}</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={this.state.rating}
          selectedStar={(rating) => this.setState({rating})}
          starSize={40}
          starColor="#FFA838"
          starStyle={{ paddingHorizontal: 10 }}
        />
        <Text style={{marginTop: 30, fontSize: 20, color: '#0B486B'}}>What could be improved?</Text>
        <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center', width: '90%', flexDirection: 'row', flexWrap: 'wrap' }} >
          {
            improveText.map((value, index) => {
              return <TouchableOpacity key={index} style={[styles.improveText, {borderColor: improveTextColor[index]}]} onPress={() => {
                var temp = this.state.message;
                temp += value + ' ';
                this.setState({message: temp});
              }}>
                <Text style={{fontSize: 18, color: improveTextColor[index]}}>{value}</Text>
              </TouchableOpacity>
            })
          }
        </View>
        <View style={{ flex: 1, width: '100%', backgroundColor: 'white', alignItems: 'center', padding: 8 }}>
          <TextInput
            placeholderTextColor="rgba(0,0,0,0.3)"
            placeholder="Add a message."
            keyboardType="default"
            autoCorrect
            autoCapitalize="sentences"
            multiline
            returnKeyType='next'
            value={this.state.message}
            onChangeText={(message) => this.setState({message})}
            maxLength={140}
            autoCorrect={false}
            style={{ flex: 1, alignItems: 'center', width: '100%', padding: 8, justifyContent: 'center', fontSize: 16, }}
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={() => {
          this.props.feedback(this.state.rating, this.state.message, this.props.auth.token, () => {
            this.setState({modalVisible: true});
            setTimeout(() => {
              this.setState({modalVisible: false});
            }, 1000);
          });
        }}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.modalVisible}
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
  improveText: {justifyContent: 'center', alignItems: 'center', marginTop:10, marginHorizontal:5, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5, borderWidth: 1},
  btnText: {fontWeight: 'bold', fontSize: 20, color: '#fff'},
  submitBtn: {
    padding:10, marginBottom: 30, marginTop: 10, flexDirection:'row', alignItems:'center',
    justifyContent:'center', borderRadius:10, backgroundColor:'#0B486B',
    height: 50, width: '70%',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1
    }
  },
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
});

const mapDispatchToProps = (dispatch) =>({
  feedback: (rating, message, token, next) => dispatch(actions.feedback(rating, message, token, next)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);