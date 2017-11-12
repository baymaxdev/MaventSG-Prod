import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Dimensions,
  Text, TextInput,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import { Actions } from 'react-native-router-flux';
import ActivityItem from '../../components/activityItem';
import Firebase from '../../helper/firebasehelper';
import Placeholder from 'rn-placeholder';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class MySkills extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      requestLoading: true,
      refreshing: false,
      isMavenUser: false,
    };
  }
  // This is to remove fb token for retry purposes
  componentWillMount() {
    this.props.getActivities(0, this.props.auth.token);
    this.props.checkId(this.props.auth.token);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activity.mySkills !== undefined) {
      let dataTemp = nextProps.activity.mySkills;
      var data = [];
      var temp = [];
      if (this.props.isViewChats === true) {
        for (var i = 0; i < dataTemp.length; i++) {
          if (dataTemp[i].mavenID._id === this.props.maven._id) {
            data.push(dataTemp[i]);
          }
        }
      } else {
        data = dataTemp;
      }

      for (var i = 0; i < data.length; i++) {
        temp.push(data[i].mavenID._id + '-' + data[i].userID._id);
      }

      Firebase.initialize();
      Firebase.getLastMessages(temp, (messages) => {
        for (i = 0; i < data.length; i++) {
          data[i].lastMessage = messages[i];
        }
        this.setState({data: data, requestLoading: false, refreshing: false});
      });
    }

    if (nextProps.profile.postalCode) {
      this.setState({isMavenUser: true});
    } else {
      this.setState({isMavenUser: false});
    }

    if(this.props.activity.offerLoading !== nextProps.activity.offerLoading && !nextProps.activity.offerLoading && nextProps.activity.offerSuccess) {
      this.refreshItem();
    } else if(this.props.activity.offerLoading !== nextProps.activity.offerLoading && !nextProps.activity.offerLoading && !nextProps.activity.offerSuccess) {
      alert(nextProps.activity.error);
    }
  }

  renderPlaceholder() {
    var ret = [];
    for (var i = 0; i < 10; i++) {
        ret.push(
            <View key={i} style={{padding: 20, height: 150}}>
                <Placeholder.ImageContent
                    onReady={false}
                    lineNumber={4}
                    animate="shine"
                    lastLineWidth="50%"
                    >
                </Placeholder.ImageContent>
            </View>
        );
    }
    return ret;
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.getActivities(0, this.props.auth.token);
  }

  refreshItem() {
    this.props.getActivities(0, this.props.auth.token);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
      {
        this.props.isViewChats &&
        <TouchableOpacity onPress={() => {
          this.props.getMavenDetails(this.props.maven._id, this.props.profile.location, this.props.auth.token);
          Actions.skillPage({ title: this.props.maven.userID.firstName + ' ' + this.props.maven.userID.lastName, isMe: true, from: 'chats' });
        }}>
          <View style={{flexDirection: 'row', height: 70, alignItems: 'center', backgroundColor: '#E9E9EE'}}>
            <Image source={{uri: this.props.maven.userID.displayPicture}} style={{width: 50, height: 50, marginHorizontal: 10, borderRadius: 18, borderWidth: 2, borderColor: 'white'}}/>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{flex: 1, fontSize: 20, marginTop: 10}}>{this.props.maven.userID.firstName + ' ' + this.props.maven.userID.lastName}</Text>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex: 1, fontSize: 16}}>{this.props.maven.title}</Text>
                <Text style={{flex: 1, fontSize: 16, marginLeft: 10}}>${this.props.maven.price}</Text>
              </View>
            </View>
            <Icon name="ios-arrow-forward" style={{ fontSize: 25, color: '#90939B', marginHorizontal: 10}} />
          </View>
        </TouchableOpacity>
      }
      {
        this.state.requestLoading?this.renderPlaceholder():null
      }
      {
        this.state.isMavenUser?
          this.state.data.length === 0?
          <View style={{height: SCREEN_HEIGHT, backgroundColor: '#fff', alignItems: 'center'}}>
            <Image style={styles.emptyImage} source={require('../../../assets/icons/coffee.png')}/>
            <Text style={styles.emptyText}>Relax~ Have a coffee while your requests are coming in!</Text>
          </View>
          :
          <Container>
            <Content refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
              {
                this.state.data.map((provider) => {
                  return (
                    <ActivityItem key={provider._id} provider={provider}/>
                  );
                })}
            </Content>
          </Container>
        :
        <View style={{height: SCREEN_HEIGHT, backgroundColor: '#fff', alignItems: 'center'}}>
          <Image style={styles.emptyImage} source={require('../../../assets/icons/money_pig.png')}/>
          <Text style={styles.emptyText}>Don't worry! Start earning money now~</Text>
          <TouchableOpacity onPress={() => {
            Actions.skillList();
          }}>
            <Text style={{color: '#479EE2', fontSize: 22, marginTop: 20}}>Register me now!</Text>
          </TouchableOpacity>
        </View>
      }
      </View>
    );
  }
}

const styles = {
  emptyImage: {
    marginTop: 120
  },
  emptyText: {
    width: '70%', fontSize: 20, marginTop: 30, color: '#7F7F7F', textAlign: 'center'
  },
};

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  activity: state.activity,
});
const mapDispatchToProps = (dispatch) =>({
  getActivities: (mode, token) => dispatch(actions.getActivities(mode, token)),
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  checkId: (token) => dispatch(actions.checkId(token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MySkills);
