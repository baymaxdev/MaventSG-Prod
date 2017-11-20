import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import StarRating from 'react-native-star-rating';

import RateComponent from './rateComponent';
import EntryComponent from './EntryComponent';
const SkillRowComponent = (props) => {
  return <View style={styles.wrapper}>
            <View style={{ paddingBottom: 3, flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
              <Text style={{ fontSize: 16, color:'#515151' }}>{ props.data.mainCategory === 0 ? "My Skill" : "My Service" }</Text>
              {
                props.isMe?
                <TouchableOpacity  onPress={() => Actions.skillList({category: props.data.mainCategory === 0 ? 'Teach a Skill' : 'Provide a Service' })}>
                  <Text style={{ color:'#FFA838' }} >Add</Text>
                </TouchableOpacity>
                :null
              }
            </View>
            <FlatList
              data={props.data.data}
              renderItem={ ({item, index}) => {
                if (item.category != 'entry') {
                  return <RateComponent key = {index} data = { item } onSuccessModal = { props.onSuccessModal } isMe = { props.isMe }/>
                }
                else {
                  return (
                    props.isMe?
                    <View key={index} style={{borderStyle: 'dotted', borderWidth: 1, borderRadius: 10, backgroundColor: 'rgba(133, 163, 181, 0.2)', marginHorizontal: -10, paddingHorizontal: 10}}>
                      <EntryComponent key={index} data={item} />
                    </View>
                    :null
                  )
                }
              }}
              keyExtractor={item => item._id}
              ItemSeparatorComponent={null}
              >
            </FlatList>
          </View>
};
const styles = StyleSheet.create({
  wrapper: { padding: 10, borderBottomWidth: 1, borderColor: '#EDF4F7' }
})

export default SkillRowComponent;
