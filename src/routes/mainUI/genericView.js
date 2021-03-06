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
  TextInput,
  RefreshControl,
  ScrollView
} from 'react-native';
import {List} from 'react-native-elements';
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
import Placeholder from 'rn-placeholder';
import FilterComponent from '../../components/filterComponent';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const KEYS_TO_FILTERS = ['category', 'title', 'firstName','lastName'];
const serviceKey = ['cooking_service', 'information_service', 'improvement', 'cleaning', 'beauty', 'photography', 'art_service', 'care', 'pet', 'others_service'];
const serviceName = ['Cooking & Baking', 'Information Technology', 'Home Improvement', 'Cleaning', 'Beauty', 'Photography', 'Art & Design', 'Home Care', 'Pet related', 'Others'];
const skillKey = ['school', 'art_skill', 'information_skill', 'sports', 'music', 'cooking_skill', 'others_skill'];
const skillName = ['School Subjects', 'Art & Design', 'Information Technology', 'Sports & Fitness', 'Music', 'Cooking & Baking', 'Others'];
const availability = ['Today', 'Other days'];

var name = [];
var key = [];
var mainCategory = 0;

class GenericView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requestLoading: true,
      data: [],
      refreshing: false,
      searchTerm: '',
      categoryName: '',
      categoryId: '',
      modalVisible: false,
      min: '',
      max: '',
      sortBy: 0,
      page: 1,
      scrollId: '',
      loading: false,
      total: 0,
      title: '',
      firstLoad: true,
      query: '',
    };
  }

  componentDidMount() {
    if (serviceKey.includes(this.props.categoryId)) {
      name = serviceName;
      key = serviceKey;
      mainCategory = 1;
    } else if (skillKey.includes(this.props.categoryId)) {
      name = skillName;
      key = skillKey;
      mainCategory = 0;
    }
    this.setState({categoryId: this.props.categoryId, title: this.props.title, query: this.props.query}, () => {
      this.props.getCatList(this.state.categoryId, mainCategory, this.props.profile.location, this.state.page, this.state.scrollId, this.state.query, this.props.auth.token);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.firstLoad === true) {
      this.setState({requestLoading: false, refreshing: false, loading: false, firstLoad: false, data: [...this.state.data, ...nextProps.catList], scrollId: nextProps.scrollId, total: nextProps.totalList}, () => {
        Actions.refresh({title: this.state.title})
      });
    }
  }

  handleRefresh = () => {

  };

  handleLoadMore = () => {
    if (this.state.total > 10 && this.state.data.length < this.state.total && this.state.firstLoad !== true) {
      this.setState({
        page: this.state.page + 1,
        loading: true,
        firstLoad: true,
      }, () => {
        this.props.getCatList(this.state.categoryId, mainCategory, this.props.profile.location, this.state.page, this.state.scrollId, this.state.query, this.props.auth.token);
      });
    }
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
              onSearch={this.onSearch}
              onChangeText={this.onChangeText}
              onCancel={this.onCancel}
              onDelete={this.onDelete}
              />
          </View>
 };

  renderFooter = () => {
    if (!this.state.loading) return null;

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

  onCancel = (text) => {
    this.setState({searchTerm: ''});
  }

  onDelete = (text) => {
    this.setState({searchTerm: ''});
  }

  onChangeCategory = (index, value) => {
    this.setState({requestLoading: true, firstLoad: true, categoryId: key[index], page: 1, scrollId: '', total: 0, data: [], title: name[index], query: ''}, () => {
      this.props.getCatList(this.state.categoryId, mainCategory, this.props.profile.location, 1, '', this.state.query, this.props.auth.token);
    });
  }

  onChangeAvailability = (index, value) => {

  }

  renderPlaceholder() {
    var ret = [];
    for (var i = 0; i < 10; i++) {
        ret.push(
            <View key={i} style={{paddingHorizontal:20, height: 70}}>
                <Placeholder.ImageContent
                    onReady={false}
                    lineNumber={2}
                    animate="shine"
                    lastLineWidth="80%"
                    >
                </Placeholder.ImageContent>
            </View>
        );
    }
    return ret;
  }

  _onRefresh = () => {
    this.setState({requestLoading: true, refreshing: true, firstLoad: true, page: 1, scrollId: '', data: [], total: 0}, () => {
      this.props.getCatList(this.state.categoryId, mainCategory, this.props.profile.location, 1, '', this.state.query, this.props.auth.token);
    });
  }

  renderDropdownRow(rowData, rowID, highlited) {
    return (
      <TouchableOpacity style={{height: 30, justifyContent: 'center', paddingHorizontal: 10}}>
        <Text style={styles.valueText}>{rowData}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    var filteredLists = this.state.data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    let _this = this;
    filteredLists.sort(function(a, b) {
      if (_this.state.sortBy === 0)
        return parseFloat(a.distance) - parseFloat(b.distance);
      else
        return parseFloat(a.price) - parseFloat(b.price);
    });

    var max, min;
    if (this.state.min === '')
      min = 0;
    else
      min = parseInt(this.state.min);

    if (this.state.max === '')
      max = -1;
    else
      max = parseInt(this.state.max);

    filteredLists = filteredLists.filter((a) => {
      if (a.price >= min) {
        if (max === -1) {
          return a;
        } else if (a.price <= max) {
          return a;
        }
      }
    });

    return (
      <View style={styles.container}>
        <View style={{ height: 0.09 * SCREEN_HEIGHT, justifyContent: 'center' }}>
          <View style={{ height: 0.065 * SCREEN_HEIGHT, flexDirection: 'row' }}>

            <View style={ styles.topView }>
              <Text style={ styles.titleText }>Categories</Text>
              <View>
                <ModalDropdown options={name}
                              textStyle={ styles.valueText }
                              dropdownTextStyle={ styles.valueText }
                              onSelect={this.onChangeCategory}
                              adjustFrame={(style) => {
                                style.left = 0;
                                style.height = 30 * name.length + (name.length - 1) / 2;
                                return style;
                              }}
                              renderRow={this.renderDropdownRow.bind(this)}
                              defaultValue={this.props.title}/>
              </View>
            </View>

            <View style={ styles.topView }>
              <Text style={ styles.titleText }>Availability</Text>
              <View>
                <ModalDropdown options={availability}
                              textStyle={ styles.valueText }
                              dropdownTextStyle={ styles.valueText }
                              adjustFrame={(style) => {
                                style.alignSelf = 'center';
                                style.width = SCREEN_WIDTH / 3;
                                style.left = SCREEN_WIDTH / 3;
                                style.height = 30 * 2 + 1;
                                return style;
                              }}
                              renderRow={this.renderDropdownRow.bind(this)}
                              onSelect={this.onChangeAvailability}
                              defaultValue={'Today'}/>
              </View>
            </View>
            <View style={ styles.topView }>
              <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                this.setState({modalVisible: true});
              }}>
                <Text style={ styles.titleText }>Filter</Text>
                <Text style={ styles.valueText }>{this.state.sortBy === 0?'Nearest':'Lowest Price'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
          {
              this.state.requestLoading?this.renderPlaceholder():null
          }
          {
            this.state.data.length === 0?
            <ScrollView style={{flex: 1}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
            >
              <View style={{height: 0.91 * SCREEN_HEIGHT - 64, justifyContent: 'center', alignItems:'center', paddingBottom: 100}}>
                <TouchableOpacity style={{justifyContent: 'center', alignItems:'center'}} onPress={() => {
                    Actions.skillList({ category: name === serviceName?'Provide a Service':'Teach a Skill', subCategory: this.props.title, categoryId: this.state.categoryId });
                }}>
                <Image source={require('../../../assets/icons/first.png')} />
                <View style={{ height: 10 }}></View>
                  <Text style={{fontSize: 18, color: '#7F7F7F'}}>No Maven here yet. Tap here to be the first!</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>:
            <List style={{borderTopWidth: 0, borderBottomWidth: 0, flex: 1}}>
            <FlatList
              data={filteredLists}
              renderItem={({ item, index }) => (
                <TouchableOpacity key = { item.mavenID } style = {{ paddingHorizontal:10, backgroundColor:'#fff' }} onPress={() => {
                  this.props.getMavenDetails(item.mavenID, this.props.profile.location, this.props.auth.token);
                  var mavens = this.props.profile.myInfo.mavens;
                  var flag = false;
                  for (var i = 0; i < mavens.length; i++) {
                    if (mavens[i]._id == item.mavenID) {
                      flag = true;
                      break;
                    }
                  }
                  Actions.skillPage({ title: `${item.firstName} ${item.lastName}`, isMe: flag })
                }}>
                  <View style={{ paddingVertical:5, flexDirection: 'row' }}>
                    <View pointerEvents="none" style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                      <Image source = {item.displayPicture ? {uri: item.displayPicture} : require('../../../assets/images/avatar.png')} style={ item.idVerified?styles.isVerifyStyle:styles.noneVerifyStyle } />
                    </View>
                    <View pointerEvents="none" style={{ flex: 2, justifyContent:'center', paddingHorizontal:5 }}>
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
                        <Text style={{ color:'#b5b5b5'}}>({Math.round(item.rating * 10) / 10})</Text>
                      </View>
                    </View>
                    <View style={{ justifyContent: 'space-around', flex: 1, alignItems: 'flex-end', paddingHorizontal:10 }}>
                      <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{color:'#FFA838', fontWeight:"700", fontSize:15}}>${item.price}</Text>
                        <Text style={{ color:'#b5b5b5', fontWeight:'400', fontSize:12 }}>/hr</Text>
                      </View>
                      <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}} onPress={() => {
                        Actions.chatPage({ mavenId: item.mavenID, title: `${item.firstName} ${item.lastName}` });
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
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0}
            />
            </List>
          }
        <FilterComponent modalVisible={this.state.modalVisible} sortBy={this.state.sortBy} min={this.state.min} max={this.state.max}
          onApply={(res) => {
            this.setState({modalVisible: false, sortBy: res.sortBy, min: res.min, max: res.max});
          }}
          onCancel={() => {
            this.setState({modalVisible: false});
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor:'#fff', flexDirection: 'column'
  },
  titleText: { color:'#515151', fontSize: 16 },
  valueText: { color:'#b5b5b5', fontSize: 14 },
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
  scrollId: state.explore.scrollId,
  totalList: state.explore.totalList,
  explore: state.explore
});

const mapDispatchToProps = (dispatch) =>({
  getCatList: (category, mainCategory, location, page, scrollId, query, token) => dispatch(actions.getCatList(category, mainCategory, location, page, scrollId, query, token)),
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  //getProfileInfo: (token) => dispatch(actions.getProfileInfo(token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GenericView);
