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
    Modal
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, Item, Icon, Container, Content, Input } from 'native-base';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import IconBadge from 'react-native-icon-badge';
import { connect } from 'react-redux';
import LoadingComponent from '../../components/loadingComponent';

class ForgotScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email
        };
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.auth.ValidEmail){
        Actions.replace('resetPassword', {email:this.state.email});
      }
      else
      {
          alert("None Such Email!");
      }
      
  }

    submit = () => {
        //Email validation process
        if (this.state.email.length < 1) {
            alert('Please enter email');
            return;
        }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if (reg.test(this.state.email) === false) {
            alert("Please input correct email");
            return;
        }
         this.props.forgotPassword(this.state.email);
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
        forgotPassword: (email) => dispatch(actions.forgotPassword(email)),
        actions: bindActionCreators(actions, dispatch)
    });
    export default connect(
        mapStateToProps, mapDispatchToProps
    )(ForgotScreen)

    const styles = StyleSheet.create({


        loginBtn: {
            padding: 5, marginTop: 40, flexDirection: 'row', width: '78%', alignSelf: 'center', alignItems: 'center',
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
