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
  Modal
} from 'react-native';
import { Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import StarRating from 'react-native-star-rating';
import DatePicker from 'react-native-datepicker';
import Gallery from 'react-native-image-gallery';
import LoadingComponent from '../../components/loadingComponent';

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
        picUrl: [require('../../../assets/images/CarouselView/Image1.jpg'), require('../../../assets/images/CarouselView/Image2.jpg'), require('../../../assets/images/CarouselView/Image3.jpg')],
        user: {},
        distance: 0,
        description: '',
        price: 0,
        rating: 0,
        modalVisible: false,
        requestLoading: true,
        idVerified: false,
    };
  }

  componentDidMount() {
    if (this.props.isMe) {
      Actions.refresh({rightButtonImage: require('../../../assets/icons/edit.png'), onRight: () => {Actions.genericBooking()}});
    } else {
      Actions.refresh({rightButtonImage: require('../../../assets/icons/morecopy.png'), onRight: () => {Actions.genericBooking()}});
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps =      ", nextProps);
    if (nextProps.maven != undefined) {
      var m = nextProps.maven.maven;
      var da = m.dayAvailable.split(',').map(function(item) {
        return parseInt(item, 10);
      });
      var av = this.state.availability;
      for (var i = 0; i < da.length; i++) {
        av[da[i]].value = true;
      }

      var ta = m.timeAvailable.split(',').map(function(item) {
        return parseInt(item, 10);
      });
      var avt = this.state.availableTime;
      for (i = 0; i < ta.length; i++) {
        avt[ta[i]].value = true;
      }
      this.setState({maven: nextProps.maven, user: m.userID, distance: nextProps.maven.distance, description: m.description, price: m.price, 
        rating: m.rating, availability: av, availableTime:avt, reviewData: m.reviews, picUrl: m.pictures, requestLoading: false, idVerified: m.userID.idVerified});
    }
  }

  onClickAvailability = (index) => {
    // let temp = this.state.availability;
    // temp[index].value = !temp[index].value;
    // this.setState({ availability:temp});
  }

  onClickAvailableTime = (index) => {
    // let temp = this.state.availableTime;
    // temp[index].value = !temp[index].value;
    // this.setState({ availableTime:temp});
  }

  render() {
    var picFlag = true;
    if (this.state.picUrl[0] == undefined && this.state.picUrl[1] == undefined && this.state.picUrl[2] == undefined) {
      picFlag = false;
    }
    
    return (
      this.state.requestLoading?
      <LoadingComponent/>
      :
      <View style={ styles.container}>
        <ScrollView>
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
              picFlag?
              <View style={{ marginTop: 3,  flexDirection:'row' }}>
                <TouchableOpacity style={ styles.photoView } onPress={(e)=>{
                    this.setState({ modalVisible: true});
                    initialPage = 0;
                  }} >
                  {
                    this.state.picUrl[0]?
                    <Image source={{ uri: this.state.picUrl[0] }} style={{ width:'100%', height:'100%' }}/>
                    :
                    <View></View>
                  }
                </TouchableOpacity>
                <TouchableOpacity style={ styles.photoView } onPress={(e)=>{
                    this.setState({ modalVisible: true});
                    initialPage = 1;
                  }} >
                  {
                    this.state.picUrl[1]?
                    <Image source={{ uri: this.state.picUrl[1] }} style={{ width:'100%', height:'100%' }}/>
                    :
                    <View></View>
                  }
                </TouchableOpacity>
                <TouchableOpacity style={ styles.photoView } onPress={(e)=>{
                    this.setState({ modalVisible: true});
                    initialPage = 2;
                  }} >
                  {
                    this.state.picUrl[2]?
                    <Image source={{ uri: this.state.picUrl[2] }} style={{ width:'100%', height:'100%' }}/>
                    :
                    <View></View>
                  }
                </TouchableOpacity>
              </View>
              :
              <View></View>
            }
            <View style={ [styles.viewContainer,{ paddingTop:0 }] } >
              <Text style={ styles.subjectText }>{this.state.title}</Text>
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
              <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={ styles.subjectText }>Ratings and Reviews</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <StarRating
                    disabled
                    maxStars={5}
                    rating={this.state.rating}
                    starSize={15}
                    starColor="#FFA838"
                    starStyle={{paddingHorizontal:2}}
                  />
                  <Text style={{ color:'#b5b5b5'}}>{'('+this.state.rating+')'}</Text>
                </View>
              </View>
            </View>
            {
              this.state.reviewData.map((item,index)=>{
                return <View key={index} style={ [styles.viewContainer, {flexDirection:'row', alignItems:'center' }] }>
                  <Image source={require('../../../assets/images/profile.png')} style={{ height: 70, width: 70, borderRadius: 25 }} />
                  <View style={{paddingHorizontal:10, flex:1}} >
                    <Text style={ styles.subjectText }>{item.name}</Text>
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
                    <Text style={ styles.contentText }>{item.description}</Text>
                  </View>
                </View>
              })
            }
            <TouchableOpacity style={{ justifyContent:'center', alignItems:'center', paddingVertical:15 }}>
              <Text style={{ fontSize: 17, color:"#FFA838" }} >Other services by this Maven</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{ flexDirection:'row'}} >
          <TouchableOpacity style={ [styles.btnView, {backgroundColor:'#004869'}] } onPress={() => {
            Actions.genericBooking({ title: this.props.title, item: this.state.maven });
            }}>
            <Text style={styles.btnText}>SKILL REQUEST</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ [styles.btnView, {backgroundColor:'#fc912f'}] } onPress={()=>{
            this.props.getMavenDetails(this.state.maven.maven._id, this.props.profile.location, this.props.auth.token);
            Actions.chatPage({title: this.props.title});
          }} >
            <Text style={styles.btnText}>CHAT</Text>
          </TouchableOpacity>
        </View>
        {this.renderModal()}
      </View>
    );
  }

  renderModal() {
    return (
      <View>
        <Modal
        animationType={"none"}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}>
        <TouchableWithoutFeedback  onPress={()=>{this.setState({modalVisible: false})}}>
          <View style={{width: SCREEN_WIDTH, height: (SCREEN_HEIGHT - SCREEN_WIDTH) / 2, backgroundColor: 'black'}}></View>
        </TouchableWithoutFeedback>
        <Gallery
          initialPage={initialPage}
          style={{backgroundColor: 'white', flex: 1}}
          images={[
            { source: { uri: this.state.picUrl[0] }},
            { source: { uri: this.state.picUrl[1] }},
            { source: { uri: this.state.picUrl[2] }}
          ]}
        />
        <TouchableWithoutFeedback  onPress={()=>{this.setState({modalVisible: false})}}>
          <View style={{width: SCREEN_WIDTH, height: (SCREEN_HEIGHT - SCREEN_WIDTH) / 2, backgroundColor: 'black'}}></View>
        </TouchableWithoutFeedback>
        </Modal>
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
  photoView: { flex:1, borderWidth:1, borderRadius:3, borderColor: '#ccc', height:80, 
  backgroundColor:'#fff', justifyContent:"center", alignItems:'center' }
  
});

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  maven: state.explore.maven
});

const mapDispatchToProps = (dispatch) =>({
  getProfileInfo: (token, userId) => dispatch(actions.getProfileInfo(token, userId)),
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SkillPage);
