import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Dimensions,
  Text, TextInput,
  TouchableOpacity,
  RefreshControl,
  FlatList
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

class ArchivedSkills extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      requestLoading: true,
      refreshing: false,
    };
  }
  // This is to remove fb token for retry purposes
  componentDidMount() {
    this.props.getActivities(2, this.props.auth.token);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activity.archivedSkills !== undefined) {
      let data = nextProps.activity.archivedSkills;
      var temp = [];
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

    if(this.props.activity.activityLoading !== nextProps.activity.activityLoading && !nextProps.activity.activityLoading && nextProps.activity.activitySuccess) {
      this.refreshItem();
    }

  }

  refreshItem() {
    this.props.getActivities(2, this.props.auth.token);
  }

  renderPlaceholder() {
    var ret = [];
    for (var i = 0; i < 10; i++) {
        ret.push(
            <View key={i} style={{padding:20, height: 150}}>
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
    this.props.getActivities(2, this.props.auth.token);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
      {
        this.state.requestLoading?this.renderPlaceholder():null
      }
      {
        this.state.data.length === 0?
        <View style={{height: SCREEN_HEIGHT, backgroundColor: '#fff', alignItems: 'center'}}>
          <Image style={styles.emptyImage} source={require('../../../assets/icons/archived.png')}/>
          <Text style={styles.emptyText}>You have not archive anything yet~</Text>
        </View>
        :
        <Container>
          <Content refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            <FlatList
              data={this.state.data}
              renderItem={ ({item, index}) => {
                return (
                  <ActivityItem key={item._id} provider={item}/>
                );
              }}
              keyExtractor={item => item._id}
              ItemSeparatorComponent={null}
              >
            </FlatList>
          </Content>
        </Container>
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
    width: '70%', fontSize: 18, marginTop: 30, marginLeft: 16, color: '#7F7F7F', textAlign: 'center'
  },
};

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  activity: state.activity,
});
const mapDispatchToProps = (dispatch) =>({
  getActivities: (mode, token) => dispatch(actions.getActivities(mode, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ArchivedSkills);
