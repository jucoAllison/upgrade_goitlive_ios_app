import {
  View,
  Text,
  Dimensions,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {useNavigation} from '@react-navigation/core';
import Lottie from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MainContext} from '../../../../App';
import animationData from '../../../assets/json/cryingHeart.json';
import imgData from '../../../assets/iosBackground.jpeg';
import Button from '../../../components/button';

const CountdownTimer = ({
  _id,
  seconds,
  errMsg,
  setErrMsg,
  showMsg,
  setShowMsg,
  modalVisible,
  setModalVisible,
}) => {
  const navigation = useNavigation();

  const formatTime = time => (time < 10 ? `0${time}` : `${time}`);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const formattedTime = `${formatTime(hours)}:${formatTime(
    minutes % 60,
  )}:${formatTime(seconds % 60)}`;

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(true)}>
        <ImageBackground
          source={imgData}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            overflow: 'hidden',
          }}
          blurRadius={30}>
          <Pressable style={styles.anocenteredView}>
            <View style={{...styles.anomodalView}}>
              <>
                {/* <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  // setPauseOverRide(true);
                }}
                style={styles.closeHere}>
                <AntDesign name="close" size={20} color="#555" />
              </TouchableOpacity> */}

                <Lottie
                  style={styles.Lottie}
                  source={animationData}
                  autoPlay
                  loop
                />

                <Text style={styles.mainTextHere}>
                  You no longer have enough funds in your account to continue!
                </Text>

                <Button
                  // loading={leaving}
                  onPress={() => {
                    // setModalVisible(true);
                    // navigation.pop();
                    navigation.navigate('DepositScreen');
                  }}
                  label={'Fund account'}
                  style={{
                    width: '100%',
                    backgroundColor: '#ee6666',
                    marginTop: 30,
                    height: 50,
                  }}
                />
              </>
              {/* )} */}
            </View>
          </Pressable>
        </ImageBackground>
      </Modal>
      <Text style={{textAlign: 'center', color: '#fff'}}>
        {/* {hours}:{minutes}:{seconds % 60} */}
        {formattedTime}
      </Text>
    </>
  );
};

export default CountdownTimer;

const styles = StyleSheet.create({
  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    // marginTop: 22,
    backgroundColor: '#00000066',
  },
  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    // height: "90%",
    padding: 15,
    width: '90%',
    paddingTop: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    // width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 6,
    backgroundColor: '#e20154',
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#e20154',
  },
  textStyle: {
    color: 'white',
    // fontWeight: 'bold',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    color: '#939393',
    fontFamily: 'Optimistic Display',
    textAlign: 'center',
  },
  closeHere: {
    justifyContent: 'center',
    zIndex: 3,
    alignItems: 'center',
    position: 'absolute',
    top: 5,
    right: 5,
    width: 34,
    height: 34,
  },
  Lottie: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mainTextHere: {
    color: '#555',
    fontWeight: '300',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Overpass-Regular',
  },
});
