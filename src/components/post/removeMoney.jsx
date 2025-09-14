// import {useNavigation} from '@react-navigation/core';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import Lottie from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import imgData from '../../assets/iosBackground.jpeg';

import animationData from '../../assets/json/cryingHeart.json';
import {MainContext} from '../../../App';
import Button from '../button';
const RemoveMoneyCom = ({
  active,
  isPlaying,
  item,
  videoLoad,
  timeLeft,
  setTimeLeft,
  setPauseOverRide,
  pauseOverRide
}) => {
  const CTX = useContext(MainContext);
  const timerRef = useRef(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);



  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);



  const getMoneyFromUser = useCallback(async () => {
    console.log('remove money from user here');
    console.log('remove money from user here =>> ', item?.user?._id);
    console.log('remove money from user here');
    try {
      // if (isRemoving) return;

      console.log('remove money from user here');
      // const fromID = await CTX?.userObj?._id;
      const toID = await item?.user?._id;
      const postID = item?._id;

      const fetching = await fetch(
        `${CTX.systemConfig?.p}account/user/account/remove/funds/${toID}/${item._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const response = await fetching.json();
      if (response?.isRemoved) {
        return CTX.logoutUser();
      }

      if (response.e) {
        createThreeButtonAlert(response.m)
        return;
      }

      setModalVisible(response?.shouldBlock);
      setPauseOverRide(response?.shouldBlock);

      console.log(
        'response?.data?.shouldBlock ==>>>  ',
        response?.shouldBlock,
      );
    } catch (error) {
      console.log('error from getMoneyFromUser => ', error);
    }
  }, []);

  useEffect(() => {
    // if (!active && !isPlaying && !videoLoad && !pauseOverRide) {
      if (!active && isPlaying && !videoLoad && !pauseOverRide) {
      timerRef.current = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(prevTime => prevTime - 1);
        } else {
          // setTimeLeft(60); // Reset to 60 seconds
          setTimeLeft(59); // Reset to 59 seconds
          getMoneyFromUser()
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [timeLeft, active, isPlaying, videoLoad, pauseOverRide]);

  useEffect(() => {
    if (active || isPlaying || videoLoad || pauseOverRide) {
      clearTimeout(timerRef.current);
    } else if (timeLeft === 59) {
      setTimeLeft(prevTime => prevTime); // Resume from the current timeLeft
    }
  }, [active, isPlaying, videoLoad, pauseOverRide]);

  // console.log('elapsedTime ==> ');
  // console.log('timeLeft ==> ', timeLeft);
  // console.log('CTX.userObj._id != item?.user?._id ==> ', CTX.userObj.username, item?.user?.username);

  // useEffect(() => {}, [])

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
                <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  // setPauseOverRide(true);
                }}
                style={styles.closeHere}>
                <AntDesign name="close" size={20} color="#555" />
              </TouchableOpacity>

                <Lottie
                  style={styles.Lottie}
                  source={animationData}
                  autoPlay
                  loop
                />

                <Text style={styles.mainTextHere}>
                  You no longer have enough funds in your account to continue watching the video!
                </Text>

                <Button
                  // loading={leaving}
                  onPress={() => {
                    // setModalVisible(true);
                    // navigation.pop();
                    leave();
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
      
    </>

    // <View>
    //   <Modal
    //     animationType="slide"
    //     transparent={true}
    //     visible={modalVisible}
    //     onRequestClose={() => {
    //       // setModalVisible(!modalVisible);
    //       console.log("adfsaf");
    //     }}>
    //     <Pressable style={styles.anocenteredView}>
    //       <View style={{...styles.anomodalView}}>
    //         <>
    //           {/* <TouchableOpacity
    //             activeOpacity={0.8}
    //             onPress={() => {
    //               setModalVisible(!modalVisible);
    //               // setPauseOverRide(true);
    //             }}
    //             style={styles.closeHere}>
    //             <AntDesign name="close" size={20} color="#555" />
    //           </TouchableOpacity> */}

    //           <Lottie
    //             style={styles.Lottie}
    //             source={animationData}
    //             autoPlay
    //             loop
    //           />

    //           <Text style={styles.mainTextHere}>
    //             You no longer have enough funds in your account to continue!
    //           </Text>

    //           <Button
    //             onPress={() => navigation.navigate('DepositScreen')}
    //             // loading={leaving}
    //             label={'Fund account'}
    //             style={{
    //               width: '100%',
    //               backgroundColor: '#ee6666',
    //               marginTop: 30,
    //               height: 50,
    //             }}
    //           />
    //         </>
    //       </View>
    //     </Pressable>
    //   </Modal>
    // </View>
  );
};

const styles = StyleSheet.create({
  // anocenteredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   height: Dimensions.get('window').height,
  //   // marginTop: 22,
  //   backgroundColor: '#00000066',
  // },
  // anomodalView: {
  //   margin: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 7,
  //   // height: "90%",
  //   padding: 15,
  //   width: '90%',
  //   paddingTop: 100,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },

  // centeredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 22,
  // },
  // modalView: {
  //   margin: 20,
  //   // width: 300,
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   padding: 13,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  // button: {
  //   borderRadius: 4,
  //   paddingHorizontal: 13,
  //   paddingVertical: 6,
  //   backgroundColor: '#e20154',
  //   elevation: 2,
  // },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  // buttonClose: {
  //   backgroundColor: '#e20154',
  // },
  // textStyle: {
  //   color: 'white',
  //   // fontWeight: 'bold',
  //   fontSize: 11,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  // modalText: {
  //   marginBottom: 15,
  //   color: '#939393',
  //   fontFamily: 'Optimistic Display',
  //   textAlign: 'center',
  // },
  // closeHere: {
  //   justifyContent: 'center',
  //   zIndex: 3,
  //   alignItems: 'center',
  //   position: 'absolute',
  //   top: 5,
  //   right: 5,
  //   width: 34,
  //   height: 34,
  // },
  // Lottie: {
  //   flex: 1,
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  // },
  // mainTextHere: {
  //   color: '#555',
  //   marginTop: 20,
  //   fontWeight: '300',
  //   fontSize: 14,
  //   textAlign: 'center',
  //   fontFamily: 'Overpass-Regular',
  // },


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

export default memo(RemoveMoneyCom);
