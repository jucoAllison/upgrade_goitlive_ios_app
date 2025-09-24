import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Keyboard,
  Platform,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MainContext } from '../../../App';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
import Fallback from '../../components/fallback/fallback';
import { RtcSurfaceView } from 'react-native-agora';
import LinearGradient from 'react-native-linear-gradient';

import ImgAbc from '../../assets/ic_launcher.png';
const Bottom = React.lazy(() => import('./bottom/bottom'));
const JoinedLiveHeader = React.lazy(() => import('./joinedLiveHeader'));
const JoinPrivateLive = ({
  isSetting,
  random,
  remoteUid,
  item,
  leave,
  channelName,
}) => {
  const CTX = useContext(MainContext);
  const [showBottomStm, setShowBottomStm] = useState(false);
  const scrollViewRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(false);
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

  const mapSmthg = messages.map((item, index) => (
    <View
      key={index}
      style={{
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      {item?.user?.img?.length > 6 && (
        <Image style={styles.styleImage} source={{ uri: item?.user?.img }} />
      )}
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 9,
            color: '#ccc',
            fontFamily: 'Gilroy-Medium',
          }}
        >
          {item?.user?.username}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#fff',
            fontFamily: 'Gilroy-Regular',
          }}
        >
          {item?.msg}
        </Text>
      </View>
    </View>
  ));

  const reSetHere = payload => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
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
    reSetHere(copiedMessages);
  };

  useEffect(() => {
    if (CTX.socketObj) {
      CTX.socketObj.on('send-private-room-message', newMessageFromUser);
      CTX.socketObj.on('every-body-leave', leave);
    }

    return () => {
      CTX.socketObj?.off('send-private-room-message');
      CTX.socketObj?.off('every-body-leave');
    };
  }, [CTX.socketObj, messages]);

  // calculating height for when keyboard opens and closes
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        LayoutAnimation.easeInEaseOut();
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        LayoutAnimation.easeInEaseOut();
        setKeyboardHeight(0);
      },
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // console.log("remoteUid =>>> ", remoteUid);

  // console.log("channelName =>>> ", channelName);

  return (
    <DismissKeyboardWrapper>
      <Pressable
        onPress={() => setShowBottomStm(!showBottomStm)}
        style={styles.scroll}
      >
        <Suspense fallback={<Fallback />}>
          <JoinedLiveHeader
            showBottomStm={false}
            item={{ ...item?.owner, is_user_caring: true }}
          />
        </Suspense>
        <View style={styles.fullCam}>
          {/* {loading || isSetting ? (
            <View style={styles.coverLoading}>
              <View style={styles.loadCover}>
                <ActivityIndicator size={32} color="#fff" />
              </View>
              <Text style={{ ...styles.pleaseRetry, marginTop: 10 }}>
                Setting up, please wait!
              </Text>
            </View>
          ) : (
            <>
              {remoteUid != 0 ? ( */}
          <React.Fragment key={remoteUid}>
            <RtcSurfaceView
              canvas={{ uid: remoteUid }}
              // connection={{ channelId: channelName }} // ✅ add this
              style={styles.videoView}
            />
          </React.Fragment>
          {/* ) : (
                <View style={styles.coverLoading}>
                  <View style={styles.loadCover}>
                    <ActivityIndicator size={32} color="#fff" />
                  </View>
                  <Text style={{ ...styles.pleaseRetry, marginTop: 10 }}>
                    Setting up, please wait!
                  </Text>
                </View>
              )}
            </>
          )} */}
        </View>
      </Pressable>

      <View
        style={[
          {
            position: 'absolute',
            flex: 1,
            width: '100%',
            // height: '100%',
            height:
              keyboardHeight > 0
                ? Dimensions.get('window').height - keyboardHeight
                : Dimensions.get('window').height - 161 - keyboardHeight,
            paddingBottom: 26,
            // height: 170,
            flexDirection: 'column',
            bottom: 0,
            zIndex: 200,
            left: 0,
          },
          keyboardHeight > 0
            ? { top: 0, bottom: undefined } // stick to top
            : { bottom: 0, top: undefined }, // stick to bottom
        ]}
      >
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: '#00000018',
            width: '100%',
            height: '44%',
            marginBottom: -30,
            paddingBottom: 40,
          }}
        >
          <View
            style={
              {
                // backgroundColor: '#00634055',
              }
            }
          >
            <View style={{ marginTop: -20 }}>
              <LinearGradient
                colors={['#00000000', '#00000018']}
                style={{
                  height: 20, // Adjust the height to control the fading effect
                }}
              />
            </View>
            <View
              style={{
                width: '85%',
                height: '89%',
                paddingLeft: 20,
                // height: '30%',
                // marginLeft: 20,
                // marginTop: 'auto',
              }}
            >
              <ScrollView
                // fadingEdgeLength={100}
                ref={scrollViewRef}
                style={styles.bottomComment}
                onScroll={handleScroll}
              >
                <Pressable
                  style={{ width: '100%', height: '100%' }}
                  onPress={() => {
                    return;
                  }}
                >
                  {mapSmthg}
                </Pressable>
              </ScrollView>
            </View>
          </View>
          {/* {remoteUid != 0 && ( */}
          <Suspense fallback={<Fallback />}>
            <Bottom
              showBottomStm={true}
              room={item._id}
              messages={messages}
              username={item?.owner?.username}
              setMessages={setMessages}
              scrollToBottom={scrollToBottom}
              leave={leave}
              _id={item?.owner?._id}
              isPrivateLive={true}
              random={random}
            />
          </Suspense>
          {/* )} */}
        </View>
      </View>
    </DismissKeyboardWrapper>
  );
};

export default JoinPrivateLive;

export const styles = StyleSheet.create({
  absolute: {
    // position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    zIndex: 30,
  },
  //   absolute: {
  //     position: 'absolute',
  //     top: 0,
  //     left: 0,
  //     bottom: 0,
  //     right: 0,
  // },
  transparent: {
    backgroundColor: '#00000000',
  },
  bottomComment: {
    width: '100%',
    height: '100%',
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
    position: 'absolute',
    width: '100%',
    height: '10%',
    backgroundColor: '#e20154',
    bottom: 0,
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // zIndex: 10,
  },
  boxStuff: {
    width: 49,
    height: 49,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
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
  loadCover: {
    backgroundColor: '#00000077',
    width: 45,
    height: 45,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverLoading: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a171e',
  },
  pleaseRetry: {
    color: '#fff',
    fontFamily: 'Overpass-Regular',
    textAlign: 'center',
  },
  styleImage: {
    width: 39,
    height: 39,
    marginRight: 7,
    borderRadius: 30,
  },
});
