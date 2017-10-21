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
// import ImageResizer from 'react-native-image-resizer';
class PrivacyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''

        };
    }
    componentWillReceiveProps(nextProps) {
     
      
  }

    submit = () => {
        Actions.pop();
    }
        render() {
            return (
                <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                    <Text style={styles.info}>
                         
                    </Text>
                    <TouchableOpacity style={[styles.loginBtn, { backgroundColor: '#0B486B', padding: 10, marginBottom: 10 }]} onPress={(e) => this.submit()}>
                        <Text style={styles.btnText}>BACK</Text>
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
    )(PrivacyScreen)

    const styles = StyleSheet.create({
        info:{
            padding:5,
            flexDirection:'row',
            width:'78%',
            alignSelf:'center',
            alignItems:'center',
            justifyContent:'center'
        },

        loginBtn: {
            padding: 5, marginTop: 500, flexDirection: 'row', width: '78%', alignSelf: 'center', alignItems: 'center',
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
