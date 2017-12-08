import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import {Button} from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Modal from 'react-native-modal';
import { Icon } from 'native-base';

class RateComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  onPressModalBtn1(actId) {
    this._row2.closeRow();
    this.setState({modalVisible: false}, () => {
      this.props.deleteMaven(this.props.data._id, this.props.auth.token, () => {
        this.props.onSuccessModal();
      });
    });
  }

  onPressModalBtn2() {
    this.setState({modalVisible: false});
  }

  render () {
    const user = this.props.isMe?this.props.profile.myInfo:this.props.profile.user
    
    return (
    <View style={styles.container}>
      {
        this.props.data.active == 1 && 
  
        <SwipeRow
          ref={component => this._row1 = component}
          rightOpenValue={-100}
          disableRightSwipe={true}
          disableLeftSwipe={!this.props.isMe}
        >
          <View style={styles.standaloneRowBack}>
            <TouchableOpacity style={{width: 100}} onPress={() => {
              this._row1.closeRow();
              this.props.deactivateMaven(this.props.data._id, this.props.auth.token, () => {
                  this.props.onSuccessModal();
              });
              
            }}>
              <View style={{backgroundColor: '#7F7F7F', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.backTextWhite}>Set Offline</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.standaloneRowFront}>
            <TouchableOpacity style={styles.standaloneRowFront} onPress={() => {
                this.props.getMavenDetails(this.props.data._id, this.props.profile.location, this.props.auth.token);
                Actions.skillPage({ title: `${user.firstName} ${user.lastName}`, isMe: this.props.isMe, from: 'profile'})
            }}>
            <View style={styles.container}>
              <View style={{ flexDirection: 'row',flex:1, justifyContent:'flex-start', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'rgba(196, 219, 231, 0.9)', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 17 }}>
                  <Text style={{ color: '#2399E6' }} >{Math.round(this.props.data.rating * 10) / 10}</Text>
                </View>
                <Text style={{ fontSize: 15, paddingLeft: 10, color: '#515151' }}>{this.props.data.title}</Text>
                {
                  this.props.isMe?
                  <View style={{marginLeft: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: '#55AE58', alignSelf: 'flex-start'}}></View>
                  :
                  null
                }
              </View>
              <View style={{flexDirection: 'row',flex:1, justifyContent:'flex-end'}}>
              <StarRating
                disabled
                maxStars={5}
                rating={this.props.data.rating}
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
        this.props.data.active == 0 && this.props.isMe &&
        <SwipeRow
          ref={component => this._row2 = component}
          rightOpenValue={-150}
          disableRightSwipe={true}
          disableLeftSwipe={!this.props.isMe}
        >
          <View style={styles.standaloneRowBack}>
            <TouchableOpacity style={{width: 100}} onPress={() => {
              this._row2.closeRow();
              this.props.activateMaven(this.props.data._id, this.props.auth.token, () => {
                  this.props.onSuccessModal();
              });
            }}>
              <View style={{backgroundColor: '#55AE58', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.backTextWhite}>Set Online</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{width: 50}} onPress={() => {
              this.setState({modalVisible: true});
            }}>
              <View style={{backgroundColor: '#EB4C36', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={require('../../assets/icons/trash.png')} style={{width: 25, height: 25, tintColor: '#FFFFFF'}}/>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.standaloneRowFront}>
            <TouchableOpacity style={styles.standaloneRowFront} onPress={() => {
              this.props.getMavenDetails(this.props.data._id, this.props.profile.location, this.props.auth.token);
              Actions.skillPage({ title: `${user.firstName} ${user.lastName}`, isMe: this.props.isMe, })
            }}>
            <View style={styles.container}>
              <View style={{ flexDirection: 'row',flex:1, justifyContent:'flex-start', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'rgba(196, 219, 231, 0.9)', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 17 }}>
                  <Text style={{ color: '#2399E6' }} >{Math.round(this.props.data.rating * 10) / 10}</Text>
                </View>
                <Text style={{ fontSize: 15, paddingLeft: 10, color: '#515151' }}>{this.props.data.title}</Text>
                <View style={{marginLeft: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: '#7F7F7F', alignSelf: 'flex-start'}}></View>
              </View>
              <View style={{flexDirection: 'row',flex:1, justifyContent:'flex-end'}}>
              <StarRating
                disabled
                maxStars={5}
                rating={this.props.data.rating}
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
      <Modal
        isVisible={this.state.modalVisible}
        >
        <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={(e)=>{
            this.setState({modalVisible: false});
            }}>
              <Icon name='close' style={{fontSize:40}}/>
          </TouchableOpacity>
          <Text style={{fontSize: 20}}>Delete?</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.modalBtn} onPress={() => {this.onPressModalBtn1()}}>
              <Text style={styles.btnText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => {this.onPressModalBtn2()}}>
              <Text style={styles.btnText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    );
  }

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
  },
  btnText: {fontWeight: 'bold', fontSize: 15, color: '#fff'},
  modalBtn:{
    flex:1, padding:10, marginBottom:10, marginTop: 30, marginHorizontal: 10, flexDirection:'row', alignItems:'center',
    justifyContent:'center', borderRadius:10, backgroundColor:'#0B486B',
    height: 50,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1
    }
  },
})

const mapStateToprops = (state) =>({
  auth: state.auth,
  profile: state.profile
});
const mapDispatchToprops = (dispatch) =>({
  activateMaven: (mavenId, token, next) => dispatch(actions.activateMaven(mavenId, token, next)),
  deactivateMaven: (mavenId, token, next) => dispatch(actions.deactivateMaven(mavenId, token, next)),
  deleteMaven: (mavenId, token, next) => dispatch(actions.deleteMaven(mavenId, token, next)),
  getProfileInfo: (token, userId) => dispatch(actions.getProfileInfo(token, userId)),
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToprops, mapDispatchToprops)(RateComponent);