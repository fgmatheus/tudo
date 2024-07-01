import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Button, TextInput, Keyboard, TouchableOpacity, Linking, Modal, FlatList } from 'react-native';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';
import { markers } from '@/assets/markers';

export default function App() {
  const mapRef = useRef<MapView>();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [buttonColors, setButtonColors] = useState({
    'Segunda-feira': 'lightgrey',
    'Terça-feira': 'lightgrey',
    'Quarta-feira': 'lightgrey',
    'Quinta-feira': 'lightgrey',
    'Sexta-feira': 'lightgrey',
    'Sábado': 'lightgrey',
    'Domingo': 'lightgrey',
  });
  const [showFilter, setShowFilter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.33,
    longitude: -122,
    latitudeDelta: 2,
    longitudeDelta: 2
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      });
    })();
  }, []);

/*   useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10, marginTop: 50, backgroundColor: 'green' }}>
            <Text style={{ color: 'black', fontSize: 30, marginHorizontal: 50, marginVertical: 50 }}>Focus</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, []); */

/*   const focusMap = () => {
    const GreenBayStadium = {
      latitude: 44.5013,
      longitude: -88.0622,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1
    };
    mapRef.current?.animateToRegion(GreenBayStadium);
  }; */

  const onMarkerSelected = (marker) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  const filteredMarkers = markers.filter(marker => {
    const dayWithoutTime = marker.days.map(day => day.split(' - ')[0]);
    return (
      marker.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedDay ? dayWithoutTime.includes(selectedDay) : true)
    );
  });

  const clearFilters = () => {
    setSearchText('');
    setSelectedDay('');
    Keyboard.dismiss();
    setButtonColors(prevColors => ({
      ...prevColors,
      'Segunda-feira': 'lightgrey',
      'Terça-feira': 'lightgrey',
      'Quarta-feira': 'lightgrey',
      'Quinta-feira': 'lightgrey',
      'Sexta-feira': 'lightgrey',
      'Sábado': 'lightgrey',
      'Domingo': 'lightgrey',
    }));
    setShowFilter(false);
  };

  const handleButtonClick = (day) => {
    const updatedColors = Object.keys(buttonColors).reduce((acc, currDay) => {
      acc[currDay] = currDay === day ? 'green' : 'lightgrey';
      return acc;
    }, {});
    setButtonColors(updatedColors);
    setSelectedDay(day);
  };

  const generateGoogleMapsLink = (latitude, longitude) => {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  const generateWazeLink = (latitude, longitude) => {
    return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  };

  const moveToLocation = (latitude, longitude) => {
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity onPress={() => moveToLocation(item.latitude, item.longitude)}>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text style={{fontWeight: 'bold'}}>{item.name}
          {/* {'\n'}
          {item.local} */}
        </Text>
        <Text>{item.countryState}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <MapView 
        ref={mapRef}
        style={{ flex: 1, zIndex: 1 }} 
        provider={PROVIDER_GOOGLE} 
        initialRegion={initialRegion} 
        showsUserLocation 
        showsMyLocationButton 
        showsCompass
      >
        {filteredMarkers.map((marker, index) => (
          <Marker key={index} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
            <Callout onPress={() => onMarkerSelected(marker)}>
              <View style={{ padding: 10, margin: 'auto', width: 'auto' }}>
                <Text>{marker.name}</Text>
                <Text style={{ textDecorationLine: 'underline', textAlign: 'center', marginTop: 5, fontSize: 12 }}>Clique para ver mais.</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={{ backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap', zIndex: 2, rowGap: 10, justifyContent: 'center' }}>
        <Button title={showFilter ? 'Esconder filtro' : 'Mostrar filtro'} onPress={() => setShowFilter(prevShowFilter => !prevShowFilter)} />
        <Button title="Limpar filtros" onPress={clearFilters} color={'lightblue'} />

        {showFilter && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', gap: 5, marginBottom: 5, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: 'black', zIndex: 3 }}>
            {Object.keys(buttonColors).map(day => (
              <Button key={day} title={day} onPress={() => handleButtonClick(day)} color={buttonColors[day]} />
            ))}
          </View>
        )}
      </View>

      <TextInput
        style={{ paddingVertical: 20, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'black' }}
        placeholder="Pesquisar lugar"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      {searchText ? (
        <FlatList
          data={filteredMarkers}
          keyExtractor={(item) => item.name}
          renderItem={renderSuggestionItem}
          style={{ maxHeight: 200, backgroundColor: 'white' }}
        />
      ) : null}

      {selectedMarker && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.06)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
              <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }} onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>X</Text>
              </TouchableOpacity>
              <Text>
                {selectedMarker.name}
                {'\n\n'}
                :
                {'\n'}
                {selectedMarker.days.join(', ')}
                {'\n\n'}
                :
                {'\n'}
                {selectedMarker.youthDays.join(', ')}
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                <TouchableOpacity
                  style={{ padding: 5, backgroundColor: 'lightgreen', borderRadius: 50 }}
                  onPress={() => {
                    const url = generateGoogleMapsLink(selectedMarker.latitude, selectedMarker.longitude);
                    Linking.openURL(url).catch(err => console.error('Erro ao abrir link do Google Maps', err));
                  }}
                >
                  <Text>Link Maps</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ padding: 5, backgroundColor: 'lightblue', borderRadius: 50 }}
                  onPress={() => {
                    const url = generateWazeLink(selectedMarker.latitude, selectedMarker.longitude);
                    Linking.openURL(url).catch(err => console.error('Erro ao abrir link do Waze', err));
                  }}
                >
                  <Text>Link Waze</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inicialView: {
    flex: 1,
  },
  buttonStyle: {
    backgroundColor: 'green',
  },
});
