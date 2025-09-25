import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  ClientRoleType,
  ChannelProfileType,
  RtcSurfaceView,
} from 'react-native-agora';

import JoinPrivateLive from './joinPrivateLive';
import Button from '../../components/button';
import { useContext } from 'react';
import { MainContext } from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';
import { useAgoraEngine } from '../../../AgoraEngineContext';
const EventJoinPrivateLive = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [isSetting, setIsSetting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [appId, setAppId] = useState(CTX.systemConfig?.A_appId);
  const [channelName, setChannelName] = useState(null);
  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const agoraEngine = useAgoraEngine();
  const [joiningErr, setJoiningErr] = useState('');
  const [random, setRandom] = useState(0);
  const [joinJson, setJoinJson] = useState(null);

  const initagora = () => {
    if (!agoraEngine) return;

    agoraEngine.enableVideo();
    agoraEngine.registerEventHandler({
      onJoinChannelSuccess: async (_connection, uid) => {
        // console.log("uid DATA HERE!!", uid)
        console.log('_connection DATA HERE!!', _connection?.localUid);
        setRandom(_connection?.localUid);

        const joining = await fetch(
          `${CTX.systemConfig?.p}get/account/join/private/call/${channelName}/${_connection?.localUid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${CTX.sessionToken}`,
            },
          },
        );
        const joinJson = await joining.json();
        if (joinJson?.e) {
          agoraEngine?.leaveChannel();
          setLoading(false);
          setErrMsg(joinJson?.m);
          setJoiningErr(joinJson?.m);
          console.log('joinJson?.m =>>>> ', joinJson?.m);
          setShowMsg(true);
          return;
        }

        // console.log("uid DATA HERE!!", uid)
        setRemoteUid(_connection?.localUid);
        setJoinJson(joinJson?.data);

        // showMessage('Successfully joined the channel ' + channelName);

        if (channelName) {
          setErrMsg('Successfully joined the channel ');
          setShowMsg(true);
          return;
        }
        // setIsJoined(true);
      },
      onUserJoined: (_connection, Uid) => {
        // console.log('Channel:', _connection);
        // console.log('My UID:', _connection);

        // showMessage('Remote user joined with uid ' + Uid);
        setErrMsg('A user joined ');
        setShowMsg(true);
      },
      onUserOffline: (_connection, Uid) => {
        // showMessage('Remote user left the channel. uid: ' + Uid);

        if (joinJson?.subscribers?.filter(v => v?.random == Uid)[0]?.isHost) {
          leave();
          navigation.goBack();
        }

        setErrMsg('A user left the channel ');
        setShowMsg(true);
        setRemoteUid(0);
      },

      // ✅ Add error handling
      onError: (err, msg) => {
        console.log('Agora error:', err, msg);
        if (err === 109 || err === 110) {
          // 109: invalid token, 110: token expired
          setShowErrorModal(true);

          setErrMsg('This stream has expired or token is invalid.');
          setShowMsg(true);
          agoraEngine.leaveChannel();
        }
      },

      // ✅ Add connection state change handling
      onConnectionStateChanged: (state, reason) => {
        // console.log('Connection state:', state, 'Reason:', reason);
        if (reason === 8) {
          // ConnectionChangedInvalidToken
          setShowErrorModal(true);
          setErrMsg('Token expired, stream is over.');
          setShowMsg(true);
          agoraEngine.leaveChannel();
        }
      },
    });

    CTX.socketObj?.emit('join-private-room', {
      room: route?.params?._id,
    });

    agoraEngine?.startPreview();
    // agoraEngine.initialize({
    //   appId: appId,
    //   channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    // });

    // Set video encoder configuration (optional but recommended)
    agoraEngine?.setVideoEncoderConfiguration({
      dimensions: { width: 640, height: 360 },
      frameRate: 15,
      bitrate: 800,
      orientationMode: 0, // Adaptative
    });

    join();
  };

  const join = async () => {
    try {
      if (!channelName) return;
      // console.log(
      //   `${CTX.systemConfig?.p}get/account/join/private/call/${channelName}`,
      // );

      agoraEngine?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      agoraEngine?.startPreview();

      agoraEngine?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (error) {
      console.log('error HERE JOIN =>> ', error);
      setJoiningErr('Single Girls send in your request here!!!');
    }
  };

  // console.log('joiningErr =>>>> ', joiningErr);

  const getTokenAndId = async () => {
    setLoading(true);
    setShowMsg(false);

    const num = 0;
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.ats}rtc/${route?.params?._id}/publisher/${num}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.error) {
        setLoading(false);
        setErrMsg(parsedJson?.msg);
        console.log('parsedJson?.msg =>>>>> ', parsedJson?.msg);
        setShowMsg(true);
        return;
      }

      setChannelName(parsedJson?.channelName);
      setToken(parsedJson?.token);
      setAppId(parsedJson?.appId);
      setUid(parseInt(parsedJson?.uid));
    } catch (error) {
      setLoading(false);
      console.log(
        'error fetching getTokenAndId for goingLive HERE! => ',
        error,
      );
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  const leave = async () => {
    try {
      if (!channelName) return;

      const leaving = await fetch(
        `${CTX.systemConfig?.p}get/account/leave/private/call/${channelName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await leaving.json();
      if (parsedJson?.e) {
        setLoading(false);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }

      CTX.socketObj?.emit('leave-room', { room: route?.params?._id });
      setAppId(null);
      setChannelName(null);
      setToken(null);
      setLoading(false);
      setIsSetting(false);
      agoraEngine?.leaveChannel();
      setRemoteUid(0);
      setShowErrorModal(false);
      setIsJoined(false);
      // setIsSelected(null);
    } catch (e) {
      console.log('e from leave handler => ', e);
    }
  };

  useEffect(() => {
    // if (isJoined) return;
    if (isFocused) {
      CTX.setStatusBarColor('#0a171e');
      getTokenAndId();
    }

    return () => {
      agoraEngine.unregisterEventHandler();
      leave();
      setElapsedTime(0);
      setShowErrorModal(false);
    };
  }, [isFocused]);

  useEffect(() => {
    // Initialize Agora engine when the app starts
    if (!token) return;
    if (!channelName) return;

    initagora();
  }, [token, channelName]);

  // if after 17 seconds, there is nothing, return back to go live
  // useEffect(() => {
  //   if (elapsedTime === 17) {
  //     setShowErrorModal(true);
  //   }
  // }, [elapsedTime]);

  // useEffect(() => {
  //   let timer;

  //   if (isFocused) {
  //     // Start the timer when the video is not visible
  //     if (remoteUid === 0 || joiningErr.length < 1) {
  //       timer = setInterval(() => {
  //         // Update elapsed time every second
  //         setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
  //       }, 1000);
  //     } else {
  //       console.log('clearInterval => ');
  //       // Reset the timer when the video goes out of view
  //       clearInterval(timer);
  //     }
  //   }

  //   return () => {
  //     clearInterval(timer); // Clean up the timer on unmount
  //   };
  // }, [isFocused, route?.params, isSetting, remoteUid]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        animated={true}
        backgroundColor={CTX.statusBarColor}
      />
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={joiningErr.length > 2 || showErrorModal}
        onRequestClose={() => {
          setShowErrorModal(!showErrorModal);
          setJoiningErr('');
        }}
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
                {joiningErr.length < 1 && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setElapsedTime(0);
                      setShowErrorModal(false);
                      // console.log("route?.params?._id =>> ", route?.params?._id);
                      setJoiningErr('');
                    }}
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
                )}
              </View>

              <Text
                style={{
                  color: '#555',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}
              >
                Closed
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {/* @{username} has closed the stream */}
                {joiningErr || 'Stream has been closed or expired'}
              </Text>

              <Button
                // loading={leaving}
                onPress={() => {
                  leave();
                  navigation.goBack();
                }}
                label={'Go back'}
                style={{ width: '100%', marginTop: 30, height: 50 }}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>
      <JoinPrivateLive
        leave={leave}
        remoteUid={remoteUid}
        room={route?.params?._id}
        item={route?.params}
        isSetting={isSetting}
        loading={loading}
        channelName={channelName}
        random={random}
      />
    </>
  );
};

export default EventJoinPrivateLive;

const styles = StyleSheet.create({
  coverMain: {
    flex: 1,
    width: '100%',
    heigth: '100%',
    backgroundColor: '#000',
  },
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
  pausedIcon: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loadCover: {
    backgroundColor: '#eeeeee17',
    width: 45,
    height: 45,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pleaseRetry: {
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
});
