import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image,
     TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Animated } from 'react-native';
import {ImagePicker} from 'expo';
import {Actions} from 'react-native-router-flux';
import {Container, Content, Icon, Form} from 'native-base';
import Search from 'react-native-search-box';
import PickerModal from '../../components/picker';

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
      moreList: [],
      reportList: [],
      data: data,
      modalVisible: false,
      modalID: 1,
      postModal: false,
      angle: new Animated.Value(0),
      showPicker:false,
      offSet: new Animated.Value(height),
    }
  }

  setModalVisible = (visible, modalID) => {
    this.setState({modalVisible: visible, modalID: modalID})
  }

  componentDidMount() {
    Actions.refresh({rightButtonImage: require('../../../assets/icons/more.png'), rightButtonIconStyle: { width: 20, height:20}, onRight: ()=>{this.setModalVisible(true, 1)}})
    let temp = [];
    let tempMore = [];
    let tempReport = [];
    data.map((item, index)=>{
      temp.push(false);
      tempMore.push(false);
      tempReport.push(false);
    })
    this.setState({ likeList: temp, moreList: tempMore, reportList: tempReport });
  }

  navigate = (data) => {
    Actions.commentsPage({data:data});
  }

  onclickMore = (index) =>{
    let list = this.state.moreList;
    list[index] = !list[index];
    this.setState({moreList: list});
  }

  onclickReport = (index) =>{
    let list = this.state.reportList;
    list[index] = !list[index];
    this.setState({reportList: list});
  }

  onclickLike = (index) =>{
    let temp = this.state.likeList;
    temp[index] = !temp[index];
    let tempData = this.state.data;
    tempData[index].likes = temp[index] ? tempData[index].likes + 1 : tempData[index].likes - 1
    this.setState({likeList: temp, data: tempData});
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

  renderItem(item, index) {
    return (
      <View style = {{ borderWidth: 1, borderRadius: 8, borderColor: '#c9c9c9', marginBottom: 13}}>
        <View style = {{flexDirection: "row", justifyContent: 'space-between', padding: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source = {item.pic} style = {{ width: 55, height: 55, borderRadius: 17 }}/>
            <View style = {{paddingHorizontal: 10}} >
              <Text style = {styles.nameText} >{item.name}</Text>
              <View style={{ height: 5 }}></View>
              <Text style ={{ color: '#a4a4a4', fontSize: 14}} >{item.day}</Text>
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
        <View style = {{ paddingBottom: 5}}>
          {
            item.topic &&
            <Text style ={{ color: '#ababab', fontSize: 15, paddingHorizontal: 10}} numberOfLines = {this.state.moreList[index] ? null : 3} >{item.topic}</Text>
          }
          {
            item.image &&
              <View>
                <Text style = {[styles.nameText, {paddingHorizontal: 10}]}>
                  {item.name}
                  <Text style = {{ color: '#ababab', fontSize: 15}}> added a new photo.</Text>
                </Text>
                <Image source = {item.image} style ={{ marginTop: 10,  width: '100%', height: 200}}/>
              </View>
          }
        </View>
        <TouchableOpacity style={{paddingHorizontal: 10, paddingBottom: 5}} onPress={(e)=>this.onclickMore(index)}>
          <Text style = {{ color: '#f69021', fontSize: 16}} >{ this.state.moreList[index] ? "Less" : "See More"}</Text>
        </TouchableOpacity>
        <View style = {{ flexDirection: 'row', alignItems:'center', paddingHorizontal: 10, paddingBottom: 5}}>
          <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} >
            <TouchableOpacity onPress={(e)=>this.onclickLike(index)} >
              <Icon style={{ fontSize:30, marginTop: 3, color: this.state.likeList[index]?'#f69021':'#515151' }} name = {this.state.likeList[index]?'ios-heart':'ios-heart-outline'} />
            </TouchableOpacity>
            <Text style = {{ color: '#a4a4a4', paddingLeft: 5}}>{item.likes}</Text>
          </View>
          <View style = {{ marginLeft: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} >
            <TouchableOpacity onPress={(e)=>this.navigate(item)} >
              <Icon style={{ fontSize:30, marginTop: 3, color: '#515151' }} name = {'ios-chatbubbles-outline'} />
            </TouchableOpacity>
            <Text style = {{ color: '#a4a4a4', paddingLeft: 5}}>{item.comments}</Text>
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

  render() {
    const spin = this.state.angle.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-135deg']
    })
    return (
      <Container>
        <Modal transparent={true} visible={this.state.modalVisible} onRequestClose={() => null} >
          { this.state.modalID === 1 &&
          <TouchableOpacity style={styles.navModal} onPressOut={() => {this.setModalVisible(false)}}>
            <View style={styles.innerNavModal}>
              <TouchableOpacity>
                <Text style={{color: '#fff'}}>Recent</Text>
              </TouchableOpacity>
              <TouchableOpacity>
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
        <Content padder style = {{backgroundColor: '#fff'}}>
       {
         this.state.data.map((item, index)=>{
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

export default TopicPage;
