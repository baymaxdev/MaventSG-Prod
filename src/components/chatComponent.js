import React, { Component } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput } from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.2.5
import LoadingComponent from '../components/loadingComponent';
import Firebase from '../helper/firebasehelper';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker';
import StarRating from 'react-native-star-rating';
import ActionSheet from 'react-native-actionsheet';
import { ImagePicker } from 'expo';

var isFirstLoad = true;
var isBookingMessage = true;
var currentActId = undefined;
var chatDisabled = false;

class Chat extends Component {
  state = {
    messages: [],
    requestLoading: true,
    activity: {},
    modalVisible: '',
    editOfferModalVisible: false,
    successModalVisible: false,
    cancelMocalVisible: false,
    serviceDate: '',
    price: '',
    rating: 0,
  };

  renderChatRightButton = () => {
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={(e) => {
        Actions.pop();
        if (this.props.from !== 'activity') {
          Actions.ActivityPage();
        }
        }} style={{ padding: 10 }}>
        <Icon name="md-mail" style={{ fontSize: 25, color: '#fff' }} />
      </TouchableOpacity>
    </View>
  }

  componentDidMount() {
    isFirstLoad = true;
    isBookingMessage = true;
    currentActId = undefined;
    chatDisabled = false;
    Firebase.initialize();
    Actions.refresh({right: this.renderChatRightButton});
    this.props.getMavenDetails(this.props.mavenId, this.props.profile.location, this.props.auth.token, (m) => {
      var maven = m.maven;
      var user = maven.userID;
      if (this.props.userID !== undefined) {
        user = this.props.userID;
      }
      var rating = this.props.userID?user.consumerRating:maven.rating;
      this.setState({maven: maven, user: user, rating: rating, requestLoading: false}, () => {
        this.props.getMavenActivities(this.state.maven._id, this.props.auth.token, (mavenActivities) => {
          this.setActivityFromMaven(mavenActivities);
        });
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activity.uploadedUrl !== nextProps.activity.uploadedUrl && nextProps.activity.uploadedUrl) {
      if (this.state.messages.length === 0) {
        this.props.initChat(this.state.maven._id, this.props.auth.token, (actId) => {
          var m = {};
          m.sender = this.props.profile.myInfo.userId;
          m.receiver = this.state.user._id;
          m.maven = this.state.maven._id;
          m.activity = actId;
          m.image = nextProps.activity.uploadedUrl;
          m.createdAt = new Date().toISOString();
          currentActId = actId;
          this.props.getMavenActivities(this.state.maven._id, this.props.auth.token, (mavenActivities) => {
            this.setActivityFromMaven(mavenActivities);
          });
          if (this.props.userID !== undefined) {
            Firebase.pushMessage(m, true);
            this.props.sendPushNotification([m.receiver], 'New Message from ' + this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName, {type: 'chat', maven: m.maven, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
          } else {
            Firebase.pushMessage(m, false);
            var user = this.props.profile.myInfo;
            user._id = user.userId;
            this.props.sendPushNotification([m.receiver], 'New Message from ' + this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName, {type: 'chat', maven: m.maven, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
          }
        });
      } else {
        var m = {};
        m.sender = this.props.profile.myInfo.userId;
        m.receiver = this.state.user._id;
        m.maven = this.state.maven._id;
        m.activity = this.state.activity._id;
        m.image = nextProps.activity.uploadedUrl;
        m.createdAt = new Date().toISOString();
        if (this.props.userID !== undefined) {
          Firebase.pushMessage(m, true);
          this.props.sendPushNotification([m.receiver], 'New Message from ' + this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName, {type: 'chat', maven: m.maven, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        } else {
          Firebase.pushMessage(m, false);
          var user = this.props.profile.myInfo;
          user._id = user.userId;
          this.props.sendPushNotification([m.receiver], 'New Message from ' + this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName, {type: 'chat', maven: m.maven, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        }
      }
    }

    if(this.props.activity.activityLoading !== nextProps.activity.activityLoading && !nextProps.activity.activityLoading && nextProps.activity.activitySuccess) {
      this.props.getMavenActivities(this.state.maven._id, this.props.auth.token, (mavenActivities) => {
        this.setActivityFromMaven(mavenActivities);
      });
      if (Actions.currentScene === 'chatPage' && nextProps.activity.showSuccessModal === true) {
        setTimeout(() => {
          this.setState({successModalVisible: true}, () => {
            setTimeout(() => {
              this.setState({successModalVisible: false});
            }, 1000);
          });
        }, 500);
      }
    }

    if(this.props.activity.activityLoading !== nextProps.activity.activityLoading && !nextProps.activity.activityLoading && !nextProps.activity.activitySuccess) {
      alert(nextProps.activity.error);
    }
  }

  setActivityFromMaven = (ma) => {
    var activity = {};
    if (this.props.userID !== undefined ) {
      for (var i = 0; i < ma.length; i ++) {
        if (ma[i].userID._id === this.props.userID._id && ma[i]._id === this.props.actId) {
          activity = ma[i];
          break;
        }
      }
    } else {
      for (var i = 0; i < ma.length; i ++) {
        if (this.props.from === 'activity' || this.props.from === 'notification') {
          if (ma[i].userID._id === this.props.profile.myInfo.userId && ma[i]._id === this.props.actId) {
            activity = ma[i];
            break;
          }
        } else {
          if (currentActId) {
            if (ma[i].userID._id === this.props.profile.myInfo.userId && ma[i]._id === currentActId) {
              activity = ma[i];
              break;
            }
          } else {
            if (ma[i].userID._id === this.props.profile.myInfo.userId && ma[i].status !== 601 && ma[i].status !== 611 && ma[i].status !== 502 && ma[i].status !== 512 && ma[i].status !== 522) {
              activity = ma[i];
              break;
            }
          }
        }
      }
    }
    this.setState({ activity });

    if (activity._id !== undefined && this.props.bookingMessage && isBookingMessage === true) {
      isBookingMessage = false;
      var bm = this.props.bookingMessage;
      bm.activity = activity._id;
      Firebase.pushMessage(bm, false);
    }

    if (activity._id !== undefined && isFirstLoad === true) {
      isFirstLoad = false;
      currentActId = activity._id;
      let user = this.props.userID!==undefined?this.state.user._id:this.props.profile.myInfo.userId;
      let node = this.props.mavenId + '-' + user + '-' + activity._id; 
      Firebase.getMessages(node, (snapshot) => {
        var m = {};
        let val = snapshot.val();
        if (this.props.from === 'activity' || this.props.from === 'notification' || (activity.status !== 601 && activity.status !== 611 && activity.status !== 502 && activity.status !== 512 && activity.status !== 522)) {
          m._id = snapshot.key;
          if (val.image) {
            m.image = val.image;
          } else {
            m.text = val.text;
          }
          m.createdAt = new Date(val.createdAt);
          if (val.sender === this.props.profile.myInfo.userId) {
            var u = {};
            u._id = val.sender;
            u.name = this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName;
            u.avatar = this.props.profile.myInfo.displayPicture;
            m.user = u;
          } else if (val.sender === this.state.user._id) {
            var u = {};
            u._id = val.sender;
            u.name = this.state.user.firstName + ' ' + this.state.user.lastName;
            u.avatar = this.state.user.displayPicture;
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
    if (this.state.messages.length === 0) {
      this.props.initChat(this.state.maven._id, this.props.auth.token, (actId) => {
        var m = {};
        m.sender = this.props.profile.myInfo.userId;
        m.receiver = this.state.user._id;
        m.maven = this.state.maven._id;
        m.activity = actId;
        m.text = messages[0].text;
        m.createdAt = messages[0].createdAt.toISOString();
        currentActId = actId;
        this.props.getMavenActivities(this.state.maven._id, this.props.auth.token, (mavenActivities) => {
          this.setActivityFromMaven(mavenActivities);
        });
        if (this.props.userID !== undefined) {
          Firebase.pushMessage(m, true);
          this.props.sendPushNotification([m.receiver], 'New Message from ' + this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName, {type: 'chat', maven: m.maven, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        } else {
          Firebase.pushMessage(m, false);
          var user = this.props.profile.myInfo;
          user._id = user.userId;
          this.props.sendPushNotification([m.receiver], 'New Message from ' + this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName, {type: 'chat', maven: m.maven, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        }
      });
    } else {
      var m = {};
      m.sender = this.props.profile.myInfo.userId;
      m.receiver = this.state.user._id;
      m.maven = this.state.maven._id;
      m.activity = this.state.activity._id;
      m.text = messages[0].text;
      m.createdAt = messages[0].createdAt.toISOString();
      if (this.props.userID !== undefined) {
        Firebase.pushMessage(m, true);
        this.props.sendPushNotification([m.receiver], 'New Message from ' + this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName, {type: 'chat', maven: m.maven, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
      } else {
        Firebase.pushMessage(m, false);
        var user = this.props.profile.myInfo;
        user._id = user.userId;
        this.props.sendPushNotification([m.receiver], 'New Message from ' + this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName, {type: 'chat', maven: m.maven, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
      }
    }
  }

  showModal(type) {
    this.setState({modalVisible: type});
  }

  showEditOfferModal(activity) {
    this.setState({price: activity.price.toString(), serviceDate: activity.serviceDate, editOfferModalVisible: true});
  }

  navigateToReview(type) {
    var user = undefined;
    if (this.props.userID === undefined) {
      user = this.props.profile.myInfo;
      user._id = user.userId;
    }
    Actions.push('reviewPage', {actId: this.state.activity._id, type: type, mavenId: this.state.maven._id, userId: this.state.user._id, user: user});
  }

  sendOfferEventMessage(text) {
    var m = {};
    m.sender = this.props.profile.myInfo.userId;
    m.receiver = this.state.user._id;
    m.maven = this.state.maven._id;
    m.activity = this.state.activity._id;
    m.text = text;
    m.createdAt = new Date().toISOString();
    Firebase.pushMessage(m, this.props.userID!==undefined);
  }

  onPressModalBtn() {
    if (this.state.modalVisible === 'grey' || this.state.modalVisible === 'blue') {
      let isMaven = this.props.userID !== undefined?true:false;
      var user = undefined;
      if (isMaven === false) {
        user = this.props.profile.myInfo;
        user._id = user.userId;
      }
      this.props.archiveActivity(this.state.activity._id, this.props.auth.token);
      this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' archived job.', {type: 'chat', maven: this.state.maven._id, user: user, activity: this.state.activity._id, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
    }
    this.setState({modalVisible: ''});
  }

  onPressBtn1() {
    let activity = this.state.activity;
    let isMaven = this.props.userID !== undefined?true:false;
    var user = undefined;
    if (isMaven === false) {
      user = this.props.profile.myInfo;
      user._id = user.userId;
    }

    switch (activity.status) {
      case 0:          // Messaged
        if (isMaven) {
          this.showModal('grey');
        } else {
          this.showModal('blue');
        }
        break;
      case 1:          // Offered
        if (isMaven) {
          this.sendOfferEventMessage('Offer Rejected');
          this.props.rejectOffer(activity._id, this.props.auth.token);
          this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' rejected your offer.', {type: 'chat', maven: this.state.maven._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        } else {
          this.sendOfferEventMessage('Offer Cancelled');
          this.props.cancelOffer(activity._id, 0, this.props.auth.token);
          this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' cancelled job.', {type: 'chat', maven: this.state.maven._id, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        }
        break;
      case 2:         // Accepted
        this.sendOfferEventMessage('Gig Completed');
        this.props.endJob(activity._id, this.props.auth.token);
        this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' completed job.', {type: 'chat', maven: this.state.maven._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        break;
      case 3:         // Rejected
        if (isMaven) {
          this.showModal('grey');
        } else {
          this.showModal('blue');
        }
        break;
      case 4:         // Cancelled
        if (isMaven) {
          this.showModal('grey');
        } else {
          this.showModal('blue');
        }
        break;
      case 500:         // Completed
        if (isMaven) {
          this.navigateToReview(1);
        } else {
          this.navigateToReview(0);
        }
        break;
      case 510:         // Maven Review
        if (isMaven) {
          this.showModal('grey');
        } else {
          this.navigateToReview(0);
        }
        break;
      case 501:         // Customer Review
        if (isMaven) {
          this.navigateToReview(1);
        } else {
          this.showModal('blue');
        }
        break;
      case 520:         // Maven Archive
        if (isMaven) {
          this.showModal('white');
        } else {
          this.showModal('blue');
        }
        break;
      case 502:         // Customer Archive
        if (isMaven) {
          this.showModal('grey');
        } else {
          this.showModal('white');
        }
        break;
      case 511:         // Maven Review + Customer Review
        if (isMaven) {
          this.showModal('grey');
        } else {
          this.showModal('blue');
        }
        break;
      case 521:         // Maven Archive + Customer Review
        if (isMaven) {
          this.showModal('white');
        } else {
          this.showModal('blue');
        }
        break;
      case 512:         // Maven Review + Customer Archive
        if (isMaven) {
          this.showModal('grey');
        } else {
          this.showModal('white');
        }
        break;
      case 522:         // Maven Archive + Customer Archive
        this.showModal('white');
        break;
      case 610:         // MavenArchived_NR
        if (isMaven) {
          this.showModal('white');
        } else {
          this.showModal('blue');
        }
        break;
      case 601:         // CustomerArchived_NR
        if (isMaven) {
          this.showModal('grey');
        } else {
          this.showModal('white');
        }
        break;
      case 611:         // BothArchived)NR
        this.showModal('white');
        break;
      default:
        break;
    }
  }

  onPressBtn2() {
    let activity = this.state.activity;
    let isMaven = this.props.userID !== undefined?true:false;
    var user = undefined;
    if (isMaven === false) {
      user = this.props.profile.myInfo;
      user._id = user.userId;
    }

    switch (activity.status) {
      case 0:          // Messaged
        if (isMaven) {

        } else {
          Actions.pop();
          Actions.genericBooking({ title: this.props.title, maven: this.state.maven });
        }
      case 1:          // Offered
        if (isMaven) {
          this.sendOfferEventMessage('Offer Accepted');
          this.props.acceptOffer(activity._id, this.props.auth.token);
          this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' accepted your offer.', {type: 'chat', maven: this.state.maven._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        } else {
          this.showEditOfferModal(activity);
        }
        break;
      case 2:         // Accepted
        this.sendOfferEventMessage('Offer Cancelled');
        this.props.cancelOffer(activity._id, 0, this.props.auth.token);
        this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' cancelled job.', {type: 'chat', maven: this.state.maven._id, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
        break;
      case 3:         // Rejected
        this.showEditOfferModal(activity);
        break;
      case 4:         // Cancelled
        Actions.pop();
        Actions.genericBooking({ title: this.props.title, maven: this.state.maven });
        break;
      case 500:         // Completed
        this.showModal('red');
        break;
      case 510:         // Maven Review
        if (isMaven) {

        } else {
          this.showModal('red');
        }
        break;
      case 501:         // Customer Review
        if (isMaven) {
          this.showModal('red');
        } else {

        }
        break;
      default:
        break;
    }
  }

  renderActions() {
    return (
      <TouchableOpacity disabled={chatDisabled} style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: 26, height: 26, marginLeft: 10 }} onPress={() => {
        this.ActionSheet.show();
      }}>
        <Icon name="md-images" style={{ fontSize: 25, color: '#90939B' }} />
      </TouchableOpacity>
    );
  }

  handlePress = (i) => {
    if (i === 1)
      this._openCameraRoll();
    else if (i === 2)
      this.takePhoto();
  }

  _openCameraRoll = async () => {
    let image = await ImagePicker.launchImageLibraryAsync();
    if (!image.cancelled) {
      this.props.uploadImage(image.uri, this.props.auth.token);
    }
  }

  takePhoto = async () => {
    let image = await ImagePicker.launchCameraAsync();
    if (!image.cancelled) {
      this.props.uploadImage(image.uri, this.props.auth.token);
    }
  }

  render() {
    let activity = this.state.activity;
    console.log(activity.status);
    let isMaven = this.props.userID !== undefined?true:false;
    var btnText1 = btnText2 = '';
    
    if (activity.status !== undefined) {
      switch (activity.status) {
        case 0:         // Messaged
          if (isMaven) {
            btnText1 = 'Archive Chat';
          } else {
            btnText1 = 'Archive Chat';
            btnText2 = 'Create Offer';
          }
          break;
        case 1:         // Offered
          if (isMaven) {
            btnText1 = 'Reject';
            btnText2 = 'Accept';
          } else {
            btnText1 = 'Cancel Offer';
            btnText2 = 'Edit Offer';
          }
          break;
        case 2:         // Accepted
          if (isMaven) {
            btnText1 = 'Completed';
            btnText2 = 'Cancel Offer';
          } else {
            btnText1 = 'Completed';
            btnText2 = 'Cancel Offer';
          }
          break;
        case 3:         // Rejected
          if (isMaven) {
            btnText1 = 'Archive Chat';
          } else {
            btnText1 = 'Archive Chat';
            btnText2 = 'Edit Offer';
          }
          break;
        case 4:         // Cancelled
          if (isMaven) {
            btnText1 = 'Archive Chat';
          } else {
            btnText1 = 'Archive Chat';
            btnText2 = 'Make new Offer';
          }
          break;
        case 500:         // Completed
          if (isMaven) {
            btnText1 = 'Leave Review';
            btnText2 = 'Archive Chat';
          } else {
            btnText1 = 'Leave Review';
            btnText2 = 'Archive Chat';
          }
          break;
        case 510:         // Maven Review
          if (isMaven) {
            btnText1 = 'Archive Chat';
          } else {
            btnText1 = 'Leave Review';
            btnText2 = 'Archive Chat';
          }
          break;
        case 501:         // Customer Review
          if (isMaven) {
            btnText1 = 'Leave Review';
            btnText2 = 'Archive Chat';
          } else {
            btnText1 = 'Archive Chat';
          }
          break;
        case 520:         // Maven Archive
          if (isMaven) {
            btnText1 = 'Chat Archived';
            chatDisabled = true;
          } else {
            btnText1 = 'Archive Chat';
          }
          break;
        case 502:         // Customer Archive
          if (isMaven) {
            btnText1 = 'Archive Chat';
          } else {
            btnText1 = 'Chat Archived';
            chatDisabled = true;
          }
          break;
        case 511:         // Maven Review + Customer Review
          if (isMaven) {
            btnText1 = 'Archive Chat';
          } else {
            btnText1 = 'Archive Chat';
          }
          break;
        case 521:         // Maven Archive + Customer Review
          if (isMaven) {
            btnText1 = 'Chat Archived';
            chatDisabled = true;
          } else {
            btnText1 = 'Archive Chat';
          }
          break;
        case 512:         // Maven Review + Customer Archive
          if (isMaven) {
            btnText1 = 'Archive Chat';
          } else {
            btnText1 = 'Chat Archived';
            chatDisabled = true;
          }
          break;
        case 522:         // Maven Archive + Customer Archive
          btnText1 = 'Chat Archived';
          chatDisabled = true;
          break;
        case 610:         // MavenArchived_NR
          if (isMaven) {
            btnText1 = 'Chat Archived';
            chatDisabled = true;
          } else {
            btnText1 = 'Archive Chat';
          }
          break;
        case 601:         // CustomerArchived_NR
          if (isMaven) {
            btnText1 = 'Archive Chat';
          } else {
            btnText1 = 'Chat Archived';
            chatDisabled = true;
          }
          break;
        case 611:         // BothArchived_NR
          btnText1 = 'Chat Archived';
          chatDisabled = true;
          break;
        default:
          break;
      }
    }

    let modalVisible = this.state.modalVisible === 'red' || this.state.modalVisible === 'grey' || this.state.modalVisible === 'blue' || this.state.modalVisible === 'white';
    var modalTitle = '';
    var modalBtnTitle = '';
    switch (this.state.modalVisible) {
      case 'grey':
        modalTitle = 'After you archive already, you all cannot send anymore messages to each other for this thread already, but your customer can create a fresh new thread by messaging this listing again! Confirm chop want to archive?';
        modalBtnTitle = 'Confirm';
        break;
      case 'blue':
        modalTitle = 'After you archive already, you all cannot send anymore messages to each other for this thread already, but you can easily create a fresh new thread by messaging this listing again! Confirm chop want to archive?';
        modalBtnTitle = 'Confirm';
        break;
      case 'red':
        modalTitle = 'To archive this chat, please leave a review first!';
        modalBtnTitle = 'Okay';
        break;
      case 'white':
        modalTitle = 'Chat already archive liao, you will no longer be able to send messages in this chat, to send this listing a message, send a new chat to the listing!';
        modalBtnTitle = 'Okay';
        break;
      default:
        break;
    }

    return (
      this.state.requestLoading ?
      <LoadingComponent/>
      :
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => {
          Actions.pop();
          if (isMaven) {
            Actions.otherProfile({title: this.props.title, userId: this.state.user._id});
          } else {
            if (this.props.from === 'booking') {
              Actions.pop();
            } else if (this.props.from !== 'skillpage') {
              this.props.getMavenDetails(this.state.maven._id, this.props.profile.location, this.props.auth.token);
              Actions.skillPage({ title: this.state.user.firstName + ' ' + this.state.user.lastName, isMe: isMaven });
            }
          }
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={this.state.user.displayPicture?{uri: this.state.user.displayPicture}:require('../../assets/images/avatar.png')} style={{width: 50, height: 50, marginHorizontal: 10, borderRadius: 18, borderWidth: 2, borderColor: 'white'}}/>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{fontSize: 20, marginTop: 5}}>{this.state.user.firstName + ' ' + this.state.user.lastName}</Text>
              {
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical:5, marginBottom: 5}}>
                  <StarRating
                    disabled
                    maxStars={5}
                    rating={this.state.rating}
                    starSize={14}
                    starColor="#FFA838"
                    starStyle={{paddingHorizontal:1}}
                  />
                  <Text style={{color:'#b5b5b5'}}>({Math.round(this.state.rating * 10) / 10})</Text>
                </View>
              }
            </View>
            <Icon name="ios-arrow-forward" style={{ fontSize: 25, color: '#90939B', marginHorizontal: 10}} />
          </View>
        </TouchableOpacity>
        {
          btnText1 !== ''?
          <View style={{height: 50, flexDirection: 'row'}}>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#90939B'}} onPress={this.onPressBtn1.bind(this)}>
              <Text style={{color: 'white'}}>{btnText1}</Text>
            </TouchableOpacity>
            {
              btnText2 !== '' && 
              <View style={{width: 1, height: 40, backgroundColor: 'white'}}></View>
            }
            {
              btnText2 !== '' && 
              <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#90939B'}} onPress={this.onPressBtn2.bind(this)}>
                <Text style={{color: 'white'}}>{btnText2}</Text>
              </TouchableOpacity>
            }
          </View>
          :
          <View style={{height: 1, backgroundColor: '#90939B'}}/>
        }
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          showUserAvatar
          user={{
            // _id: this.props.profile.myInfo.userID,
            _id: this.props.profile.myInfo.userId
          }}
          textInputProps={{editable: !chatDisabled}}
          renderActions={this.renderActions.bind(this)}
        />
        <Modal
          isVisible={modalVisible}
          >
          <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={(e)=>{
              this.setState({modalVisible: ''});
              }}>
                <Icon name='close' style={{fontSize:40}}/>
            </TouchableOpacity>
            <Text style={{fontSize: 20}}>{modalTitle}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {this.onPressModalBtn()}}>
                <Text style={styles.btnText}>{modalBtnTitle}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.cancelMocalVisible}
          >
          <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={(e)=>{
              this.setState({cancelMocalVisible: false});
              }}>
                <Icon name='close' style={{fontSize:40}}/>
            </TouchableOpacity>
            <Text style={{fontSize: 20}}>Cancel only if you are sure.</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {
                this.setState({cancelMocalVisible: false})
                this.sendOfferEventMessage('Offer Cancelled');
                this.props.cancelOffer(activity._id, isMaven?1:0, this.props.auth.token);
                this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' cancelled job.', {type: 'chat', maven: this.state.maven._id, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
              }}>
                <Text style={styles.btnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {
                this.setState({cancelMocalVisible: false})
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
                  this.props.editOffer(activity._id, this.state.price, this.state.serviceDate, this.props.auth.token);
                  var user = undefined;
                  if (isMaven === false) {
                    user = this.props.profile.myInfo;
                    user._id = user.userId;
                  }
                  this.props.sendPushNotification([this.state.user._id], this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName + ' edited offer.', {type: 'chat', maven: this.state.maven._id, user: user, title: this.props.profile.myInfo.firstName + ' ' + this.props.profile.myInfo.lastName}, this.props.auth.token);
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
        <ActionSheet
            ref={o => this.ActionSheet = o}
            title={null}
            options={['Cancel', 'Choose from Library...', 'Take a picture...']}
            cancelButtonIndex={0}
            onPress={this.handlePress}
        />
      </View>
    );
  }
}

const styles = {
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
  maven: state.explore.maven,
  activity: state.activity,
});

const mapDispatchToProps = (dispatch) =>({
  getMavenDetails: (mavenId, location, token, callback) => dispatch(actions.getMavenDetails(mavenId, location, token, callback)),
  initChat: (mavenId, token, next) => dispatch(actions.initChat(mavenId, token, next)),
  getMavenActivities: (mavenId, token, callback) => dispatch(actions.getMavenActivities(mavenId, token, callback)),
  acceptOffer: (actId, token) => dispatch(actions.acceptOffer(actId, token)),
  rejectOffer: (actId, token) => dispatch(actions.rejectOffer(actId, token)),
  cancelOffer: (actId, type, token) => dispatch(actions.cancelOffer(actId, type, token)),
  editOffer: (actId, price, serviceDate, token) => dispatch(actions.editOffer(actId, price, serviceDate, token)),
  endJob: (actId, token) => dispatch(actions.endJob(actId, token)),
  archiveActivity: (actId, token) => dispatch(actions.archiveActivity(actId, token)),
  sendPushNotification: (ids, message, data, token) => dispatch(actions.sendPushNotification(ids, message, data, token)),
  removeNotificationActId: () => dispatch(actions.removeNotificationActId()),
  uploadImage: (imageUrl, token) => dispatch(actions.uploadImage(imageUrl, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);