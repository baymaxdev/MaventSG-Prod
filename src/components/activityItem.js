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
import DatePicker from 'react-native-datepicker';
import Firebase from '../helper/firebasehelper';

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
      cancelModalVisible: false,
      serviceDate: '',
      price: '',
    };
  }

  ComponentDidMount() {
    Firebase.initialize();
  }

  showModal() {
    this.setState({modalVisible: true});
  }

  showEditOfferModal() {
    this.setState({editOfferModalVisible: true, price: this.props.provider.price.toString(), serviceDate: this.props.provider.serviceDate});
  }

  navigateToReview(type, userId, mavenId, user) {
    Actions.push('reviewPage', {actId: this.props.provider._id, type: type, userId: userId, mavenId: mavenId, user: user});
  }

  archiveChat() {
    let provider = this.props.provider;
    let isMaven = this.props.profile.myInfo.userId === provider.mavenUserID._id?true:false;
    let userId = isMaven?provider.userID._id:provider.mavenUserID._id;
    let user = isMaven?undefined:provider.userID;

    this.props.archiveActivity(provider._id, this.props.auth.token);
    this.props.sendPushNotification([userId], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' archived job.', {type: 'chat', maven: provider.mavenID._id, user: user, activity: provider._id, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
  }

  sendOfferEventMessage(text) {
    var m = {};
    let provider = this.props.provider;
    let isMaven = this.props.profile.myInfo.userId === provider.mavenUserID._id?true:false;
    m.sender = this.props.profile.myInfo.userId;
    m.receiver = isMaven?provider.userID._id:provider.mavenID._id;
    m.maven = provider.mavenID._id;
    m.activity = provider._id;
    m.text = text;
    m.createdAt = new Date().toISOString();
    Firebase.pushMessage(m, isMaven);
  }

  onPressBtn1() {
    this.setState({modalVisible: false});

    let provider = this.props.provider;
    let isMaven = this.props.profile.myInfo.userId === provider.mavenUserID._id?true:false;
    let userId = isMaven?provider.userID._id:provider.mavenUserID._id;
    let user = isMaven?undefined:provider.userID;

    switch (provider.status) {
      case 0:          // Messaged
        this.archiveChat();
        break;
      case 1:          // Offered
        this.sendOfferEventMessage('Offer Cancelled');
        this.props.cancelOffer(provider._id, 0, this.props.auth.token);
        this.props.sendPushNotification([userId], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' cancelled job.', {type: 'chat', maven: provider.mavenID._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        break;
      case 2:         // Accepted
        this.sendOfferEventMessage('Gig Completed');
        this.props.endJob(provider._id, this.props.auth.token);
        this.props.sendPushNotification([userId], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' completed job.', {type: 'chat', maven: provider.mavenID._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        break;
      case 3:         // Rejected
        this.archiveChat();
        break;
      case 4:         // Cancelled
        this.archiveChat();
        break;
      case 500:         // Completed
        if (isMaven) {
          this.navigateToReview(1, userId, provider.mavenID._id, user);
        } else {
          this.navigateToReview(0, userId, provider.mavenID._id, user);
        }
        break;
      case 510:         // Maven Review
        if (isMaven) {
          this.archiveChat();
        } else {
          this.navigateToReview(0, userId, provider.mavenID._id, user);
        }
        break;
      case 501:         // Customer Review
        if (isMaven) {
          this.navigateToReview(1, userId, provider.mavenID._id, user);
        } else {
          this.archiveChat();
        }
        break;
      case 520:         // Maven Archive
        if (isMaven) {
          
        } else {
          this.navigateToReview(0, userId, provider.mavenID._id, user);
        }
        break;
      case 502:         // Customer Archive
        if (isMaven) {
          this.navigateToReview(1, userId, provider.mavenID._id, user);
        } else {
          
        }
        break;
      case 511:         // Maven Review + Customer Review
        this.archiveChat();
        break;
      case 521:         // Maven Archive + Customer Review
        if (isMaven) {
          
        } else {
          this.archiveChat();
        }
        break;
      case 512:         // Maven Review + Customer Archive
        if (isMaven) {
          this.archiveChat();
        } else {
          
        }
        break;
      case 522:         // Maven Archive + Customer Archive
        
        break;
      case 610:         // MavenArchived_NR
        if (isMaven) {
          
        } else {
          this.archiveChat();
        }
        break;
      case 601:         // CustomerArchived_NR
        if (isMaven) {
          this.archiveChat();
        } else {
          
        }
        break;
      case 611:         // BothArchived_NR
        
        break;
      default:
        break;
    }
  }

  onPressBtn2() {
    this.setState({modalVisible: false});
    
    let provider = this.props.provider;
    let isMaven = this.props.profile.myInfo.userId === provider.mavenUserID._id?true:false;
    let userId = isMaven?provider.userID._id:provider.mavenUserID._id;
    let user = isMaven?undefined:provider.userID;

    switch (provider.status) {
      case 0:          // Messaged
        if (!isMaven) {
          var maven = provider.mavenID;
          maven.userID = provider.mavenUserID;
          Actions.pop();
          Actions.genericBooking({ title: provider.userID.firstName + ' ' + provider.userID.lastName, maven: maven });
        }
        break;
      case 1:          // Offered
        setTimeout(() => {
          this.showEditOfferModal();
        }, 500);
        break;
      case 2:         // Accepted
        this.setState({cancelModalVisible: true});
        break;
      case 3:         // Rejected
        if (isMaven) {
          
        } else {
          setTimeout(() => {
            this.showEditOfferModal();
          }, 500);
        }
        break;
      case 4:          // Cancelled
        if (!isMaven) {
          var maven = provider.mavenID;
          maven.userID = provider.mavenUserID;
          Actions.pop();
          Actions.genericBooking({ title: provider.userID.firstName + ' ' + provider.userID.lastName, maven: maven });
        }
        break;
      case 500:
        this.archiveChat();
        break;
      case 510:
        if (!isMaven) {
          this.archiveChat();
        }
        break;
      case 501:
        if (isMaven) {
          this.archiveChat();
        }
        break;
      case 520:
        if (!isMaven) {
          this.archiveChat();
        }
        break;
      case 502:
        if (isMaven) {
          this.archiveChat();
        }
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
    let userId = isMaven?provider.userID._id:provider.mavenUserID._id;
    let user = isMaven?undefined:provider.userID;

    switch (provider.status) {
      case 0:
        modalText = '0: Messaged';
        btnText1 = 'Archive Chat';
        if (!isMaven) {
          btnText2 = 'Create Offer';
        }
        boxText = 'Messaged'
        boxColor = '#7F7F7F';
        break;
      case 1:         // Offered
        if (!isMaven) {
          modalText = '1: Offered';
          btnText1 = 'Cancel Offer';
          btnText2 = 'Edit Offer';
          boxText = 'Offered';
          boxColor = '#FDF251';
        }
        break;
      case 2:         // Accepted
        modalText = '2: Accepted';
        btnText1 = 'Completed';
        btnText2 = 'Cancel Offer';
        boxText = 'Accepted';
        boxColor = '#54AD57';
        break;
      case 3:         // Rejected
        modalText = '3: Rejected';
        btnText1 = 'Archive Chat';
        if (!isMaven) {
          btnText2 = 'Edit Offer';
        }
        boxText = 'Rejected';
        boxColor = '#DA3832';
        if (isMaven) {
          boxDisabled = true;
        }
        break;
      case 4:         // Cancelled
        modalText = '4: Cancelled';
        btnText1 = 'Archive Chat';
        if (!isMaven) {
          btnText2 = 'Make new Offer';
        }
        boxText = 'Cancelled';
        boxColor = '#EE8640';
        break;
      case 500:         // Completed
        modalText = '500: Completed';
        btnText1 = 'Leave Review';
        btnText2 = 'Archive Chat';
        boxText = 'Completed';
        boxColor = '#7F7F7F';
        break;
      case 510:         // Maven Review
        modalText = '510: Maven Review';
        if (isMaven) {
          btnText1 = 'Archive Chat';
          boxText = 'Reviewed';
        } else {
          btnText1 = 'Leave Review';
          btnText2 = 'Archive Chat';
          boxText = 'Completed';
        }
        boxColor = '#7F7F7F';
        break;
      case 501:         // Customer Review
        modalText = '501: Customer Review';
        if (isMaven) {
          btnText1 = 'Leave Review';
          btnText2 = 'Archive Chat';
          boxText = 'Completed';
        } else {
          btnText1 = 'Archive Chat';
          boxText = 'Reviewed';
        }
        boxColor = '#7F7F7F';
        break;
      case 520:         // Maven Archive
        modalText = '520: Maven Archive';
        if (isMaven) {
          btnText1 = 'Chat Archived';
          boxText = 'Archived';
        } else {
          btnText1 = 'Leave Review';
          btnText2 = 'Archive Chat';
          boxText = 'Completed';
        }
        boxColor = '#7F7F7F';
        break;
      case 502:         // Customer Archive
        modalText = '502: Customer Archive';
        if (isMaven) {
          btnText1 = 'Leave Review';
          btnText2 = 'Archive Chat';
          boxText = 'Completed';
        } else {
          btnText1 = 'Chat Archived';
          boxText = 'Archived';
        }
        boxColor = '#7F7F7F';
        break;
      case 511:         // Maven Review + Customer Review
        modalText = '511: Maven Review + Customer Review';
        btnText1 = 'Archive Chat';
        boxText = 'Reviewed';
        boxColor = '#7F7F7F';
        break;
      case 521:         // Maven Archive + Customer Review
        modalText = '521: Maven Archive + Customer Review';
        if (isMaven) {
          btnText1 = 'Chat Archived';
          boxText = 'Archived';
        } else {
          btnText1 = 'Archive Chat';
          boxText = 'Reviewed';
        }
        boxColor = '#7F7F7F';
        break;
      case 512:         // Maven Review + Customer Archive
        modalText = '502: Maven Review + Customer Archive';
        if (isMaven) {
          btnText1 = 'Archive Chat';
          boxText = 'Reviewed';
        } else {
          btnText1 = 'Chat Archived';
          boxText = 'Archived';
        }
        boxColor = '#7F7F7F';
        break;
      case 522:         // Maven Archive + Customer Archive
        modalText = '522: Maven Archive + Customer Archive';
        btnText1 = 'Chat Archived';
        boxText = 'Archived';
        boxColor = '#7F7F7F';
        break;
      case 610:         // MavenArchived_NR
        modalText = '610: MavenArchived_NR';
        if (isMaven) {
          btnText1 = 'Chat Archived';
          boxText = 'Archived';
        } else {
          btnText1 = 'Archive Chat';
          boxText = 'Archive';
        }
        boxColor = '#7F7F7F';
        break;
      case 601:         // CustomerArchived_NR
        modalText = '610: CustomerArchived_NR';
        if (isMaven) {
          btnText1 = 'Archive Chat';
          boxText = 'Archive';
        } else {
          btnText1 = 'Chat Archived';
          boxText = 'Archived';
        }
        boxColor = '#7F7F7F';
        break;
      case 611:         // BothArchived_NR
        modalText = '611: BothArchived_NR';
        btnText1 = 'Chat Archived';
        boxText = 'Archived';
        boxColor = '#7F7F7F';
        break;
      default:
        break;
    }

    return (
      <View key={provider._id} style = {{ paddingHorizontal:10, backgroundColor:'#fff' }}>
        <TouchableOpacity key={provider._id} style={{ paddingVertical:10, flexDirection: 'row', borderBottomWidth:1, borderBottomColor: '#ececec' }} onPress={() => {
          isMaven?
          Actions.chatPage({ mavenId: provider.mavenID._id, title: name, userID: provider.userID, from: 'activity', actId: provider._id })
          :
          Actions.chatPage({ mavenId: provider.mavenID._id, title: name, from: 'activity', actId: provider._id })
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
              (provider.status === 1 && isMaven)?
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => {
                  this.sendOfferEventMessage('Offer Accepted');
                  this.props.acceptOffer(provider._id, this.props.auth.token);
                  this.props.sendPushNotification([userId], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' accepted your offer.', {type: 'chat', maven: provider.mavenID._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
                }}>
                  <Icon name="ios-checkmark-circle" style={{ color:'#00B356' }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.sendOfferEventMessage('Offer Rejected');
                  this.props.rejectOffer(provider._id, this.props.auth.token);
                  this.props.sendPushNotification([userId], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' rejected your offer.', {type: 'chat', maven: provider.mavenID._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
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
        <Modal
          isVisible={this.state.cancelModalVisible}
          >
          <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={(e)=>{
              this.setState({cancelModalVisible: false});
              }}>
                <Icon name='close' style={{fontSize:40}}/>
            </TouchableOpacity>
            <Text style={{fontSize: 20}}>Cancel only if you are sure.</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {
                this.setState({cancelModalVisible: false})
                this.sendOfferEventMessage('Offer Cancelled');
                this.props.cancelOffer(activity._id, isMaven?1:0, this.props.auth.token);
                this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' cancelled job.', {type: 'chat', maven: this.state.maven._id, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
              }}>
                <Text style={styles.btnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {
                this.setState({cancelModalVisible: false})
                }}>
                <Text style={styles.btnText}>No</Text>
              </TouchableOpacity>
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
                  this.sendOfferEventMessage('Re-Offer');
                  this.props.editOffer(provider._id, this.state.price, this.state.serviceDate, this.props.auth.token);
                  this.props.sendPushNotification([userId], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' edited offer.', {type: 'chat', maven: provider.mavenID._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
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
  acceptOffer: (actId, token) => dispatch(actions.acceptOffer(actId, token)),
  rejectOffer: (actId, token) => dispatch(actions.rejectOffer(actId, token)),
  cancelOffer: (actId, type, token) => dispatch(actions.cancelOffer(actId, type, token)),
  editOffer: (actId, price, serviceDate, token) => dispatch(actions.editOffer(actId, price, serviceDate, token)),
  endJob: (actId, token) => dispatch(actions.endJob(actId, token)),
  archiveActivity: (actId, token) => dispatch(actions.archiveActivity(actId, token)),
  sendPushNotification: (ids, message, data, token) => dispatch(actions.sendPushNotification(ids, message, data, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityItem);
