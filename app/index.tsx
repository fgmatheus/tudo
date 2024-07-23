import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Button, TextInput, Keyboard, TouchableOpacity, Linking, Modal, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';
import { markers } from '@/assets/markers';
import { OpenAI } from 'openai';
import { StatusBar } from 'expo-status-bar';
import { ButtonWaze } from '@/components/ButtonWaze';
import { ButtonMaps } from '@/components/ButtonMaps';
import { ButtonRefresh } from '@/components/ButtonRefresh';
import { ButtonSave } from '@/components/ButtonSave';
import { useSubscription } from '../components/SubscriptionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const mapRef = useRef<MapView>();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [buttonColors, setButtonColors] = useState({
    'Cidade': 'lightgrey',
    'Monumento': 'lightgrey',
    'Estatua': 'lightgrey',
    'Museu': 'lightgrey',
    'Ponte': 'lightgrey',
    'Castelo': 'lightgrey',
  });
  const [showFilter, setShowFilter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: -23.547,
    longitude: -46.610,
    latitudeDelta: 2,
    longitudeDelta: 2
  });
  const [chatGPTResponse, setChatGPTResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedResponses, setSavedResponses] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { subscriptionStatus } = useSubscription();

  const openai = new OpenAI({
    apiKey: 'API_KEY_GPT', // Substitua pela sua chave da API OpenAI
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

      // Load saved responses from AsyncStorage
      const savedData = await AsyncStorage.getItem('chatGPTResponses');
      if (savedData) {
        setSavedResponses(JSON.parse(savedData));
      }

      // Load favorites from AsyncStorage
      const favoriteData = await AsyncStorage.getItem('favorites');
      if (favoriteData) {
        setFavorites(JSON.parse(favoriteData));
      }
    })();
  }, []);

  const onMarkerSelected = async (marker) => {
    if (subscriptionStatus === 'active') {
      setSelectedMarker(marker);
      setModalVisible(true);
      
      if (savedResponses[marker.name]) {
        setChatGPTResponse(savedResponses[marker.name]);
      } else {
        setLoading(true);
        await fetchChatGPTResponse(marker.name);
      }
    } else {
      Alert.alert('Aviso', 'Assinatura não está ativa.');
    }
  };

  const fetchChatGPTResponse = async (name, reload = false) => {
    const messages = [{ 
      role: 'user', 
      content: `Faça uma breve explicação sobre ${name} com no máximo 150 palavras, incluindo curiosidades, de forma simples e enxuta` 
    }];

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const data = response.choices[0].message.content.trim();
      console.log('Informações do ChatGPT:', data); // Adicionado console.log para mostrar as informações no console
      setChatGPTResponse(data);
      const newSavedResponses = {
        ...savedResponses,
        [name]: data
      };
      setSavedResponses(newSavedResponses);
      await AsyncStorage.setItem('chatGPTResponses', JSON.stringify(newSavedResponses));
    } catch (error) {
      console.error('Erro ao buscar informações do ChatGPT:', error);
      setChatGPTResponse('Não foi possível obter informações no momento.');
    } finally {
      setLoading(false);
    }
  };

  const reloadChatGPTResponse = async () => {
    if (selectedMarker) {
      setLoading(true);
      await fetchChatGPTResponse(selectedMarker.name, true);
    }
  };

  const addFavorite = async () => {
    if (selectedMarker) {
      const newFavorite = {
        ...selectedMarker,
        chatGPTResponse
      };
      const updatedFavorites = [...favorites];
      const exists = updatedFavorites.some(fav => fav.name === newFavorite.name && fav.latitude === newFavorite.latitude && fav.longitude === newFavorite.longitude);

      Alert.alert('Este ponto já foi salvo anteriormente')
      if (!exists) {
        updatedFavorites.push(newFavorite);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        Alert.alert('Salvo')
      }
    }
    setIsLoading(false);
  };

  const filteredMarkers = markers.filter(marker => {
    return (
      marker.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedCategory ? marker.category === selectedCategory : true)
    );
  });

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory('');
    Keyboard.dismiss();
    setButtonColors(prevColors => ({
      ...prevColors,
      'Cidade': 'lightgrey',
      'Monumento': 'lightgrey',
      'Estatua': 'lightgrey',
      'Museu': 'lightgrey',
      'Ponte': 'lightgrey',
      'Castelo': 'lightgrey',
    }));
    setShowFilter(false);
  };

  const handleButtonClick = (category) => {
    const updatedColors = Object.keys(buttonColors).reduce((acc, currCategory) => {
      acc[currCategory] = currCategory === category ? 'green' : 'lightgrey';
      return acc;
    }, {});
    setButtonColors(updatedColors);
    setSelectedCategory(category);
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
        <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
        <Text>{item.countryState}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>

      <View style={{ backgroundColor: 'black', flexDirection: 'row', flexWrap: 'wrap', zIndex: 2, gap: 20, justifyContent: 'center', paddingBottom: 5 }}>

        <Button title={showFilter ? 'Esconder filtro' : 'Mostrar filtro'} onPress={() => setShowFilter(prevShowFilter => !prevShowFilter)} color={'#F46B27'} />

        <Button title="Limpar filtros" onPress={clearFilters} color={'#F46B27'} />

        {showFilter && (
          <View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', gap: 5, paddingBottom: 10, paddingTop: 5, borderBottomWidth: 1, borderBottomColor: 'black', zIndex: 3 }}>

            {Object.keys(buttonColors).map(category => (
              <Button key={category} title={category} onPress={() => handleButtonClick(category)} color={buttonColors[category]} />
            ))}

          </View>

            <TextInput
              style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'black' }}
              placeholder="Pesquisar lugar"
              value={searchText}
              onChangeText={text => setSearchText(text)}
            />
          
          </View>
        )}
      </View>

      <MapView 
        ref={mapRef}
        style={{ flex: 1, zIndex: 1}} 
        provider={PROVIDER_GOOGLE} 
        initialRegion={initialRegion} 
        showsUserLocation 
        showsMyLocationButton 
        showsCompass
      >
        {filteredMarkers.map((marker, index) => (
          <Marker key={index} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} pinColor= '#F46B27' >
            <Callout onPress={() => onMarkerSelected(marker)}>
              <View style={{ padding: 10, margin: 'auto', width: 'auto' }}>
                <Text>{marker.name}</Text>
                <Text style={{ textDecorationLine: 'underline', textAlign: 'center', marginTop: 5, fontSize: 12 }}>Clique para ver mais.</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

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

            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' }}>

              <TouchableOpacity style={{ position: 'absolute', top: 0, right: 15, zIndex: 2, padding: 10 }} onPress={() => setModalVisible(false)}>

                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'red' }}>X</Text>

              </TouchableOpacity>

              <Text style={{ fontWeight:'bold', marginBottom: 15 }}>{selectedMarker.name}</Text>
              <Text>{loading ? <ActivityIndicator size="large" color="#0000ff" /> : chatGPTResponse}</Text>

              <View style={{ flexDirection:'row', gap: 15, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>

                <ButtonSave 
                  title={''} 
                  icon='save' 
                  onPress={addFavorite}
                  isLoading={isLoading}
                />

                <ButtonRefresh 
                  title='' 
                  icon='refresh' 
                  onPress={reloadChatGPTResponse}
                />

              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 10 }}>
                <ButtonMaps 
                icon='logo-google' 
                title='Google Maps' 
                onPress={() => Linking.openURL(generateGoogleMapsLink(selectedMarker.latitude, selectedMarker.longitude))}
                />
                <ButtonWaze 
                title='Waze' 
                icon={'navigate'} 
                onPress={() => Linking.openURL(generateWazeLink(selectedMarker.latitude, selectedMarker.longitude))}
                />
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