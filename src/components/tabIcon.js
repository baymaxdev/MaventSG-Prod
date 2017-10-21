import React from 'react';
import { Icon } from 'native-base';
import { Text, View } from 'react-native';

const TabIcon = (props) => {
  if (props.type === 'main') {
    return <Icon
      name={props.icon}
      style={{ color: props.focused ? '#084E70' : '#bbbbbb' }}
    >
    </Icon>
  }
  else {
    return <View style={{
      width: 120, height: 30, 
        justifyContent:'center', alignItems:'center'
    }}>
      <Text style={{ fontSize:14, fontWeight:'bold', textAlign: 'center', color: props.focused ? '#fff' : '#fff' }}> {props.title} </Text>
        <View style={{marginTop:5, width:15,height:0,
                    borderBottomWidth: 15,
                    borderBottomColor: props.focused?'#fff':'#0B486B',
                    borderLeftWidth: 15,
                    borderLeftColor: 'transparent',
                    borderRightWidth: 15,
                    borderRightColor: 'transparent',
                    borderStyle: 'solid'}}/>
    </View>
  }
};

export default TabIcon;