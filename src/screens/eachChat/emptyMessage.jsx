import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {MainContext} from '../../../App';
import {useRoute} from '@react-navigation/core';
import chat_bg from '../../assets/chat_bg.png';

const EmptyMessage = () => {
  const CTX = useContext(MainContext);
  const route = useRoute();
  const {photo, full_name, isChat, _id, username} = route.params;

  return (
    // <ImageBackground source={chat_bg} style={styles.styleLandingLogo}>
    //   <View
    //     style={{
    //       width: '100%',
    //       padding: 20,
    //       flex: 1,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       backgroundColor: CTX.isDarkMode ? '#000000b8' : "#fbefe3a7",
    //     }}></View>

    //     <View style={styles.positionAbsoluteView}>
    <>
      <View
        style={{
          ...styles.coverSearchHere,
          backgroundColor: CTX.isDarkMode ? '#202d3489' : '#efefef',
        }}>
        <Text
          style={{
            ...styles.innerTextInput,
            color: CTX.isDarkMode ? '#abb1b8' : '#0a0a0a',
          }}>
          Messages are encrypted end to end.
        </Text>
      </View>
      <View style={styles.activiityCover}>
        <View>
          <Image
            source={{
              uri: photo
                ? photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={{...styles.eachImg, width: 90, height: 90}}
          />

          <Text
            style={{
              ...styles.pleaseRetry,
              color: CTX.isDarkMode ? '#fff' : '#000',
              marginTop: 10,
            }}>
            {full_name}
          </Text>

          <Text
            style={{
              ...styles.pleaseRetry,
              color: CTX.isDarkMode ? '#fff' : '#000',
              fontFamily: 'Gilroy-Regular',
              marginTop: 3,
            }}>
            @{username}
          </Text>
        </View>
      </View>
    </>
    //   </View>
    // </ImageBackground>
  );
};

export default EmptyMessage;

const styles = StyleSheet.create({
  styleLandingLogo: {
    width: '100%',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  coverSearchHere: {
    backgroundColor: '#202d34',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    // left: -23,
    height: 38,
    alignItems: 'center',
    flexDirection: 'row',
  },
  positionAbsoluteView: {
    width: '100%',
    position: 'absolute',
    // padding: 20,
  },
  innerTextInput: {
    color: '#abb1b8',
    marginLeft: 10,
    fontFamily: 'Gilroy-Regular',
    width: '80%',
    fontSize: 12,
  },
  activiityCover: {
    width: '100%',
    height: '100%',
    // height: Dimensions.get('window').height - 240,
    // justifyContent: 'center',
    paddingTop: 130,
    alignItems: 'center',
  },
  pleaseRetry: {
    marginTop: 20,
    color: '#fff',
    fontFamily: 'Gilroy-Medium',
    textAlign: 'center',
  },
});
