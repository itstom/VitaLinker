// SplashScreen.tsx
import React from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';

const SplashScreen = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    image: {
      width: Dimensions.get('window').width, 
      height: Dimensions.get('window').height,
    }
  });

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo01.png')} 
        style={styles.image}
        resizeMode='contain'
      />
    </View>
  );
};

export default SplashScreen;
