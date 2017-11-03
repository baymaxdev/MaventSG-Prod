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

const SCREEN_WIDTH = Dimensions
  .get('window')
  .width;
const {width, height} = Dimensions.get('window');
const HORIZONTAL_PADDING = 8;

class SubCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      topicCounts: [],
      refreshing: false,
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ refreshing: false, topicCounts: nextProps.topic.topicCount });
  }

  navigate = (data) => {
    this.props.getCatList(data.id, this.props.profile.location, this.props.auth.token);
    Actions.genericView({data: data, title: data.name});
  }

  goTopic = (data) => {
    this.props.getTopics(data.id, this.props.auth.token);
    Actions.topicPage({ title: data.name, category: data.id });
  }

  onSearch = (text) => {
    this.setState({ searchTerm: text });
  }

  onChangeText = (text) => {
    this.setState({ searchTerm: text });
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
    if (this.state.topicCounts.length === 10)
      this.props.getTopicCount(1, this.props.auth.token);
    else
      this.props.getTopicCount(0, this.props.auth.token);
  }

  render() {
    const filteredLists = this.props.data.filter(createFilter(this.state.searchTerm, ['name']))
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
  getCatList: (category, location, token) => dispatch(actions.getCatList(category, location, token)),
  getTopicCount: (mainCategory, token) => dispatch(actions.getTopicCount(mainCategory, token)),
  getTopics: (category, token) => dispatch(actions.getTopics(category, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
