import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-looped-carousel';
const { width, height } = Dimensions.get('window');

const CarouselComponent = (props) => {
  return <Carousel
                    delay={6000}
                    style={styles.carouselItem}
                    autoplay
                    pageinfo
                >
                    <View style={styles.carouselItem}>
                        <Image source={require('../../assets/images/CarouselView/Image2-1.jpg')} style={styles.carouselImage} />
                    </View>

                    <View style={styles.carouselItem}>
                        <Image source={require('../../assets/images/CarouselView/Image1.jpg')} style={styles.carouselImage} />
                    </View>

                    <View style={styles.carouselItem}>
                        <Image source={require('../../assets/images/CarouselView/Image3-1.jpg')} style={styles.carouselImage} />
                    </View>
                </Carousel>
};
const styles = StyleSheet.create({
  carouselItem: {
    width: width, height: height / 3
  },
  carouselImage: {
      width: width, height:height / 3
  },
})

export default CarouselComponent;
