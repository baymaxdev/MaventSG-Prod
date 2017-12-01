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
import Modal from 'react-native-modal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class RequestedSkills extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      requestLoading: true,
      refreshing: false,
      successModalVisible: false,
    };
  }
  // This is to remove fb token for retry purposes
  componentWillMount() {
    this.refreshItem();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.activity.activityLoading !== nextProps.activity.activityLoading && !nextProps.activity.activityLoading && nextProps.activity.activitySuccess) {
      if (Actions.currentScene === '_RequestedSkills') {
        this.refreshItem();
        if (nextProps.activity.showSuccessModal === true) {
          setTimeout(() => {
            this.setState({successModalVisible: true}, () => {
              setTimeout(() => {
                this.setState({successModalVisible: false});
              }, 1000);
            });
          }, 500);
        }
      }
    }
    
  }

  refreshItem() {
    this.props.getActivities(1, this.props.auth.token, (activities) => {
      let data = activities;
      var temp = [];
      for (var i = 0; i < data.length; i++) {
        temp.push(data[i].mavenID._id + '-' + data[i].userID._id + '-' + data[i]._id);
      }

      Firebase.initialize();
      Firebase.getLastMessages(temp, (messages) => {
        for (i = 0; i < data.length; i++) {
          data[i].lastMessage = messages[i];
        }
        this.setState({data: data, requestLoading: false, refreshing: false});
      });
    });
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
    this.refreshItem();
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {
          this.state.requestLoading?this.renderPlaceholder():null
        }
        {
          <Container>
            <Content refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            {
              this.state.data.length === 0?
              <View style={{height: SCREEN_HEIGHT, backgroundColor: '#fff', alignItems: 'center'}}>
                <Image style={styles.emptyImage} source={require('../../../assets/icons/req_skill.png')}/>
                <Text style={styles.emptyText}>You have not requested any job from our mavens!</Text>
                <TouchableOpacity onPress={() => {
                  Actions.popTo('_categoryView');
                }}>
                  <Text style={{color: '#479EE2', fontSize: 22, marginTop: 20}}>Start hiring now!</Text>
                </TouchableOpacity>
              </View>
              :
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
            }
            </Content>
          </Container>
        }
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
  activity: state.activity,
});
const mapDispatchToProps = (dispatch) =>({
  getActivities: (mode, token, next) => dispatch(actions.getActivities(mode, token, next)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestedSkills);
