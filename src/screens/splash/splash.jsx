import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';

import roundLogo from '../../assets/round-colored-logo.png';
import Button from '../../components/button';
import { MainContext } from '../../../App';
import { useWebSocket } from '../../../WebSocketContext';
const Splash = () => {
  const navigation = useNavigation();
  const CTX = useContext(MainContext);
  const { sendMessage } = useWebSocket();
  const [counter, setCounter] = useState(false);
  const getSessionToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@sessionToken');
      const userObj = await AsyncStorage.getItem('@userObj');
      // console.log("value HERE!!! from value ==>> ", value);
      // console.log("userObj HERE!!! from userObj ==>> ", userObj);

      if (value && value.length > 10) {
        CTX.setSessionToken(value);
        // CTX.setUserObj(userObj);
        // console.log("userObj ==>> ", userObj);
        // sendMessage({
        //   action: 'rebringuserdetails',
        //   token: value,
        // });

        await navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Navigation',
            },
          ],
        });
      } else {
        navigation.navigate('Number');
      }
    } catch (e) {
      console.log('eHERE! from getting ASYNC STORAGE', e);
    }
  };

  const getSystemConfig = async () => {
    try {
      const fetching = await fetch(`${CTX.url}system/config/info`);
      const getData = await fetching.json();
      // console.log("getData HERE!!! from getSystemConfig ==>> ", getData);
      // console.log("getData HERE!!! from getSystemConfig ==>> ", `${CTX.url}system/config/info`);
      CTX.systemConfigHandler(getData?.data);
      CTX.setIsUpgrade(getData?.data?.app_version !== CTX.appVersion);
      // console.log("calc something here!! ==>> ", getData?.data);

      if (getData?.data?.isUnderMaintenance) {
        // if (!true) {
        await navigation.reset({
          index: 0,
          routes: [
            {
              name: 'UnderManten',
            },
          ],
        });
        return;
      } else {
        getSessionToken();
      }
    } catch (error) {
      if (counter === true) {
        return null;
      } else {
        setTimeout(() => {
          getSystemConfig();
          setCounter(true);
        }, 6000);
        console.log('error from getSystemConfig splash HERE!!! ===>>> ', error);
        return;
      }
    }
  };

  useEffect(() => {
    getSystemConfig();
    CTX.setStatusBarColor('#e20154');
  }, []);

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

  const animatedText = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSequence(
          withTiming(-550),
          withDelay(700, withTiming(0)),
          withTiming(-50),
          withTiming(0),
          withTiming(-25),
          withTiming(-5),
        ),
      },
    ],
  }));

  const animatedGo = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSequence(
          withTiming(550),
          withDelay(100, withTiming(0)),
          withTiming(50),
          withTiming(0),
          withTiming(25),
          withTiming(5),
        ),
      },
    ],
  }));

  // const checkCount = useCallback(() => {
  //   if (counter > 10) {
  //     return null;
  //   }

  //   const newCount = counter + 1;
  //   setCounter(newCount);
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     checkCount();
  //   }, 1200);
  //   return () => setCounter(0);
  // }, [counter]);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={counter}
        onRequestClose={() => setCounter(false)}
      >
        <Pressable style={styles.centeredView}>
          <View style={{ ...styles.modalView }}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <AntDesign
                  name="disconnect"
                  size={40}
                  style={{ marginBottom: 12 }}
                  color="#e20154"
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setCounter(false)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    width: 34,
                    height: 34,
                  }}
                >
                  <AntDesign
                    name="close"
                    size={20}
                    style={{ marginLeft: 'auto' }}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  color: '#555',
                  fontSize: 20,
                  fontFamily: 'Gilroy-Bold',
                  textAlign: 'center',
                  marginBottom: 10,
                }}
              >
                Network
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                  fontFamily: 'Gilroy-Regular',
                }}
              >
                Check your network connection.
              </Text>

              <Button
                onPress={() => setCounter(false)}
                label={'Close'}
                style={{ width: '100%', marginTop: 30, height: 50 }}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.containerCover}>
        <StatusBar animated={true} backgroundColor={CTX.statusBarColor} />
        <Animated.View style={[styles.arrowCover, animatedGo]}>
          <View style={styles.arrowLeft}></View>
          <Text style={styles.goItLiveText}>GO IT LIVE</Text>
          <View style={styles.arrowRight}></View>
        </Animated.View>
        <View style={styles.makeMoney}>
          <Animated.Text style={[styles.makeMoneyText, animatedText]}>
            MAKE MONEY
          </Animated.Text>
        </View>
        <Animated.View style={[styles.roundLogoCover, animatedStyles]}>
          <Image source={roundLogo} style={styles.roundImage} />
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    // fontFamily: "Gilroy-Thin",
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
});
export default Splash;

//
// import {
//   View,
//   Text,
//   StatusBar,
//   StyleSheet,
//   Image,
//   Modal,
//   Pressable,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import React, {useContext, useEffect, useState} from 'react';
// import Animated, {
//   useAnimatedStyle,
//   withTiming,
//   withRepeat,
//   withSequence,
//   withDelay,
// } from 'react-native-reanimated';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/core';
// import AntDesign from 'react-native-vector-icons/AntDesign';

// import roundLogo from '../../assets/round-colored-logo.png';
// import Button from '../../components/button';
// import { MainContext } from '../../../App';
// const Splash = () => {
//   const navigation = useNavigation();
//   const CTX = useContext(MainContext);
//   const [counter, setCounter] = useState(false);
//   const getSessionToken = async () => {
//     try {
//       const value = await AsyncStorage.getItem('@sessionToken');
//       const userObj = await AsyncStorage.getItem('@userObj');
//       // console.log("value HERE!!! from value ==>> ", value);
//       // console.log("userObj HERE!!! from userObj ==>> ", userObj);

//       if (value && value.length > 10) {
//         CTX.setSessionToken(value);
//         CTX.setUserObj(userObj);
//         // console.log("userObj ==>> ", userObj);
//         await navigation.reset({
//           index: 0,
//           routes: [
//             {
//               name: 'Navigation',
//             },
//           ],
//         });
//       } else {
//         navigation.navigate('Number');
//       }
//     } catch (e) {
//       console.log('eHERE! from getting ASYNC STORAGE', e);
//     }
//   };

//   const getSystemConfig = async () => {
//     try {
//       const fetching = await fetch(`${CTX.url}system/config/info`);
//       const getData = await fetching.json();
//       // console.log("getData HERE!!! from getSystemConfig ==>> ", getData);
//       // console.log("getData HERE!!! from getSystemConfig ==>> ", `${CTX.url}system/config/info`);
//       CTX.systemConfigHandler(getData?.data);
//       CTX.setIsUpgrade(getData?.data?.app_version !== CTX.appVersion);
//       // console.log("calc something here!! ==>> ", getData?.data);

//       if (getData?.data?.isUnderMaintenance) {
//         // if (!true) {
//         await navigation.reset({
//           index: 0,
//           routes: [
//             {
//               name: 'UnderManten',
//             },
//           ],
//         });
//         return;
//       } else {
//         getSessionToken();
//       }
//     } catch (error) {
//       if (counter === true) {
//         return null;
//       } else {
//         setTimeout(() => {
//           getSystemConfig();
//           setCounter(true);
//         }, 6000);
//         console.log('error from getSystemConfig splash HERE!!! ===>>> ', error);
//         return;
//       }
//     }
//   };

//   useEffect(() => {
//     getSystemConfig();
//     CTX.setStatusBarColor('#e20154');
//   }, []);

//   const animatedStyles = useAnimatedStyle(() => ({
//     transform: [
//       {
//         translateY: withRepeat(
//           withSequence(
//             withTiming(-15),
//             withDelay(1000, withTiming(0)),
//             withTiming(-15),
//           ),
//           -1,
//         ),
//       },
//     ],
//   }));

//   const animatedText = useAnimatedStyle(() => ({
//     transform: [
//       {
//         translateX: withSequence(
//           withTiming(-550),
//           withDelay(700, withTiming(0)),
//           withTiming(-50),
//           withTiming(0),
//           withTiming(-25),
//           withTiming(-5),
//         ),
//       },
//     ],
//   }));

//   const animatedGo = useAnimatedStyle(() => ({
//     transform: [
//       {
//         translateX: withSequence(
//           withTiming(550),
//           withDelay(100, withTiming(0)),
//           withTiming(50),
//           withTiming(0),
//           withTiming(25),
//           withTiming(5),
//         ),
//       },
//     ],
//   }));

//   // const checkCount = useCallback(() => {
//   //   if (counter > 10) {
//   //     return null;
//   //   }

//   //   const newCount = counter + 1;
//   //   setCounter(newCount);
//   // }, []);

//   // useEffect(() => {
//   //   setTimeout(() => {
//   //     checkCount();
//   //   }, 1200);
//   //   return () => setCounter(0);
//   // }, [counter]);

//   return (
//     <>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={counter}
//         onRequestClose={() => setCounter(false)}>
//         <Pressable style={styles.centeredView}>
//           <View style={{...styles.modalView}}>
//             <>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'center',
//                   width: '100%',
//                   position: 'relative',
//                 }}>
//                 <AntDesign
//                   name="disconnect"
//                   size={40}
//                   style={{marginBottom: 12}}
//                   color="#e20154"
//                 />
//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   onPress={() => setCounter(false)}
//                   style={{
//                     position: 'absolute',
//                     right: 0,
//                     width: 34,
//                     height: 34,
//                   }}>
//                   <AntDesign
//                     name="close"
//                     size={20}
//                     style={{marginLeft: 'auto'}}
//                     color="#555"
//                   />
//                 </TouchableOpacity>
//               </View>

//               <Text
//                 style={{
//                   color: '#555',
//                   fontWeight: 'bold',
//                   fontSize: 20,
//                   textAlign: 'center',
//                   marginBottom: 10,
//                 }}>
//                 Network
//               </Text>

//               <Text
//                 style={{
//                   color: '#555',
//                   fontWeight: '300',
//                   fontSize: 14,
//                   textAlign: 'center',
//                 }}>
//                 Check your network connection.
//               </Text>

//               <Button
//                 onPress={() => setCounter(false)}
//                 label={'Close'}
//                 style={{width: '100%', marginTop: 30, height: 50}}
//               />
//             </>
//             {/* )} */}
//           </View>
//         </Pressable>
//       </Modal>

//       <View style={styles.containerCover}>
//         <StatusBar animated={true} backgroundColor={CTX.statusBarColor} />
//         <Animated.View style={[styles.arrowCover, animatedGo]}>
//           <View style={styles.arrowLeft}></View>
//           <Text style={styles.goItLiveText}>GO IT LIVE</Text>
//           <View style={styles.arrowRight}></View>
//         </Animated.View>
//         <View style={styles.makeMoney}>
//           <Animated.Text style={[styles.makeMoneyText, animatedText]}>
//             MAKE MONEY
//           </Animated.Text>
//         </View>
//         <Animated.View style={[styles.roundLogoCover, animatedStyles]}>
//           <Image source={roundLogo} style={styles.roundImage} />
//         </Animated.View>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   containerCover: {
//     width: '100%',
//     height: '100%',
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#e20154',
//   },
//   arrowCover: {
//     flexDirection: 'row',
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 'auto',
//     justifyContent: 'center',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//   },
//   arrowLeft: {
//     width: 70,
//     backgroundColor: '#fff',
//     height: 2,
//   },
//   arrowRight: {
//     width: 70,
//     backgroundColor: '#fff',
//     height: 2,
//   },
//   goItLiveText: {
//     fontSize: 30,
//     marginHorizontal: 10,
//     fontStyle: 'italic',
//     color: '#fff',
//   },
//   makeMoney: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   makeMoneyText: {
//     fontWeight: 'bold',
//     color: '#fff',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     fontSize: 43,
//   },
//   roundLogoCover: {
//     alignContent: 'center',
//     justifyContent: 'center',
//     marginTop: 'auto',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     alignItems: 'center',
//     height: 170,
//     width: 170,
//     backgroundColor: '#fff',
//     borderRadius: 90,
//   },
//   roundImage: {
//     width: 130,
//     height: 130,
//     marginTop: -17,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: Dimensions.get('window').height,
//     // marginTop: 22,
//     backgroundColor: '#00000066',
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 7,
//     // height: "90%",
//     padding: 15,
//     width: '90%',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
// });
// export default Splash;
