import React from 'react';
import { Icon } from 'native-base';
import { View, Text, Image, TextInput, TouchableOpacity ,StyleSheet} from 'react-native';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import categoryData from '../routes/services/category.json';

class ItemRow extends React.Component {

  render() {
    let provider = this.props.data;
    let mavens = this.props.profile.myInfo.mavens;
    return (
      <TouchableOpacity style = {{ paddingHorizontal:10, backgroundColor:'#fff' }} onPress={() => {
        this.props.getMavenDetails(provider.mavenID, this.props.profile.location, this.props.auth.token);
        var flag = false;
        for (var i = 0; i < mavens.length; i++) {
          if (mavens[i]._id == provider.mavenID) {
            flag = true;
            break;
          }
        }
        Actions.skillPage({ title: `${provider.firstName} ${provider.lastName}`, isMe: flag })
      }}>
        <View key={provider.mavenID} style={{ paddingVertical:5, flexDirection: 'row', borderBottomWidth:1, borderBottomColor: '#ececec' }}>
          <View pointerEvents="none" style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
            <Image source={provider.displayPicture ? {uri: provider.displayPicture} : require('../../assets/images/avatar.png')} style={provider.idVerified?styles.isVerifyStyle:styles.noneVerifyStyle} />
          </View>
          <View pointerEvents="none" style={{ flex: 2, justifyContent:'center', paddingHorizontal:5 }}>
            <TextInput defaultValue={provider.title} editable={false} style={{ fontSize:13, color:'#515151', fontWeight:'400', height:17, marginRight: -50}}></TextInput>
            <TextInput defaultValue={categoryData[provider.category]} editable={false} style={{ color:'#145775', height:23, marginRight: -50, fontSize:12, fontWeight:'400' }}></TextInput>
            <Text style={{ fontSize: 12, color:'#b5b5b5' }}>{provider.firstName + " " + provider.lastName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <StarRating
                disabled
                maxStars={5}
                rating={provider.rating}
                starSize={15}
                starColor="#FFA838"
                starStyle={{paddingHorizontal:2}}
              />
              <Text style={{ color:'#b5b5b5'}}>({Math.round(provider.rating * 10) / 10})</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'space-around', flex: 1, alignItems: 'flex-end', paddingHorizontal:10 }}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{color:'#FFA838', fontWeight:"700", fontSize:15}}>${provider.price}</Text>
              <Text style={{ color:'#b5b5b5', fontWeight:'400', fontSize:12 }}>/hr</Text>
            </View>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}} onPress={()=>{
              this.props.getMavenDetails(provider.mavenID, this.props.profile.location, this.props.auth.token);
              Actions.chatPage({ title: `${provider.firstName} ${provider.lastName}` })
            }}>
              <Icon name = "ios-chatbubbles-outline" style={{ fontSize: 29, color:'#3F6A86', paddingRight:5 }}/>
              <Icon name = "ios-arrow-forward" style={{ fontSize: 18, color:'#BFD9E7', paddingLeft:5 }}/>
            </TouchableOpacity>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
              <Icon name='md-pin' style={{fontSize:15, paddingRight:2, color:'#BFD9E7'}} />
              <Text style={{ fontSize: 15, color:'#b5b5b5', }}>{ Math.round(provider.distance / 100) / 10 + "Km" }</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};
const styles = StyleSheet.create({
   isVerifyStyle:{
         height: 70, 
         width: 70, 
         borderRadius: 25,
         borderWidth:2,
         borderColor:'#FFA838'
   },
   noneVerifyStyle:{
         height: 70, 
         width: 70,
         borderRadius: 25,
   }
});

const mapStateToProps = (state) =>({
  auth: state.auth,
  profile: state.profile
});

const mapDispatchToProps = (dispatch) =>({
  getMavenDetails: (mavenId, location, token) => dispatch(actions.getMavenDetails(mavenId, location, token)),  
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemRow);