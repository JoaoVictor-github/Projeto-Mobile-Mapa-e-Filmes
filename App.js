import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = '1993e977'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Encontre Filmes
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme para ler suas Informações :"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Encontrar Filme" onPress={handleSearch} color='#ff9900'  />

      {movieData && (
        <View style={styles.movieDataContainer}>
          <Text style={styles.subtitle2}>{movieData.Title}</Text>
          <Text style={styles.subtitle2}>Ano de Lançamento: {movieData.Year}</Text>
          <Text style={styles.subtitle2}>Gênero: {movieData.Genre}</Text>
          <Text style={styles.subtitle2}>Diretor: {movieData.Director}</Text>
          <Text style={styles.subtitle2}>Prêmios: {movieData.Awards}</Text>
        </View> )}

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.subtitle1}>Esta é Sua Localização Atual!</Text>
          <Text style={styles.coordenadas}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.coordenadas}>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você Esta Aqui!"
            />
          </MapView>
        </View>
      )}
        </View>
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 10,
    padding: 30,
    backgroundColor: '#191624',
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#fffafa',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    margin: 20,
    marginTop: 60,
    marginBottom: 20,
    padding: 15,
    textAlign: 'center',
    backgroundColor: '#ff9900',
    borderRadius: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 2,
    margin: 5,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    padding: 8,
    paddingLeft: 16,
    borderRadius: 60,
    backgroundColor: '#fffafa',
  },
  locationContainer: {
    display: 'flex',
    justifyContent:'center',
    textAlign: 'center',
    marginTop: 70,
    marginLeft: 30,
    marginRight: 30,
    width: '90%',
    backgroundColor: '#ff9900',
    borderRadius: 16,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    paddingTop: '4%',
    paddingRight:'20%',
    paddingLeft:'8%',
    paddingBottom: '10%',
    borderWidth: 2,

  },
  map: {
    marginLeft:80,
    width: 500,
    height: 500,
    marginTop: 10,
  },
  movieDataContainer: {
    margin: 20,
    marginTop: 50,
    marginBottom: -20,
    padding: 20,
    backgroundColor: '#fffafa',
    borderWidth: 4,
    borderColor: '#ff9900',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center'
  },
  subtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center', 
    color: '#fffafa'
  },
  subtitle1: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center', 
    color: '#fffafa',
    paddingLeft: 76,
    paddingRight: 4
  },
  subtitle2: {
    fontSize:18,
    fontWeight: 'bold',
    color: '#ff9900'
  },
  coordenadas: {
    fontWeight: 'bold',
    paddingLeft: 76,
    color: '#fffafa'
  }
});

export default App;
