import React, { Component } from 'react';
import { View, Text } from 'react-native';
export default class Blank extends Component {
  state = {
    messages: [],
  };

  componentWillMount() {
    this.setState({
     
    });
  }

  render() {
    return (
      <View style = {{flex: 1}}>
        <Text>BlankView</Text>
      </View>
     
    );
  }
}
