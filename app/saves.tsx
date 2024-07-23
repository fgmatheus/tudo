import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { ButtonMaps } from '@/components/ButtonMaps';
import { ButtonWaze } from '@/components/ButtonWaze';
import { ButtonDelete } from '@/components/ButtonDelete';

export default function Saves() {
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar o estado de atualização

  useEffect(() => {
    fetchFavorites(); // Extraí a função para buscar os favoritos para que possamos chamá-la no botão de atualização
  }, []);

  const fetchFavorites = async () => {
    setRefreshing(true); // Indica que a atualização está em progresso
    const favoriteData = await AsyncStorage.getItem('favorites');
    if (favoriteData) {
      setFavorites(JSON.parse(favoriteData));
    }
    setRefreshing(false); // Indica que a atualização foi concluída
  };

  const removeFavorite = async (name) => {
    const updatedFavorites = favorites.filter(item => item.name !== name);
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity onPress={() => { setSelectedFavorite(item); setModalVisible(true); }}>
      <View style={styles.favoriteItem}>
        <View>

          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.countryState}>{item.countryState}</Text>
        </View>

        <View>
          {/* <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFavorite(item.name)}
          >
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity> */}
          <ButtonDelete 
          title=''
          icon='trash'
          onPress={() => removeFavorite(item.name)}
          />
          
        </View>

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor="black" /> */}
      {/* Botão de atualização */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchFavorites}>
        <Text style={styles.refreshButtonText}>Atualizar Lista</Text>
      </TouchableOpacity>

      {/* Lista de favoritos */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => `${item.name}-${item.latitude}-${item.longitude}`}
        renderItem={renderFavoriteItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum ponto favorito salvo.</Text>}
        refreshing={refreshing} // Propriedade que indica se a lista está atualizando
        onRefresh={fetchFavorites} // Função que é chamada quando a lista é atualizada manualmente
      />

      {/* Modal para exibir detalhes do favorito selecionado */}
      {selectedFavorite && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.06)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' }}>
              <TouchableOpacity style={{ position: 'absolute', top: 0, right: 15, zIndex: 2, padding: 10 }} onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'red' }}>X</Text>
              </TouchableOpacity>
              <Text>
                {selectedFavorite.name}
                {'\n\n'}
                {selectedFavorite.chatGPTResponse}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 20 }}>
                {/* <TouchableOpacity
                  style={{ padding: 10, backgroundColor: '#4285F4', borderRadius: 5 }}
                  onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${selectedFavorite.latitude},${selectedFavorite.longitude}`)}
                >
                  <Text style={{ color: 'white' }}>Abrir no Google Maps</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  style={{ padding: 10, backgroundColor: '#FF6F00', borderRadius: 5 }}
                  onPress={() => Linking.openURL(`https://waze.com/ul?ll=${selectedFavorite.latitude},${selectedFavorite.longitude}&navigate=yes`)}
                >
                  <Text style={{ color: 'white' }}>Abrir no Waze</Text>
                </TouchableOpacity> */}
                <ButtonMaps 
                icon='logo-google' 
                title='Google Maps' 
                onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${selectedFavorite.latitude},${selectedFavorite.longitude}`)}
                />

                <ButtonWaze 
                title='Waze' 
                icon={'navigate'} 
                onPress={() => Linking.openURL(`https://waze.com/ul?ll=${selectedFavorite.latitude},${selectedFavorite.longitude}&navigate=yes`)}
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
  container: {
    flex: 1,
    padding: 20,
    /* backgroundColor: 'white', */
  },
  favoriteItem: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: 200,
  },
  category: {
    fontSize: 16,
  },
  countryState: {
    fontSize: 16,
    color: '#555',
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
  refreshButton: {
    alignSelf: 'flex-end', // Alinha o botão à direita
    padding: 10,
    backgroundColor: '#F46B27',
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  refreshButtonText: {
    backgroundColor: '#F46B27',
    color: 'white',
    fontWeight: 'bold',
  },
});
