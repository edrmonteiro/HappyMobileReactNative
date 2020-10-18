import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { MapEvent, Marker } from 'react-native-maps';

import mapMarkerImg from '../../images/map-marker.png';
import * as Location from 'expo-location';

export default function SelectMapPosition() {
  const navigation = useNavigation();
  const [position, setPosition] = useState({latitude:0, longitude: 0});
  const [userPosition, setUserPosition] = useState({latitude:0, longitude: 0});

  useFocusEffect(() => {
    async function handleInitialPosition() {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
          alert('Permission to access location was denied');
      }
      else { 
          const gpsPosition = await Location.getCurrentPositionAsync({});
          //console.log(gpsPosition);
          setUserPosition({latitude:gpsPosition.coords.latitude, longitude: gpsPosition.coords.longitude});
      }
    } 
    handleInitialPosition()

  });
  if (userPosition.latitude === 0){
    return <View/>;
  }
  function handleNextStep() {
    navigation.navigate('OrphanageData', {position});
  }
  function handleSelectMapPosition(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate);
  }
  return (
    <View style={styles.container}>
      <MapView 
        initialRegion={{
          // latitude: -27.2092052,
          // longitude: -49.6401092,
          latitude: userPosition.latitude,
          longitude: userPosition.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        style={styles.mapStyle}
        onPress={handleSelectMapPosition}
      >
        { position.latitude !== 0 && (
            <Marker 
                icon={mapMarkerImg}
                coordinate={{ latitude: position.latitude, longitude: position.longitude }}
            />
        )}
      </MapView>
      { position.latitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})
