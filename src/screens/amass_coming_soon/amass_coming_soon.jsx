import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useContext} from 'react';
import {MainContext} from '../../../App';
import ComingSoon from '../../assets/coming_soon.png';

const AmassComingSoon = () => {
  const CTX = useContext(MainContext);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff', flex: 1},
      ]}>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle={CTX.isDarkMode ? 'light-content' : 'dark-content'}
      />

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image source={ComingSoon} style={styles.comingSoonImg} />

        <Text
          style={{
            width: '90%',
            textAlign: 'center',
            fontFamily: 'Gilroy-Medium',
            fontSize: 16,
            color: CTX.isDarkMode ? '#fff' : '#000',
          }}>
          Big news! 🎉 Amass is coming soon — your space to connect, share &
          grow communities. We will notify immediately whenever we are live!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AmassComingSoon;

const styles = StyleSheet.create({
  comingSoonImg: {
    width: Dimensions.get('window').width,
    objectFit: 'contain',
    margin: 'auto',
  },
});
