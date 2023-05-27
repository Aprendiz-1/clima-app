import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Wind from 'react-native-vector-icons/Feather';

type WeatherProps = {
  main: string;
  description: string;
  icon: string;
};

type MainProps = {
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
};

type WindProps = {
  speed: number;
};

interface WeatherData {
  id: number;
  name: string;
  weather: WeatherProps[];
  main: MainProps;
  wind: WindProps;
}

function App(): JSX.Element {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const apiKey = '59ce03f4ecac1ac140034c999c356148';

  useEffect(() => {
    getLocation();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getLocation() {
    try {
      Geolocation.getCurrentPosition(async info => {
        let lat = info.coords.latitude;
        let lon = info.coords.longitude;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`,
        );

        const data = await response.json();
        setWeatherData(data);
        checkImage(String(weatherData?.weather[0].main));
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function loadData() {
    if (city === '') {
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`,
      );

      const data = await response.json();
      setWeatherData(data);
      checkImage(String(weatherData?.weather[0].main));
    } catch (error) {
      console.log(error);
    }
  }

  function checkImage(weather: string) {
    if (weather === 'Clouds') {
      return (
        <Image source={require('./assets/clouds.png')} style={styles.image} />
      );
    } else if (weather === 'Clear') {
      return (
        <Image source={require('./assets/clear.png')} style={styles.image} />
      );
    } else if (weather === 'Rain') {
      return (
        <Image source={require('./assets/rain.png')} style={styles.image} />
      );
    } else if (weather === 'Snow') {
      return (
        <Image source={require('./assets/snow.png')} style={styles.image} />
      );
    } else if (weather === 'Drizzle') {
      return (
        <Image source={require('./assets/drizzle.png')} style={styles.image} />
      );
    } else {
      return (
        <Image source={require('./assets/mist.png')} style={styles.image} />
      );
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />

        <LinearGradient
          colors={
            Number(weatherData?.main.temp) > 24
              ? ['#d0ee25', '#f89500', '#b63636']
              : ['#3f00ee', '#5d949e', '#f0f0f0']
          }
          style={styles.gradientContainer}>
          <View style={styles.topContent}>
            <View style={styles.inputContent}>
              <TextInput
                placeholder="Cidade"
                value={city}
                onChangeText={e => setCity(e)}
                onSubmitEditing={loadData}
                style={styles.input}
              />

              <TouchableOpacity onPress={loadData}>
                <LinearGradient
                  colors={
                    Number(weatherData?.main.temp) > 24
                      ? ['#d0ee25', '#f89500']
                      : ['#3f00ee', '#5d949e']
                  }
                  style={styles.searchButton}>
                  <Icon name="search" size={22} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {weatherData ? (
            <>
              <View style={styles.titleContent}>
                <Ionicons name="location-sharp" size={30} color="#fff" />
                <Text style={styles.title}>{weatherData?.name}</Text>
              </View>

              <LinearGradient
                colors={['#cecece', '#fff']}
                style={styles.centerCard}>
                {checkImage(String(weatherData?.weather[0].main))}

                <Text style={styles.description}>
                  {weatherData?.weather[0].description}
                </Text>

                <View style={styles.infosContent}>
                  <View style={styles.infosColumn}>
                    <Text style={styles.tempTitle}>
                      {weatherData?.main.temp.toFixed(0)}°C
                    </Text>
                  </View>
                  <View style={styles.divisor} />
                  <View style={styles.infosColumn}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                      <Wind name="wind" size={22} color="#222" />
                      <Text style={styles.subTitle}>
                        {weatherData?.wind.speed}km/h
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Ionicons name="water-sharp" size={22} color="#222" />
                      <Text style={styles.subTitle}>
                        {weatherData?.main.humidity}%
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </>
          ) : (
            <View style={{flex: 1, alignItems: 'center', paddingTop: 120}}>
              <LinearGradient
                colors={['#cecece', '#fff']}
                style={styles.centerCard}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#222',
                    textAlign: 'center',
                  }}>
                  Ative sua localização ou pesquise por uma cidade
                </Text>
              </LinearGradient>
            </View>
          )}
        </LinearGradient>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
  },
  topContent: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  inputContent: {
    width: '88%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 30,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingLeft: 18,
  },
  searchButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  titleContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '7.5%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 3,
  },
  centerCard: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  imageContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  image: {
    width: 120,
    height: 120,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textTransform: 'capitalize',
    marginBottom: 30,
  },
  tempTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 5,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 8,
  },
  infosContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  divisor: {
    width: 2,
    height: '100%',
    backgroundColor: '#222',
  },
  infosColumn: {
    width: 85,
    justifyContent: 'center',
  },
});

export default App;
