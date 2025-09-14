import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  RefreshControl,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
import Lottie from 'lottie-react-native';
import happyEyes from '../../assets/json/withLoading.json';
// import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
// import Biometrics from 'react-native-biometrics';
import {useNavigation} from '@react-navigation/native';

import styles from './styles';
import {MainContext} from '../../../App';
import Button from '../../components/button';
import SelectBank from './selectBank';
import { useWebSocket } from '../../../WebSocketContext';
const Funds = React.lazy(() => import('../profile/funds'));
const Withdraw = ({
  inputs,
  setInputs,
  withdrawHandler,
  otherData,
  loading,
  selectedText, setSelectedText
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const CTX = useContext(MainContext);
  const [isModal, setIsModal] = useState(false);
  const [gottenData, setGottenData] = useState(null);
      const { latestMessage, } = useWebSocket();
    const [balance, setBalance] = useState(0)
  
  // const onRefresh = () => {
  //   setRefreshing(true);
  //   refreshHere().then(() => setRefreshing(false));
  // };
  // const rnBiometrics = new ReactNativeBiometrics({
  //   allowDeviceCredentials: true,
  // });

  // const { biometryType } = await rnBiometrics.isSensorAvailable()

  // if (biometryType === BiometryTypes.TouchID) {
  //   //do something fingerprint specific
  // }

  // do you know

  // are your legs the gospels cause I would love to spread them widely tonight
  // I no you love cookies, would you like to eat mine tonight
  // after seeing you, I believe diamonds are the second hardest substance in the world

  // const abcd = async () => {
  //   try {
  //     // const {biometryType} = await rnBiometrics.isSensorAvailable();

  //     // if (biometryType === BiometryTypes.TouchID) {
  //     //   // Touch ID is available
  //     //   console.log('// Touch ID is available HERE!');
  //     // } else if (biometryType === BiometryTypes.FaceID) {
  //     //   // Face ID is available
  //     //   console.log('// Face ID is available HERE!');
  //     // } else if (biometryType === BiometryTypes.Biometrics) {
  //     //   // Touch ID or Face ID is available
  //     //   console.log('// Touch ID or Face ID is available HERE!');
  //     // } else {
  //     //   // Biometrics not supported
  //     //   console.log('// Biometrics not supported HERE!');
  //     // }
  //     // })

  //     rnBiometrics
  //       .simplePrompt({promptMessage: 'Confirm fingerprint'})
  //       .then(resultObject => {
  //         const {success} = resultObject;

  //         if (success) {
  //           console.log('successful biometrics provided');
  //           withdrawHandler()
  //         } else {
  //           console.log('user cancelled biometric prompt');
  //           navigation.pop(1);
  //         }
  //       })
  //       .catch(() => {
  //         setIsModal(true);
  //         console.log('biometrics failed => ', Math.random());
  //       });
  //   } catch (error) {
  //     // Handle error
  //     console.error(error);
  //   }
  // };


    useEffect(() => {
      if (latestMessage) {
        setBalance(latestMessage?.balance)
      }
    }, [latestMessage]);
  return (
    <>
      <ScrollView
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        style={styles.containerCover}>
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          // hidden={true}
          barStyle="dark-content"
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModal}
          onRequestClose={() => setIsModal(!isModal)}>
          <Pressable style={anoStyles.centeredView}>
            <View style={{...anoStyles.modalView}}>
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    position: 'relative',
                  }}>
                  <Entypo
                    name="chevron-with-circle-down"
                    size={40}
                    style={{marginBottom: 12}}
                    color="#e20154"
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsModal(false)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      width: 34,
                      height: 34,
                    }}>
                    <AntDesign
                      name="close"
                      size={20}
                      style={{marginLeft: 'auto'}}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    color: '#555',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center',
                    marginBottom: 10,
                  }}>
                  Biometrics failed
                </Text>

                <Text
                  style={{
                    color: '#555',
                    fontWeight: '300',
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                  Your device do not support biometrics, we advice you enable
                  biometrics for protecting your account funds before withdrawal
                  {/* @{calledHere?.username} wants to join your live stream */}
                </Text>

                <Text
                  style={{
                    color: '#555',
                    fontWeight: '300',
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                  Continue without authentication
                </Text>
                <Button
                  // loading={leaving}
                  // onPress={withdrawHandler}

                  disable={!inputs?.number || !inputs?.name || !inputs?.bank}
                  onPress={withdrawHandler}
                  label={'Continue'}
                  style={{width: '100%', marginTop: 30, height: 50}}
                />
              </>
            </View>
          </Pressable>
        </Modal>
        {otherData ? (
          <>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <View style={{width: 236, height: 236}}>
                <Lottie source={happyEyes} autoPlay loop />
              </View>
              <Text style={styles.upperText}>
                Withdrawal pending due to netwoork cost
              </Text>
              <Text style={{...styles.upperText}}>Pull down to refresh</Text>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
              }}>
              <Text style={styles.upperText}>Account number</Text>
              <View style={styles.coverSearchHere}>
                <MaterialCommunityIcons
                  name="numeric"
                  color="#262626"
                  size={24}
                />
                <TextInput
                  style={styles.innerTextInput}
                  editable={inputs?.name ? false : true}
                  // placeholder="Search"
                  // placeholderTextColor={'#262626'}
                  value={inputs?.number}
                  onChangeText={e => {
                    setSelectedText({
                      code: '001',
                      name: 'Select bank',
                    });
                    setGottenData(null)

                    setInputs({...inputs, name: ""})

                  const newValue = e.replace(/\D/g, '');
                    setInputs({...inputs, number: newValue});
                  }}
                />
              </View>
            </View>
            <SelectBank
              inputs={inputs}
              setInputs={setInputs}
              setGottenData={setGottenData}
              selectedText={selectedText}
              setSelectedText={setSelectedText}
            />

            {inputs?.name && (
              <View
                style={{
                  paddingHorizontal: 20,
                }}>
                <Text style={{...styles.upperText, marginTop: 0}}>
                  Account name
                </Text>
                <View style={styles.coverSearchHere}>
                  <Feather name="user" color="#262626" size={24} />
                  <TextInput
                    editable={false}
                    style={styles.innerTextInput}
                    // placeholder="Search"
                    // placeholderTextColor={'#262626'}
                    value={inputs?.name}
                  />
                </View>
              </View>
            )}
            <Suspense fallback={null}>
              <Funds onPress={() => console.log('abcd')} />
            </Suspense>

            <View
              style={{
                padding: 20,
              }}>
              <Button
                style={{width: '100%', marginTop: 50}}
                label={'Withdraw funds'}
                loading={loading}
                disable={!inputs?.name || balance < 999}
                onPress={withdrawHandler}
                // onPress={abcd}
              />

              {/* <Text style={{...styles.upperText, marginTop: 30}}>
                  Withdrawals are only made on fridays.
                </Text>
                <Text
                  style={{
                    color: 'blue',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginTop: 1,
                  }}>
                  Learn more
                </Text> */}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default Withdraw;

const anoStyles = StyleSheet.create({
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
    backgroundColor: 'white',
    borderRadius: 7,
    // height: "90%",
    padding: 15,
    width: '90%',
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
  coverMain: {
    flex: 1,
    width: '100%',
    heigth: '100%',
    backgroundColor: '#000',
  },
  activityCover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#0a171e53',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pausedIcon: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});

// import { View, Text } from 'react-native'
// import React from 'react'

// const Withdrawal = () => {
//   return (
//     <View>
//       <Text>Withdrawal</Text>
//       <Text>Withdrawal</Text>
//       <Text>Withdrawal</Text>
//     </View>
//   )
// }

// export default Withdrawal
