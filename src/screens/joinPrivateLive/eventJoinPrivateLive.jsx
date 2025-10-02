import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ClientRoleType, ChannelProfileType } from 'react-native-agora';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import ImgAbc from '../../assets/ic_launcher.png';
import Button from '../../components/button';
import { useContext } from 'react';
import { MainContext } from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';
import { useAgoraEngine } from '../../../AgoraEngineContext';
import Fallback from '../../components/fallback/fallback';
import GiftAnimation from '../../components/gift_animation';

const JoinPrivateLive = React.lazy(() => import('./joinPrivateLive'));
const GiftStreamer = React.lazy(() => import('./giftStreamer'));
const EventJoinPrivateLive = () => {
  const CTX = useContext(MainContext);
  const [showAbsolute, setShowAbsolute] = useState(false);
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
  const bottomSheetModalRef = useRef(null);
  const snapping = ['25%', '40%', '70%'];
  const snapPoints = useMemo(() => [...snapping], []);
  const [giftOverride, setGiftOverride] = useState(null);
  const [messages, setMessages] = useState([
    {
      _id: Math.random(),
      user: {
        username: `Notice`,
        img: ImgAbc,
        verify: true,
      },
      msg: 'Welcome to GoitLive!! Enjoy engaging with people in real time; you must be at least eighteen years old.',
    },
  ]);

  const initagora = caname => {
    if (!agoraEngine) return;

    agoraEngine.enableVideo();
    agoraEngine.registerEventHandler({
      onJoinChannelSuccess: async (_connection, uid) => {
        console.log('caname for initagora HERE!!', caname, route?.params?._id);
        // console.log('_connection DATA HERE!!', _connection?.localUid);
        setRandom(_connection?.localUid);

        const joining = await fetch(
          `${CTX.systemConfig?.p}get/account/join/private/call/${route?.params?._id}/${_connection?.localUid}`,
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
          setLoading(false);
          setErrMsg(joinJson?.m);
          setJoiningErr(joinJson?.m);
          setShowErrorModal(true);
          console.log('joinJson?.m =>>>> ', joinJson?.m);
          setShowMsg(true);

          if (joinJson?._id == route?.params?._id) {
            agoraEngine?.leaveChannel();
          }
          return;
        }

        // console.log("uid DATA HERE!!", uid)
        // setRemoteUid(_connection?.localUid);
        // setRemoteUid(uid);
        console.log(
          'joinJson?.data =>>> ',
          joinJson?.data?.subscribers?.filter((v, i) => v?.isHost)[0]?.random,
        );

        setRemoteUid(
          joinJson?.data?.subscribers?.filter((v, i) => v?.isHost)[0]?.random,
        );
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

      // onUserJoined: (_connection, Uid) => {
      //           // if (!isJoined) {
      //           // }
      //           setIsSetting(false);
      //           setRemoteUid(Uid);
      //           console.log('onUserJoined called =>>> ', Uid);
      //         },

      onUserOffline: (_connection, Uid) => {
        // showMessage('Remote user left the channel. uid: ' + Uid);

        if (joinJson?.subscribers?.filter(v => v?.random == Uid)[0]?.isHost) {
          leave();
          navigation.replace('Navigation', {
            screen: 'Private', // bottom tab
            params: {
              screen: 'privateProfiles', // top tab inside Deposit
            },
          });
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
          navigation.replace('Navigation', {
            screen: 'Private', // bottom tab
            params: {
              screen: 'privateProfiles', // top tab inside Deposit
            },
          });
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

          navigation.replace('Navigation', {
            screen: 'Private', // bottom tab
            params: {
              screen: 'privateProfiles', // top tab inside Deposit
            },
          });
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

      agoraEngine?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      agoraEngine?.startPreview();

      agoraEngine?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (error) {
      console.log('error HERE JOIN =>> ', error);
      // setJoiningErr('Single Girls send in your request here!!!');
      // setShowErrorModal(true)
    }
  };

  // console.log('joiningErr =>>>> ', joiningErr);

  const getTokenAndId = async () => {
    setLoading(true);
    setShowMsg(false);

    const num = 0;
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.ats}private/stream/rtc/${route?.params?._id}/publisher/${num}`,
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
        setShowErrorModal(true);
        setJoiningErr(parsedJson?.msg);
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

  const leave = async isany => {
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
      setJoinJson(null);
      setToken(null);
      setLoading(false);
      setIsSetting(false);
      setRemoteUid(0);
      setShowErrorModal(false);
      setIsJoined(false);
      agoraEngine.unregisterEventHandler();
      agoraEngine?.leaveChannel();

      if (isany?.forReal) {
        navigation.replace('Navigation', {
          screen: 'Private', // bottom tab
          params: {
            screen: 'privateProfiles', // top tab inside Deposit
          },
        });
      }
    } catch (e) {
      console.log('e from leave handler => ', e);
    }
  };

  const leaveAndGoback = () => {
    leave();
    navigation.replace('Navigation', {
      screen: 'Private', // bottom tab
      params: {
        screen: 'privateProfiles', // top tab inside Deposit
      },
    });
  };

  useEffect(() => {
    if (!isFocused) return;

    CTX.setStatusBarColor('#0a171e');
    getTokenAndId();

    return () => {
      leave();

      setElapsedTime(0);
      setShowErrorModal(false);
      setRemoteUid(0);
      setJoinJson(null);
      setChannelName(null);
      setToken(null);
    };
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) return;
    if (!token || !channelName || !agoraEngine) return;

    let active = true;

    if (active) {
      initagora(channelName);
      // caname
    }

    return () => {
      active = false;
      agoraEngine?.unregisterEventHandler();
    };
  }, [isFocused, token, channelName, agoraEngine]);

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

  const openMenu = useCallback(() => {
    setShowAbsolute(true);
  }, []);

  const closeModalPress = useCallback(() => {
    setShowAbsolute(false);
    bottomSheetModalRef.current?.close();
  }, []);

  // renders
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

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
                  navigation.replace('Navigation', {
                    screen: 'Private', // bottom tab
                    params: {
                      screen: 'privateProfiles', // top tab inside Deposit
                    },
                  });
                }}
                label={'Go back'}
                style={{ width: '100%', marginTop: 30, height: 50 }}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>

      {showAbsolute && (
        <Pressable
          onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
          }}
        >
          <BottomSheet
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{ ...styles.reactionText, color: '#fff' }}>
                  Details
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={closeModalPress}
                  style={styles.closeLine}
                >
                  <Ionicons color={'#838289'} name="close" size={23} />
                </TouchableOpacity>
              </View>
            )}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                return null;
              }}
            >
              <BottomSheetScrollView>
                {loading ? (
                  <View style={styles.loadingActivityCover}>
                    <ActivityIndicator color={'#3b3b3b'} size={40} />
                  </View>
                ) : (
                  <Suspense fallback={<Fallback />}>
                    <GiftStreamer
                      setErrMsg={setErrMsg}
                      streamer={route?.params}
                      setShowMsg={setShowMsg}
                      leave={leave}
                      random={random}
                      setGiftOverride={setGiftOverride}
                      messages={messages}
                      setMessages={setMessages}
                      closeModalPress={closeModalPress}
                    />
                  </Suspense>
                )}
              </BottomSheetScrollView>
            </Pressable>
          </BottomSheet>
        </Pressable>
      )}
      <GiftAnimation override={giftOverride} />

      <Suspense fallback={<Fallback />}>
        <JoinPrivateLive
          leave={leave}
          remoteUid={remoteUid}
          room={route?.params?._id}
          item={route?.params}
          isSetting={isSetting}
          loading={loading}
          channelName={channelName}
          random={random}
          openMenu={openMenu}
          messages={messages}
          setMessages={setMessages}
          leaveAndGoback={leaveAndGoback}
        />
      </Suspense>
    </>
  );
};

export default EventJoinPrivateLive;

const styles = StyleSheet.create({
  eachBtnCover: {
    backgroundColor: '#efefef',
    paddingHorizontal: 25,
    borderRadius: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },

  showAbsolute: {
    position: 'absolute',
    // backgroundColor: '#e010b400',
    backgroundColor: '#00003330',
    width: '100%',
    height: '100%',
    zIndex: 220,
  },
  handleComponentStyle: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    backgroundColor: '#e20154',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 2,
  },
  reactionText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeLine: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#e1e1e1',
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'center',
  },
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
