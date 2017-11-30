import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableHighlight,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  RefreshControl,
  FlatList
} from 'react-native';
import { Icon, Form, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import StarRating from 'react-native-star-rating';
import DatePicker from 'react-native-datepicker';
import { ImagePicker } from 'expo';
import ReviewComponent from '../../components/reviewComponent';
import LoadingComponent from '../../components/loadingComponent';
import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';
import GalleryComponent from '../../components/galleryComponent';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
var initialPage = 0;

class SkillPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
        availability:[{ label: 'S', value: false },{ label: 'M', value: false },{ label: 'T', value: false },
                      { label: 'W', value: false },{ label: 'T', value: false },{ label: 'F', value: false },{ label: 'S', value: false }],
        availableTime:[{ label: 'Morning', value: false },{ label: 'Afternoon', value: false },{ label: 'Evening', value: false },
                      { label: 'Night', value: false }],
        reviewData:[{ name:'Kamai Matthews', rating:3.5, description:'I am a dedicated person. I enjoy reading, and the knowledge and perspective that my reading gives me has strengthened my teaching skills....' },
                    { name:'Priscilla Moore', rating:4.5, description:'I am a dedicated person. I enjoy reading, and the knowledge and perspective that my reading gives me has strengthened my teaching skills....' }],
        picUrl: [],
        user: {},
        distance: 0,
        description: '',
        price: 0,
        rating: 0,
        modalVisible: false,
        reportModalVisible: false,
        requestLoading: true,
        idVerified: false,
        refreshing: false,
        reportText: '',
        successModalVisible: false,
        chats: []
    };
  }

  componentDidMount() {
    if (this.props.isMe) {
      this.props.getActivities(0, this.props.auth.token);
      Actions.refresh({rightButtonImage: require('../../../assets/icons/edit.png'), onRight: () => {
        this.editMavenActionSheet.show();
      }});
    } else {
      Actions.refresh({rightButtonImage: require('../../../assets/icons/more1.png'), onRight: () => {
        this.genericMavenActionSheet.show();
      }});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.profile.mavenImageLoading !== nextProps.profile.mavenImageLoading && !nextProps.profile.mavenImageLoading && nextProps.profile.mavenImageSuccess){
      this.setState({requestLoading: false});
    }
    else if(this.props.profile.mavenImageLoading !== nextProps.profile.mavenImageLoading && !nextProps.profile.mavenImageLoading && !nextProps.profile.mavenImageSuccess){
      this.setState({requestLoading: false});
      alert(nextProps.profile.error);
    }

    if (nextProps.maven.maven !== undefined) {
      var m = nextProps.maven.maven;
      var da = m.dayAvailable.split(',').map(function(item) {
        return parseInt(item, 10);
      });
      var av = this.state.availability;
      for (var i = 0; i < av.length; i++) {
        if (da.includes(i))
          av[i].value = true;
        else
          av[i].value = false;
      }

      var ta = m.timeAvailable.split(',').map(function(item) {
        return parseInt(item, 10);
      });
      var avt = this.state.availableTime;
      for (i = 0; i < avt.length; i++) {
        if (ta.includes(i))
          avt[i].value = true;
        else
          avt[i].value = false;
      }

      var reviewData = m.reviews;
      reviewData.sort(function(a, b) {
        da = new Date(a.createdDate);
        db = new Date(b.createdDate);
        return db.getTime() - da.getTime();
      });
      this.setState({maven: m, user: m.userID, distance: nextProps.maven.distance, description: m.description, price: m.price, title: m.title, 
        rating: m.rating, availability: av, availableTime:avt, reviewData: reviewData, picUrl: m.pictures, requestLoading: false, refreshing: false, idVerified: m.userID.idVerified});

      if (nextProps.activity.mySkills !== undefined) {
        var temp = nextProps.activity.mySkills;
        var chats = [];
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].mavenID._id === m._id) {
            chats.push(temp[i]);
          }
        }
        this.setState({chats});
      }
    }
  }

  onClickAvailability = (index) => {

  }

  onClickAvailableTime = (index) => {

  }

  _openCameraRoll = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({allowsEditing:true, aspect:[4,3]});
    this.addPhoto(image);
  }

  takePhoto = async () => {
    let image = await ImagePicker.launchCameraAsync({allowsEditing:true, aspect:[4,3]});
    this.addPhoto(image);
  }

  async addPhoto (image) {
    if (!image.cancelled) {
      let pictures = this.state.picUrl;
      pictures[this.state.picNumber] = image.uri;
      this.setState({picUrl: pictures, requestLoading: true});
      this.props.addMavenImage(this.state.maven._id, image.uri, this.props.auth.token);
    }
  }

  handlePress = (i) => {
    if (i === 1)
      this._openCameraRoll();
    else if (i === 2)
      this.takePhoto();
  }

  handleEditMavenPress = (i) => {
    if (i === 1) {
      Actions.skillList({ isEdit: true });
    }
    else if (i === 2)
      this.props.deleteMaven(this.state.maven._id, this.props.auth.token, () => {
        this.props.getMyProfileInfo(this.props.auth.token);
        Actions.pop();
      });
  }

  handleDeleteImagePress = (i) => {
    if (i === 1) {
      this.props.deleteMavenImage(this.state.maven._id, this.state.deleteImageIndex, this.props.auth.token, () => {
        this._onRefresh();
      });
    }
  }

  handleGenericMavenPress = (i) => {
    if (i == 1) {
      this.props.saveMaven(this.state.maven._id, this.props.auth.token, () => {
        this.setState({successModalVisible: true});
        setTimeout(() => {
          this.setState({successModalVisible: false});
        }, 1000);
      });
    } else if (i == 2) {
      this.setState({reportModalVisible: true, reportText: ''});
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.getMavenDetails(this.state.maven._id, this.props.profile.location, this.props.auth.token);
  }

  _onDeleteImage(index) {
    this.setState({deleteImageIndex: index});
    this.deleteImageActionSheet.show();
  }

  render() {
    return (
      this.state.requestLoading?
      <LoadingComponent/>
      :
      <View style={ styles.container}>
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        >
          <View style={{ padding: 20 }} >
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
              <Image source={this.state.user.displayPicture ? {uri: this.state.user.displayPicture} : require('../../../assets/images/avatar.png')} style={ this.state.idVerified?styles.isVerifyStyle:styles.noneVerifyStyle }/>
              <Text style={{ fontSize: 20, color: '#145775', fontWeight: '500', paddingVertical:5 }}>{this.state.user.firstName} {this.state.user.lastName}</Text>
              <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <Icon name='md-pin' style={{fontSize:15, paddingRight:2, color:'#BFD9E7'}} />
                <Text style={{ fontSize: 15, color:'#b5b5b5', }}>{Math.round(this.state.distance / 100) / 10 + "Km"}</Text>
              </View>
            </View>
            {
              <View style={{ marginTop: 3,  flexDirection:'row' , justifyContent: 'center'}}>
                {
                  this.state.picUrl[0]?
                  <View style={ styles.photoView }>
                    <TouchableOpacity style={ styles.photoView } onPress={(e) => {
                        this.setState({ modalVisible: true});
                        initialPage = 0;
                      }} >
                        <Image source={{ uri: this.state.picUrl[0] }} style={{ width:'100%', height:'100%' }}/>
                    </TouchableOpacity>
                    {
                      this.props.isMe?
                      <TouchableOpacity style={{ right: 0, top: 0, position: 'absolute', padding: 3, }} onPress={() => {this._onDeleteImage(0)}}>
                        <Image source={require('../../../assets/icons/close.png')} style={{width: 25, height: 25}} />
                      </TouchableOpacity>
                      :null
                    }
                  </View>
                  :this.props.isMe?
                  <TouchableOpacity style={ styles.photoView } onPress={(e)=>{
                      this.setState({ picNumber: 0 });
                      this.ActionSheet.show();
                    }} >
                      <Icon name="md-add-circle" style={{ fontSize: 30 }} />
                  </TouchableOpacity>
                  :
                  null
                }
                {
                  this.state.picUrl[1]?
                  <View style={ styles.photoView }>
                    <TouchableOpacity style={ styles.photoView } onPress={(e) => {
                        this.setState({ modalVisible: true});
                        initialPage = 1;
                      }} >
                        <Image source={{ uri: this.state.picUrl[1] }} style={{ width:'100%', height:'100%' }}/>
                    </TouchableOpacity>
                    {
                      this.props.isMe?
                      <TouchableOpacity style={{ right: 0, top: 0, position: 'absolute', padding: 3, }} onPress={() => {this._onDeleteImage(1)}}>
                        <Image source={require('../../../assets/icons/close.png')} style={{width: 25, height: 25}} />
                      </TouchableOpacity>
                      :null
                    }
                  </View>
                  :this.props.isMe && this.state.picUrl[0]?
                  <TouchableOpacity style={ styles.photoView } onPress={(e)=>{
                      this.setState({ picNumber: 1 });
                      this.ActionSheet.show();
                    }} >
                      <Icon name="md-add-circle" style={{ fontSize: 30 }} />
                  </TouchableOpacity>
                  :
                  null
                }
                {
                  this.state.picUrl[2]?
                  <View style={ styles.photoView }>
                    <TouchableOpacity style={ styles.photoView } onPress={(e) => {
                        this.setState({ modalVisible: true});
                        initialPage = 2;
                      }} >
                        <Image source={{ uri: this.state.picUrl[2] }} style={{ width:'100%', height:'100%' }}/>
                    </TouchableOpacity>
                    {
                      this.props.isMe?
                      <TouchableOpacity style={{ right: 0, top: 0, position: 'absolute', padding: 3, }} onPress={() => {this._onDeleteImage(2)}}>
                        <Image source={require('../../../assets/icons/close.png')} style={{width: 25, height: 25}} />
                      </TouchableOpacity>
                      :null
                    }
                  </View>
                  :this.props.isMe && this.state.picUrl[0] && this.state.picUrl[1]?
                  <TouchableOpacity style={ styles.photoView } onPress={(e)=>{
                      this.setState({ picNumber: 2 });
                      this.ActionSheet.show();
                    }} >
                      <Icon name="md-add-circle" style={{ fontSize: 30 }} />
                  </TouchableOpacity>
                  :
                  null
                }
              </View>
            }
            <View style={ styles.viewContainer } >
              <Text style={ styles.subjectText }>{this.state.title}</Text>
            </View>
            <View style={ styles.viewContainer } >
              <Text style={ styles.subjectText }>Skill Description</Text>
                <Text style={ styles.contentText }>{this.state.description}</Text>
            </View>
            <View style={ [styles.viewContainer, { flexDirection:'row', justifyContent:'space-between' }] } >
              <Text style={ styles.subjectText }>Price</Text>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'#FFA838', fontWeight:"700", fontSize:19}}>{'$'+this.state.price}</Text>
                <Text style={{ color:'#b5b5b5', fontWeight:'400', fontSize:15 }}>/hr</Text>
              </View>
            </View>
            <View style={ styles.viewContainer }>
              <View style={{ flexDirection:'row', justifyContent:'space-between' }} >
                <Text style={ styles.subjectText }>Availability</Text>
                <View style={{ flexDirection:'row' }}>
                  {
                    this.state.availability.map((item,index)=>{
                      return <TouchableOpacity key={index} onPress={(e)=> this.onClickAvailability(index) }
                                style={ { width:30, height:30, borderRadius:15, marginHorizontal:3, backgroundColor:item.value?'#fc912f':'#f1f1f1', justifyContent:'center', alignItems:'center' } }>
                              <Text style={{ color: item.value?'#fff':'#515151' }} >{item.label}</Text>
                        </TouchableOpacity>
                    })
                  }
                </View>
              </View>
              <View style={{ flexDirection:'row', justifyContent:'space-between',  marginTop:20 }}>
                  {
                    this.state.availableTime.map((item,index)=>{
                      return <TouchableOpacity key={index} onPress={(e)=> this.onClickAvailableTime(index) }
                                style={ { flex:1, height:39, borderRadius:17, marginHorizontal:3, backgroundColor:item.value?'#fc912f':'#f1f1f1', justifyContent:'center', alignItems:'center' } }>
                              <Text style={{ color: item.value?'#fff':'#515151' }} >{item.label}</Text>
                        </TouchableOpacity>
                    })
                  }
                </View>
            </View>
            <View style={ styles.viewContainer }>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ flexDirection: 'row', alignItems:'center' }}>
                    <Text style={ styles.subjectText }>Ratings and Reviews</Text>
                    <Text style={{ color:'#b5b5b5' }}> (</Text><Text style={{color:'#b5b5b5'}}>{this.state.reviewData.length}</Text><Text style={{color:'#b5b5b5'}}>)</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <StarRating
                      disabled
                      maxStars={5}
                      rating={this.state.rating}
                      starSize={15}
                      starColor="#FFA838"
                      starStyle={{paddingHorizontal:2}}
                    />
                    <Text style={{ color:'#b5b5b5'}}>{'('+Math.round(this.state.rating * 10) / 10+')'}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => {
                  Actions.allReviewPage({userId: this.props.isMe?undefined:this.state.user._id, from: 'skillpage'});
                  }}>
                  <Text style={{ color:'#FFA838' }} >View all</Text>
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={this.state.reviewData.slice(0, 5)}
              renderItem={ ({item, index}) => {
                return <ReviewComponent data={item}/>
              }}
              keyExtractor={item => item._id}
              ItemSeparatorComponent={null}
              >
            </FlatList>
            {
              !this.props.isMe?
              <TouchableOpacity style={{ justifyContent:'center', alignItems:'center', paddingVertical:15 }} onPress={() => {
                if (this.props.from === 'profile') {
                  Actions.pop();
                } else {
                  Actions.otherProfile({title: this.props.title, userId: this.state.user._id});
                }
              }}>
                <Text style={{ fontSize: 17, color:"#FFA838" }} >Other services by this Maven</Text>
              </TouchableOpacity>
              :null
            }
          </View>
        </ScrollView>
        {
          this.props.isMe?
          <View style={{ flexDirection:'row'}} >
            <View style={{justifyContent:'center', alignItems:'center', padding:15, backgroundColor:'#004869'}}>
              <Text style={styles.btnText}>{this.state.chats.length}</Text>
            </View>
            <TouchableOpacity style={ [styles.btnView, {backgroundColor:'#fc912f'}] } onPress={()=>{
              Actions.viewChats({isViewChats: true, maven: this.state.maven, from: 'skillpage'});
            }} >
              <Text style={styles.btnText}>View Chats</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={{ flexDirection:'row'}} >
            <TouchableOpacity style={ [styles.btnView, {backgroundColor:'#004869'}] } onPress={() => {
              Actions.genericBooking({ title: this.props.title, maven: this.state.maven });
              }}>
              <Text style={styles.btnText}>SKILL REQUEST</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ [styles.btnView, {backgroundColor:'#fc912f'}] } onPress={()=>{
              this.props.getMavenDetails(this.state.maven._id, this.props.profile.location, this.props.auth.token);
              Actions.chatPage({title: this.props.title, from: 'skillpage'});
            }} >
              <Text style={styles.btnText}>CHAT</Text>
            </TouchableOpacity>
          </View>
        }
        <ActionSheet
            ref={o => this.ActionSheet = o}
            title={null}
            options={['Cancel', 'Choose from Library...', 'Take a picture...']}
            cancelButtonIndex={0}
            onPress={this.handlePress}
        />
        <ActionSheet
            ref={o => this.editMavenActionSheet = o}
            title={'What would you like to do?'}
            options={['Cancel', 'Edit maven details', 'Delete listing']}
            cancelButtonIndex={0}
            destructiveButtonIndex={2}
            onPress={this.handleEditMavenPress}
        />
        <ActionSheet
            ref={o => this.deleteImageActionSheet = o}
            title={null}
            options={['Cancel', 'Delete Image']}
            cancelButtonIndex={0}
            destructiveButtonIndex={1}
            onPress={this.handleDeleteImagePress}
        />
        <ActionSheet
            ref={o => this.genericMavenActionSheet = o}
            title={'What would you like to do?'}
            options={['Cancel', 'Save', 'Report']}
            cancelButtonIndex={0}
            onPress={this.handleGenericMavenPress}
        />
        <Modal isVisible={this.state.reportModalVisible}>
          <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={(e)=>{
              this.setState({reportModalVisible: false, reportText: ''});
              }}>
                <Icon name='close' style={{fontSize:40}}/>
            </TouchableOpacity>
            <Form style={{width:'100%' }}>
                <Item regular>
                <Input
                    value={ this.state.reportText }
                    placeholder="Write description here."
                    style={{ height: 150, width:'100%', alignSelf: 'flex-start' }}
                    autoCorrect={false}
                    autoCapitalize="none"
                    multiline
                    onChangeText={(text) => this.setState({reportText: text})}
                />
                </Item>
            </Form>
            <TouchableOpacity style={[styles.loginBtn,{backgroundColor:'#0B486B', padding:10, marginBottom:10}]} onPress={(e)=>{
              this.setState({reportModalVisible: false});
              setTimeout(() => {
                this.props.reportMaven(this.state.maven._id, this.state.reportText, this.props.auth.token, () => {
                  this.setState({successModalVisible: true});
                  setTimeout(() => {
                    this.setState({successModalVisible: false});
                  }, 1000);
                });
              }, 500);
            }}>
              <Text style={styles.btnText}>REPORT</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.successModalVisible}
          animationIn={'slideInLeft'}
          animationOut={'slideOutRight'}
          animationInTiming={500}
          animationOutTiming={500}
          >
          <View style={styles.modalContent}>
            <Icon name='md-checkmark-circle' style={{fontSize:40, paddingHorizontal: 8, color: 'green' }}/>
            <Text>Success!</Text>
          </View>
        </Modal>
        <GalleryComponent picUrl={this.state.picUrl} modalVisible={this.state.modalVisible} initialPage={initialPage}
          onClose={() => {
            this.setState({modalVisible: false})
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor:'#fff'
  },
  subjectText:{ fontSize: 17, color:"#515151", paddingVertical:5 },
  contentText: { fontSize: 14, color:"#b5b5b5" },
  viewContainer: {
    borderBottomWidth:1, borderBottomColor: '#f8f8f8', paddingVertical:15
  },
  btnView: { flex:1, justifyContent:'center', alignItems:'center', paddingVertical:15 },
  btnText: { color:'#fff', fontSize:17, fontWeight:'600' },
  isVerifyStyle:{
    height: 150, width: 150, borderRadius: 50, borderWidth:3, borderColor:'#FFA838'
  },
  noneVerifyStyle:{
      height: 150, width: 150, borderRadius: 50, borderWidth:3, borderColor:'#fff'
  },
  photoView: { borderWidth:1, borderRadius:3, borderColor: '#ccc', height:80, width: (SCREEN_WIDTH - 40) / 3,
  backgroundColor:'#fff', justifyContent:"center", alignItems:'center' },
  loginBtn:{
    padding:5, marginTop:15, flexDirection:'row', width:'78%', alignSelf:'center', alignItems:'center',
    justifyContent:'center', borderRadius:10,
    height: 50,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
    width: 0,
    height: 1
    }
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  maven: state.explore.maven,
  activity: state.activity,
});

const mapDispatchToProps = (dispatch) =>({
  getMyProfileInfo: (token) => dispatch(actions.getMyProfileInfo(token)),
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  addMavenImage: (mavenId, imageUrl, token) => dispatch(actions.addMavenImage(mavenId, imageUrl, token)),
  deleteMavenImage: (mavenId, index, token, next) => dispatch(actions.deleteMavenImage(mavenId, index, token, next)),
  deleteMaven: (mavenId, token, next) => dispatch(actions.deleteMaven(mavenId, token, next)),
  saveMaven: (mavenId, token, next) => dispatch(actions.saveMaven(mavenId, token, next)),
  reportMaven: (mavenId, description, token, next) => dispatch(actions.reportMaven(mavenId, description, token, next)),
  getActivities: (mode, token) => dispatch(actions.getActivities(mode, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SkillPage);
