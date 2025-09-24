import React, {
  useRef,
  useState,
  useEffect,
  Suspense,
  lazy,
  useContext,
} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { RtcSurfaceView } from 'react-native-agora';
import Lottie from 'lottie-react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ImgAbc from '../../assets/ic_launcher.png';

import LiveLot from '../../assets/json/waves.json';
import { MainContext } from '../../../App';
const TopDetailsHere = lazy(() => import('./topDetailsHere'));
const BottomBtns = lazy(() => import('./bottomBtns'));
const Live = ({
  uid,
  join,
  leave,
  leaveChannel,
  isJoined,
  showMessage,
  isHost,
  setIsHost,
  message,
  setIsJoined,
  remoteUid,
  permissionGranted,
  room,
}) => {
  const [messages, setMessages] = useState([
    {
      _id: Math.random(),
      user: {
        username: `Notice`,
        img: ImgAbc,
        verify: true,
      },
      msg: 'Welcome to GoItLive!! Enjoy engaging with people in real time; you must be at least eighteen years old.',
    },
  ]);
  const CTX = useContext(MainContext);
  const scrollViewRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    let interval;

    if (isJoined) {
      interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          clearInterval(interval);
        }
      }, 1300);
    }

    return () => clearInterval(interval); // Cleanup on component unmount or when isJoined becomes false
  }, [isJoined, timer]);

  const handleScroll = event => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    // Check if the scroll view is at the bottom
    const atBottom = scrollY + scrollViewHeight >= contentHeight;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = asd => {
    // if (isAtBottom) {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    // }
  };

  const newMessageFromUser = async ({ user, msg, totalUsers }) => {
    const copiedMessages = messages.slice();
    const newMessage = {
      user,
      msg,
      totalUsers,
    };

    copiedMessages.push(newMessage);
    setMessages(copiedMessages);
    scrollToBottom();
  };

  const checkPress = () => {
    // if(!permissionGranted){
    //     Linking.openSettings();
    //   return
    // }
    setTimeout(() => {
      setIsJoining(false);
    }, 1200);
    join();
    setIsJoining(true);
    setIsJoined(true);
  };

  useEffect(() => {
    if (CTX.socketObj) {
      CTX.socketObj.on('send-private-room-message', newMessageFromUser);
      // CTX.socketObj?.emit('join-private-room', {room: CTX.userObj?._id});
    }

    return () => {
      CTX.socketObj?.off('send-private-room-message');
    };
  }, [CTX.socketObj, messages]);

  return (
    <>
      <View style={styles.scroll}>
        <View style={styles.onTopSmth}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 10,
              // overflow: "scroll"
              marginTop: 40,
              width: '100%',
            }}
          >
            <Suspense fallback={null}>
              {/* {isJoined && ( */}
              <TopDetailsHere
                leaveChannel={leaveChannel}
                messages={messages}
                isJoined={isJoined}
                timer={timer}
              />
              {/* )} */}
            </Suspense>
          </View>

          {isJoined ? (
            <>
              <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />
              {timer > 0 && (
                <View style={styles.counterTimer}>
                  <Text
                    style={{
                      // fontWeight: 'bold',
                      fontSize: 33,
                      color: '#ffffff',
                      fontFamily: 'Overpass-Regular',
                    }}
                  >
                    {timer}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <View
                style={{
                  width: 280,
                  height: 280,
                }}
              >
                <Lottie source={LiveLot} autoPlay loop style={{width: 0, height: 0}} />
              </View>

              <View style={styles.rememberTextCover}>
                <Text style={styles.rememberText}>
                  Remember to keep live streaming respectful and to follow our
                  <Text style={{ color: '#00d', paddingLeft: 4 }}>
                    {' '}
                    Community Guideline
                  </Text>
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={checkPress}
                style={styles.startCallHere}
              >
                {isJoining ? (
                  <ActivityIndicator color={'#fff'} size={20} />
                ) : (
                  <>
                    {isJoined ? (
                      <Fontisto name="phone" color="#fff" size={19} />
                    ) : (
                      <Fontisto name="livestream" color="#fff" size={19} />
                    )}
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        marginLeft: 4,
                      }}
                    >
                      Go live
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {isJoined && (
        <Suspense fallback={null}>
          <BottomBtns
            join={join}
            isJoined={isJoined}
            setIsJoined={setIsJoined}
            leaveChannel={leaveChannel}
            messages={messages}
            room={room}
            setMessages={setMessages}
            scrollToBottom={scrollToBottom}
            isJoining={isJoining}
            timer={timer}
            setIsJoining={setIsJoining}
            scrollViewRef={scrollViewRef}
          />
        </Suspense>
      )}
    </>
  );
};

export default Live;

const styles = StyleSheet.create({
  counterTimer: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#202d3499',
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 30, // Adjust as needed
    left: Dimensions.get('window').width / 2 - 30, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgSomethingHere: {
    width: '100%',
    height: Dimensions.get('window').height,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: { flex: 1, alignItems: 'center' },
  scroll: {
    width: '100%',
    position: 'relative',
  },
  scrollContainer: { alignItems: 'center' },
  // videoView: {width: '100%', height: Dimensions.get('window').height},
  videoView: { width: '100%', height: '100%' },
  btnContainer: { flexDirection: 'row', justifyContent: 'center' },
  head: { fontSize: 20 },
  info: { backgroundColor: '#00ffe0', paddingHorizontal: 8, color: '#0000ff' },
  onTopSmth: {
    width: '100%',
    height: Dimensions.get('window').height,
  },
  coverSmth: {
    width: '100%',
    height: Dimensions.get('window').height,
  },
  rememberTextCover: {
    flexWrap: 'nowrap',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: '#d1d1d1',
    justifyContent: 'center',
    borderBottomWidth: 2,
  },
  rememberText: {
    color: '#fff',
    fontFamily: 'Gilroy-Medium',
  },

  startCallHere: {
    // backgroundColor: '#00000099',
    width: 168,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 43,
    borderRadius: 18,
    backgroundColor: '#e20154',
    marginTop: 55,
  },
});

// 00667d61f61a30149d08b7a1e20f4b7455eIAC+E5Z9y3U2KU4JL55mYNPOh+YaL3S3oXWHnSR0OYip4VaqJE3SY0iIEADuaSAA+PKNZAEAAQC4wIxk
