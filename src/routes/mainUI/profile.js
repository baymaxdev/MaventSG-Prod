import React, { Component } from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, Dimensions ,ListView, RefreshControl } from 'react-native';
import { Container, Content, Icon, Form, Item, Input } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as actions from '../../actions';
import SkillRowComponent from '../../components/skillRowComponent';
import ReviewComponent from '../../components/reviewComponent';
import LoadingComponent from '../../components/loadingComponent';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import { ImagePicker } from 'expo';

const { width, height } = Dimensions.get('window');

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestLoading: true,
      basic: true,
      entrySkillMaven:[{
               "_id": "59c3827010da5e2c2ab86331",
               "title": "Register a skill today!",
               "category": "entry",
               "active": false,
               "rating": 5,
               "status": 0,
               "mainCategory": 0
           }],
        entryServiceMaven:[{
               "_id": "59c3827010da5e2c2ab86331",
               "title": "Register a service today!",
               "category": "entry",
               "active": false,
               "rating": 5,
               "status": 0,
               "mainCategory": 1
           }],
           reviewData: [],
           refreshing: false,
           modalVisible: null,
           aboutMe: '',
           isMe: this.props.userId?false:true
			//listViewData: Array(20).fill('').map((_,i)=>`item #${i}`)
    };
    //this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }
  componentWillMount() {
    // this.fetchdetails();
  }

  updateProfileInfo() {
    if (!this.state.isMe) {
      this.props.getProfileInfo(this.props.auth.token, this.props.userId);
    } else {
      this.props.getMyProfileInfo(this.props.auth.token);
    }
  }

  componentDidMount() {
    this.updateProfileInfo();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isMe) {
      if(this.props.profile.myInfo !== nextProps.profile.myInfo && nextProps.profile.loading){
        this.setState({requestLoading: false, refreshing: false, reviewData: nextProps.profile.myInfo.mavenReviews, aboutMe: nextProps.profile.myInfo.about, displayPicture: nextProps.profile.myInfo.displayPicture});
        if(this.modalFlag) {
          this.setState({modalVisible: 2});
          setTimeout(() => {
            this.setState({modalVisible: null});
            this.modalFlag = false;
          }, 1000);
        }
      }
    } else {
      if(this.props.profile.user !== nextProps.profile.user && nextProps.profile.loading){
        this.setState({requestLoading: false, refreshing: false, reviewData: nextProps.profile.user.mavenReviews, displayPicture: nextProps.profile.user.displayPicture});
        if(this.modalFlag) {
          this.setState({modalVisible: 2});
          setTimeout(() => {
            this.setState({modalVisible: null});
            this.modalFlag = false;
          }, 1000);
        }
      }
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.updateProfileInfo();
  }

  onSuccessModal() {
    this.modalFlag = true;
    this.updateProfileInfo();
  }

  handlePress = (i) => {
    if (i === 1)
      this._openCameraRoll();
    else if (i === 2)
      this.takePhoto();
  }

  _openCameraRoll = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({allowsEditing:true, aspect:[1,1]});
    this.addPhoto(image);
  }

  takePhoto = async () => {
    let image = await ImagePicker.launchCameraAsync({allowsEditing:true, aspect:[1,1]});
    this.addPhoto(image);
  }

  addPhoto (image) {
    if (!image.cancelled) {
      this.setState({displayPicture: image.uri});
      this.props.updateProfileImage(image.uri, this.props.auth.token );
    }
  }

  render() {
    const user = this.state.isMe?this.props.profile.myInfo:this.props.profile.user;
    let mavenList = [];
    if(user && user.mavens && user.mavens.length >  0){
      let serviceList = user.mavens.filter((e) => e.mainCategory === 0);
      let skillList = user.mavens.filter((e) => e.mainCategory === 1);
      if(serviceList.length > 0){
        mavenList.push({ mainCategory: 0, data: serviceList});
      }
      else{
        mavenList.push({ mainCategory: 0, data: this.state.entrySkillMaven});
      }

      if(skillList.length > 0){
        mavenList.push({ mainCategory: 1, data: skillList});
      }
      else{
        mavenList.push({ mainCategory: 1, data: this.state.entryServiceMaven});
      }

    }
    else{
      mavenList.push({ mainCategory: 0, data: this.state.entrySkillMaven});
      mavenList.push({ mainCategory: 1, data: this.state.entryServiceMaven});
    }
    if (user.about === null || user.about === '') {
      user.about = 'Write something about yourself...';
    }

    return (
      this.state.requestLoading ?
      <LoadingComponent/>
      :
      <Container>
        <Content
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>

          <View style={{}} >
            <Image source={require('../../../assets/images/CarouselView/Image1.jpg')} style={{ position:'absolute',flex:1, width: width}}/>
            <View style={{ position: 'absolute', backgroundColor:'rgba(11, 72, 107, 0.9)', width:'100%', height:'100%'}}/>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }} disabled={!this.state.isMe} onPress={() => {
              this.ActionSheet.show();
            }}>
            {
              <Image source={ this.state.displayPicture ? {uri: this.state.displayPicture} : require('../../../assets/images/avatar.png')} style={{ height: 150, width: 150, borderRadius: 50, borderWidth:3, borderColor:'#fff' }} />
            }
            </TouchableOpacity>
            <View style={{ flexDirection:'row', alignItems: 'center', justifyContent:'center', paddingTop: 2 }}>
              <Text style={{ fontSize: 20, color: 'white', fontWeight: '500' }}>{user.firstName + ' ' + user.lastName}</Text>
              {
                user.idVerified &&
                  <Icon name="md-checkmark-circle" style={{ fontSize:15, color:'#FFA838', marginLeft:5, marginTop:4}} />
              }
            </View>
            <View style={{ flexDirection: 'row', justifyContent:'center' }}>
              <Text style={{ fontSize: 13, color:'#fff' }}>Member since </Text>
              <Text style={{ fontSize: 13, color:'#fff' }}>{moment(new Date(user.createdDate)).format('D MMM YYYY ')}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop:20 }}>
              <View style={styles.socialView}>
                <Text style={styles.socialTextValue}>1094</Text>
                <Text style={styles.socialTextTitle}>Jobs Completed</Text>
              </View>
              <View style={styles.socialView}>
                <Text style={styles.socialTextValue}>223</Text>
                <Text style={styles.socialTextTitle}>Jobs Offer</Text>
              </View>
              {
                this.state.isMe?
                <View style={{flex:1, justifyContent: 'center', padding: 5, alignItems: 'center' }}>
                  <Text style={styles.socialTextValue}>88</Text>
                  <Text style={styles.socialTextTitle}>Saved</Text>
                </View>
                :null
              }
            </View>
          </View>
          <View style={{ backgroundColor: 'white', padding: 5 }}>
              <View style={styles.wrapper}>
                <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                  <Text style={{ fontSize: 16, color:"#515151" }}>About</Text>
                  {
                    this.state.isMe?
                    <TouchableOpacity  onPress={() => this.setState({modalVisible: 1})}>
                      <Text style={{ color:'#FFA838' }} >Edit</Text>
                    </TouchableOpacity>
                    :null
                  }
                </View>
                <Text style={{ fontSize: 13, color:"#b5b5b5" }}>{user.about}</Text>
              </View>
             {
                    mavenList.map((item, index) => {
                      return <SkillRowComponent key={index} data={item} onSuccessModal={this.onSuccessModal.bind(this)} isMe={this.state.isMe}/>
                    })
              }
              <View>
                <View style={{ paddingBottom: 10 }}>
                  <View style={{ padding: 10, flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                    <View style={{  flexDirection: 'row', alignItems:'center' }}>
                      <Text style={{ fontSize: 16, color:'#515151' }}>Reviews</Text>
                      <Text style={{color:'#b5b5b5'}}> (</Text><Text style={{color:'#b5b5b5'}}>{user.mavenReviews.length}</Text><Text style={{color:'#b5b5b5'}}>)</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                      Actions.allReviewPage({userId: this.props.userId});
                      }}>
                      <Text style={{ color:'#FFA838' }} >View all</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {
                      this.state.reviewData.slice(0, 4).map((item, index)=>{
                        return <ReviewComponent key={index} data={item}/>
                      })
                    }
                  </View>
                </View>
              </View>
          </View>

        </Content>
        <Modal isVisible={this.state.modalVisible == 1}>
          <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={(e)=>{
              this.setState({modalVisible: null, aboutMe: this.props.profile.myInfo.about});
              }}>
                <Icon name='close' style={{fontSize:40}}/>
            </TouchableOpacity>
            <Form style={{width:'100%' }}>
                <Item regular>
                <Input
                    value={ this.state.aboutMe }
                    placeholder="Write something about yourself..."
                    style={{ height: 150, width:'100%', alignSelf: 'flex-start' }}
                    autoCorrect={false}
                    autoCapitalize="none"
                    multiline
                    onChangeText={(text) => this.setState({aboutMe: text})}
                />
                </Item>
            </Form>
            <TouchableOpacity style={[styles.loginBtn,{backgroundColor:'#0B486B', padding:10, marginBottom:10}]} onPress={(e)=>{
              this.setState({modalVisible: null});
              let _this = this;
              this.props.editAbout(this.state.aboutMe, this.props.auth.token, () => {
                _this.updateProfileInfo();
              });
            }}>
              <Text style={styles.btnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.modalVisible == 2}
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
        <ActionSheet
            ref={o => this.ActionSheet = o}
            title={null}
            options={['Cancel', 'Choose from Library...', 'Take a picture...']}
            cancelButtonIndex={0}
            onPress={this.handlePress}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ball: {
    height: 160,
    width: 160,
    borderRadius: 80,
    borderWidth: 80,
    borderColor: 'white',
    // shadowColor: 'black',
    // shadowOpacity: 0.5,
    // shadowRadius: 5,
  },

  socialTextValue: { fontSize: 20, color: 'white', fontWeight: 'bold' },

  socialTextTitle: {
    fontSize: 13, color: 'white'
  },

  socialView: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5
  },

  wrapper: { padding: 10, borderBottomWidth: 1, borderColor: '#EDF4F7' },

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
  btnText:{color:'#fff', fontWeight:'bold'},
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

const mapStateToProps = (state) =>({
    auth: state.auth,
    profile: state.profile
});
const mapDispatchToProps = (dispatch) =>({
    getProfileInfo: (token, userId) => dispatch(actions.getProfileInfo(token, userId)),
    getMyProfileInfo: (token) => dispatch(actions.getMyProfileInfo(token)),
    editAbout: (about, token, next) => dispatch(actions.editAbout(about, token, next)),
    updateProfileImage: (imageUrl, token) => dispatch(actions.updateProfileImage(imageUrl, token)),
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
