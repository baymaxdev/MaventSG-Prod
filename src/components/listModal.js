import React from 'react';
import { Icon } from 'native-base';
import { StyleSheet, Text, View, Modal, ScrollView, TouchableOpacity} from 'react-native';

export default class ListModal extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       showModal: props.show,
     };
   }
   render() {
    return (
     <Modal animationType={'none'} transparent={true} visible={this.state.showLoginModal} onRequestClose={() => null} >
       <View style={styles.listModal}>
         <View style={{backgroundColor:'#fff', borderRadius:10, width:'100%', padding:10}}>
         <ScrollView style={{marginBottom:20}}>
          <View style={styles.itemWrapper}>
                 <Text style={{fontSize:18, fontWeight:'500'}} >{this.props.data[0].label}</Text>
          </View>
           {
             this.props.data.map((item, index)=>{
               if(index>0)
               return <TouchableOpacity key={index} style={styles.itemWrapper} onPress={(e)=>{this.props.handler(false,item.label, item.key) ;this.setState({showModal:false})}}>
                 <Text style={{color:'#085be0', fontSize:18}} >{item.label}</Text>
               </TouchableOpacity>
             })
           }
          </ScrollView>
          </View>
          <TouchableOpacity style={{ backgroundColor:'#fff', padding:10, marginTop:10,width:'100%', borderRadius:10}} onPress={(e)=>{this.props.handler(false,'') ;this.setState({showModal:false})}}>
            <Text style={{textAlign:'center', fontSize:18}}>Cancel</Text>
          </TouchableOpacity>
        </View>
    </Modal>
    )}
};

const styles = StyleSheet.create({
  listModal: {
        flex:1,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemWrapper:{padding:10, justifyContent:'center', alignItems:'center', borderWidth:1, borderColor:'#ccc', 
                borderTopColor:'transparent', borderLeftColor:'transparent', borderRightColor:'transparent'}
})

