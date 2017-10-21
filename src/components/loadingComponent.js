
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
    ActivityIndicator
} from 'react-native';
const { width, height } = Dimensions.get('window');

export default class LoadingComponent extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <View style = {styles.container}>
                <ActivityIndicator
                    style = {styles.activityIndicator}
                    color = 'black'
                    size = 'large'
                />
            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        opacity: 0.7,
        width,
    },
    activityIndicator: {
        flex: 1,
        position: 'relative'
    },
});
