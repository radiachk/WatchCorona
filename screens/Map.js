import * as React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native';
import MapView from 'react-native-maps';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addRegion} from "../DataActions";

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 51;
const LONGITUDE = 9;
const LATITUDE_DELTA = 15;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const INITAL_REGION = {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
};


class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true};
    }

    componentDidMount() {

        this.setState({loading: true});
        fetch('https://coronawatch-firebase.firebaseio.com/map.json')
            .then(response => response.json())
            .then(responseJson => responseJson)
            .then(json => {
                var props = this.props;
                props.data.regions = [];
                function add_data_to_circles(key) {
                    let values = json[Object.keys(json)[0]][key];
                    var region = {
                        key: String(key),
                        lat: Number(values['lat']),
                        long: Number(values['long']),
                        infected: Number(values['cases']),
                        deaths: Number(values['deaths']),
                        region: String(values['region'])
                    };
                    props.addRegion(region);
                }
                Object.keys(json[Object.keys(json)[0]]).forEach(add_data_to_circles);
            })
            .catch((error) => console.warn(error)
            ).finally(() => this.setState({ loading: false }));
    }

    render = () => {
        let circle_id = 0;
        const regions = this.props.data.regions.filter(region => region.region !== 'World');

        const DrawCircles = regions.map(function(circle)  {
            circle_id++;
            let radius = 0;
            var infected = circle.infected;
            if (infected !== 0) {
                if (infected < 1000) {
                    radius = 10000;
                } else {
                    radius = circle.infected * 10;
                }
            }
            return (
                    <MapView.Circle
                        center={{latitude: circle.lat, longitude: circle.long}}
                        radius={radius}
                        fillColor = { 'rgba(0, 173, 181, 0.5)' }
                        key = {String(circle_id)}
                        style={{zIndex: 100}}
                    />
            )
        });

        return (
            this.state.loading ?
                (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#00adb5" />
                    </View>)
                :
                (<View style={styles.container}>
                    <View style={styles.mapContainer}>
                        <MapView
                            initialRegion={INITAL_REGION}
                            style={styles.map}
                            customMapStyle={mapStyle}
                        >
                            {DrawCircles}
                        </MapView>
                    </View>
                </View>)
        )
    }
}


Map.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  map: {
    width: width,
    height: height,
  },
  mapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});

const mapStateToProps = (state) => {
    const { data } = state;
    return { data }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addRegion,
    }, dispatch)
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);

const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#393e46"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#393e46"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#222831"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#393e46"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#393e46"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#393e46"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#222831"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];
