import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Text, TextInput,
  TouchableOpacity
} from 'react-native';
import { Container, Content, Icon } from 'native-base';
import data from '../services/request.json';
import { Actions } from 'react-native-router-flux';
import StarRating from 'react-native-star-rating';

class MySkills extends Component {
  constructor() {
    super();
    this.state = {
      offered: true,
    };
  }
  // This is to remove fb token for retry purposes
  componentDidMount() {

  }

  render() {
    return (
      <Container>
        <Content>
          {
            data.map((provider) => {
              return (
                <View key={provider.id} style = {{ paddingHorizontal:10, backgroundColor:'#fff' }}>
                <View key={provider.id} style={{ paddingVertical:10, flexDirection: 'row', borderBottomWidth:1, borderBottomColor: '#ececec' }}>
                  <View style={{ justifyContent: 'flex-start', flex: 1, alignItems: 'center', paddingTop:5 }}>
                    <Image source={require('../../../assets/images/profile.png')} style={{ height: 70, width: 70, borderRadius: 25 }} />
                  </View>
                  <View style={{ flex: 2, justifyContent:'center', paddingHorizontal:5 }}>
                    <TextInput defaultValue={provider.tags.toString()} editable={false} style={{ fontSize:13, color:'#515151', fontWeight:'400', height:17, width:150}}></TextInput>
                    <TextInput defaultValue={provider.Service} editable={false} style={{ color:'#145775', height:23,width:150, fontSize:12, fontWeight:'400' }}></TextInput>
                    <Text style={styles.text}>{provider.Name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical:3}}>
                      <StarRating
                        disabled
                        maxStars={5}
                        rating={provider.rate}
                        starSize={15}
                        starColor="#FFA838"
                        starStyle={{paddingHorizontal:2}}
                      />
                      <Text style={{ color:'#b5b5b5'}}>({provider.rate})</Text>
                    </View>
                    <Text style={styles.text}>{provider.Message}</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={ styles.text} >Offer:</Text>
                      <Text style={{ color:'#FFA838', fontSize:15 }} >${provider.price}</Text>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'space-around', flex: 1, alignItems: 'flex-end', paddingHorizontal:10 }}>
                    <View style={{ justifyContent:'center', alignItems:'center'}}>
                      <TouchableOpacity>
                        <Icon name="ios-checkmark-circle" style={{ color:'#00B356' }}/>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Icon name="ios-close-circle" style={{ color:'#F52422' }}/>
                      </TouchableOpacity>
                    </View>                    
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                      <Icon name='md-pin' style={{fontSize:15, paddingRight:2, color:'#BFD9E7'}} />
                      <Text style={{ fontSize: 15, color:'#b5b5b5', }}>{provider.Dist}</Text>
                    </View>
                  </View>
                </View>
              </View>
              );
            })}
        </Content>
      </Container>

    );
  }
}

const styles = {
  text:{ fontSize: 12, color:'#b5b5b5' }
};

export default MySkills;
