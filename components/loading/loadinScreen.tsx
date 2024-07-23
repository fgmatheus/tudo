import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo0.png')} // Usando a imagem local
        style={styles.image}
      />
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  image: {
    width: 310,
    height: 220,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});
