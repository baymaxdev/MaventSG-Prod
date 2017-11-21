import React from 'react';
import { View, Text, TouchableWithoutFeedback ,StyleSheet, Dimensions, Modal } from 'react-native';
import Gallery from 'react-native-image-gallery';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class GalleryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  onClose() {
    this.props.onClose();
  }

  render() {
    var images = [];
    for (var i = 0; i < 3; i ++ ) {
      if (this.props.picUrl[i]) {
        images.push({source: {uri: this.props.picUrl[i]}});
      }
    }
    
    return (
      <View>
        <Modal
          animationType={"none"}
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={() => {this.onClose()}}>
            <TouchableWithoutFeedback  onPress={() => {this.onClose()}}>
              <View style={{width: SCREEN_WIDTH, height: (SCREEN_HEIGHT - SCREEN_WIDTH) / 2, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{color: '#fff', fontSize: 16}}>Tap here to go back</Text>
              </View>
            </TouchableWithoutFeedback>
            <Gallery
              initialPage={this.props.initialPage}
              style={{backgroundColor: 'white', flex: 1}}
              images={images}
            />
            <TouchableWithoutFeedback  onPress={() => {this.onClose()}}>
              <View style={{width: SCREEN_WIDTH, height: (SCREEN_HEIGHT - SCREEN_WIDTH) / 2, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
              </View>
            </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({

});
