import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Animated, RefreshControl, FlatList } from 'react-native';
import {ImagePicker} from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import categoryData from '../services/category.json';
import {Actions} from 'react-native-router-flux';
import {Container, Content, Icon, Form} from 'native-base';
import Placeholder from 'rn-placeholder';
import StarRating from 'react-native-star-rating';

const SCREEN_WIDTH = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');
const HORIZONTAL_PADDING = 8;

class SavedMavenPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      requestLoading: true,
      refreshing: false,
    }
  }

  componentDidMount() {
    this.initialize();
  }

  initialize() {
    this.props.getSavedMavens(this.props.auth.token);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.profile.savedMavens, requestLoading: false, refreshing: false });
  }

  renderItem(item, index) {
    return (
      <View style = {{padding: 10}}>
        <TouchableOpacity style = {{ paddingHorizontal:10, backgroundColor:'#fff' }} onPress={() => {
          this.props.getMavenDetails(item._id, this.props.profile.location, this.props.auth.token);
          Actions.skillPage({ title: `${item.userID.firstName} ${item.userID.lastName}`, isMe: false })
        }}>
          <View style={{ flex: 1, paddingVertical:5, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View pointerEvents="none" style={{ flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image source = {item.userID.displayPicture ? {uri: item.userID.displayPicture} : require('../../../assets/images/avatar.png')} style={{ height: 70, width: 70, borderRadius: 25 }} />
              <View pointerEvents="none" style={{ justifyContent:'space-between', paddingHorizontal:5 }}>
                <Text ellipsizeMode='tail' style={{fontSize:13, color:'#515151', fontWeight:'400'}}>{item.title}</Text>
                <Text style={{ color:'#145775', fontSize:12, fontWeight:'400' }}>{categoryData[item.category]}</Text>
                <Text style={{ fontSize: 12, color:'#b5b5b5' }}>{`${item.userID.firstName} ${item.userID.lastName}`}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <StarRating
                    disabled
                    maxStars={5}
                    rating={item.rating}
                    starSize={15}
                    starColor="#FFA838"
                    starStyle={{paddingHorizontal:2}}
                  />
                  <Text style={{ color:'#b5b5b5'}}>({Math.round(item.rating * 10) / 10})</Text>
                </View>
              </View>
            </View>
            <View style={{ justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'#FFA838', fontWeight:"700", fontSize:15}}>${item.price}</Text>
                <Text style={{ color:'#b5b5b5', fontWeight:'400', fontSize:12 }}>/hr</Text>
              </View>
              <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={() => {
                Actions.chatPage({ mavenId: item._id, title: `${item.userID.firstName} ${item.userID.lastName}` });
              }}>
                <Icon name = "ios-chatbubbles-outline" style={{ fontSize: 29, color:'#3F6A86', paddingRight:5 }}/>
                <Icon name = "ios-arrow-forward" style={{ fontSize: 18, color:'#BFD9E7' }}/>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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
    return (
      <View style={styles.container}>
        <Container>
          {
              this.state.requestLoading?this.renderPlaceholder():null
          }
          <Content style = {{backgroundColor: '#fff'}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />}>
            <FlatList
              data={this.state.data}
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
  getSavedMavens: (token) => dispatch(actions.getSavedMavens(token)),
  getMavenDetails: (mavenId, location, token, callback) => dispatch(actions.getMavenDetails(mavenId, location, token, callback)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedMavenPage);