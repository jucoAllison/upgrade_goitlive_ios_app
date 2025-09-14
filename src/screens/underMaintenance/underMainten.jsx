import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {WebView} from 'react-native-webview';

const UnderManten = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = 'https://jsonplaceholder.typicode.com/photos'; // Replace with your desired website URL

  const handleError = error => {
    console.error('Error loading website:', error);
    setError(error.message);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar animated={true} backgroundColor={'#fff'} />

      {isLoading && <ActivityIndicator style={{marginTop: 152}} size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      <Text style={{...styles.error, textAlign: "center", marginTop: 14}}>Error: we are currently under maintenance</Text>
      {/* <WebView
        source={{uri: url}}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={handleError}
        // Add other props as needed (e.g., injectedJavaScript, onMessage)
      /> */}
    </View>
  );
};

export default UnderManten;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: ""
  },
  error: {
    color: 'red',
  },
});
