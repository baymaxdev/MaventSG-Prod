import React from 'react';
import { Icon, Card } from 'native-base';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import LoadingComponent from '../../components/loadingComponent';

class Otp extends React.Component {
  constructor(props) {
     super(props);
     this.count = 0;
     this.state = {
         value1:'',
         value2:'',
         value3:'',
         value4:'',
         value5:'',
         phoneNumber: ''
     };
   }

   componentWillReceiveProps(nextProps) {
      if(this.props.auth.verifyLoading !== nextProps.auth.verifyLoading && !nextProps.auth.verifyLoading && nextProps.auth.verifyOtp){
        Actions.main();
      }
      if(this.props.auth.verifyLoading !== nextProps.auth.verifyLoading && !nextProps.auth.verifyLoading && !nextProps.auth.verifyOtp){
        alert(nextProps.auth.verifyMsg);
      }
  }

   componentDidMount(){
       if(this.props.phoneState === "1") this.props.generateOTP(this.props.auth.phoneNumber);
   }

   onChange = (text, index) => {
       switch(index){
           case 1:
            this.setState({value1:text});
            if(text.length) this.refs.text2.focus();
            break;
           case 2:
            this.setState({value2:text});
            if(text.length) this.refs.text3.focus();
            break;
           case 3:
            this.setState({value3:text});
            if(text.length) this.refs.text4.focus();
            break;
          case 4:
            this.setState({value4:text});
            if(text.length) this.refs.text5.focus();
            break;
           case 5:
            this.setState({value5:text});
            if(text.length) this.refs.text5.blur();
            break;
            
       }
   }

   onGenerate = () => {
       this.count = this.count + 1;
       if(this.count > 3) {
           alert("you cannot try more than 3 times.");
           return;
       }
       if(this.props.phoneState === "2" && this.state.phoneNumber.length < 1) {
           alert("input phoneNumber");
           return;
       }
       let phoneNumber = this.props.phoneState === "1" ? this.props.auth.phoneNumber : this.state.phoneNumber;
       this.props.generateOTP(phoneNumber);
   }

   onVerify = () => {
       if(this.state.value1.length < 1 || this.state.value2.length < 1 || this.state.value3.length < 1) {
            alert("please fill");
            return;
       }
       let phoneNumber = this.props.phoneState === "1" ? this.props.auth.phoneNumber : this.state.phoneNumber;
       let otp = this.state.value1 + this.state.value2 + this.state.value3 + this.state.value4 + this.state.value5;
       this.props.verifyOtp(phoneNumber, otp);
   }

   render() {
    return (
        <View style={styles.container}>
            <Text style={{fontWeight:'bold', textAlign:'center'}} >JUST ONE MORE STEP... </Text>
            <View style={{paddingVertical:30}} >
                <Text style={{fontSize:12, textAlign:'center'}} >Type your activation code sent to</Text>
                <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <Text style={{fontWeight:'bold',textAlign:'center'}}> +65 </Text>
                    {
                        this.props.phoneState === "1" ?
                            <Text style={{fontWeight:'bold', textAlign:'center'}}>{this.props.auth.phoneNumber}</Text>
                        :
                        <TextInput
                            ref='phoneNumber'
                            keyboardType="phone-pad"
                            autoCapitalize="none"
                            style={styles.phoneInput}
                            placeholder="Your mobile number"
                            maxLength={8}
                            onChangeText={(text) => this.setState({phoneNumber:text})}
                            value={this.state.phoneNumber}
                        />
                    }
                </View>
            </View>
            <View style={{paddingHorizontal:10, flexDirection:'row', justifyContent:'space-around', alignItems:'center', width:'100%'}}>
                <Card>
                    <TextInput ref="text1" value={this.state.value1} keyboardType="numeric" maxLength={1} 
                    onChangeText={(text)=>this.onChange(text,1)} style={styles.textInput}/>
                </Card>
                <Card>
                    <TextInput ref="text2" value={this.state.value2} keyboardType="numeric" maxLength={1} 
                    onChangeText={(text)=>this.onChange(text,2)} style={styles.textInput}/>
                </Card>
                <Card>
                    <TextInput ref="text3" value={this.state.value3} keyboardType="numeric" maxLength={1} 
                    onChangeText={(text)=>this.onChange(text,3)} style={styles.textInput}/>
                </Card>
                <Card>
                    <TextInput ref="text4" value={this.state.value4} keyboardType="numeric" maxLength={1} 
                    onChangeText={(text)=>this.onChange(text,4)} style={styles.textInput}/>
                </Card>
                <Card>
                    <TextInput ref="text5" value={this.state.value5} keyboardType="numeric" maxLength={1} 
                    onChangeText={(text)=>this.onChange(text,5)} style={styles.textInput}/>
                </Card>
            </View>
            <TouchableOpacity style={styles.btn} onPress = {(e) => this.onGenerate()} >
                <Text style={{color:'#fff', fontWeight:'bold', textAlign:'center'}} >RESEND CODE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress = {(e) => this.onVerify()} >
                <Text style={{color:'#fff', fontWeight:'bold', textAlign:'center'}} >Verify OTP</Text>
            </TouchableOpacity>
            {
             this.props.auth.verifyLoading &&
                <LoadingComponent/>
            }
        </View>
     
    )}
};
const mapStateToProps = (state) =>({
    auth: state.auth
});
const mapDispatchToProps = (dispatch) =>({
    generateOTP: (phoneNumber) => dispatch(actions.generateOTP(phoneNumber)),
    verifyOtp: (phoneNumber, otp) =>dispatch(actions.verifyOtp(phoneNumber, otp)),
    actions: bindActionCreators(actions, dispatch)
});
export default connect(
    mapStateToProps, mapDispatchToProps
)(Otp)

const styles = StyleSheet.create({
    container:{
        flex:1, justifyContent:'flex-start', alignItems:'center', padding:20
    },
    textInput:{ height:40, paddingHorizontal:5 , textAlign:'center', width: '100%'},
    phoneInput:{backgroundColor:'#fff', paddingHorizontal:10, height: 30,
                flex: 1,
                borderColor: '#a9a9a9', borderWidth: 0.5, borderRadius:5},
    btn:{backgroundColor:'#0B486B', padding:10, width:'100%', marginTop:30, borderRadius:5,
            shadowOpacity: 0.8,
            shadowRadius: 2,
            shadowOffset: {
                width: 0,
                height: 1
            } 
        }
 
})

