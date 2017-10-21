import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import StarRating from 'react-native-star-rating';

const ReviewComponent = (props) => {
  return <View key={props.data.id} style={styles.container}>
    <Image source={props.data.reviewUserID.displayPicture ? {uri: props.data.reviewUserID.displayPicture} : require('../../assets/images/avatar.png')} style={{ height: 70, width: 70, borderRadius: 25 }} />
    <View style={{marginLeft:10, width:'100%'}} >
      <Text style={{ fontSize: 16, paddingRight: 5, color:'#515151' }}>
        {props.data.reviewUserID.firstName + " " + props.data.reviewUserID.lastName}
      </Text>
      <View style={{flexDirection:'row', paddingVertical:5}} >
        <StarRating
          disabled
          maxStars={5}
          rating={parseInt(props.data.rating, 10)}
          starSize={16}
          starColor="#FFA838"
          starStyle={{paddingHorizontal:2}}
        />
        <Text style={{ color:'#b5b5b5'}}>({props.data.rating})</Text>
      </View>
      <Text style={{ color:'#b5b5b5', fontSize:14 }}>{props.data.description}</Text>
    </View>

  </View>
};
const styles = StyleSheet.create({
  container: {width:'100%', flexDirection:'row',
    borderBottomWidth: 1, borderColor: '#EDF4F7',
    alignItems: 'center', padding: 5
  }
})

export default ReviewComponent;
