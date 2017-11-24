import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import {Button} from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

const RateComponent = (props) => {
  const user = props.isMe?props.profile.myInfo:props.profile.user

  return <View style={styles.container}>
    {
      props.data.active == 1 && 

      <SwipeRow
        ref={component => this._row1 = component}
        rightOpenValue={-100}
        disableRightSwipe={true}
        disableLeftSwipe={!props.isMe}
      >
        <View style={styles.standaloneRowBack}>
          <TouchableOpacity style={{width: 100}} onPress={() => {
            this._row1.closeRow();
            props.deactivateMaven(props.data._id, props.auth.token, () => {
                props.onSuccessModal();
            });
            
          }}>
            <View style={{backgroundColor: '#7F7F7F', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.backTextWhite}>Set Offline</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.standaloneRowFront}>
          <TouchableOpacity style={styles.standaloneRowFront} onPress={() => {
              props.getMavenDetails(props.data._id, props.profile.location, props.auth.token);
              Actions.skillPage({ title: `${user.firstName} ${user.lastName}`, isMe: props.isMe, from: 'profile'})
          }}>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row',flex:1, justifyContent:'flex-start', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(196, 219, 231, 0.9)', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 17 }}>
                <Text style={{ color: '#2399E6' }} >{Math.round(props.data.rating * 10) / 10}</Text>
              </View>
              <Text style={{ fontSize: 15, paddingLeft: 10, color: '#515151' }}>{props.data.title}</Text>
              {
                props.isMe?
                <View style={{marginLeft: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: '#55AE58', alignSelf: 'flex-start'}}></View>
                :
                null
              }
            </View>
            <View style={{flexDirection: 'row',flex:1, justifyContent:'flex-end'}}>
            <StarRating
              disabled
              maxStars={5}
              rating={props.data.rating}
              starSize={20}
              starColor="#FFA838"
              starStyle={{ paddingHorizontal: 2 }}
            />
            </View>
          </View>
          </TouchableOpacity>
        </View>
      </SwipeRow>
    }
    {
      props.data.active == 0 && props.isMe &&
      <SwipeRow
        ref={component => this._row2 = component}
        rightOpenValue={-150}
        disableRightSwipe={true}
        disableLeftSwipe={!props.isMe}
      >
        <View style={styles.standaloneRowBack}>
          <TouchableOpacity style={{width: 100}} onPress={() => {
            this._row2.closeRow();
            props.activateMaven(props.data._id, props.auth.token, () => {
                props.onSuccessModal();
            });
          }}>
            <View style={{backgroundColor: '#55AE58', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.backTextWhite}>Set Online</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{width: 50}} onPress={() => {
            this._row2.closeRow();
            props.deleteMaven(props.data._id, props.auth.token, () => {
                props.onSuccessModal();
            });
          }}>
            <View style={{backgroundColor: '#EB4C36', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require('../../assets/icons/trash.png')} style={{width: 25, height: 25, tintColor: '#FFFFFF'}}/>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.standaloneRowFront}>
          <TouchableOpacity style={styles.standaloneRowFront} onPress={() => {
            props.getMavenDetails(props.data._id, props.profile.location, props.auth.token);
            Actions.skillPage({ title: `${user.firstName} ${user.lastName}`, isMe: props.isMe, })
          }}>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row',flex:1, justifyContent:'flex-start', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(196, 219, 231, 0.9)', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 17 }}>
                <Text style={{ color: '#2399E6' }} >{props.data.rating}</Text>
              </View>
              <Text style={{ fontSize: 15, paddingLeft: 10, color: '#515151' }}>{props.data.title}</Text>
              <View style={{marginLeft: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: '#7F7F7F', alignSelf: 'flex-start'}}></View>
            </View>
            <View style={{flexDirection: 'row',flex:1, justifyContent:'flex-end'}}>
            <StarRating
              disabled
              maxStars={5}
              rating={props.data.rating}
              starSize={20}
              starColor="#FFA838"
              starStyle={{ paddingHorizontal: 2 }}
            />
            </View>
          </View>
          </TouchableOpacity>
        </View>
      </SwipeRow>
    }
  </View>

};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10
  },
  standalone: {
    marginTop: 30,
    marginBottom: 30,
  },
  standaloneRowFront: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    //justifyContent: 'center',
    height: 50,
  },
  standaloneRowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backTextWhite: {
    color: '#fff'
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    width: 100,
  }
})

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile
});
const mapDispatchToProps = (dispatch) =>({
  activateMaven: (mavenId, token, next) => dispatch(actions.activateMaven(mavenId, token, next)),
  deactivateMaven: (mavenId, token, next) => dispatch(actions.deactivateMaven(mavenId, token, next)),
  deleteMaven: (mavenId, token, next) => dispatch(actions.deleteMaven(mavenId, token, next)),
  getProfileInfo: (token, userId) => dispatch(actions.getProfileInfo(token, userId)),
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RateComponent);