import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Dimensions,
  Text, TextInput,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { Actions } from 'react-native-router-flux';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker'

const categoryName = {
  'cooking_service' : 'Cooking & Baking',
  'information_service' : 'Information Technology',
  'improvement' : 'Home Improvement',
  'cleaning' : 'Cleaning',
  'beauty' : 'Beauty',
  'photography' : 'Photography',
  'art_service' : 'Art & Design',
  'care' : 'Home Care',
  'pet' : 'Pet related',
  'others_service' : 'Others',
  'school' : 'School Subjects',
  'art_skill' : 'Art & Design',
  'information_skill' : 'Information Technology',
  'sports' : 'Sports & Fitness',
  'music' : 'Music',
  'cooking_skill' : 'Cooking & Baking',
  'others_skill' : 'Others'
};
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class ActivityItem extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      editOfferModalVisible: false,
      serviceDate: '',
      price: '',
    };
  }

  showModal() {
    this.setState({modalVisible: true});
  }

  showEditOfferModal() {
    this.setState({editOfferModalVisible: true, price: this.props.provider.price.toString(), serviceDate: this.props.provider.serviceDate});
  }

  navigateToReview(type) {
    Actions.push('reviewPage', {actId: this.props.provider._id, type: type});
  }

  onPressBtn1() {
    this.setState({modalVisible: false});

    let provider = this.props.provider;
    let isMaven = this.props.profile.myInfo.userId === provider.mavenUserID._id?true:false;

    switch (provider.status) {
      case 1:          // Offered
        this.props.cancelOffer(provider._id, 0, this.props.auth.token);
        break;
      case 2:         // Accepted
        this.props.endJob(provider._id, this.props.auth.token);
        break;
      case 3:         // Rejected
        this.props.archiveActivity(provider._id, this.props.auth.token);
        break;
      case 4:         // Cancelled
        this.props.archiveActivity(provider._id, this.props.auth.token);
        break;
      case 5:         // Completed
        if (isMaven) {
          this.navigateToReview(1);
        } else {
          this.navigateToReview(0);
        }
        break;
      case 6:         // CReviewed
        if (isMaven) {
          this.navigateToReview(1);
        }
        break;
      case 7:         // MReviewed
        if (!isMaven) {
          this.navigateToReview(0);
        }
        break;
      case 8:         // Both Reviewed
        this.props.archiveActivity(provider._id, this.props.auth.token);
        break;
      default:
        break;
    }
  }

  onPressBtn2() {
    this.setState({modalVisible: false});
    
    let provider = this.props.provider;
    let isMaven = this.props.profile.myInfo.userId === provider.mavenUserID._id?true:false;

    switch (provider.status) {
      case 1:          // Offered
        setTimeout(() => {
          this.showEditOfferModal();
        }, 500);
        break;
      case 2:         // Accepted
        if (isMaven) {
          this.props.cancelOffer(provider._id, 1, this.props.auth.token);
        } else {
          this.props.cancelOffer(provider._id, 0, this.props.auth.token);
        }  
        break;
      case 3:         // Rejected
        setTimeout(() => {
          this.showEditOfferModal();
        }, 500);
        break;    
      default:
        break;
    }
  }

  render() {
    let provider = this.props.provider;
    let isMaven = this.props.profile.myInfo.userId === provider.mavenUserID._id?true:false;
    let name = isMaven?provider.userID.firstName + ' ' + provider.userID.lastName:provider.mavenUserID.firstName + ' ' + provider.mavenUserID.lastName;
    var modalText = btnText1 = btnText2 = boxText = boxColor = '', boxDisabled = false;
    let rating = isMaven?provider.userID.consumerRating:provider.mavenID.rating;

    switch (provider.status) {
      case 1:         // Offered
        if (!isMaven) {
          modalText = 'What do you want to do?';
          btnText1 = 'Cancel Offer';
          btnText2 = 'Edit Offer';
          boxText = 'Offered';
          boxColor = '#FDF251';
        }
        break;
      case 2:         // Accepted
        modalText = '"Job completed?" or "Cancel job?"';
        btnText1 = 'Completed';
        btnText2 = 'Cancel job';
        boxText = 'Accepted';
        boxColor = '#54AD57';
        break;
      case 3:         // Rejected
        modalText = 'What do you want to do?';
        btnText1 = 'Archive';
        btnText2 = 'Edit Offer';
        boxText = 'Rejected';
        boxColor = '#DA3832';
        if (isMaven) {
          boxDisabled = true;
        }
        break;
      case 4:         // Cancelled
        modalText = 'Archive Job?';
        btnText1 = 'Yes';
        btnText2 = 'No';
        boxText = 'Cancelled';
        boxColor = '#EE8640';
        break;
      case 5:         // Completed
        modalText = 'Give Review?';
        btnText1 = 'Yes';
        btnText2 = 'No';
        boxText = 'Completed';
        boxColor = '#7F7F7F';
        break;
      case 6:         // CReviewed
        if (isMaven) {
          modalText = 'Please leave some review for your customer!';
          btnText1 = 'Yes';
          btnText2 = 'No';
          boxText = 'Completed';
          boxColor = '#7F7F7F';
        } else {
          modalText = "Pending Maven's review...";
          btnText1 = 'Got it';
          boxText = 'Completed';
          boxColor = '#7F7F7F';
        }
        break;
      case 7:         // MReviewed
        if (isMaven) {
          modalText = 'Pending customer review...';
          btnText1 = 'Got it';
          boxText = 'Completed';
          boxColor = '#7F7F7F';
        } else {
          modalText = 'Please leave some review for your maven!';
          btnText1 = 'Yes';
          btnText2 = 'No';
          boxText = 'Completed';
          boxColor = '#7F7F7F';
        }
        break;
      case 8:         // Both Reviewed
        modalText = 'Archive Job';
        btnText1 = 'Yes';
        btnText2 = 'No';
        boxText = 'Completed';
        boxColor = '#7F7F7F';
        break;
      case 9:         // Archived
        boxText = 'Archived';
        boxColor = '#C3C3C3';
        boxDisabled = true;
        break;
      default:
        break;
    }

    return (
      <View key={provider._id} style = {{ paddingHorizontal:10, backgroundColor:'#fff' }}>
        <TouchableOpacity key={provider._id} style={{ paddingVertical:10, flexDirection: 'row', borderBottomWidth:1, borderBottomColor: '#ececec' }} onPress={() => {
          this.props.getMavenDetails(provider.mavenID._id, this.props.profile.location, this.props.auth.token);
          isMaven?
          Actions.chatPage({ title: name, userID: provider.userID, status: provider.status, rating: rating })
          :
          Actions.chatPage({ title: name, status: provider.status, rating: rating, from: 'activity' })
        }}>
          <View style={{ justifyContent: 'flex-start', flex: 1, alignItems: 'center', paddingTop:5 }}>
          {
            isMaven?
            <Image source={provider.userID.displayPicture?{uri: provider.userID.displayPicture}:require('../../assets/images/avatar.png')} style={{ height: 70, width: 70, borderRadius: 25 }} />
            :
            <Image source={provider.mavenUserID.displayPicture?{uri: provider.mavenUserID.displayPicture}:require('../../assets/images/avatar.png')} style={{ height: 70, width: 70, borderRadius: 25 }} />
          }
          </View>
          <View style={{ flex: 2, justifyContent:'center', paddingHorizontal:5 }}>
            <Text style={{ fontSize:16, color:'#515151', fontWeight:'400', height:20 }} numberOfLines={1} ellipsizeMode='tail'>{provider.mavenID.title}</Text>
            <Text style={{ color:'#145775', height:18, fontSize:13, fontWeight:'400', paddingBottom: -2 }}>{categoryName[provider.mavenID.category]}</Text>
            <Text style={ styles.text }>{name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical:3}}>
              <StarRating
                disabled
                maxStars={5}
                rating={rating}
                starSize={14}
                starColor="#FFA838"
                starStyle={{paddingHorizontal:1}}
              />
              <Text style={{color:'#b5b5b5'}}>({Math.round(rating * 10) / 10})</Text>
            </View>
            <Text style={{ fontSize: 15 }} numberOfLines={1} ellipsizeMode='tail'>{provider.lastMessage}</Text>
            {
              provider.status !== 0 &&
              <View style={{flexDirection:'row', alignItems:'center', paddingTop: 5}}>
                <Text style={ styles.text} >Offer: </Text>
                <Text style={{ color:'#FFA838', fontSize:15, fontWeight:"500" }} >${provider.price}</Text>
              </View>
            }
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', paddingRight:10 }}>
            {
              provider.status === 0?
              <View style={styles.container}>
              </View>
              :
              (provider.status === 1 && isMaven)?
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => {
                  this.props.acceptOffer(provider._id, this.props.auth.token);
                }}>
                  <Icon name="ios-checkmark-circle" style={{ color:'#00B356' }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.props.rejectOffer(provider._id, this.props.auth.token);
                }}>
                  <Icon name="ios-close-circle" style={{ color:'#F52422' }}/>
                </TouchableOpacity>
              </View>
              :
              <TouchableOpacity style={styles.container} disabled={boxDisabled} onPress={this.showModal.bind(this)}>
                <View style={[styles.btnContainer, {backgroundColor: boxColor}]}>
                    <Text style={styles.btnText}>{boxText}</Text>
                </View>
              </TouchableOpacity>
            }
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
              <Icon name='md-pin' style={{fontSize:15, paddingRight:2, color:'#BFD9E7'}} />
              <Text style={{ fontSize: 15, color:'#b5b5b5', }}>{0.2} km</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.modalVisible}
          >
          <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={(e)=>{
              this.setState({modalVisible: false});
              }}>
                <Icon name='close' style={{fontSize:40}}/>
            </TouchableOpacity>
            <Text style={{fontSize: 20}}>{modalText}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.modalBtn} onPress={this.onPressBtn1.bind(this)}>
                <Text style={styles.btnText}>{btnText1}</Text>
              </TouchableOpacity>
              {
                btnText2 !== '' && 
                <TouchableOpacity style={styles.modalBtn} onPress={this.onPressBtn2.bind(this)}>
                  <Text style={styles.btnText}>{btnText2}</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.editOfferModalVisible}>
          <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%'}}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>Date</Text>
            <View style={{ marginTop: 3, width: '100%', backgroundColor: 'white', borderRadius: 3, padding: 6 }}>
              <DatePicker
                style={{width: '100%'}}
                date={this.state.serviceDate}
                mode="date"
                placeholder="Service Date"
                format="DD/MM/YYYY"
                minDate="02-01-1900"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => { this.setState({ serviceDate: date }); }}
                customStyles={{
                    dateInput: {
                        borderRadius:5, backgroundColor:'#fff'
                    }
                }}
              />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 15 }}>Offer Price $</Text>
            <View style={{ marginTop: 3, width: '100%', backgroundColor: 'white', borderRadius: 3, alignItems: 'center', padding: 6 }}>
              <TextInput
                placeholderTextColor="rgba(0,0,0,0.3)"
                placeholder="Price"
                returnKeyType='go'
                keyboardType="numeric"
                maxLength={6}
                value={this.state.price}
                onChangeText={(price) => this.setState({price})}
                underlineColorAndroid='transparent'
                style={{ height: 40, width: '100%', padding: 8, fontSize: 16, borderRadius: 3, borderWidth: 1, borderColor: 'grey' }}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => {
                  this.setState({editOfferModalVisible: false});
                  this.props.editOffer(provider._id, this.state.price, this.state.serviceDate, this.props.auth.token);
                }}>
                  <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtn} onPress={() => {
                  this.setState({editOfferModalVisible: false});
                }}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = {
  text:{ fontSize: 13, color:'#b5b5b5' },
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'},
  btnContainer: {width: '100%', paddingVertical: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center'},
  btnText: {fontWeight: 'bold', fontSize: 15, color: '#fff'},
  modalBtn:{
    flex:1, padding:10, marginBottom:10, marginTop: 30, marginHorizontal: 10, flexDirection:'row', alignItems:'center',
    justifyContent:'center', borderRadius:10, backgroundColor:'#0B486B',
    height: 50,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1
    }
  },
};

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  activity: state.activity,
});
const mapDispatchToProps = (dispatch) =>({
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  acceptOffer: (actId, token) => dispatch(actions.acceptOffer(actId, token)),
  rejectOffer: (actId, token) => dispatch(actions.rejectOffer(actId, token)),
  cancelOffer: (actId, type, token) => dispatch(actions.cancelOffer(actId, type, token)),
  editOffer: (actId, price, serviceDate, token) => dispatch(actions.editOffer(actId, price, serviceDate, token)),
  endJob: (actId, token) => dispatch(actions.endJob(actId, token)),
  archiveActivity: (actId, token) => dispatch(actions.archiveActivity(actId, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityItem);
