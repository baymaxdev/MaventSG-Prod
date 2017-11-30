import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Animated, RefreshControl, FlatList } from 'react-native';
import {ImagePicker} from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import {Actions} from 'react-native-router-flux';
import {Container, Content, Icon, Form} from 'native-base';
import Placeholder from 'rn-placeholder';
import ReadMore from '@expo/react-native-read-more-text';
import SegmentedControlTab from 'react-native-segmented-control-tab';

const SCREEN_WIDTH = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');
const HORIZONTAL_PADDING = 8;

class AllReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      requestLoading: true,
      refreshing: false,
      selectedIndex: 0,
      mavenReviews: [],
      consumerReviews: [],
    }
  }

  componentDidMount() {
    this.initialize();
  }

  initialize() {
    if (this.props.userId) {
      this.props.getProfileInfo(this.props.auth.token, this.props.userId);
    } else {
      this.props.getMyProfileInfo(this.props.auth.token);
    }
  }

  componentWillReceiveProps(nextProps) {
    var mavenReviews = [];
    var consumerReviews = [];

    if (this.props.userId) {
      mavenReviews = nextProps.profile.user.mavenReviews;
      consumerReviews = nextProps.profile.user.consumerReviews;
    } else {
      mavenReviews = this.props.profile.myInfo.mavenReviews;
      consumerReviews = this.props.profile.myInfo.consumerReviews;
    }

    for (var i = 0; i < mavenReviews.length; i++) {
      mavenReviews[i].asWhat = 'As Maven';
    }

    for (i = 0; i < consumerReviews.length; i++) {
      consumerReviews[i].asWhat = 'As User';
    }

    this.setState({ mavenReviews: mavenReviews, consumerReviews: consumerReviews, requestLoading: false, refreshing: false });
  }

  getStringFromDate(date) {
    let createdDate = new Date(date);
    let currentDate = new Date();
    let diffMin = (currentDate - createdDate) / 1000 / 60;
    var date = '';
    if (diffMin < 60) {
      date = Math.floor(diffMin) + ' minute';
    } else if ((diffMin / 60) < 24) {
      date = Math.floor(diffMin / 60) + ' hour';
    } else {
      let diffYear = currentDate.getUTCFullYear() - createdDate.getUTCFullYear();
      let diffMon = currentDate.getUTCMonth() - createdDate.getUTCMonth();
      let diffDay = currentDate.getUTCDate() - createdDate.getUTCDate();

      if (diffMon == 0) {
        if (diffYear > 0) {
          if (diffDay < 0) {
            date = '11 month';
          } else {
            date = '1 year';
          }
        } else {
          date = Math.floor(diffMin / 60 / 24) + ' day';
        }
      } else if (diffMon == 1) {
        if (diffYear > 0) {
          date = diffYear + ' year';
        } else {
          if (diffDay < 0) {
            date = Math.floor(diffMin / 60 / 24) + ' day';
          } else {
            date = diffMon + ' month';
          }
        }
      } else if (diffMon > 1) {
        if (diffYear > 0) {
          date = diffYear + ' year';
        } else {
          if (diffDay < 0) {
            date = (diffMon - 1) + ' month';
          } else {
            date = diffMon + ' month';
          }
        }
      } else {
        if (diffYear == 1) {
          if (diffDay < 0) {
            date = (12 + diffMon - 1) + ' month';
          } else {
            date = (12 + diffMon) + ' month';
          }
        } else {
          date = (diffYear - 1) + ' year';
        }
      }
    }
    if (date[0] == '1' && date[1] == ' ') {
      date += ' ago';
    } else {
      date += 's ago';
    }
    return date;
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: '#f69021', marginTop: 5}} onPress={handlePress}>
        Show More
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: '#f69021', marginTop: 5}} onPress={handlePress}>
        Less
      </Text>
    );
  }

  _handleTextReady = () => {
  }

  renderItem(item, index) {
    return (
      <View style = {{padding: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Image source = {item.reviewUserID.displayPicture?{uri: item.reviewUserID.displayPicture}:require('../../../assets/images/avatar.png')} style = {{ width: 55, height: 55, borderRadius: 17 }}/>
          <View style = {{ flexDirection: "column", paddingBottom: 5, paddingHorizontal: 10 }}>
            <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
              <Text style = {{color: '#AF362D'}}>
                {item.reviewUserID.firstName + ' ' + item.reviewUserID.lastName + ' '}
                <Text style={{color: 'black'}}>
                  {item.description}
                </Text>
              </Text>
            </ReadMore>
            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="ios-time-outline" style={{ color:'#a4a4a4', marginRight: 3, fontSize: 14 }}/>
              <Text style ={{ color: '#a4a4a4', fontSize: 14, marginRight: 5}} >{this.getStringFromDate(item.createdDate)}</Text>
              <Text>
                {item.asWhat}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderPlaceholder() {
    var ret = [];
    for (var i = 0; i < 10; i++) {
        ret.push(
            <View key={i} style={{padding:20, height: 75}}>
                <Placeholder.ImageContent
                    onReady={false}
                    lineNumber={3}
                    animate="shine"
                    lastLineWidth="40%"
                    >
                </Placeholder.ImageContent>
            </View>
        );
    }
    return ret;
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.initialize();
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%'
        }}
      />
    );
  };

  render() {
    var data = [];
    if (this.props.from === 'skillpage') {
      data = this.state.mavenReviews;
    } else if (this.state.selectedIndex === 0) {
      data = this.state.mavenReviews.concat(this.state.consumerReviews);
    } else if (this.state.selectedIndex === 1) {
      data = this.state.mavenReviews;
    } else {
      data = this.state.consumerReviews;
    }

    if (data.length !== 0) {
      data.sort(function(a, b) {
        da = new Date(a.createdDate);
        db = new Date(b.createdDate);
        return db.getTime() - da.getTime();
      });
    }

    return (
      <View style={styles.container}>
      {
        this.props.from !== 'skillpage' &&
        <View style={{paddingHorizontal: 50, paddingVertical: 10, justifyContent: 'center', alignItems: 'center'}}>
          <SegmentedControlTab
            values={['All', 'All Maven', 'All User']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            activeTabStyle={{backgroundColor: '#0B486B'}}
            activeTabTextStyle={{color: '#fff'}}
            tabStyle={{borderColor: '#0B486B'}}
            tabTextStyle={{color: '#0B486B'}}
            />
        </View>
      }
        <Container>
          {
              this.state.requestLoading?this.renderPlaceholder():null
          }
          <Content padder style = {{backgroundColor: '#fff'}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />}>
            <FlatList
              data={data}
              renderItem={ ({item, index}) => this.renderItem(item, index)}
              keyExtractor={item => item._id}
              ItemSeparatorComponent={this.renderSeparator}
              >
            </FlatList>
          </Content>
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
});
const mapDispatchToProps = (dispatch) =>({
  getProfileInfo: (token, userId) => dispatch(actions.getProfileInfo(token, userId)),
  getMyProfileInfo: (token) => dispatch(actions.getMyProfileInfo(token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllReviewPage);