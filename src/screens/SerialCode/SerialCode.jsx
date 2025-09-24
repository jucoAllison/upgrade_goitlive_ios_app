import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/core';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-community/clipboard';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

import roundLogo from '../../assets/round-colored-logo.png';
import styles from '../verification/verification.styles';
import { MainContext } from '../../../App';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
const SerialCode = () => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  const [copyText, setCopyText] = useState('Copy');
  const route = useRoute();

  const copySerialCode = useCallback((text = '') => {
    Clipboard.setString(text);

    setTimeout(() => {
      setCopyText('Copy');
    }, 1000);
    setCopyText('Copied');
  }, []);

  const redirectHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Navigation',
        },
      ],
    });
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withRepeat(
          withSequence(
            withTiming(-15),
            withDelay(1000, withTiming(0)),
            withTiming(-15),
          ),
          -1,
        ),
      },
    ],
  }));

  return (
    <DismissKeyboardWrapper>
      <ImageBackground
        source={{ uri: CTX.systemConfig?.loginBackgroundImageUrl }}
        style={classes.styleLandingLogo}
      >
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          hidden={true}
        />

        <ScrollView>
          <View
            style={{
              width: '100%',
              padding: 20,
              flex: 1,

              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000098',
            }}
          ></View>
          {/* <TouchableOpacity activeOpacity={0.8}
          style={styles.backTouchableOpacity}
          onPress={() => navigation.navigate('Number')}>
          <MaterialIcons
          size={27}
          name="arrow-back-ios"
          style={{marginLeft: 10}}
          color={'#fff'}
          />
          </TouchableOpacity> */}
          <View style={classes.positionAbsoluteView}>
            <Animated.View style={[classes.roundLogoCover, animatedStyles]}>
              <Image source={roundLogo} style={classes.roundImage} />
            </Animated.View>

            <View style={classes.boxCover}>
              <View style={classes.eachBox}>
                <Text style={classes.eachTextBox}>Fast</Text>
              </View>
              <View style={classes.eachBox}>
                <Text style={classes.eachTextBox}>Powerful</Text>
              </View>
              <View style={classes.eachBox}>
                <Text style={classes.eachTextBox}>Secure</Text>
              </View>
              <View style={classes.eachBox}>
                <Text style={classes.eachTextBox}>Private</Text>
              </View>
              <View style={classes.eachBox}>
                <Text style={classes.eachTextBox}>Unlimited</Text>
              </View>
              <View style={classes.eachBox}>
                <Text style={classes.eachTextBox}>Synced</Text>
              </View>
              <View style={classes.eachBox}>
                <Text style={classes.eachTextBox}>100% free and open</Text>
              </View>
              <View style={classes.eachBox}>
                <Text style={classes.eachTextBox}>Reliable</Text>
              </View>
            </View>

            <Text
              style={{
                ...styles.whatsYourNumber,
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              Backup Code
            </Text>
            <Text
              style={{
                ...styles.whatsYourNumber,
                fontSize: 17,
                fontWeight: '400',
                fontFamily: 'Gilroy-Medium',
              }}
            >
              Your backup code helps you login into another device. Copy and
              keep it safe, no one from GoitLive will ever ask for it.
            </Text>

            <View style={styles.textInputLinkCover}>
              <FontAwesome name="qrcode" size={22} color="#3b3b3b" />
              <Text style={{ ...styles.inputTextInput, color: '#3b3b3b' }}>
                {route?.params?.backup_words}
              </Text>

              <Pressable
                onPress={() => copySerialCode(route?.params?.backup_words)}
                style={styles.copyHandler}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#fff',
                    fontFamily: 'Gilroy-Black',
                  }}
                >
                  {copyText}
                </Text>
              </Pressable>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => redirectHome()}
              style={{ paddingTop: 10, width: '100%' }}
            >
              <View style={styles.eachBtnCover}>
                <Text style={styles.eachBtnText}>Start</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('AppEventFeatures')}
              style={{ marginBottom: 20, paddingBottom: 20 }}
            >
              <Text style={classes.beta_version}>Beta Version</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </DismissKeyboardWrapper>
  );
};

export default SerialCode;

const classes = StyleSheet.create({
  beta_version: {
    textAlign: 'center',
    marginTop: 44,
    fontFamily: 'Gilroy-Medium',
    fontSize: 11,
    color: '#fff',
  },
  boxCover: {
    flexWrap: 'wrap',
    marginVertical: 20,
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  eachBox: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderWidth: 1, // thickness
    borderColor: '#3b3b3b', // color
    borderStyle: 'solid',
    paddingHorizontal: 20,
    paddingVertical: 10.7,
  },
  eachTextBox: {
    fontSize: 17,
    fontFamily: 'Gilroy-Medium',
    color: '#3b3b3b',
  },
  styleLandingLogo: {
    width: '100%',
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  positionAbsoluteView: {
    width: '100%',
    // alignItems: 'center',
    position: 'absolute',
    padding: 20,
  },
  roundLogoCover: {
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 98,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    height: 170,
    width: 170,
    backgroundColor: '#fff',
    borderRadius: 90,
  },
  roundImage: {
    width: 130,
    height: 130,
    marginTop: -17,
  },
});
