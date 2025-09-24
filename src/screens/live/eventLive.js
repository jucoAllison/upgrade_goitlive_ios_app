import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  StatusBar,
  Linking,
  Alert,
  NativeModules,
} from 'react-native';
import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/core';
import { ClientRoleType, ChannelProfileType } from 'react-native-agora';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAgoraEngine } from '../../../AgoraEngineContext';
import { MainContext } from '../../../App';
import Button from '../../components/button';
import Live from './live';
// const Live = lazy(() => import('./live'));
const EventLive = ({
  data,
  removeOverRideShow,
  showError,
  onRefreshOthers,
}) => {
  const CTX = useContext(MainContext);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [message, setMessage] = useState(''); // Message to the user
  const navigation = useNavigation();
  const [leaving, setLeaving] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [appId, setAppId] = useState(CTX.systemConfig?.A_appId);
  const [channelName, setChannelName] = useState(null);
  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);
  const isFocused = useIsFocused();
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const agoraEngine = useAgoraEngine();

  function showMessage(msg) {
    setMessage(msg);
  }

  const join = async () => {
    if (isJoined) {
      return;
    }
    if (!agoraEngine) {
      console.warn('Agora engine not ready yet (waiting for appId).');
      return;
    }
    try {
      await CTX.socketObj?.emit('toggle-isLive', {
        _id: CTX.userObj._id,
        toggle: 'isPublicLive',
        value: true,
      });

      agoraEngine?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      agoraEngine?.startPreview();
      agoraEngine?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = async () => {
    try {
      await CTX.socketObj?.emit('toggle-isLive', {
        _id: CTX.userObj._id,
        toggle: 'isPublicLive',
        value: false,
      });
      agoraEngine?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('You left the channel');
    } catch (e) {
      console.log(e);
    }
  };

  const setupVideoSDKEngine = async () => {
    try {
      // use the helper function to get permissions

      agoraEngine.enableVideo();
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user joined with uid ' + Uid);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user left the channel. uid: ' + Uid);
          setRemoteUid(0);
        },
      });
      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      // Set video encoder configuration (optional but recommended)
      agoraEngine?.setVideoEncoderConfiguration({
        dimensions: { width: 640, height: 360 },
        frameRate: 15,
        bitrate: 800,
        orientationMode: 0, // Adaptative
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leaveStream = () => {
    setTimeout(() => {
      navigation.goBack();
      setIsModal(false);
      setLeaving(false);
    }, 300);
    leave();
    setLeaving(true);
  };

  const getTokenAndId = async () => {
    setLoading(true);
    setShowMsg(false);
    const num = 0;

    // console.log(`${CTX.systemConfig?.ats}rtc/${CTX.userObj.username}/publisher/${num}`);
    // console.log(`CTX.userObj.username =>> ${CTX.userObj.username}`);
    // console.log(`CTX.userObj =>> ${CTX.userObj}`);

    try {
      const fetching = await fetch(
        // `${CTX.systemConfig?.ats}get/token?channelName=myChannel&role=CLIENT_ROLE_AUDIENCE&uid=123&expireTime=86300`,
        `${CTX.systemConfig?.ats}rtc/${CTX.userObj.username}/publisher/${num}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      setLoading(false);
      if (parsedJson?.error) {
        setErrMsg(parsedJson?.msg);
        setShowMsg(true);
        return;
      }
      CTX.setStatusBarColor('#000');
      setToken(parsedJson?.token);
      setAppId(parsedJson?.appId);
      setChannelName(parsedJson?.channelName);
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

  useEffect(() => {
    if (isFocused) {
      // navigation.setParams({screenName: 'Live'});
      CTX.setStatusBarColor('#000');
      getTokenAndId();
    }

    // return () => {
    //   leave();
    // };
  }, [isFocused]);

  useEffect(() => {
    if (!channelName) {
      return;
    } else {
      setupVideoSDKEngine();
    }

    
  // return () => {
  //   agoraEngine.unregisterEventHandler();
  // };
  }, [channelName]);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="light-content"
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModal}
        onRequestClose={() => setIsModal(!isModal)}
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
                  onPress={() => setIsModal(false)}
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
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}
              >
                End live
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                You want to close live streaming. When you end a stream, it
                won't be saved
              </Text>

              <Button
                loading={leaving}
                onPress={leaveStream}
                label={'Continue'}
                style={{ width: '100%', marginTop: 30, height: 50 }}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* {!permissionGranted && (
          <Text style={{ color: 'red' }}>
            Grant permissions manually and continue
          </Text>
        )} */}
        {loading ? (
          <View style={styles.pausedIcon}>
            <View style={styles.loadCover}>
              <ActivityIndicator size={32} color="#fff" />
            </View>
          </View>
        ) : showError || showMsg ? (
          <>
            <View style={styles.pausedIcon}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  getTokenAndId();
                  onRefreshOthers();
                }}
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <FontAwesome5 size={40} color="#fff" name="holly-berry" />
                <Text style={{ ...styles.pleaseRetry, marginTop: 10 }}>
                  {errMsg || 'Error happened'}
                </Text>

                <Text style={{ ...styles.pleaseRetry, marginTop: 10 }}>
                  Click to retry
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // <Suspense
          //   fallback={
          //     <View style={styles.activityCover}>
          //       <ActivityIndicator color={'#e20154'} size={40} />
          //     </View>
          //   }>
          <Live
            leaveChannel={() => setIsModal(true)}
            uid={uid}
            join={join}
            leave={leave}
            showMessage={showMessage}
            isHost={isHost}
            setIsHost={setIsHost}
            permissionGranted={permissionGranted}
            message={message}
            setIsJoined={setIsJoined}
            isJoined={isJoined}
            remoteUid={remoteUid}
            room={CTX.userObj?._id}
          />
          // </Suspense>
        )}
      </View>
      {!isJoined && (
        <>
          {data?.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={removeOverRideShow}
              style={{
                ...styles.startNewChat,
                transform: [{ rotate: '45deg' }],
              }}
            >
              <Ionicons name="add-sharp" color={'#fff'} size={24} />
            </TouchableOpacity>
          )}
        </>
      )}
    </>
  );
};

export default EventLive;

const styles = StyleSheet.create({
  startNewChat: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#e20154',
    position: 'absolute',
    bottom: 32,
    right: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
