import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import {Actions} from 'react-native-router-flux';
import {Icon, Container, Content} from 'native-base';
import Search from 'react-native-search-box';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Placeholder from 'rn-placeholder';
import { AutoGrowTextInput } from 'react-native-auto-grow-textinput';

const SCREEN_WIDTH = Dimensions
  .get('window')
  .width;
const {width, height} = Dimensions.get('window');
const HORIZONTAL_PADDING = 8;
const data = [{pic: require('../../../assets/images/profile.png'), name: 'Laura Lee', day: '4d ago', comments: 1, likes:14,
              content: 'I am a dedicated person. I enjoy reading, and the knowledge and perspective that my reading gives me has strengthened my teaching skills' },
              {pic: require('../../../assets/images/profile.png'), name: 'John David', day: '4d ago', comments: 1, likes:14,
              content: 'I am a dedicated person. I enjoy reading, and the knowledge and perspective that my reading gives me has strengthened my teaching skills' },
              {pic: require('../../../assets/images/profile.png'), name: 'Eric Lou', day: '4d ago', comments: 1, likes:14,
              content: 'I am a dedicated person. I enjoy reading, and the knowledge and perspective that my reading gives me has strengthened my teaching skills' },
            ]
class CommentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      topic: {},
      commentText: '',
      requestLoading: true,
    }
  }

  componentWillMount() {
    this.props.getComments(this.props.data.topicID, this.props.auth.token);
    this.setState({topic: this.props.data});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({comments: nextProps.topic.comments, requestLoading: false, commentText: ''});
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

  renderItem(item, index) {
    return (
      <View>
        <View style = {{flexDirection: "row", padding: 5}}>
          <Image source = {item.userID.displayPicture?{uri: item.userID.displayPicture}:require('../../../assets/images/avatar.png')} style = {{ width: 50, height: 50, borderRadius: 25 }}/>
          <View style = {{paddingHorizontal: 10, flex:1}} >
            <View style = {{ backgroundColor: '#ececec', padding: 8, borderRadius: 20 }}>
              <Text style = {{fontSize:14, fontWeight: '600'}} >{item.userID.firstName + ' ' + item.userID.lastName}</Text>
              <Text selectable style={{paddingVertical: 5 }} >{item.text}</Text>
            </View>
            <View style = {{ flexDirection: 'row', padding: 5}}>
              <Text style={{color: '#b5b5b5'}} >{this.getStringFromDate(item.createdDate)}</Text>
              <View style = {{ flexDirection: 'row', paddingHorizontal: 10 }}>
                <TouchableOpacity onPress={(e)=>this.onLikeList(index)} >
                  <Icon style={{ fontSize:17, color: '#515151' }} name = {item.liked?'ios-heart':'ios-heart-outline'} />
                </TouchableOpacity>
                  <Text style ={{ color: '#515151', paddingHorizontal: 5}} >{item.heart}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  onclickLike = () => {
    this.props.setLike(this.state.topic.topicID, 0, this.props.auth.token);
    let temp = this.state.topic;
    temp.liked = !temp.liked;
    temp.heart = temp.liked ? temp.heart + 1 : temp.heart - 1;
    this.setState({topic: temp});
  }

  onLikeList = (index) =>{
    this.props.setLike(this.state.comments[index].commentID, 1, this.props.auth.token);
    let temp = this.state.comments;
    temp[index].liked = !temp[index].liked;
    temp[index].heart = temp[index].liked ? temp[index].heart + 1 : temp[index].heart - 1;
    this.setState({comments: temp});
  }

  renderPlaceholder() {
    var ret = [];
    for (var i = 0; i < 5; i++) {
        ret.push(
            <View key={i} style={{padding:20, height: 75}}>
                <Placeholder.ImageContent
                    onReady={false}
                    lineNumber={2}
                    animate="shine"
                    lastLineWidth="70%"
                    >
                </Placeholder.ImageContent>
            </View>
        );
    }
    return ret;
  }

  render() {
    return (
      <KeyboardAwareScrollView behavior = 'padding' style ={{ flex: 1}} contentContainerStyle = {{flex: 1}} scrollEnabled={false} keyboardShouldPersistTaps={true}>
        <Container style = {{ backgroundColor: '#fff' }}>
          <Content>
            <ScrollView>
              <View style = {{flexDirection: "row", alignItems: 'center', padding: 20, paddingBottom: 0}}>
                <Image source = {this.state.topic.userID.displayPicture?{uri: this.state.topic.userID.displayPicture}:require('../../../assets/images/avatar.png')} style = {{ width: 60, height: 60, borderRadius: 30 }}/>
                <View style = {{paddingHorizontal: 10, justifyContent: 'space-between', height: 35}} >
                  <Text style = {{fontSize:16, fontWeight: '600'}} >{this.state.topic.userID.firstName + ' ' + this.state.topic.userID.lastName}</Text>
                  <Text style = {{color: '#515151', fontSize:12}}>{this.getStringFromDate(this.state.topic.createdDate)}</Text>
                </View>
              </View>
              <View style = {{ paddingVertical: 10, paddingHorizontal: 20}}>
                <Text style = {{ fontSize:16 }}>
                  {this.state.topic.text}
                </Text>
              </View>
              <View style = {{ padding: 10}}>
                <View style = {{paddingVertical:10, paddingHorizontal:20, flexDirection: 'row', alignItems:'center', borderColor: '#ececec', borderBottomWidth: 1, borderTopWidth: 1 }}>
                  <TouchableOpacity onPress={(e)=>this.onclickLike()} >
                    <Icon style={{ fontSize:27, color: '#515151', marginTop: 2 }} name = {this.state.topic.liked?'ios-heart':'ios-heart-outline'} />
                  </TouchableOpacity>
                  <Text style ={{ color: '#515151', fontSize: 17, paddingHorizontal: 10}} >{this.state.topic.heart}</Text>
                </View>
              </View>
              {
                this.state.requestLoading
                ?
                this.renderPlaceholder()
                :
                this.state.comments.map((item, index)=>{
                  return <View key={index}>
                    {this.renderItem(item, index)}
                    </View>
                })
              }
            </ScrollView>
          </Content>
        </Container>
        <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, paddingHorizontal: 10, borderColor: '#b5b5b5', backgroundColor: '#fff', height: "9%"}}>
          <AutoGrowTextInput
            returnKeyType="next"
            placeholder='Write a comment...'
            onChangeText={(text) => {this.setState({commentText: text})}}
            value={this.state.commentText}
            maxHeight={ 50 }
            style={{ width: "85%", fontSize:15, backgroundColor: 'pink', borderRadius:50, borderWidth: 1, borderColor: '#b5b5b5', backgroundColor: '#f0f0f0', paddingHorizontal: 10}} />
          <TouchableOpacity onPress = {(e)=>{
            if (this.state.commentText !== '') {
              this.setState({requestLoading: true});
              this.props.addComment(this.state.topic.topicID, this.state.commentText, this.props.auth.token, () => {
                this.props.getComments(this.props.data.topicID, this.props.auth.token);
              });
            }
          }}>
            <Text style={{color: '#0080FF', fontSize: 18, fontWeight: 'bold'}}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  commentText: {
    color: '#515151'
  }
});

const mapStateToProps = (state) =>({
  auth: state.auth,
  topic: state.topic,
});
const mapDispatchToProps = (dispatch) =>({
  getComments: (topicId, token) => dispatch(actions.getComments(topicId, token)),
  addComment: (topicId, text, token, next) => dispatch(actions.addComment(topicId, text, token, next)),
  setLike: (id, type, token) => dispatch(actions.setLike(id, type, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsPage);
