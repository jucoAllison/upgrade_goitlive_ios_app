import {
  View,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {Suspense, useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {RtcSurfaceView} from 'react-native-agora';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from '../../components/button';
import LinearGradient from 'react-native-linear-gradient';

const Bottom = React.lazy(() => import('./bottom/bottom'));
const JoinedLiveHeader = React.lazy(() => import('./joinedLiveHeader'));
const JoinedLive = ({
  leave,
  remoteUid,
  room,
  messages,
  setMessages,
  loading,
  isSetting,
  username,
  showMsg,
  errMsg,
  CTX,
  _id,
  navigation,
}) => {
  const [showBottomStm, setShowBottomStm] = useState(false);
  const scrollViewRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(false);

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
    scrollViewRef.current?.scrollToEnd({animated: true});
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
      }}>
      {item?.user?.img?.length > 6 && (
        <Image style={styles.styleImage} source={{uri: item?.user?.img}} />
      )}
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 9,
            color: '#ccc',
            fontFamily: 'Overpass-Regular',
          }}>
          {item?.user?.username}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#fff',
            fontFamily: 'Overpass-Regular',
          }}>
          {item?.msg}
        </Text>
      </View>
    </View>
  ));

  const reSetHere = payload => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  const newMessageFromUser = async ({user, msg, totalUsers}) => {
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
    }

    return () => {
      CTX.socketObj?.off('send-private-room-message');
    };
  }, [CTX.socketObj, messages]);

  // background-color: transparent; /* Ensure a transparent background */
  //   const htmlContent = `
  //   <html>
  //     <head>
  //       <style>
  //         /* Your custom styles for the content */
  //         body {
  //           color: black;
  //           font-size: 16px;
  //           filter: blur(3px);
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div>
  //         <p>Your custom HTML content goes here.</p>
  //       </div>
  //     </body>
  //   </html>
  // `;

  return (
    <>
      <Pressable
        onPress={() => setShowBottomStm(!showBottomStm)}
        style={styles.scroll}>
        <Suspense fallback={null}>
          <JoinedLiveHeader
            showBottomStm={showBottomStm}
            navigation={navigation}
          />
        </Suspense>
        <View style={styles.fullCam}>
          {loading || isSetting ? (
            <View style={styles.coverLoading}>
              <View style={styles.loadCover}>
                <ActivityIndicator size={32} color="#fff" />
              </View>
              <Text style={{...styles.pleaseRetry, marginTop: 10}}>
                Setting up, please wait!
              </Text>
            </View>
          ) : showMsg ? (
            <View style={styles.coverLoading}>
              <FontAwesome5 size={40} color="#fff" name="holly-berry" />
              <Text style={{...styles.pleaseRetry, marginTop: 10}}>
                {errMsg || 'Error happened, click to retry'}
              </Text>
              <Button label={'Go back'} style={{marginTop: 10}} />
            </View>
          ) : (
            <>
              {remoteUid != 0 ? (
                <React.Fragment key={remoteUid}>
                  <RtcSurfaceView
                    canvas={{uid: remoteUid}}
                    style={styles.videoView}
                  />
                </React.Fragment>
              ) : (
                <View style={styles.coverLoading}>
                  <View style={styles.loadCover}>
                    <ActivityIndicator size={32} color="#fff" />
                  </View>
                  <Text style={{...styles.pleaseRetry, marginTop: 10}}>
                    Setting up, please wait!
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        {/* bottom smth when a remote user joins */}
        {/* {messages.length > 0 && ( */}

        {/* )} */}
      </Pressable>
      <View
        style={{
          width: '100%',
          height: '30%',
          overflow: 'hidden',
          position: 'absolute',
          bottom: 50,
          left: 7,
        }}>
        <LinearGradient
          colors={['#00000000', '#00000009']}
          style={{
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // right: 0,
            marginTop: -1,
            height: 20, // Adjust the height to control the fading effect
          }}
        />
        <ScrollView
          // fadingEdgeLength={100}
          ref={scrollViewRef}
          style={styles.bottomComment}
          onScroll={handleScroll}>
          <Pressable
            style={{width: '100%', height: '100%'}}
            onPress={() => {
              return;
            }}>
            {mapSmthg}
          </Pressable>
        </ScrollView>
      </View>
      {/* {remoteUid != 0 && ( */}
      <Suspense fallback={null}>
        <Bottom
          showBottomStm={showBottomStm}
          room={room}
          messages={messages}
          username={username}
          setMessages={setMessages}
          scrollToBottom={scrollToBottom}
          leave={leave}
          _id={_id}
        />
      </Suspense>
      {/* )} */}
    </>
  );
};

export default JoinedLive;

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
    backgroundColor: '#00000009',
  },
  main: {backgroundColor: '#7d9'},
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
  videoView: {width: '100%', height: '100%'},
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
  addText: {fontWeight: 'bold', color: '#fff', marginLeft: 13},
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

// <WebView
// style={[styles.absolute, styles.transparent]}
// originWhitelist={['*']}
// source={{
//   html:
//     '<div style="' +
//     'position: absolute; top: 0; right:0; bottom: 0; left: 0;' +
//     'background: rgba(255,255,255,0.2); backdrop-filter: blur(48px);' +
//     '/*width:100%; height:100%; margin:0; padding:-10px;*/' +
//     '/*background: #ff000033;*/ /*transparent*/ /*background: #4fc3f733;*/' +
//     '">asjdfhaskjfhaskf</div>',
// }}
// />
