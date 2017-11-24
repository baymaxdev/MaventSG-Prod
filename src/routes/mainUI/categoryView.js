import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Platform, Text, Image, BackHandler, ToastAndroid } from 'react-native';
import { Container, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import RenderItem from '../../components/categoryItem';
import CarouselComponent from '../../components/carouselComponent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import { Permissions, Notifications } from 'expo';

const { width, height } = Dimensions.get('window');

const imageDetails = [
    {
        name: 'Get a Service',
        id: 'service',
        image: require('../../../assets/images/ListView/Get_a_service.jpg')
    },
    {
        name: 'Learn a Skill',
        id: 'learn',
        image: require('../../../assets/images/ListView/Learn_a_skill.jpeg')
    },
    {
        name: 'Provide a Service',
        id: 'provide',
        image: require('../../../assets/images/ListView/Provide_service.jpg')
    },
    {
        name: 'Teach a Skill',
        id: 'teach',
        image: require('../../../assets/images/ListView/teach_skill.jpeg')
    },
];

var backButtonPressedOnce = false;
var isFirstLoad = true;

class CategoryView extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
      }

    async registerForPushNotificationsAsync() {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
      
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
          // Android remote notification permissions are granted during the app
          // install, so this will only ask on iOS
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
      
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
          return;
        }
      
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        this.props.savePushToken(token, this.props.auth.token);
    }

    componentDidMount() {
        if (isFirstLoad) {
            isFirstLoad = false;
            this.registerForPushNotificationsAsync();
        }
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        if (Actions.currentScene === '_categoryView') {
            if (backButtonPressedOnce === true) {
                Actions.pop();
                Actions.pop();
            } else {
                ToastAndroid.show('Press one more time to go back', ToastAndroid.SHORT);
                backButtonPressedOnce = true;
                setTimeout(function() {
                    backButtonPressedOnce = false;
                }, 2000);
            }
            return true;
        }
        Actions.pop();
        return true;
    }

    render() {
        return (
            <View style={{flex:1}}>
                <CarouselComponent/>
                    <View style={{flex:1}}>
                       {imageDetails.map((item, index)=>{
                           if(index % 2 == 0){
                            return <View key={index} style={{  flex:1, flexDirection:'row', paddingTop:3, justifyContent:'space-around', alignItems:'flex-start'}}>
                                <RenderItem data={imageDetails[index]} />
                                {
                                    imageDetails[index+1] &&
                                        <RenderItem data={imageDetails[index+1]} />
                                }
                            </View>
                           }
                        })}
                    </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({

    list: {
        borderWidth:1, width:width, height:height,backgroundColor:'red',

  },

});

const mapStateToProps = (state) =>({
    auth: state.auth,
});
  
const mapDispatchToProps = (dispatch) =>({
    getMyProfileInfo: (token) => dispatch(actions.getMyProfileInfo(token)),
    savePushToken: (pushToken, token) => dispatch(actions.savePushToken(pushToken, token)),
    actions: bindActionCreators(actions, dispatch)
});
  
export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);