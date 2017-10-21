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
import {Actions} from 'react-native-router-flux';
import {Icon, Container, Content} from 'native-base';
import Search from 'react-native-search-box';
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
      data,
      isLike: false,
      likeList:[],
    }
  }

  componentDidMount() {
    let temp = [];
    data.map((item, index)=>{
      temp.push(false);
    })
    this.setState({ likeList: temp })   
  }
  
  renderItem(item, index) {
    return (
          <View>
            <View style = {{flexDirection: "row", padding: 10}}>
              <Image source = {item.pic} style = {{ width: 50, height: 50, borderRadius: 25 }}/>
              <View style = {{paddingHorizontal: 10, flex:1}} >
                <View style = {{ backgroundColor: '#ececec', padding: 10, borderRadius: 20 }}>
                  <Text style = {{fontSize:15}} >{item.name}</Text>
                  <Text style={{paddingVertical: 5}} >{item.content}</Text>
                </View>
                <View style = {{ flexDirection: 'row', padding: 10}}>
                  <Text style={{color: '#b5b5b5'}} >{item.day}</Text>
                  <View style = {{ flexDirection: 'row', paddingHorizontal: 15 }}>
                    <TouchableOpacity onPress={(e)=>this.onLikeList(index)} >
                      <Icon style={{ fontSize:17, color: '#515151' }} name = {this.state.likeList[index]?'ios-heart':'ios-heart-outline'} />
                    </TouchableOpacity>
                     <Text style ={{ color: '#515151', paddingHorizontal: 5}} >Like</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
    );
  }

  onclickLike = () => {
    this.setState((prev)=>({ isLike: !prev.isLike}));
  }

  onLikeList = (index) =>{
    let temp = this.state.likeList;
    temp[index] = !temp[index];
    let tempData = this.state.data;
    tempData[index].likes = temp[index] ? tempData[index].likes + 1 : tempData[index].likes - 1
    this.setState({likeList: temp, data: tempData});
  }

  render() {
    return (
      <KeyboardAvoidingView behavior = 'padding' style ={{ flex: 1}} contentContainerStyle = {{flex: 1}} >
        <Container style = {{ marginBottom: 5, backgroundColor: '#fff'}}>
          <Content>
            <ScrollView>
              <View style = {{flexDirection: "row", alignItems: 'center', padding: 20, paddingBottom: 0}}>
                <Image source = {this.props.data.pic} style = {{ width: 60, height: 60, borderRadius: 30 }}/>
                <View style = {{paddingHorizontal: 10, justifyContent: 'space-between', height: 40}} >
                  <Text style = {{fontSize:16}} >{this.props.data.name}</Text>
                  <Text style = {{color: '#515151', fontSize:12}}>{this.props.data.day}</Text>
                </View>
              </View>
              <View style = {{ paddingVertical: 10, paddingHorizontal: 20}}>
                <Text style = {{ fontSize:18 }}>
                  {this.props.data.topic}
                </Text>
              </View>
              <View style = {{ padding: 10}}>
                <View style = {{paddingVertical:10, paddingHorizontal:20, flexDirection: 'row', alignItems:'center', borderColor: '#ececec', borderBottomWidth: 1, borderTopWidth: 1 }}>
                  <TouchableOpacity onPress={(e)=>this.onclickLike()} >
                    <Icon style={{ fontSize:27, color: '#515151', marginTop: 2 }} name = {this.state.isLike?'ios-thumbs-up':'ios-thumbs-up-outline'} />
                  </TouchableOpacity>
                  <Text style ={{ color: '#515151', fontSize: 17, paddingHorizontal: 10}} >Like</Text>
                </View>
              </View>
              
            {
              this.state.data.map((item, index)=>{
                return <View key={index}>
                  {this.renderItem(item, index)}
                  </View>
              })
            }
            
            <View style = {{flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal:10, borderColor: '#b5b5b5'}}>
              <TextInput returnKeyType="next" multiline={true} placeholder = "Write a comments..." style = {{ fontSize:15, flex: 1, height:50 }}/>
              <TouchableOpacity onPress = {(e)=>{}}>
                <Icon name = "ios-happy-outline" style={{ color: '#b5b5b5' }}/>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Content>
        </Container>
      </KeyboardAvoidingView>
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

export default CommentsPage;
