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
 
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, Item, Icon, Container, Content, Input } from 'native-base';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import IconBadge from 'react-native-icon-badge';
import { ImagePicker } from 'expo';
import DatePicker from 'react-native-datepicker'
import { connect } from 'react-redux';
import LoadingComponent from '../../components/loadingComponent';

class resetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password:'',
            otp:''

        };
    }
    componentWillMount(){
        this.state.email = this.props.email;
    }

    async saveToken(token) {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            
        }
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.auth.resetPasswordSuccess){
        this.props.getMyProfileInfo(nextProps.auth.token);
        this.saveToken(nextProps.auth.token);
        Actions.main();
      }
      else
      {
          alert("Sorry,Please check your OTP");
      }
  }
    submit = () => {
        //Validation 
        if (this.state.email.length < 1) {
            alert('Please enter email');
            return;
        }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if (reg.test(this.state.email) === false) {
            alert("Please input correct email");
            return;
        }
        this.props.resetPasswordfunc(this.state.email,this.state.password,this.state.otp);
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                <Form style={{ width: '78%', alignSelf: 'center', alignItems: 'center' }}>
                    <Item rounded>
                        <Icon active name='mail' style={{ color: 'grey' }} />
                        <Input
                            returnKeyType="next"
                            keyboardType="email-address"
                            value={this.state.email}
                            placeholder="Email"
                            style={{ height: 40, width: '100%' }}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={(text) => this.setState({ email: text })}
                            onSubmitEditing={(e) => { this.refs.password._root.focus() }}
                        />
                    </Item>
                    <Item rounded style={{ marginTop: 20 }}>
                        <Icon active name='lock' style={{ color: 'grey' }} />
                        <Input
                            ref="password"
                            value={this.state.password}
                            placeholder="New Password"
                            style={{ height: 40 }}
                            autoCorrect={false}
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={(text) => this.setState({ password: text })}
                        />
                    </Item>
                    <Item rounded style={{ marginTop: 20 }}>
                         <Icon active name='lock' style={{ color: 'grey' }} />
                        <Input
                            ref="otp"
                            value={this.state.otp}
                            placeholder="OTP"
                            style={{ height: 40 }}
                            autoCorrect={false}
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={(text) => this.setState({ otp: text })}
                        />
                    </Item>
                </Form>

                <TouchableOpacity style={[styles.loginBtn, { backgroundColor: '#0B486B', padding: 10, marginBottom: 10 }]} onPress={(e) => this.submit()}>
                    <Text style={styles.btnText}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = (state) => ({
    auth:state.auth
});

const mapDispatchToProps = (dispatch) => ({
    resetPasswordfunc: (email,password,otp) => dispatch(actions.resetPasswordfunc(email,password,otp)),
    getMyProfileInfo: (token) => dispatch(actions.getMyProfileInfo(token)),
    actions: bindActionCreators(actions, dispatch)
});
export default connect(
    mapStateToProps, mapDispatchToProps
)(resetPassword)

const styles = StyleSheet.create({

    loginBtn: {
        padding: 5, marginTop: 15, flexDirection: 'row', width: '78%', alignSelf: 'center', alignItems: 'center',
        justifyContent: 'center', borderRadius: 10,
        height: 50,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 1
        }
    },
    btnText: { color: '#fff', fontWeight: 'bold' },

});
