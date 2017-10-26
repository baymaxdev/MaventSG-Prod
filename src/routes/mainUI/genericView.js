import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import {Icon, Container, Content, Card} from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import  {createFilter} from 'react-search-input';
import * as actions from '../../actions';
import StarRating from 'react-native-star-rating';
import Search from 'react-native-search-box';
import ModalDropdown from 'react-native-modal-dropdown';
import LoadingComponent from '../../components/loadingComponent';
import categoryData from '../services/category.json';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const KEYS_TO_FILTERS = ['category', 'title', 'firstName','lastName'];
const serviceKey = ['cooking_service', 'information_service', 'improvment', 'cleaning', 'beauty', 'photography', 'art_service', 'care', 'pet', 'others_service'];
const serviceName = ['Cooking & Banking', 'Information Technology', 'Home Improvement', 'Cleaning', 'Beauty', 'Photography', 'Art & Design', 'Home Care', 'Pet related', 'Others'];
const skillKey = ['school', 'art_skill', 'information_skill', 'sports', 'music', 'cooking_skill', 'others_skill'];
const skillName = ['School Subjects', 'Art & Design', 'Information Technology', 'Sports & Fitness', 'Music', 'Cooking & Baking', 'Others'];
const availability = ['Today', 'Other days'];

var name = [];
var key = [];

class GenericView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requestLoading: true,
      data: [],
      refreshing: false,
      searchTerm: '',
      categoryName: ''
    };
  }

  componentDidMount() {
    this.props.getProfileInfo(this.props.auth.token);
    if (serviceKey.includes(this.props.data.id)) {
      name = serviceName;
      key = serviceKey;
    } else if (skillKey.includes(this.props.data.id)) {
      name = skillName;
      key = skillKey;
    }
  }

  componentWillReceiveProps(nextProps) {
      this.setState({requestLoading: false, data: nextProps.catList});
  }

  handleRefresh = () => {

  };

  handleLoadMore = () => {

  };

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

  renderHeader = () => {
   return <View style={{backgroundColor:'#f8f8f8', padding:3}}>
            <Search
              backgroundColor={'#f8f8f8'} inputStyle={{ backgroundColor:'#fff', borderWidth:1, borderColor:'#ececec'}}
              placeholderTextColor="#a4a4a4"
              tintColorSearch="#a4a4a4"
              tintColorDelete="#e5e5e5"
              titleCancelColor="#a4a4a4"
              onSearch={this.onSearch} onChangeText={this.onChangeText} />
          </View>
 };

  renderFooter = () => {
    if (!this.state.requestLoading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE'
        }}
      >
        <ActivityIndicator
          animating = {true}
          style = {styles.activityIndicator}
          color = '#0000ff'
          size = 'large'
        />
      </View>
    );
  };

  onSearch = (text) => {
    this.setState({ searchTerm: text });
  }

  onChangeText = (text) => {
    this.setState({ searchTerm: text });
  }

  onChangeCategory = (index, value) => {
    this.props.getCatList(key[index], this.props.profile.location, this.props.auth.token);
    Actions.refresh({title: value});
  }

  onChangeAvailability = (index, value) => {

  }

  render() {
    const filteredLists = this.state.data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      <View style={styles.container}>
        <View style={{ height: 0.09 * SCREEN_HEIGHT, justifyContent: 'center' }}>
          <View style={{ height: 0.065 * SCREEN_HEIGHT, flexDirection: 'row' }}>

            <View style={ styles.topView }>
              <Text style={ styles.titleText }>Categories</Text>
              <View>
                <ModalDropdown options={name}
                              textStyle={{color: '#b5b5b5', fontSize: 16}}
                              dropdownTextStyle={{color: '#b5b5b5', fontSize: 16}}
                              onSelect={this.onChangeCategory}
                              defaultValue={this.props.title}/>
              </View>
            </View>

            <View style={ styles.topView }>
              <Text style={ styles.titleText }>Availability</Text>
              <View>
                <ModalDropdown options={availability}
                              textStyle={{color: '#b5b5b5', fontSize: 16}}
                              dropdownTextStyle={{color: '#b5b5b5', fontSize: 16}}
                              onSelect={this.onChangeAvailability}
                              defaultValue={'Today'}/>
              </View>
            </View>

            <View style={ styles.topView }>
              <Text style={ styles.titleText }>Filter</Text>
              <Text style={ styles.valueText }>Nearest</Text>
            </View>

          </View>
        </View>
        <Container>
          <Content>
          <FlatList
            data={filteredLists}
            renderItem={({ item, index }) => (
              <TouchableOpacity key = { item.mavenID } style = {{ paddingHorizontal:10, backgroundColor:'#fff' }} onPress={() => {
                this.props.getMavenDetails(item.mavenID, this.props.profile.location, this.props.auth.token);
                var mavens = this.props.profile.user.mavens;
                var flag = false;
                for (var i = 0; i < mavens.length; i++) {
                  if (mavens[i]._id == item.mavenID) {
                    flag = true;
                    break;
                  }
                }
                Actions.skillPage({ title: `${item.firstName} ${item.lastName}`, item: item, isMe: flag })
              }}>
                <View style={{ paddingVertical:5, flexDirection: 'row' }}>
                  <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                    <Image source = {item.displayPicture ? {uri: item.displayPicture} : require('../../../assets/images/avatar.png')} style={ item.idVerified?styles.isVerifyStyle:styles.noneVerifyStyle } />
                  </View>
                  <View style={{ flex: 2, justifyContent:'center', paddingHorizontal:5 }}>
                    <TextInput defaultValue={item.title} editable={false} style={{ fontSize:13, color:'#515151', fontWeight:'400', height:17, marginRight: -50}}></TextInput>
                    <TextInput defaultValue={categoryData[item.category]} editable={false} style={{ color:'#145775', height:23, marginRight: -50, fontSize:12, fontWeight:'400' }}></TextInput>
                    <Text style={{ fontSize: 12, color:'#b5b5b5' }}>{`${item.firstName} ${item.lastName}`}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                      <StarRating
                        disabled
                        maxStars={5}
                        rating={item.rating}
                        starSize={15}
                        starColor="#FFA838"
                        starStyle={{paddingHorizontal:2}}
                      />
                      <Text style={{ color:'#b5b5b5'}}>({item.rating})</Text>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'space-around', flex: 1, alignItems: 'flex-end', paddingHorizontal:10 }}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={{color:'#FFA838', fontWeight:"700", fontSize:15}}>${item.price}</Text>
                      <Text style={{ color:'#b5b5b5', fontWeight:'400', fontSize:12 }}>/hr</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}} onPress={() => {
                      Actions.chatPage({ title: `${item.firstName} ${item.lastName}`, item: item })
                    }}>
                      <Icon name = "ios-chatbubbles-outline" style={{ fontSize: 29, color:'#3F6A86', paddingRight:5 }}/>
                      <Icon name = "ios-arrow-forward" style={{ fontSize: 18, color:'#BFD9E7', paddingLeft:5 }}/>
                    </TouchableOpacity>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                      <Icon name='md-pin' style={{fontSize:15, paddingRight:2, color:'#BFD9E7'}} />
                      <Text style={{ fontSize: 15, color:'#b5b5b5', }}>{Math.round(item.distance / 100) / 10 + "Km"}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.mavenID}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.9}

          />
        </Content>
      </Container>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor:'#fff'
  },
  titleText: { color:'#515151', fontSize:16 },
  valueText: { color:'#b5b5b5' },
  topView:{ flex: 1, paddingLeft: 10, justifyContent: 'center', borderRightWidth: 1, borderColor: '#ececec', alignItems:'center' },
  isVerifyStyle:{
    height: 70,
    width: 70,
    borderRadius: 25,
    borderWidth:2,
    borderColor:'#FFA838'
  },
  noneVerifyStyle:{
      height: 70,
      width: 70,
      borderRadius: 25,
  }
});

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  catList: state.explore.catList,
  explore: state.explore
});

const mapDispatchToProps = (dispatch) =>({
  getCatList: (category, location, token) => dispatch(actions.getCatList(category, location, token)),
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  getProfileInfo: (token) => dispatch(actions.getProfileInfo(token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GenericView);
