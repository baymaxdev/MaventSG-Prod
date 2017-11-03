import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Animated, RefreshControl } from 'react-native';
import {ImagePicker} from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import {Actions} from 'react-native-router-flux';
import {Container, Content, Icon, Form} from 'native-base';
import Search from 'react-native-search-box';
import PickerModal from '../../components/picker';
import Placeholder from 'rn-placeholder';
import ReadMore from '@expo/react-native-read-more-text';

const SCREEN_WIDTH = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');
const HORIZONTAL_PADDING = 8;
const data = [{pic: require('../../../assets/images/user1.jpg'), name: 'Sunny Lee', day: 'a moment ago', comments: 589, likes:168,
              topic: 'Anyone knows what to look out for when it comes to hiring a freelancer?' },

              {pic: require('../../../assets/images/profile.png'), name: 'Christina Toh', day: '3h ago', comments: 888, likes:1688,
              image: require('../../../assets/images/Announcement_banner.jpg')},

              {pic: require('../../../assets/images/user2.jpg'), name: 'Keeva Sharma', day: '4h ago', comments: 534, likes:765,
              topic: 'How do you value your hourly rate?' },

              {pic: require('../../../assets/images/user3.jpg'), name: 'Shankar Sharma', day: '3h ago', comments: 888, likes:1688,
              image: require('../../../assets/images/CarouselView/Image2-1.jpg')},

              {pic: require('../../../assets/images/user4.jpg'), name: 'Sandy Lou', day: '1d ago', comments: 534, likes:765,
              topic: 'SCAMMER ALERT!' },

            ]
const pickerData = Platform.OS==="android"?['Please Select...','Take photo...','Choose from Library...']:['Take photo...','Choose from Library...'];

class TopicPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeList:[],
      reportList: [],
      data: [],
      modalVisible: false,
      modalID: 1,
      postModal: false,
      angle: new Animated.Value(0),
      showPicker:false,
      offSet: new Animated.Value(height),
      requestLoading: true,
      refreshing: false,
      sortBy: 0,
    }
  }

  setModalVisible = (visible, modalID) => {
    this.setState({modalVisible: visible, modalID: modalID})
  }

  componentDidMount() {
    Actions.refresh({rightButtonImage: require('../../../assets/icons/more.png'), rightButtonIconStyle: { width: 20, height:20}, onRight: ()=>{this.setModalVisible(true, 1)}})
    // let tempReport = [];
    // data.map((item, index)=>{
    //   tempReport.push(false);
    // })
    // this.setState({ reportList: tempReport });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.topic.topics, requestLoading: false, refreshing: false });
  }

  navigateToComments = (data) => {
    Actions.commentsPage({data:data});
  }

  onclickReport = (index) =>{
    let list = this.state.reportList;
    list[index] = !list[index];
    this.setState({reportList: list});
  }

  onclickLike = (index) =>{
    this.props.setLike(this.state.data[index].topicID, 0, this.props.auth.token);
    let temp = this.state.data;
    temp[index].liked = !temp[index].liked;
    temp[index].heart = temp[index].liked ? temp[index].heart + 1 : temp[index].heart - 1;
    this.setState({data: temp});
  }

  onClickAdd = () => {
    if(this.state.postModal){
      Animated.timing(
        this.state.angle,
        {
          toValue: 0,
          duration: 300
        }
      ).start();
    }
    else{
      Animated.timing(
        this.state.angle,
        {
          toValue: 1,
          duration: 300
        }
      ).start();
    }
    this.setState((prev) => ({postModal: !prev.postModal}))
  }

  getDateString(date) {
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
    console.log(item);
    return (
      <View style = {{ borderWidth: 1, borderRadius: 8, borderColor: '#c9c9c9', marginBottom: 13}}>
        <View style = {{flexDirection: "row", justifyContent: 'space-between', padding: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source = {item.userID.displayPicture?{uri: item.userID.displayPicture}:require('../../../assets/images/avatar.png')} style = {{ width: 55, height: 55, borderRadius: 17 }}/>
            <View style = {{paddingHorizontal: 10}} >
              <Text style = {styles.nameText} >{item.userID.firstName + ' ' + item.userID.lastName}</Text>
              <View style={{ height: 5 }}></View>
              <Text style ={{ color: '#a4a4a4', fontSize: 14}} >{this.getDateString(item.createdDate)}</Text>
            </View>
          </View>
          <TouchableOpacity style={{paddingTop: 5, paddingRight: 5 }} onPress={() => {this.onclickReport(index)}}>
            <Image source = {require('../../../assets/icons/arrow-down.png')} />
          </TouchableOpacity>
        </View>
        { this.state.reportList[index] &&
            <TouchableOpacity style={[styles.innerPostModal, {position: 'absolute', right: 10, top: 38, width: null}]}>
              <Icon name={'ios-alert-outline'} style={{fontSize: 17, color: 'white' }} />
              <Text style={{fontSize: 15, paddingLeft: 5, color: 'white'}}>Report Post</Text>
            </TouchableOpacity>
          }
        <View style = {{ paddingBottom: 5, paddingHorizontal: 10}}>
          {
            item.text &&
            <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
              <Text style ={{ color: '#ababab', fontSize: 15, paddingHorizontal: 10}}>{item.text}</Text>
            </ReadMore>
          }
          {
            item.image &&
              <View>
                <Text style = {[styles.nameText, {paddingHorizontal: 10}]}>
                  {item.userID.firstName + ' ' + item.userID.lastName}
                  <Text style = {{ color: '#ababab', fontSize: 15}}> added a new photo.</Text>
                </Text>
                <Image source = {{uri: item.image}} style ={{ marginTop: 10,  width: '100%', height: 200}}/>
              </View>
          }
        </View>
        <View style = {{ flexDirection: 'row', alignItems:'center', paddingHorizontal: 10, paddingBottom: 5}}>
          <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} >
            <TouchableOpacity onPress={(e)=>this.onclickLike(index)} >
              <Icon style={{ fontSize:30, marginTop: 3, color: item.liked?'#f69021':'#515151' }} name = {item.liked?'ios-heart':'ios-heart-outline'} />
            </TouchableOpacity>
            <Text style = {{ color: '#a4a4a4', paddingLeft: 5}}>{item.heart}</Text>
          </View>
          <View style = {{ marginLeft: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} >
            <TouchableOpacity onPress={(e)=>this.navigateToComments(item)} >
              <Icon style={{ fontSize:30, marginTop: 3, color: '#515151' }} name = {'ios-chatbubbles-outline'} />
            </TouchableOpacity>
            <Text style = {{ color: '#a4a4a4', paddingLeft: 5}}>{item.commentsCount}</Text>
          </View>
        </View>
      </View>
    );
  }

  onclickCamera = () => {
    this.setModalVisible(true, 3);
  }

  onclickText = () => {
    this.setModalVisible(true, 4);
  }

  onUploadImage = () => {
    this.setState({ showPicker: true });
  }

  onCancel = () => {
    this.setState({modalVisible: false, picUrl: null});
  }

  onPost = () => {
    this.setState({modalVisible: false, picUrl: null});
  }

  changeValue = (value) => {
    if(Platform.OS==="android"){
      if(value === 1) this.takePhoto();
      else if(value === 2) this._openCameraRoll();
    }
    else{
      if(value === 0) this.takePhoto();
      else if(value === 1) this._openCameraRoll();
    }
  }

  _openCameraRoll = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({allowsEditing:true, aspect:[4,3]});
    if(!image.cancelled) {
      this.setState({picUrl: {uri: image.uri}});
    }
  }

  takePhoto = async () => {
      let image = await ImagePicker.launchCameraAsync({allowsEditing:true, aspect:[4,3]});
      if(!image.cancelled) {
        this.setState({picUrl: {uri: image.uri}});
      }
  }

  renderPlaceholder() {
    var ret = [];
    for (var i = 0; i < 5; i++) {
        ret.push(
            <View key={i} style={{padding:20, height: 150}}>
                <Placeholder.ImageContent
                    onReady={false}
                    lineNumber={2}
                    animate="shine"
                    lastLineWidth="40%"
                    >
                </Placeholder.ImageContent>
                <View style={{height: 20}}/>
                <Placeholder.Paragraph
                    onReady={false}
                    lineNumber={3}
                    animate="shine"
                    lastLineWidth="70%"
                    >
                </Placeholder.Paragraph>
            </View>
        );
    }
    return ret;
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.getTopics(this.props.category, this.props.auth.token);
  }

  onSortByRecent() {
    this.setState({sortBy: 0});
    this.setModalVisible(false)
  }

  onSortByMostHearts() {
    this.setState({sortBy: 1});
    this.setModalVisible(false)
  }

  render() {
    const spin = this.state.angle.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-135deg']
    })
    var sortedData = this.state.data;
    let _this = this;
    sortedData.sort(function(a, b) {
      if (_this.state.sortBy === 0) 
        return Date(b.createdDate) - Date(a.createdDate);
      else
        return b.heart - a.heart;
    });

    return (
      <Container>
        <Modal transparent={true} visible={this.state.modalVisible} onRequestClose={() => null} >
          { this.state.modalID === 1 &&
          <TouchableOpacity style={styles.navModal} onPressOut={() => {this.setModalVisible(false)}}>
            <View style={styles.innerNavModal}>
              <TouchableOpacity onPress={() => {this.onSortByRecent()}}>
                <Text style={{color: '#fff'}}>Recent</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {this.onSortByMostHearts()}}>
                <Text style={{color: '#fff', marginTop: 5}}>Most Hearts</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          }
          { this.state.modalID === 3 &&
            <TouchableWithoutFeedback onPress = {(e)=> this.setState({modalVisible: false})} >
              <View style={styles.postModal} >
                <View style={{ marginBottom:50,  width: '90%', padding: 20, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center'}}>
                  <TextInput multiline={true} placeholder = "What's on your mind today? Share a lobang today!"
                    onChangeText={(text) => this.setState({postText: text})}
                    style = {{ width: '100%', padding: 5, fontSize:15, height:70, borderWidth: 1, borderColor: '#515151', borderRadius: 3 }}/>
                  <TouchableOpacity onPress = {(e) => this.onUploadImage()}  style = {{ marginTop: 10, height:150, width: '100%', borderWidth: 1, borderColor: '#515151', borderRadius: 3, justifyContent: 'center', alignItems: 'center' }}>
                    {
                      this.state.picUrl ?
                      <Image source = {this.state.picUrl} style = {{ width: '100%',  height: '100%' }} />
                      :
                      <Text style = {{ color: '#515151', fontSize: 17 }} >Click here to post image</Text>
                    }
                  </TouchableOpacity>
                  <View style = {{ flexDirection: 'row', width: '100%', paddingTop: 20, justifyContent: 'space-around'}}>
                    <TouchableOpacity onPress = {(e) => this.onPost()} style = {styles.postBtn} >
                      <Text style = {styles.PostBtnText}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {(e) => this.onCancel()} style = {styles.postBtn} >
                      <Text style = {styles.PostBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
                  {this.state.showPicker ? <PickerModal closeModal={() => this.setState({ showPicker: false })} data={pickerData} offSet={this.state.offSet}  changeValue={this.changeValue} /> : null}
                </View>
              </View>
            </TouchableWithoutFeedback>
          }
          { this.state.modalID === 4 &&
            <TouchableWithoutFeedback onPress = {(e)=> this.setState({modalVisible: false})} >
              <View style={styles.postModal} >
                <View style={{ width: '90%', padding: 20, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center'}}>
                  <TextInput multiline={true} placeholder = "Write a description..."
                    onChangeText={(text) => this.setState({postText: text})}
                    style = {{ width: '100%', padding: 5, fontSize:15, height:150, borderWidth: 1, borderColor: '#515151', borderRadius: 3 }}/>
                  <View style = {{ flexDirection: 'row', width: '100%', paddingTop: 20, justifyContent: 'space-around'}}>
                    <TouchableOpacity onPress = {(e) => this.onPost()} style = {styles.postBtn} >
                      <Text style = {styles.PostBtnText}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {(e) => this.onCancel()} style = {styles.postBtn} >
                      <Text style = {styles.PostBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>

          }

        </Modal>
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
         sortedData.map((item, index)=>{
           return <View key={index}>
             {this.renderItem(item, index)}
            </View>
         })
       }
       </Content>
       { this.state.postModal &&
          <View style={styles.plusModal}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
              marginBottom: 5, paddingBottom: 10, paddingRight: 5 }}>
                <Text style={styles.textStyle}>Post Image</Text>
                <TouchableOpacity onPress = {(e) => this.onclickCamera()} >
                  <Image source = {require('../../../assets/icons/camera.png')} style={{ height: 30, width: 30}} />
                </TouchableOpacity>
              </View>
              <View style={styles.alignIcons}>
                <Text style={styles.textStyle}>Post Some Text</Text>
                <TouchableOpacity onPress = {(e) => this.onclickText()}>
                  <Image source = {require('../../../assets/icons/chat.png')} style={{ height: 30, width: 30}} />
                </TouchableOpacity>
              </View>
          </View>
          }
       <TouchableOpacity onPress={(e) => this.onClickAdd()} style={{position: 'absolute', bottom: 30, right: 30}}>
          <Animated.Image source = {require('../../../assets/icons/plus.png')} style={{ transform: [{rotate: spin}], height: 50, width: 50}} />
       </TouchableOpacity>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  nameText: {color: '#656565', fontSize:17, fontWeight: '500' },
  navModal: {
    flex:1, flexDirection: 'row', justifyContent: 'flex-end',
    paddingTop: '18%', paddingHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  innerNavModal: {
    backgroundColor:'#353535', paddingHorizontal:10, paddingVertical:10,
    width:'30%', height: '10%',
    borderWidth: 1, borderRadius: 3, borderColor: '#353535'
  },
  postModal: {
    flex:1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  innerPostModal: {
    flexDirection: 'row', alignItems: 'center', paddingLeft: '5%',
    backgroundColor:'rgba(0, 0, 0, 0.8)',
    width:'100%', height: '12%',
    borderWidth: 1, borderRadius: 5, borderColor: '#ffffff',
  },
  plusModal: {
    position: 'absolute', bottom: 70, right: 30
  },
  alignIcons: {
    flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
    marginBottom: 15, paddingBottom: 10, paddingRight: 5
  },
  textStyle: {
    color: '#fff', backgroundColor: '#222222', marginRight: 10,
    height: 30, padding: 5
  },
  postBtn: {justifyContent:'center', alignItems:'center', height:40,width: 0.35 * SCREEN_WIDTH, borderRadius:5,
        backgroundColor:'#0B486B',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 1
        }
  },
  PostBtnText: { color: '#fff', fontSize: 20 }
});

const mapStateToProps = (state) =>({
  auth: state.auth,
  topic: state.topic,
});
const mapDispatchToProps = (dispatch) =>({
  getTopics: (category, token) => dispatch(actions.getTopics(category, token)),
  setLike: (id, type, token) => dispatch(actions.setLike(id, type, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);