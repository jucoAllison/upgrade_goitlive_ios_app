import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import happyEyes from '../../assets/json/loading.json';

const Fallback = () => {
  return (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={true}
        onRequestClose={() => console.log('null')}
      >
        <Pressable style={styles.centeredView}>
          <View style={{ ...styles.modalView }}>
            <>
              <LottieView
                source={happyEyes}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
            </>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default Fallback;

const styles = StyleSheet.create({
  lottieAnimation: {
    // width: 200, // Add specific width
    // height: 200, // Add specific height
    width: Dimensions.get('window').width, // Full width
    height: Dimensions.get('window').height, // Full height
  },
  containerCover: {
    width: '100%',
    height: '100%',
    flex: 1,
    padding: 20,
    backgroundColor: '#e20154',
  },
  arrowCover: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  arrowLeft: {
    width: 70,
    backgroundColor: '#fff',
    height: 2,
  },
  arrowRight: {
    width: 70,
    backgroundColor: '#fff',
    height: 2,
  },
  goItLiveText: {
    fontSize: 30,
    marginHorizontal: 10,
    fontStyle: 'italic',
    color: '#fff',
  },
  makeMoney: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  makeMoneyText: {
    fontWeight: 'bold',
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 43,
  },
  roundLogoCover: {
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    // marginTop: 22,
    backgroundColor: '#00000066',
  },
  modalView: {
    margin: 20,
    backgroundColor: '00000066',
    borderRadius: 7,
    height: '100%',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
});
