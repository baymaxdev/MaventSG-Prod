import React from 'react';
import { Icon } from 'native-base';
import { View, Text, Image, TextInput, TouchableOpacity ,StyleSheet, Dimensions, ScrollView } from 'react-native';
import Modal from 'react-native-modal';

export default class FilterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: this.props.min,
      max: this.props.max,
      sortBy: this.props.sortBy
    }
  }

  onApply() {
    this.props.onApply(this.state);
  }

  onCancel() {
    this.setState({min: this.props.min, max: this.props.max, sortBy: this.props.sortBy});
    this.props.onCancel();
  }

  render() {
    return (
      <Modal isVisible={this.props.modalVisible} style={{ margin: 0 }}>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{ height: 20, backgroundColor: '#0B486B' }}>
          </View>
          <View style={{height: 44, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#0B486B', flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {this.onCancel()}}>
              <Text style={{color: '#fff', fontSize: 18}}>Cancel</Text>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 20, color: '#fff'}}>Filter</Text>
            <TouchableOpacity onPress={() => {this.onApply()}}>
              <Text style={{color: '#fff', fontSize: 18}}>Apply</Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={{height: 40, paddingLeft: 10, paddingBottom: 5, justifyContent: 'flex-end', backgroundColor: '#EFEFEF'}}>
              <Text style={{fontSize: 16}}>SORT BY</Text>
            </View>
            <TouchableOpacity style={{paddingHorizontal: 20, height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} onPress={() => {
              this.setState({sortBy: 0});
            }}>
              <Text style={{fontSize: 20}}>Nearest</Text>
              {
                this.state.sortBy === 0?
                <Icon name="md-checkmark" style={{fontSize: 25, color: '#4080FF'}}/>
                :
                null
              }
            </TouchableOpacity>
            <View style={{height: 1, backgroundColor: '#EFEFEF', marginLeft: 10}}/>
            <TouchableOpacity style={{paddingHorizontal: 20, height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} onPress={() => {
              this.setState({sortBy: 1});
            }}>
              <Text style={{fontSize: 20}}>Lowest Price</Text>
              {
                this.state.sortBy === 1?
                <Icon name="md-checkmark" style={{fontSize: 25, color: '#4080FF'}}/>
                :
                null
              }
            </TouchableOpacity>
            <View style={{height: 40, paddingLeft: 10, paddingBottom: 5, justifyContent: 'flex-end', backgroundColor: '#EFEFEF'}}>
              <Text style={{fontSize: 16}}>PRICE RANGE</Text>
            </View>
            <View style={{paddingHorizontal: 20, height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={{fontSize: 20}}>Minimum</Text>
              <TextInput
                style={{height: 40, width: '25%', borderColor: '#EFEFEF', borderWidth: 1}}
                onChangeText={(min) => this.setState({min})}
                value={this.state.min}
                placeholder='Not set'
                keyboardType="numeric"
                returnKeyType='next'
              />
            </View>
            <View style={{height: 1, backgroundColor: '#EFEFEF', marginLeft: 10}}/>
            <View style={{paddingHorizontal: 20, height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={{fontSize: 20}}>Maximum</Text>
              <TextInput
                style={{height: 40, width: '25%', borderColor: '#EFEFEF', borderWidth: 1}}
                onChangeText={(max) => this.setState({max})}
                value={this.state.max}
                placeholder='Not set'
                keyboardType="numeric"
                returnKeyType='done'
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};
const styles = StyleSheet.create({
});