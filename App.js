import {Pressable, View, Text, StyleSheet} from "react-native";
import MapView from "react-native-maps";
import * as Location from 'expo-location';
import {useEffect, useRef, useState} from "react";

let isDebug = true;
let locationHeadingSubscription;
let locationOn = false;

export default function App() {

    const [errorMsg, setErrorMsg] = useState('');
    const [heading, setHeading] = useState(0);

    const mapRef = useRef();

    async function startLocationHeadingSubscription() {
        if (locationOn && !locationHeadingSubscription) {
            isDebug && console.log(new Date(), 'startLocationHeadingSubscription Location.watchHeadingAsync');
            locationHeadingSubscription = await Location.watchHeadingAsync((heading) => watchHeadingAsyncCallback(heading)).catch((error) => {
                isDebug && console.log(error);
            });
        } else {
            isDebug && console.log(new Date(), 'startLocationHeadingSubscription skip');
        }
    }

    function stopLocationHeadingSubscription() {
        if (locationOn && locationHeadingSubscription) {
            isDebug && console.log(new Date(), 'stopLocationHeadingSubscription');
            try {
                locationHeadingSubscription?.remove && locationHeadingSubscription?.remove();
            } catch (error) {
                isDebug && console.log(error);
            }
            locationHeadingSubscription = null;
        } else {
            isDebug && console.log(new Date(), 'stopLocationHeadingSubscription skip');
        }
    }

    function watchHeadingAsyncCallback(heading) {
        isDebug && console.log(new Date(), 'watchHeadingAsyncCallback');
        updateHeading(heading);
    }

    function updateHeading(input) {
        (async () => {
            let direction = -1
            if (locationOn) {
                await startLocationHeadingSubscription();
                let heading = input;
                if (!heading?.magHeading && locationOn) {
                    isDebug && console.log(new Date(), 'Location.getHeadingAsync');
                    heading = await Location.getHeadingAsync().catch((error) => {
                        isDebug && console.log(error);
                    });
                }
                if (heading?.magHeading) {
                    direction = heading?.magHeading;
                }
                direction = Math.round(direction * 10) / 10;
                isDebug && console.log('DIRECTION', direction);
                setHeading(direction)
            } else {
                stopLocationHeadingSubscription();
            }
        })();
    }

    useEffect(() => {
        isDebug && console.log(new Date(), 'Location.requestForegroundPermissionsAsync');
        Location.requestForegroundPermissionsAsync()
            .then(async (res) => {
                if (res.status !== 'granted') {
                    setErrorMsg('Permission to access location was denied. Enable location services to allow "Air Map Israel" determine your location.');
                    locationOn = false;
                } else {
                    locationOn = true;
                    await startLocationHeadingSubscription();
                }
            })
            .catch((error) => {
                isDebug && console.log(error);
            });

    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'oldlace'
            }}
        >
            <MapView
                style={{
                    width: "100%",
                    height: "80%",
                }}
                ref={mapRef}
                showsUserLocation={true}
            />
            <Text style={{
                alignItems: 'center',
                padding: 10,
                fontWeight: 'bold',
                height: 50,
            }}>
                {'Heading: ' + heading}
            </Text>

            {errorMsg &&
                <View style={[styles.container, styles.error, {flex: 5, alignItems: 'center'}]}>
                    <Text style={styles.error}>{errorMsg}</Text>
                    <Pressable
                        style={[styles.pressable]}
                        onPress={() => setErrorMsg('')}>
                        <Text style={[styles.buttonText, {width: 100}]}>Close</Text>
                    </Pressable>
                </View>
            }

        </View>
    );
}
const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: 'oldlace',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    error: {
        flex: 5,
        width: '100%',
        padding: 5,
        color: 'red',
        backgroundColor: 'oldlace',
        textAlign: 'center',
    },
    buttonText: {
        borderWidth: 1,
        borderRadius: 5,
        height: 30,
        width: 75,
        textAlign: 'center',
        fontSize: 15,
        paddingTop: 2
    },
    pressable: {
        borderRadius: 10,
        padding: 4,
    },
});
