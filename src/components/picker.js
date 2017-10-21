import React from 'react';
import { Icon } from 'native-base';
import { StyleSheet, Text, View, Animated, Picker, Dimensions, TouchableHighlight, Platform } from 'react-native';

var deviceHeight = Dimensions.get('window').height;
var PickerItem = Picker.Item; 
export default class PickerModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.show,
            value: 0
        };
    }

    componentDidMount() {
        Animated.timing(this.props.offSet, {
            duration: 300,
            toValue: 0
        }).start()
    }
    closeModal= () => {
        Animated.timing(this.props.offSet, {
            duration: 300,
            toValue: deviceHeight
        }).start(this.props.closeModal);
    }
    onChange = (value) => {
        if(Platform.OS==="ios"){
            this.setState({value:value});
        }
        else{
            if(value==0) return;
            this.props.changeValue(value);
            this.closeModal()
        }
    }
    render() {
        return (
            <Animated.View style={{ transform: [{ translateY: this.props.offSet }],backgroundColor:'#d3d4d9' }}>
                <View style={styles.closeButtonContainer}>
                <TouchableHighlight onPress={this.closeModal} underlayColor="transparent" style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableHighlight>
                {
                    Platform.OS==="ios" &&
                    <TouchableHighlight onPress={(e)=>{this.props.changeValue(this.state.value);this.closeModal()}} underlayColor="transparent" style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Select</Text>
                    </TouchableHighlight>
                }
            </View>

                <Picker itemStyle={{ justifyContent:'center', height:150, color:'#027afe'}}
                    selectedValue={this.state.value}
                    onValueChange={(value) => { this.onChange(value) }}>
                    {this.props.data.map((value, index) => (
                        <PickerItem
                            key={index}
                            value={index}
                            label={value}
                        />
                    ))}
                </Picker>
            </Animated.View>
        )
    }
};
const styles = StyleSheet.create({
    closeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:"#eef0ef",
        borderTopColor: '#e2e2e2',
        borderTopWidth: 1,
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1
    },
    closeButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    closeButtonText: {
        color: '#027afe',
        fontSize:17
    },
    
})

