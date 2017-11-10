import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Dimensions,
  Text, TextInput,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { Actions } from 'react-native-router-flux';
import StarRating from 'react-native-star-rating';

const categoryName = {
  'cooking_service' : 'Cooking & Baking',
  'information_service' : 'Information Technology',
  'improvement' : 'Home Improvement',
  'cleaning' : 'Cleaning',
  'beauty' : 'Beauty',
  'photography' : 'Photography',
  'art_service' : 'Art & Design',
  'care' : 'Home Care',
  'pet' : 'Pet related',
  'others_service' : 'Others',
  'school' : 'School Subjects',
  'art_skill' : 'Art & Design',
  'information_skill' : 'Information Technology',
  'sports' : 'Sports & Fitness',
  'music' : 'Music',
  'cooking_skill' : 'Cooking & Baking',
  'others_skill' : 'Others'
};
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class ActivityItem extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentWillMount() {
    
  }

  render() {
    let provider = this.props.provider;
    return (
      <View key={provider._id} style = {{ paddingHorizontal:10, backgroundColor:'#fff' }}>
      <View key={provider._id} style={{ paddingVertical:10, flexDirection: 'row', borderBottomWidth:1, borderBottomColor: '#ececec' }}>
        <View style={{ justifyContent: 'flex-start', flex: 1, alignItems: 'center', paddingTop:5 }}>
        {
          this.props.profile.myInfo.userId === provider.mavenUserID._id?
          <Image source={provider.userID.displayPicture?{uri: provider.userID.displayPicture}:require('../../assets/images/avatar.png')} style={{ height: 70, width: 70, borderRadius: 25 }} />
          :
          <Image source={provider.mavenUserID.displayPicture?{uri: provider.mavenUserID.displayPicture}:require('../../assets/images/avatar.png')} style={{ height: 70, width: 70, borderRadius: 25 }} />
        }
        </View>
        <View style={{ flex: 2, justifyContent:'center', paddingHorizontal:5 }}>
          <TextInput defaultValue={provider.mavenID.title} editable={false} style={{ fontSize:13, color:'#515151', fontWeight:'400', height:17}}></TextInput>
          <TextInput defaultValue={categoryName[provider.mavenID.category]} editable={false} style={{ color:'#145775', height:23, fontSize:12, fontWeight:'400' }}></TextInput>
          {
            this.props.profile.myInfo.userId === provider.mavenUserID._id?
            <Text style={styles.text}>{provider.userID.firstName + ' ' + provider.userID.lastName}</Text>
            :
            <Text style={styles.text}>{provider.mavenUserID.firstName + ' ' + provider.mavenUserID.lastName}</Text>
          }
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical:3}}>
            <StarRating
              disabled
              maxStars={5}
              rating={4.5}
              starSize={15}
              starColor="#FFA838"
              starStyle={{paddingHorizontal:2}}
            />
            <Text style={{ color:'#b5b5b5'}}>({4})</Text>
          </View>
          <Text style={styles.text}>{provider.lastMessage}</Text>
          {
            provider.status !== 0 && 
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={ styles.text} >Offer:</Text>
              <Text style={{ color:'#FFA838', fontSize:15 }} >${provider.price}</Text>
            </View>
          }
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight:10 }}>
          {
            (provider.status === 0 || provider.status === 6 || provider.status === 7 || provider.status === 8) &&
            <View style={styles.container}>
            </View>
          }
          {
            provider.status === 1 && this.props.profile.myInfo.userId === provider.mavenUserID._id &&
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity>
                <Icon name="ios-checkmark-circle" style={{ color:'#00B356' }}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="ios-close-circle" style={{ color:'#F52422' }}/>
              </TouchableOpacity>
            </View>
          }
          {
            provider.status === 1 && this.props.profile.myInfo.userId !== provider.mavenUserID._id &&
            <View style={styles.container}>
              <View style={[styles.btnContainer, {backgroundColor: '#FDF251'}]}>
                  <Text style={styles.btnText}>Offered</Text>
              </View>
            </View>
          }
          {
            provider.status === 2 &&
            <View style={styles.container}>
              <View style={[styles.btnContainer, {backgroundColor: '#54AD57'}]}>
                  <Text style={styles.btnText}>Accepted</Text>
              </View>
            </View>
          }
          {
            provider.status === 3 &&
            <View style={styles.container}>
              <View style={[styles.btnContainer, {backgroundColor: '#DA3832'}]}>
                  <Text style={styles.btnText}>Rejected</Text>
              </View>
            </View>
          }
          {
            provider.status === 4 &&
            <View style={styles.container}>
              <View style={[styles.btnContainer, {backgroundColor: '#EE8640'}]}>
                  <Text style={styles.btnText}>Cancelled</Text>
              </View>
            </View>
          }
          {
            provider.status === 5 &&
            <View style={styles.container}>
              <View style={[styles.btnContainer, {backgroundColor: '#7F7F7F'}]}>
                  <Text style={styles.btnText}>Completed</Text>
              </View>
            </View>
          }
          {
            provider.status === 9 &&
            <View style={styles.container}>
              <View style={[styles.btnContainer, {backgroundColor: '#C3C3C3'}]}>
                  <Text style={styles.btnText}>Archived</Text>
              </View>
            </View>
          }
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Icon name='md-pin' style={{fontSize:15, paddingRight:2, color:'#BFD9E7'}} />
            <Text style={{ fontSize: 15, color:'#b5b5b5', }}>{0.2} km</Text>
          </View>
        </View>
      </View>
    </View>
    );
  }
}

const styles = {
  text:{ fontSize: 12, color:'#b5b5b5' },
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'},
  btnContainer: {width: '100%', paddingVertical: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center'},
  btnText: {fontWeight: 'bold', fontSize: 15, color: '#fff'},
};

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile,
  activity: state.activity,
});
const mapDispatchToProps = (dispatch) =>({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityItem);