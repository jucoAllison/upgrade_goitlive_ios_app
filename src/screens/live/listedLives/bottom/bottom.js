import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
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
import { MainContext } from '../../../../../App';

const CountdownTimer = React.lazy(() => import('./countdownTimer'));
import CommentInput from './commentInput';
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

      console.log('response?.data?.shouldBlock ==>>>  ', response?.data);
      if (response?.data?.shouldBlock) {
        setModalVisible(response?.data?.shouldBlock);
        // setPauseOverRide();
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
