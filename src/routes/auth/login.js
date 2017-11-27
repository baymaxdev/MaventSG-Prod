'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
  AsyncStorage,
  NetInfo
} from 'react-native';
import { Location, Permissions, Font } from 'expo';
import { Actions } from 'react-native-router-flux';
import { Form, Item, Icon, Container, Content, Input } from 'native-base';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import LoadingComponent from '../../components/loadingComponent';
import Modal1 from 'react-native-modal';
import Swiper from 'react-native-swiper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
       showLoginModal: false,
       email:'demo3@gmail.com',
       password:'password',
       modalVisible: false,
       tutorModalVisible: false,
       loading: true,
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
        'Arial': require('../../../assets/fonts/arial.ttf'),
    });
    
    this.getFirstLoad();
    this.getToken();
  }

  componentDidMount() {
    this.getLocationAsync();
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  async getToken() {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token !== null) {
            // this.props.requestLoginWithToken(token);
        }
        this.setState({loading: false});
    } catch (error) {

    }
  }

  async saveToken(token) {
    try {
        await AsyncStorage.setItem('token', token);
    } catch (error) {
        
    }
  }

  async getFirstLoad() {
    try {
        const FirstLoad = await AsyncStorage.getItem('FirstLoad');
        if (FirstLoad === null) {
            this.setState({tutorModalVisible: true});
            this.saveFirstLoad();
        }
    } catch (error) {

    }
  }

  async saveFirstLoad() {
    try {
        await AsyncStorage.setItem('FirstLoad', 'No');
    } catch (error) {
        
    }
  }

  componentWillReceiveProps(nextProps) {
      if(this.props.auth.loginLoading !== nextProps.auth.loginLoading && !nextProps.auth.loginLoading && nextProps.auth.loggedIn){
        this.props.getMyProfileInfo(nextProps.auth.token);
        if (this.props.auth.autoLogin !== true) {
            this.saveToken(nextProps.auth.token);
        }
        Actions.main();
      }
      if(this.props.auth.loginLoading !== nextProps.auth.loginLoading && !nextProps.auth.loginLoading && !nextProps.auth.loggedIn){
        if (nextProps.auth.status === 404) {
            Actions.signup({from: 'fb'});
        } else if(nextProps.auth.status === 401) {
            Actions.OTP({phoneState: "2", userId: nextProps.auth.userId});
        }
        else{
            alert('Invalid User');
        }
      }
  }

  handleConnectivityChange = (isConnected) => {
      if (isConnected === false) {
          this.setState({modalVisible: true});
          setTimeout(() => {
              this.setState({modalVisible: false});
            }, 2000);
      }
  }

  onShowLoginDialog = () => {
    this.setState({showLoginModal:true});
  }

  onLogin = () => {
      if(this.state.email.length<1) {
          alert('Please enter email');
          return;
      }
      if(this.state.password.length<1) {
          alert('Please enter password');
          return;
      }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if (reg.test(this.state.email) === false) {
            alert("Please input correct email");
            return;
        }
      this.setState({showLoginModal:false});
      this.props.requestLogin(this.state.email, this.state.password);
  }

  async getLocationAsync() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
        Location.getCurrentPositionAsync({ enableHighAccuracy: true, maximumAge: 600000 }).then((position) => {
            const userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.004500214972604111,
                longitudeDelta: 0.008444935083389282,
            };
            this.props.setLocation(userLocation);
        }).catch((e) => {
            // this one is firing the error instantly
            alert(e + ' Please make sure your location (GPS) is turned on.');
        });
    } else {
        throw new Error('Location permission not granted');
    }
  }

  onForgotPassword = () => {
        this.setState({showLoginModal:false});
        Actions.forgotScreen({email: this.state.email});
  }

  onFacebookLogin = () => {
      this.props.facebookLogin();
  }
  render() {
    return (
        this.state.loading?
        <View style={{flex: 1, backgroundColor: 'white'}}/>
        :
        <View style={{flex: 1, justifyContent:'center' }}>
            <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <Image source={require('../../../assets/images/CarouselView/Image2.jpg')} style={{ flex: 1, height: SCREEN_HEIGHT / 2 , width: SCREEN_WIDTH, opacity: 0.4 }} blurRadius={3} />
                <View style={{ position: 'absolute' }}>
                  <Image source={require('../../../assets/images/mavent_logo.png')} style={styles.LogoImage} />
                  <View style={{ alignItems: 'center', width: '100%', paddingTop: 10 }}>
                      <Text style={{ textAlign: 'center', fontSize: 30, color: '#0B486B', backgroundColor: 'rgba(0,0,0,0)', fontWeight: '700' }}>M A V E N T</Text>
                  </View>
                </View>
            </View>
            <Container marginTop={15}>
                <Content style={{padding:10}}>
                    <TouchableOpacity style={[styles.loginBtn,{backgroundColor:'#0B486B'}]} onPress={(e)=>this.onShowLoginDialog()}>
                        <Icon name='mail' style={{color:'#fff', paddingRight:10}} />
                        <Text style={styles.btnText}>Login with Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {(e) => this.onFacebookLogin()} style={[styles.loginBtn,{backgroundColor:'#3B5895'}]}>
                        <Icon name='logo-facebook' style={{color:'#fff', paddingRight:10}} />
                        <Text style={styles.btnText}>Continue with Facebook</Text>
                    </TouchableOpacity>
                    <Text style={{alignSelf:'center', paddingTop:20, paddingBottom:5, fontWeight:'bold'}}>OR</Text>
                    <TouchableOpacity style={[styles.loginBtn,{borderWidth:1.5, borderColor:'#0B486B', padding:10, shadowRadius:1}]} onPress={(e)=>{Actions.signup({from: 'login'})}}>
                        <Text style={{color:'#0B486B', fontWeight:'bold'}}>Sign up</Text>
                    </TouchableOpacity>
                    <Modal1 isVisible={this.state.showLoginModal}>
                        <View style={styles.loginModal}>
                            <View style={{backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10, borderWidth:1, borderRadius:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={(e)=>this.setState({showLoginModal:false})}>
                                    <Icon name='close' style={{fontSize:40}}/>
                                </TouchableOpacity>
                                <Form style={{width:'100%' }}>
                                    <Item rounded>
                                    <Icon active name='mail' style={{ color: 'grey' }}/>
                                    <Input
                                        returnKeyType="next"
                                        keyboardType="email-address"
                                        value={ this.state.email }
                                        placeholder="Email"
                                        style={{ height: 40, width:'100%'}}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        onChangeText={(text) => this.setState({email: text})}
                                        onSubmitEditing={(e)=>{this.refs.password._root.focus()}}
                                    />
                                    </Item>
                                    <Item rounded style={{ marginTop: 20 }}>
                                    <Icon active name='lock' style={{ color: 'grey' }}/>
                                    <Input
                                        ref="password"
                                        value={ this.state.password }
                                        placeholder="Password"
                                        style={{ height: 40 }}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        secureTextEntry
                                        onChangeText={(text) => this.setState({password: text})}
                                    />
                                    </Item>
                                </Form>
                                <TouchableOpacity style={{paddingTop:20, paddingBottom:5}} onPress={(e)=>this.onForgotPassword()}>
                                    <Text>Forgot Password?</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.loginBtn,{backgroundColor:'#0B486B', padding:10, marginBottom:10}]} onPress={(e)=>this.onLogin()}>
                                <Text style={styles.btnText}>SIGN IN</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </Modal1>
                </Content>
            </Container>
            <Text style={{alignSelf:'center', padding:10}}>Beta v 1.0.0</Text>
            {
             this.props.auth.loginLoading &&
                <LoadingComponent/>
            }
            <Modal1
                isVisible={this.state.modalVisible}
                animationIn={'slideInLeft'}
                animationOut={'slideOutRight'}
                animationInTiming={500}
                animationOutTiming={500}
                >
                <View style={styles.modalContent}>
                    <Icon name='md-warning' style={{fontSize:40, paddingHorizontal: 8, color: 'red' }}/>
                    <Text>No Network Connection</Text>
                </View>
            </Modal1>
            <Modal
                visible={this.state.tutorModalVisible}
                onRequestClose={() => {this.setState({tutorModalVisible: false})}}
                >
                <Swiper style={styles.wrapper} showsButtons={true} loop={false}>
                    <View style={styles.tutorView}>
                        <Text style={styles.tutorText}>Hello Swiper</Text>
                    </View>
                    <View style={styles.tutorView}>
                        <Text style={styles.tutorText}>Beautiful</Text>
                    </View>
                    <View style={styles.tutorView}>
                        <Text style={styles.tutorText}>And simple</Text>
                        <TouchableOpacity style={[styles.loginBtn,{backgroundColor:'#0B486B', position: 'absolute', bottom: 50}]} onPress={(e) => this.setState({tutorModalVisible: false})}>
                            <Text style={styles.btnText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </Swiper>
            </Modal>
        </View>

    );
  }
}

const styles = StyleSheet.create({
    LogoImage: {
        height: 200,
        width: 200,
        resizeMode:'contain',
        marginLeft: 20
    },
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
    loginModal: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      wrapper: {
        
    },
    tutorView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    tutorText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
      }
});

const mapStateToProps = (state) =>({
    auth: state.auth
});
const mapDispatchToProps = (dispatch) =>({
    requestLogin: (email, password) => dispatch(actions.requestLogin(email, password)),
    requestLoginWithToken: (token) => dispatch(actions.requestLoginWithToken(token)),
    facebookLogin: () => dispatch(actions.facebookLogin()),
    setLocation: (location) => dispatch(actions.setLocation(location)),
    getMyProfileInfo: (token) => dispatch(actions.getMyProfileInfo(token)),
    actions: bindActionCreators(actions, dispatch)
});
export default connect(
    mapStateToProps, mapDispatchToProps
)(Login)
