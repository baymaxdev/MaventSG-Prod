import React from 'react';
import { Scene, Router, Actions, Reducer } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image, Platform, Button, BackHandler, ToastAndroid } from 'react-native';
import { Icon } from 'native-base';

import Login from './auth/login';
import Signup from './auth/signup';
import Otp from './auth/OTP';

import ForgotScreen from './auth/forgotScreen';
import resetPassword from './auth/resetPassword';
import TermsScreen from './auth/TermsScreen';
import PrivacyScreen from './auth/PrivacyScreen';
import CategoryView from './mainUI/categoryView';
import SubCategory from './mainUI/subCategory';
import Discovery from './mainUI/discovery';
import Profile from './mainUI/profile';
import MySkills from './mainUI/mySkills';
import RequestedSkills from './mainUI/requestedSkills';
import ArchivedSkills from './mainUI/archivedSkills';
import SkillList from './mainUI/skillList';
import GenericView from './mainUI/genericView';
import GenericBooking from './mainUI/genericBookingPage';
import SkillPage from './mainUI/skillPage';
import TopicPage from './mainUI/topicPage';
import CommentsPage from './mainUI/commentsPage';
import AllReviewPage from './mainUI/allReviewPage';
import ReviewPage from './mainUI/reviewPage';
import TabIcon from '../components/tabIcon';
import Chat from '../components/chatComponent';
import Feedback from '../components/feedback';
import SavedMavenPage from './mainUI/savedMavenPage';
import BlankPage from './mainUI/BlankView';
import reducerCreate from '../reducers/router_reducer'

const TabIcon1 = (props) => {
  return <TabIcon  {...props} icon={'ios-home-outline'} type='main' />
};
const TabIcon2 = (props) => {
  return <TabIcon  {...props} icon={'ios-search-outline'} type='main' />
};
const TabIcon3 = (props) => {
  return <TabIcon  {...props} icon={'ios-person-outline'} type='main' />
};

const AcitivityIcon1 = (props) => {
  return <TabIcon  {...props} title={'My Skills'} type='activity' />
};
const AcitivityIcon2 = (props) => {
  return <TabIcon  {...props} title={'Requested Skills'} type='activity' />
};
const AcitivityIcon3 = (props) => {
  return <TabIcon  {...props} title={'Archived'} type='activity' />
};

const renderRightButton = () => {
  return <View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={(e) => Actions.ActivityPage()} style={{ padding: 10 }}>
      <Icon name="md-mail" style={{ fontSize: 25, color: '#fff' }} />
    </TouchableOpacity>
  </View>
}

const renderMainUIRightButton = () => {
  return <View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={(e) => Actions.feedback()} style={{ padding: 10 }}>
      <Image source={require('../../assets/icons/feedback.png')} style={{width: 20, height: 20, marginTop: 2}}/>
    </TouchableOpacity>
    <TouchableOpacity onPress={(e) => Actions.ActivityPage()} style={{ padding: 10 }}>
      <Icon name="md-mail" style={{ fontSize: 25, color: '#fff' }} />
    </TouchableOpacity>
  </View>
}

const renderLeftButton = () => {
  return <TouchableOpacity onPress={(e) => Actions.reset("auth")} style={{ padding: 10 }}>
    <Icon name="arrow-back" style={{ fontSize: 25, color: '#fff' }} />
  </TouchableOpacity>
}

var backButtonPressedOnce = false;

class RouterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.onBackPress());
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', () => this.onBackPress());
  }

  onBackPress = () => {
    if (Actions.currentScene === '_categoryView') {
        if (backButtonPressedOnce === true) {
            Actions.pop();
            Actions.pop();
        } else {
            ToastAndroid.show('Press one more time to go back', ToastAndroid.SHORT);
            backButtonPressedOnce = true;
            setTimeout(function() {
                backButtonPressedOnce = false;
            }, 2000);
        }
        return true;
    } else if (Actions.currentScene === 'login') {
        BackHandler.exitApp();
        return true;
    }
    Actions.pop();
    return true;
  }

  render() {
    return (
      <Router {...this.props} createReducer={reducerCreate}>
        <Scene key='root' {...this.props} hideNavBar onRight={() => { Actions.ActivityPage() }}
          navigationBarStyle={{ backgroundColor: '#0B486B', borderBottomWidth: 0 }}
          titleStyle={{ color: 'white', fontSize: 20, fontWeight: '600' }}
          renderRightButton={renderRightButton}
          tintColor='white'
          >

          <Scene key='auth'>
            <Scene key="login" component={Login} hideNavBar />
            <Scene key="signup" component={Signup} title="Join Mavent" hideNavBar={false} rightButtonImage={null} renderRightButton={null} />
            <Scene key="OTP" component={Otp} title="ACTIVATION" back={Platform.OS === "android" ? false : true} renderLeftButton={renderLeftButton}
              renderRightButton={null} hideNavBar={false} rightButtonImage={null} />
            <Scene key="forgotScreen" component={ForgotScreen} />
            <Scene key="resetPassword" component={resetPassword} />
            <Scene key="TermsScreen" component={TermsScreen} />
            <Scene key="PrivacyScreen" component={PrivacyScreen}/>
          </Scene>

          <Scene key='home' {...this.props} >
            <Scene key="main" {...this.props} panHandlers={null} gestureEnabled={false} swipeEnabled={false} tabs activeBackgroundColor='#fff' tabBarStyle={{ backgroundColor: '#fff', paddingVertical: 3 }} tabBarPosition='bottom'
              title="M A V E N T" renderLeftButton={null} navigationBarStyle={{ backgroundColor: "#0B486B" }} indicatorStyle={{ backgroundColor: '#084E70' }} activeTintColor="#084E70" inactiveTintColor="#bbbbbb"
              animationEnabled showIcon={true} showLabel={true} default="categoryView" lazy={true} hideNavBar={true}>

              <Scene key="categoryView" navigationBarStyle={{ height: Platform.OS === "android" ? 60 : 44, backgroundColor: "#0B486B" }} tabBarLabel="Home" component={CategoryView} icon={TabIcon1} title="M A V E N T" initial renderRightButton={renderMainUIRightButton}/>
              <Scene key="discovery" {...this.props} navigationBarStyle={{ height: Platform.OS === "android" ? 60 : 44, backgroundColor: "#0B486B" }} tabBarLabel="Discovery" component={Discovery} icon={TabIcon2} title="Discovery"/>
              <Scene key="profile" navigationBarStyle={{ height: Platform.OS === "android" ? 60 : 44, backgroundColor: "#0B486B" }} tabBarLabel="Profile" component={Profile} icon={TabIcon3} title="Profile" />
            </Scene>
            <Scene key="ActivityPage" back={Platform.OS === "android" ? false : true} title="Activity" gestureEnabled={false} tabs hideNavBar={false}
              showIcon={true} showLabel={false} tabBarPosition='top' tabBarStyle={{ backgroundColor: "#0B486B" }} tabStyle={{ padding: 0, paddingTop: 20 }}
              activeTintColor="#fff" inactiveTintColor="#fff" labelStyle={{ fontWeight: 'bold' }} indicatorStyle={{ backgroundColor: '#0B486B' }}
              rightButtonImage={null} renderRightButton={null} animationEnabled iconStyle={{ width: 120, height: 30 }} backBehavior="none" >
              <Scene key="MySkills" component={MySkills} tabBarLabel='My Skills' back={false}
                navigationBarStyle={{ height: 0 }} renderRightButton={null} title='' icon={AcitivityIcon1}
              />
              <Scene key="RequestedSkills" component={RequestedSkills} tabBarLabel='Requested Skills' back={false}
                navigationBarStyle={{ height: 0 }} renderRightButton={null} title='' icon={AcitivityIcon2}
              />
              <Scene key="Archived" component={ArchivedSkills} tabBarLabel='Archived' back={false}
                navigationBarStyle={{ height: 0 }} renderRightButton={null} title='' icon={AcitivityIcon3}
              />
            </Scene>
            <Scene key="feedback" component={Feedback} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="Feedback"/>
            <Scene key="skillList" component={SkillList} back={Platform.OS === "android" ? false : true} title="Be a Maven!" renderRightButton={null} rightButtonImage={null} />
            <Scene key="subCategory" component={SubCategory} back={Platform.OS === "android" ? false : true} title="Subcategory" />
            <Scene key="genericView" component={GenericView} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="GenericView" />
            <Scene key="genericBooking" component={GenericBooking} back={Platform.OS === "android" ? false : true} title="GenericBookingPage" />
            <Scene key="skillPage" component={SkillPage} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="Skill" />
            <Scene key="chatPage" component={Chat} back={Platform.OS === "android" ? false : true} title="ChatPage" renderRightButton={null} rightButtonImage={null}/>
            <Scene key="topicPage" component={TopicPage} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="topicPage" />
            <Scene key="commentsPage" component={CommentsPage} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="Comments" />
            <Scene key="otherProfile" component={Profile} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="Profile" />
            <Scene key="allReviewPage" component={AllReviewPage} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="All Reviews" />
            <Scene key="viewChats" component={MySkills} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="Chats" />
            <Scene key="reviewPage" component={ReviewPage} rightButtonImage={null} renderRightButton={null} rightTitle='Submit' back={Platform.OS === "android" ? false : true} title="Review" />
            <Scene key="savedMavenPage" component={SavedMavenPage} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="Saved Mavens" />
            <Scene key="blankView" component={BlankPage} back={Platform.OS === "android" ? false : true} title="ChatPage" />
          </Scene>

        </Scene>
      </Router>
    );
  }
};


export default RouterComponent;
