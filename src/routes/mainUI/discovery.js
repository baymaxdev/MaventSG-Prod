import React from 'react';
import Expo from 'expo';
import { View, TouchableHighlight, ActivityIndicator, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
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
// import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

const SCREEN_H = Dimensions.get('window').height;
const SCREEN_W = Dimensions.get('window').width;
const { width, height } = Dimensions.get('window');
const KEYS_TO_FILTERS = ['category', 'title','firstName','lastName'];
var timer;
var secs = 0;
var myLocation = {};
var radius = 100;
var firstLoading = 0;

class Discovery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestLoading: true,
            statusBarHeight: 1,
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
        };
        this.searchUpdated = this.searchUpdated.bind(this);
    }

    componentWillMount() {
        this.props.getProfileInfo(this.props.auth.token);
        this.getLocationAsync();
        setTimeout(()=>this.setState({statusBarHeight: Expo.Constants.statusBarHeight-23}),500);
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
                this.props.getNearbyList(userLocation,userLocation, this.props.auth.token);
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
        radius = 100 * zoom;
        //this.setState({radius: 100 * zoom});
    }

    onRegionChangeComplete = (region) => {
        //this.props.setLocation(region);
        if (firstLoading === 2) {
            const zoom = myLocation.latitudeDelta / region.latitudeDelta;
            radius = 100 * zoom;
            this.setState({region});
            secs = 0;
            timer = setInterval(() => {
                secs += 1;
                if (secs == 3) {
                    clearInterval(timer);
                    this.setState({ requestLoading: true });
                    this.props.getNearbyList(this.state.region,this.state.region, this.props.auth.token);
                }
            }, 1000);
        } else {
            firstLoading += 1;
        }
    }

    searchUpdated(term) {
         this.setState({ searchTerm: term })
    }
    //Sort module.
    sortByVierified(){
        
    }

    render() {
        const { nearbyList } = this.props;
        const filteredLists = nearbyList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        return (
            <View style={{ flex: 1, paddingTop: this.state.statusBarHeight }}>
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
                    <View pointerEvents="none" style={{ height: 0.3 * SCREEN_H, width: SCREEN_W, alignItems: 'center', justifyContent:'center'}}>
                        <View pointerEvents="none" style={[styles.mapCenterMarkerView, {width: radius, height: radius, borderRadius: radius/2}]}>
                        </View>
                    </View>
                    <View pointerEvents="none" style={{position:'absolute', left:0, top:0, height: 0.3 * SCREEN_H, width:SCREEN_W, alignItems: 'center', justifyContent:'center'}}>
                            <Image style={{ width: 32, height: 32, marginTop: -16}} source={require('../../../assets/icons/pin.png')}/>
                    </View>
                     
                    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', position:'absolute', right:10, bottom:10, width:55, height:55}} onPress={() => {
                        this.setState({region: myLocation});
                    }}> 
                            <View style={{width: 55, height: 55}}></View>
                    </TouchableOpacity>
                </MapView>
                
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
                        <Content>
                            {
                                filteredLists.map((item, index) => {
                                    return <ItemRow key={index} data={item} profileData={this.props.profile}/>
                                })
                            }
                        </Content>
                        {
                            this.state.requestLoading &&
                            <LoadingComponent />
                        }
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
    getNearbyList: (location,myLocation, token) => dispatch(actions.getNearbyList(location,myLocation, token)),
    getProfileInfo: (token) => dispatch(actions.getProfileInfo(token)),
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Discovery);
