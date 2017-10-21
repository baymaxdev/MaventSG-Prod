import React from 'react';
import { StyleSheet, View, Text ,TouchableOpacity} from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import StarRating from 'react-native-star-rating';
const EntryComponent = (props) => {
  return <View style={styles.container}>

    <TouchableOpacity style={styles.registerNew} onPress={() => Actions.skillList({ category: props.data.mainCategory === 0 ? 'Teach a Skill' : 'Provide a Service' })}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'rgba(196, 219, 231, 0.9)', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 17 }}>
            <Text style={{ color: '#2399E6' }} >{props.data.rating}</Text>
          </View>
          <Text style={{ fontSize: 15, paddingLeft: 10, color: '#515151' }}>{props.data.title}</Text>
        </View>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
          <StarRating
            disabled
            maxStars={5}
            rating={props.data.rating}
            starSize={20}
            starColor="#FFA838"
            starStyle={{ paddingHorizontal: 2 }}
          />
        </View>
    </TouchableOpacity>
  </View>


};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10
  },
  registerNew:{
      flexDirection:'row',alignItems:'center'
  }
})

export default EntryComponent;