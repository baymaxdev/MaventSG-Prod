import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Animated, RefreshControl } from 'react-native';
import {ImagePicker} from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import {Actions} from 'react-native-router-flux';
import {Container, Content, Icon, Form} from 'native-base';
import Placeholder from 'rn-placeholder';
import ReadMore from '@expo/react-native-read-more-text';
import SegmentedControlTab from 'react-native-segmented-control-tab'

const SCREEN_WIDTH = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');
const HORIZONTAL_PADDING = 8;

class ReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      requestLoading: true,
      refreshing: false,
      selectedIndex: 0,
    }
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.maven !== undefined) {
      this.setState({ data: nextProps.maven.maven.reviews, requestLoading: false, refreshing: false });
    } else {
      this.setState({requestLoading: false, refreshing: false});
    }
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
      <Text style={{color: '#f69021', fontSize: 16, marginTop: 5}} onPress={handlePress}>
        Show More
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: '#f69021', fontSize: 16, marginTop: 5}} onPress={handlePress}>
        Less
      </Text>
    );
  }

  _handleTextReady = () => {
  }

  renderItem(item, index) {
    return (
      <View style = {{ borderWidth: 1, borderRadius: 8, borderColor: '#c9c9c9', marginBottom: 13}}>
        <View style = {{flexDirection: "row", justifyContent: 'space-between', padding: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source = {item.userID.displayPicture?{uri: item.userID.displayPicture}:require('../../../assets/images/avatar.png')} style = {{ width: 55, height: 55, borderRadius: 17 }}/>
            <View style = {{paddingHorizontal: 10}} >
              <Text style = {styles.nameText} >{item.userID.firstName + ' ' + item.userID.lastName}</Text>
              <View style={{ height: 5 }}></View>
              <Text style ={{ color: '#a4a4a4', fontSize: 14}} >{this.getStringFromDate(item.createdDate)}</Text>
            </View>
          </View>
        </View>
        <View style = {{ paddingBottom: 5, paddingHorizontal: 10}}>
          {
            item.text &&
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
              <Text style ={{ color: '#ababab', fontSize: 15, paddingHorizontal: 10}}>{item.text}</Text>
            </ReadMore>
          }
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
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });
  }

  render() {
    return (
      <View style={styles.container}>
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
        {
          this.state.data.map((item, index)=>{
            return <View key={index}>
              {this.renderItem(item, index)}
              </View>
          })
        }
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
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewPage);