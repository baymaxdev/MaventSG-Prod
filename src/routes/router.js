import React from 'react';
import { Scene, Router, Actions, Reducer } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Text, TouchableOpacity, Image, Platform } from 'react-native';
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
import SkillList from './mainUI/skillList';
import GenericView from './mainUI/genericView';
import GenericBooking from './mainUI/genericBookingPage';
import SkillPage from './mainUI/skillPage';
import TopicPage from './mainUI/topicPage';
import CommentsPage from './mainUI/commentsPage';
import TabIcon from '../components/tabIcon';
import Chat from '../components/chatComponent';
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
  return <TouchableOpacity onPress={(e) => Actions.ActivityPage()} style={{ padding: 10 }}>
    <Icon name="md-mail" style={{ fontSize: 25, color: '#fff' }} />
  </TouchableOpacity>
}

const renderLeftButton = () => {
  return <TouchableOpacity onPress={(e) => Actions.reset("auth")} style={{ padding: 10 }}>
    <Icon name="arrow-back" style={{ fontSize: 25, color: '#fff' }} />
  </TouchableOpacity>
}

class RouterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
            <Scene key="main" {...this.props} gestureEnabled={false} tabs activeBackgroundColor='#fff' tabBarStyle={{ backgroundColor: '#fff', paddingVertical: 3 }}
              title="M A V E N T" renderLeftButton={null} navigationBarStyle={{ backgroundColor: "#0B486B" }} indicatorStyle={{ backgroundColor: '#084E70' }} activeTintColor="#084E70" inactiveTintColor="#bbbbbb"
              animationEnabled showIcon={true} showLabel={true} default="categoryView" lazy={true} hideNavBar={Platform.OS === "android" ? false : true} >

              <Scene key="categoryView" navigationBarStyle={{ height: Platform.OS === "android" ? 0 : 60, backgroundColor: "#0B486B" }} tabBarLabel="Home" component={CategoryView} icon={TabIcon1} title="M A V E N T" initial/>
              <Scene key="discovery" {...this.props} navigationBarStyle={{ height: Platform.OS === "android" ? 0 : 60, backgroundColor: "#0B486B" }} tabBarLabel="Discovery" component={Discovery} icon={TabIcon2} title="Discovery"/>
              <Scene key="profile" navigationBarStyle={{ height: Platform.OS === "android" ? 0 : 60, backgroundColor: "#0B486B" }} tabBarLabel="Profile" component={Profile} icon={TabIcon3} title="M A V E N T" />
            </Scene>
            <Scene key="ActivityPage" back={Platform.OS === "android" ? false : true} title="Activity" gestureEnabled={false} tabs hideNavBar={false}
              showIcon={true} showLabel={false} tabBarPosition='top' tabBarStyle={{ backgroundColor: "#0B486B" }} tabStyle={{ padding: 0, paddingTop: 20 }}
              activeTintColor="#fff" inactiveTintColor="#fff" labelStyle={{ fontWeight: 'bold' }} indicatorStyle={{ backgroundColor: '#0B486B' }}
              rightButtonImage={null} renderRightButton={null} animationEnabled iconStyle={{ width: 120, height: 30 }} backBehavior="none" >
              <Scene key="MySkills" component={MySkills} tabBarLabel='My Skills' back={false}
                navigationBarStyle={{ height: 0 }} renderRightButton={null} title='' icon={AcitivityIcon1}
              />
              <Scene key="RequestedSkills" component={MySkills} tabBarLabel='Requested Skills' back={false}
                navigationBarStyle={{ height: 0 }} renderRightButton={null} title='' icon={AcitivityIcon2}
              />
              <Scene key="Archived" component={MySkills} tabBarLabel='Archived' back={false}
                navigationBarStyle={{ height: 0 }} renderRightButton={null} title='' icon={AcitivityIcon3}
              />
            </Scene>
            <Scene key="skillList" component={SkillList} back={Platform.OS === "android" ? false : true} title="Be a Maven!" renderRightButton={null} rightButtonImage={null} />
            <Scene key="subCategory" component={SubCategory} back={Platform.OS === "android" ? false : true} title="Subcategory" />
            <Scene key="genericView" component={GenericView} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="GenericView" />
            <Scene key="genericBooking" component={GenericBooking} back={Platform.OS === "android" ? false : true} title="GenericBookingPage" />
            <Scene key="skillPage" component={SkillPage} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="Skill" />
            <Scene key="chatPage" component={Chat} back={Platform.OS === "android" ? false : true} title="ChatPage" />
            <Scene key="topicPage" component={TopicPage} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="topicPage" />
            <Scene key="commentsPage" component={CommentsPage} rightButtonImage={null} renderRightButton={null} back={Platform.OS === "android" ? false : true} title="Comments" />
            <Scene key="blankView" component={BlankPage} back={Platform.OS === "android" ? false : true} title="ChatPage" />
          </Scene>

        </Scene>
      </Router>
    );
  }
};


export default RouterComponent;
