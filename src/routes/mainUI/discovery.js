import React from 'react';
import Expo from 'expo';
import { View, TouchableHighlight, ActivityIndicator, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';

import { Container, Content, Icon } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import Search from 'react-native-search-box';
import  {createFilter} from 'react-search-input';
import ItemRow from '../../components/discoveryItem'
import LoadingComponent from '../../components/loadingComponent';
import Placeholder from 'rn-placeholder';

const SCREEN_H = Dimensions.get('window').height;
const SCREEN_W = Dimensions.get('window').width;
const { width, height } = Dimensions.get('window');
const KEYS_TO_FILTERS = ['category', 'title','firstName','lastName'];
var timer;
var secs = 0;
var myLocation = {};
// var radius = 100;
var firstLoading = 0;

class Discovery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestLoading: true,
            mapLoaded: false,
            errorMessage: null,
            location: null,
            searchTerm: '',
            region: {
                latitude: 1.324281,
                longitude: 103.791676,
                latitudeDelta: 0.0045,
                longitudeDelta: 0.0034
            },
            radius: 100,
            animatedMargin: new Animated.Value(0),
            animated: new Animated.Value(0.01),
            opacityA: new Animated.Value(1)
        };
        this.searchUpdated = this.searchUpdated.bind(this);
    }

    componentWillMount() {
        this.getLocationAsync();
    }

    componentDidMount() {
      const { animated, opacityA } = this.state;
      Animated.loop(
        Animated.parallel([
          Animated.timing(animated, {
            toValue: 1,
            duration: 2500,
            // useNativeDriver: Platform.OS === 'android',
            delay: 100
          }),
          Animated.timing(opacityA, {
            toValue: 0,
            duration: 2500,
            // useNativeDriver: Platform.OS === 'android',
            delay: 100
          })
        ])
      ).start()
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ requestLoading: false });
    }

    async getLocationAsync() {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            Location.getCurrentPositionAsync({ enableHighAccuracy: true, maximumAge: 600000 }).then((position) => {
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.004500214972604111,
                    longitudeDelta: 0.008444935083389282,
                };
                myLocation = userLocation;
                this.setState({ region: userLocation });
                this.props.setLocation(userLocation);
                this.props.getNearbyList(userLocation, userLocation, this.props.auth.token);
            }).catch((e) => {
                // this one is firing the error instantly
                alert(e + ' Please make sure your location (GPS) is turned on.');
            });
        } else {
            throw new Error('Location permission not granted');
        }
    }

    onSearch = (text) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    onChangeText = (text) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    onRegionChange = (region) => {
        clearInterval(timer);
        const zoom = myLocation.latitudeDelta / region.latitudeDelta;
        // radius = 100 * zoom;
        this.setState({region, radius: 100 * zoom});
    }

    onRegionChangeComplete = (region) => {
        //this.props.setLocation(region);
        if (firstLoading === 2) {
            const zoom = myLocation.latitudeDelta / region.latitudeDelta;
            this.setState({region, radius: 100 * zoom});
            // this.setState({region});
            secs = 0;
            timer = setInterval(() => {
                secs += 1;
                if (secs == 2) {
                    clearInterval(timer);
                    this.animate(1, () => {
                        this.setState({ requestLoading: true });
                        this.props.getNearbyList(this.state.region, this.state.region, this.props.auth.token);
                    });
                }
            }, 1000);
        } else {
            firstLoading += 1;
        }
    }

    animate (value, cb) {
        this.state.animatedMargin.setValue(0)
        Animated.timing(
            this.state.animatedMargin,
            {
                toValue: value,
                duration: 300,
                easing: Easing.linear
            }
        ).start(cb);
    }

    searchUpdated(term) {
         this.setState({ searchTerm: term })
    }
    //Sort module.
    sortByVierified(){

    }

    renderPlaceholder() {
        var ret = [];
        for (var i = 0; i < 10; i++) {
            ret.push(
                <View key={i} style={{paddingHorizontal:20, height: 70}}>
                    <Placeholder.ImageContent
                        onReady={false}
                        lineNumber={2}
                        animate="shine"
                        lastLineWidth="80%"
                        >
                    </Placeholder.ImageContent>
                </View>
            );
        }
        return ret;
    }

    render() {
        const { animated, opacityA } = this.state;
        const { nearbyList } = this.props;
        const filteredLists = nearbyList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        const movingMargin = this.state.animatedMargin.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [-16, -50, -16]
        })

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    ref={component => this._map = component}
                    provider="google"
                    region={this.state.region}
                    showsScale
                    showsMyLocationButton
                    loadingEnabled
                    style={{ height: 0.3 * SCREEN_H, width: SCREEN_W }}
                    onRegionChange={this.onRegionChange}
                    onRegionChangeComplete = {this.onRegionChangeComplete}
                >
                <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', position:'absolute', right:10, bottom:10, width:55, height:55 }} onPress={() => {
                            this._map.animateToRegion(myLocation, 500);
                        }}>
                            <View style={{width: 55, height: 55}}></View>
                        </TouchableOpacity>
                </MapView>

                {Platform.OS === 'android'?
                    <View style={{ height: 0.3 * SCREEN_H, width: SCREEN_W, alignItems: 'center', justifyContent:'center', position:'absolute'}}>
                    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', position:'absolute', right:10, bottom:10, width:55, height:55, elevation: 5 }} onPress={() => {
                            this._map.animateToRegion(myLocation, 500);
                        }}>
                            <Image style={{width: 55, height: 55}} source={require('../../../assets/icons/mylocationbutton.png')}/>
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
                <View pointerEvents="none" style={{ height: 0.3 * SCREEN_H, width: SCREEN_W, alignItems: 'center', justifyContent:'center', position:'absolute'}}>
                    <Animated.View pointerEvents="none" style={{
                      backgroundColor: 'rgba(0,122,255,0.4)',
                       borderWidth:1,
                        borderColor:'rgba(0,112,255,0.7)',
                         width: this.state.radius,
                          height: this.state.radius,
                           borderRadius: this.state.radius/2,
                            opacity: opacityA,
                             transform: [{ scale: animated }]
                            }}>
                  </Animated.View>
                </View>
                <View pointerEvents="none" style={{position:'absolute', height: 0.3 * SCREEN_H, width: SCREEN_W, alignItems: 'center', justifyContent:'center'}}>
                    <Animated.Image style={{ width: 32, height: 32, marginTop: movingMargin}} source={require('../../../assets/icons/pin.png')}/>
                </View>

                <View style={styles.listContainer}>
                    <View style={{ backgroundColor: '#f8f8f8', padding: 3 }}>
                        <Search
                            ref="search_box" backgroundColor={'#f8f8f8'} inputStyle={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#ececec' }}
                            placeholderTextColor="#a4a4a4"
                            tintColorSearch="#a4a4a4"
                            tintColorDelete="#e5e5e5"
                            titleCancelColor="#a4a4a4"
                            onSearch={this.onSearch} onChangeText={(term) => { this.searchUpdated(term) }} />
                    </View>
                    <Container>
                        {
                            this.state.requestLoading?this.renderPlaceholder():null
                        }
                        <Content>
                            {
                                filteredLists.map((item, index) => {
                                    return <ItemRow key={index} data={item} profileData={this.props.profile}/>
                                })
                            }
                        </Content>
                    </Container>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
    },

    listContainer: {
        backgroundColor: '#f8f8f8',
        flex: 1,
    },

    mapCenterMarkerView: {
        backgroundColor:'rgba(0,122,255,0.1)',
        borderWidth:1,
        borderColor:'rgba(0,112,255,0.3)',
    },

    mapCenterMarker: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const mapStateToProps = (state) => ({
    auth: state.auth,
    nearbyList: state.explore.nearbyList,
    profile: state.profile,
});
const mapDispatchToProps = (dispatch) => ({
    setLocation: (location) => dispatch(actions.setLocation(location)),
    getNearbyList: (location, myLocation, token) => dispatch(actions.getNearbyList(location, myLocation, token)),
    getProfileInfo: (token, userId) => dispatch(actions.getProfileInfo(token, userId)),
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Discovery);
