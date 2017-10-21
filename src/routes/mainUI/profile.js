import React, { Component } from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, Dimensions ,ListView, RefreshControl } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as actions from '../../actions';
import SkillRowComponent from '../../components/skillRowComponent';
import ReviewComponent from '../../components/reviewComponent';
import LoadingComponent from '../../components/loadingComponent';


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
               "rating": 0,
               "status": 0,
               "mainCategory": 0
           }],
        entryServiceMaven:[{
               "_id": "59c3827010da5e2c2ab86331",
               "title": "Register a service today!",
               "category": "entry",
               "active": false,
               "rating": 0,
               "status": 0,
               "mainCategory": 1
           }],
           reviewData: [],
           refreshing: false,
			//listViewData: Array(20).fill('').map((_,i)=>`item #${i}`)
    };
    //this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }
  componentWillMount() {
    // this.fetchdetails();
  }

  componentDidMount() {
    this.props.getProfileInfo(this.props.auth.token);
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.profile.user !== nextProps.profile.user && nextProps.profile.loading){
      this.setState({requestLoading: false, refreshing: false, reviewData: nextProps.profile.user.reviews ? nextProps.profile.user.reviews.slice(0, 4) : []});
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.getProfileInfo(this.props.auth.token);
  }

  render() {
    const {profile: {user}} = this.props;
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
         
          <View style={{ paddingHorizontal: 10 }} >
            <Image source={require('../../../assets/images/CarouselView/Image1.jpg')} style={{ position:'absolute',flex:1, width: width}}>
              <View style={{ backgroundColor:'rgba(11, 72, 107, 0.9)', width:'100%', height:'100%'}}/>
            </Image>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
              <Image source={ user.displayPicture ? {uri: user.displayPicture} : require('../../../assets/images/avatar.png')} style={{ height: 150, width: 150, borderRadius: 50, borderWidth:3, borderColor:'#fff' }} />
            </View>
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
              <View style={{flex:1, justifyContent: 'center', padding: 5, alignItems: 'center' }}>
                <Text style={styles.socialTextValue}>88</Text>
                <Text style={styles.socialTextTitle}>Saved</Text>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: 'white', padding: 5 }}>
              <View style={styles.wrapper}>
                <Text style={{ fontSize: 16, color:"#515151" }}>About</Text>
                <Text style={{ fontSize: 13, color:"#b5b5b5" }}>I am a dedicated person. I enjoy reading, and the knowledge and perspective that my reading gives me has strengthened my teaching skills....</Text>
              </View>
             {
                    mavenList.map((item, index) => {
                      return <SkillRowComponent key={index} data={item} />
                    }) 
              }
              <View>
                <View style={{ paddingBottom: 10 }}>
                  <View style={{ padding: 10, flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                    <View style={{  flexDirection: 'row', alignItems:'center' }}>
                      <Text style={{ fontSize: 16, color:'#515151' }}>Reviews</Text>
                      <Text style={{color:'#b5b5b5'}}> (</Text><Text style={{color:'#b5b5b5'}}>{user.reviews.length}</Text><Text style={{color:'#b5b5b5'}}>)</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ reviewData: user.reviews })}>
                      <Text style={{ color:'#FFA838' }} >View all</Text>
                    </TouchableOpacity>
                  </View>  
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {
                      this.state.reviewData.map((item, index)=>{
                        return <ReviewComponent key={index} data={item}/>
                      })
                    }
                  </View>
                </View>
              </View>
          </View>

        </Content>
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

  wrapper: { padding: 10, borderBottomWidth: 1, borderColor: '#EDF4F7' }
 
});

const mapStateToProps = (state) =>({
    auth: state.auth,
    profile: state.profile
});
const mapDispatchToProps = (dispatch) =>({
    getProfileInfo: (token) => dispatch(actions.getProfileInfo(token)),
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);


