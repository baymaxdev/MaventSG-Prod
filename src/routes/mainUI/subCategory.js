import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {Container, Content, Icon} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import  {createFilter} from 'react-search-input';
import Search from 'react-native-search-box';

const {width, height} = Dimensions.get('window');
const HORIZONTAL_PADDING = 8;

const predefined = {
  'service': {
    'key': ['cooking_service', 'information_service', 'improvement', 'cleaning', 'beauty', 'photography', 'art_service', 'care', 'pet', 'others_service'],
    'name': [
      ['cooking', 'cooking baking', 'baking'], 
      ['information', 'technology', 'information technology'], 
      ['home', 'improvement', 'home improvement'], 
      ['cleaning'], 
      ['beauty'], 
      ['photography', 'photograph', 'photo'], 
      ['art', 'design', 'design'], 
      ['home care', 'care'], 
      ['pet related', 'pet'], 
      ['others']
    ]
  },
  'learn': {
    'key': ['school', 'art_skill', 'information_skill', 'sports', 'music', 'cooking_skill', 'others_skill'],
    'name': [
      ['school', 'subjects', 'school subjects'], 
      ['art', 'design', 'design'], 
      ['information', 'technology', 'information technology'], 
      ['sports', 'fitness', 'sport fitness'], 
      ['music'], 
      ['cooking', 'baking', 'cooking baking'], 
      ['others']
    ]
  }
};

var key = [];
var name = [];
var mainCategory = 0;

class SubCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topicCounts: [],
      refreshing: false,
    }
  }

  componentDidMount() {
    key = predefined[this.props.kind].key;
    name = predefined[this.props.kind].name;
    mainCategory = this.props.kind==='service'?1:0;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ refreshing: false, topicCounts: nextProps.topic.topicCount });
  }

  navigate = (data) => {
    Actions.genericView({categoryId: data.id, title: data.name, query: ''});
  }

  goTopic = (data) => {
    this.props.getTopics(data.id, this.props.auth.token);
    Actions.topicPage({ title: data.name, category: data.id });
  }

  onSearch = (text) => {
    var nextKey = '';
    for (var i = 0; i < name.length; i++) {
      if (name[i].includes(text.toLowerCase())) {
        nextKey = key[i];
      }
    }

    if (nextKey !== '') {
      Actions.genericView({categoryId: nextKey, title: text, query: ''});
    } else {
      Actions.genericView({categoryId: nextKey, title: text, query: text});
    }
  }

  onChangeText = (text) => {

  }

  renderItem(data) {
    var topic = '';
    let tc = this.state.topicCounts;
    for (var i = 0; i < tc.length; i++) {
      if (tc[i].category == data.id) {
        topic = tc[i].topicCount;
      }
    }
    return (
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <View style={{ borderRadius:5, borderWidth:1, borderColor:'#b5b5b5', backgroundColor:'#fff'}}>
              <TouchableOpacity onPress={() => this.navigate(data)}>
                <Image source={data.image} style={styles.itemImageStyle} >
                </Image>
                <View style={{ position:'absolute', width: (width / 2) - HORIZONTAL_PADDING,
                    height:130, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', borderRadius:5 }}>
                  <Text style={styles.placeholderItemNameStyle}> {data.name} </Text>
                  </View>
              </TouchableOpacity>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:10}}>
                <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center' }}>
                  <Icon name="ios-people-outline" style={{ color:'#FFA838', marginRight:5, fontSize: 23}} />
                  <Text style={{ color:'#FFA838', fontSize: 13 }}>{topic}</Text>
                </View>
                <TouchableOpacity onPress={(e)=>{this.goTopic(data)}}
                  style={{ backgroundColor: '#FFA838', paddingVertical:3, paddingHorizontal:5, justifyContent:'center', alignItems:'center', borderRadius:3, height: 30}}>
                  <Text style={{ color:'#fff', fontSize: 12}} >Sharing Corner</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.getTopicCount(mainCategory, this.props.auth.token);
  }

  render() {
    const filteredLists = this.props.data;
    return (
      <View style={styles.container}>
        <Search
                ref="search_box" backgroundColor={'#0B486B'} inputStyle={{ backgroundColor:'#032d44'}}
                    placeholderTextColor="#d3d3d3"
                    tintColorSearch="#fff"
                    tintColorDelete="#fff"
                    onSearch={this.onSearch}  onChangeText={this.onChangeText}     />
        <Container>
          <Content style={{
            width: width
          }} refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
            <Image source={require('../../../assets/images/Announcement_banner.jpg')} style={{ width: width, height: height / 3.65 }}/>
            <View style={{
              flex: 1
            }}>
              {filteredLists.map((item, index) => {
                if (index % 2 == 0) {
                  return <View
                    key={index}
                    style={{
                    flexDirection: 'row',
                    paddingTop:HORIZONTAL_PADDING ,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                  }}>
                   {this.renderItem(filteredLists[index])}
                    {
                      filteredLists[index + 1] && this.renderItem(filteredLists[index + 1])
                    }
                  </View>
                }
              })}
            </View>
          </Content>
        </Container>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemImageStyle: {
  	justifyContent: 'center',
  	alignItems: 'center',
  	width: (width / 2) - HORIZONTAL_PADDING,
    height:130,
    borderRadius:5,
  },
  placeholderItemNameStyle: {
  	textAlign: 'center',
  	fontSize: 17,
  	color: '#fff',
  	fontWeight: 'bold',
  },
});

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  topic: state.topic,
});
const mapDispatchToProps = (dispatch) =>({
  setLocation: (location) => dispatch(actions.setLocation(location)),
  getTopicCount: (mainCategory, token) => dispatch(actions.getTopicCount(mainCategory, token)),
  getTopics: (category, token) => dispatch(actions.getTopics(category, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
