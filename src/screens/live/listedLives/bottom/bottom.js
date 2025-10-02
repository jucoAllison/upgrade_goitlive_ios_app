import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  ImageBackground,
  Pressable,
} from 'react-native';
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Lottie from 'lottie-react-native';
import imgData from '../../../../assets/iosBackground.jpeg';
import animationData from '../../../../assets/json/cryingHeart.json';
import CommentInput from './commentInput';
import Button from '../../../../components/button';
import { MainContext } from '../../../../../App';

const CountdownTimer = React.lazy(() => import('./countdownTimer'));
const Bottom = ({
  leave,
  showBottomStm,
  room,
  messages,
  setMessages,
  scrollToBottom,
  isPrivateLive,
  // username,
  _id,
  isToComment,
  setIsToComment,
}) => {
  // const [] = useState(false)
  const [seconds, setSeconds] = useState(0);
  const prevSecondsRef = useRef();
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const CTX = useContext(MainContext);
  const navigation = useNavigation();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        // translateY: withSequence(withTiming(85), withDelay(100, withTiming(0))),
        translateY: -showBottomStm
          ? withSequence(withTiming(0), withDelay(100, withTiming(85)))
          : withSequence(withTiming(0), withDelay(100, withTiming(0))),
      },
    ],
  }));
  // console.log('remove money from user here => _id ', _id);

  const handleMinuteReached = async () => {
    // Your logic when 60 seconds have passed
    console.log('A minute has passed! Do something...');
    console.log('A minute has passed! Do something... ', Math.random());
    console.log('A minute has passed! Do something...');

    try {
      // if (isRemoving) return;

      console.log('remove money from user here => _id ', _id);
      // const fromID = await CTX?.userObj?._id;
      const toID = await _id;

      const fetching = await fetch(
        `${CTX.systemConfig?.p}account/user/account/remove/funds/${toID}`, // we get three fetching here as
        // `${CTX.systemConfig?.p}user/get_private_account/1/3`, // we get three fetching here as
        {
          method: 'GET',
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

      if (response.error) {
        setErrMsg(response?.msg);
        setShowMsg(true);
        return;
      }

      // console.log('response?.data?.shouldBlock ==>>>  ', response?.data);
      if (response?.shouldBlock) {
        if (!modalVisible) {
          setModalVisible(response?.shouldBlock);
        }
      }
    } catch (error) {
      console.log('error from getMoneyFromUser => ', error);
    }
  };

  useEffect(() => {
    prevSecondsRef.current = seconds;
  }, [seconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);

      // Check if it's been 60 seconds (1 minute)
      if ((prevSecondsRef.current + 1) % 60 === 0) {
        handleMinuteReached(); // Call your function when a minute is reached
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empt

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(true)}
      >
        <ImageBackground
          source={imgData}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            overflow: 'hidden',
          }}
          blurRadius={30}
        >
          <Pressable style={styles.anocenteredView}>
            <View style={{ ...styles.anomodalView }}>
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setModalVisible(false);
                    leave();
                    navigation.navigate('Navigation', {
                      screen: 'Chats',
                    });
                  }}
                  style={styles.closeHere}
                >
                  <AntDesign name="close" size={20} color="#555" />
                </TouchableOpacity>

                <Lottie
                  style={styles.Lottie}
                  source={animationData}
                  autoPlay
                  loop
                />

                <Text style={styles.mainTextHere}>
                  You no longer have enough funds in your account to continue
                  streaming!
                </Text>

                <Button
                  // loading={leaving}
                  onPress={() => {
                    setModalVisible(false);
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

      {/* <Animated.View style={[styles.bottomSmth, animatedStyles]}> */}
      <View style={styles.bottomSmth}>
        {isToComment ? (
          <CommentInput
            isPrivateLive={isPrivateLive}
            setIsToComment={setIsToComment}
            room={room}
            messages={messages}
            scrollToBottom={scrollToBottom}
            setMessages={setMessages}
          />
        ) : (
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.addComment}
              onPress={() => setIsToComment(!isToComment)}
              // onPress={checkIfLive}
            >
              <Text
                style={{
                  color: '#ffffff99',
                  // fontWeight: 'bold',
                  marginLeft: 4,
                }}
              >
                Add comment...
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.boxStuff}>
              <Ionicons name="call" size={23} color={'#fff'} />
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.offVideo}
              onPress={leave}>
              <View style={{...styles.boxStuff, marginLeft: 'auto'}}>
                <Feather name="power" size={20} color="#ffffff99" />
              </View>
            </TouchableOpacity> */}

            {/* <View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#fff',
                    textTransform: 'capitalize',
                  }}>
                  {username}
                </Text>
                <Suspense fallback={null}>
                  <CountdownTimer
                    _id={_id}
                    seconds={seconds}
                    setSeconds={setSeconds}
                    // errMsg={errMsg}
                    // setErrMsg={setErrMsg}
                    // showMsg={showMsg}
                    // setShowMsg={setShowMsg}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                  />
                </Suspense>
              </View>
            </View> */}

            {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsToComment(!isToComment)}
              style={{...styles.boxStuff, backgroundColor: '#fff'}}>
              <MaterialCommunityIcons
                name="message-text"
                size={23}
                color={'#e20154'}
              />
            </TouchableOpacity> */}
          </View>
        )}
      </View>
    </>
  );
};

export default Bottom;

export const styles = StyleSheet.create({
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
    fontFamily: 'Gilroy-Medium',
  },
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
  offVideo: {
    width: 38,
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  addComment: {
    backgroundColor: '#5b5b5b38',
    // width: 130,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingRight: 35,
    borderRadius: 18,
  },
  main: { backgroundColor: '#7d9' },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  scroll: {
    height: Dimensions.get('window').height,
    width: '100%',
    position: 'relative',
  },
  videoView: { width: '100%', height: '100%' },
  fullCam: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  smallCam: {
    top: 0,
    left: 0,
    backgroundColor: '#d0d',
    position: 'absolute',
    width: '39%',
    height: '26%',
    zIndex: 20,
  },
  bottomSmth: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxStuff: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  endCall: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'transparent',
    borderColor: '#fff',
    backgroundColor: '#e20154',
    marginTop: -90,
  },
  bottomAddPart: {
    position: 'absolute',
    width: '100%',
    height: '10%',
    backgroundColor: '#e20154',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    padding: 20,
  },
  addText: { fontWeight: 'bold', color: '#fff', marginLeft: 13 },
});
