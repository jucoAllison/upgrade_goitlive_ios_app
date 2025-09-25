import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MainContext } from '../../../../../App';
import MappedLivers from './mappedLivers';
import { useAgoraEngine } from '../../../../../AgoraEngineContext';
import {
  ClientRoleType,
  ChannelProfileType,
  RtcSurfaceView,
} from 'react-native-agora';
import ErrMessage from '../../../../components/errMessage/errMessage';
import ImgAbc from '../../../../assets/ic_launcher.png';
import Fallback from '../../../../components/fallback/fallback';
import Button from '../../../../components/button';

const BottomBtns = lazy(() => import('./bottomBtns'));
const TopDetailsHere = lazy(() => import('./topDetailsHere'));
const AllUsersMap = lazy(() => import('./allUsers'));
const PrivateProfile = ({
  setSwipeEnabled,
  openMenu,
  showMsg,
  setShowMsg,
  errMsg,
  setErrMsg,
  channelName,
  setChannelName,
}) => {
  const CTX = useContext(MainContext);
  const [shouldRefresh, setShouldRefresh] = useState({ math: 'null' });
  const [refreshing, setRefreshing] = useState(false);
  const agoraEngine = useAgoraEngine();
  const [joinLoading, setJoinLoading] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  // const [showMsg, setShowMsg] = useState(false);
  // const [errMsg, setErrMsg] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [appId, setAppId] = useState(CTX.systemConfig?.A_appId);
  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [timer, setTimer] = useState(5);
  const [allUsers, setAllUsers] = useState([]);
  const [isModal, setIsModal] = useState(null);
  const [myUid, setMyUid] = useState(null);
  const [toBlock, setToBlock] = useState(null)
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
  const scrollViewRef = useRef();

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

  useEffect(() => {
    if (CTX.socketObj) {
      CTX.socketObj.on('send-private-room-message', newMessageFromUser);
      // CTX.socketObj?.emit('join-private-room', {room: CTX.userObj?._id});
    }

    return () => {
      CTX.socketObj?.off('send-private-room-message');
    };
  }, [CTX.socketObj, messages]);

  useEffect(() => {
    let interval;

    if (token) {
      interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          clearInterval(interval);
        }
      }, 1300);
    }

    return () => clearInterval(interval); // Cleanup on component unmount or when isJoined becomes false
  }, [token, timer]);

  const getDetails = async () => {
    try {
      const joining = await fetch(
        `${CTX.systemConfig?.p}get/account/join/private/call/${channelName}/${myUid}`,
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
        // setLoading(false);
        setErrMsg(joinJson?.m);
        setJoiningErr(joinJson?.m);
        console.log('joinJson?.m =>>>> ', joinJson?.m);
        setShowMsg(true);
        return;
      }
    } catch (error) {
      console.log('error from getDetails from private =>>> ', error);
    }
  };

  useEffect(() => {
    if (!myUid) return;
    if (!channelName) return;

    getDetails();
  }, [myUid, channelName]);

  const join = async () => {
    if (token) {
      return;
    }
    if (!agoraEngine) {
      console.warn('Agora engine not ready yet (waiting for appId).');
      return;
    }
    if (joinLoading) return;

    agoraEngine.enableVideo();
    agoraEngine.registerEventHandler({
      onJoinChannelSuccess: async (_connection, uid) => {
        // showMessage('Successfully joined the channel ' + channelName);
        setMyUid(_connection?.localUid);

        if (channelName) {
          setErrMsg('Successfully joined the channel ');
          setShowMsg(true);
        }
        // setIsJoined(true);
      },
      onUserJoined: (_connection, Uid) => {
        // showMessage('Remote user joined with uid ' + Uid);
        const prev = [...allUsers];
        prev.unshift(Uid);
        setAllUsers(prev);
        setRemoteUid(Uid);
        setErrMsg('A user joined');
        setShowMsg(true);
      },
      onUserOffline: (_connection, Uid) => {
        // showMessage('Remote user left the channel. uid: ' + Uid);
        const prev = [...allUsers];

        setAllUsers(prev.filter(v => v !== Uid));

        setErrMsg('A user left the channel');
        setShowMsg(true);
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

    setJoinLoading(true);
    try {
      // first create call model data
      const fetching = await fetch(
        `${CTX.systemConfig?.ats}private/stream/live/call`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      setJoinLoading(false);

      if (parsedJson?.error) {
        setErrMsg(parsedJson?.error);
        setShowMsg(true);
        return;
      }
      setSwipeEnabled(false);
      await CTX.socketObj?.emit('toggle-isLive', {
        _id: CTX.userObj._id,
        toggle: 'isPrivateLive',
        value: true,
      });

      setToken(parsedJson?.token);
      setAppId(parsedJson?.appId);
      setChannelName(parsedJson?.channelName);
      setUid(parseInt(parsedJson?.uid));

      CTX.socketObj?.emit('join-private-room', {
        room: parsedJson?.channelName,
      });

      agoraEngine?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      agoraEngine?.startPreview();
      agoraEngine?.joinChannel(
        parsedJson?.token,
        parsedJson?.channelName,
        parsedJson?.uid,
        {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        },
      );
    } catch (e) {
      setJoinLoading(false);
      setErrMsg('Network request failed');
      setShowMsg(true);
      console.log(e);
    }
  };

  const leave = async () => {
    setLeaving(true);
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.ats}private/stream/end/call/${channelName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();

      if (parsedJson?.error || parsedJson?.e) {
        setErrMsg(parsedJson?.error || parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setLeaving(false);
      setIsModal(null);
      setSwipeEnabled(true);

      await CTX.socketObj?.emit('oya-everybody-leave', {
        room: channelName,
        user: CTX.userObj._id,
      });

      await CTX.socketObj?.emit('toggle-isLive', {
        _id: CTX.userObj._id,
        toggle: 'isPrivateLive',
        value: false,
      });
      agoraEngine?.leaveChannel();

      CTX.socketObj?.emit('leave-room', { room: channelName });

      setToken(null);
      setAppId(null);
      setChannelName(null);
      setUid(null);

      setRemoteUid(0);
      // setIsJoined(false);
      // showMessage('You left the channel');
    } catch (e) {
      setLeaving(false);
      setErrMsg('Network request failed');
      setShowMsg(true);
      console.log(e);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setShouldRefresh({ math: Math.random() });
    setRefreshing(false);
  };

  
const blockUser = async () => {
    setLeaving(true);
  try {
     const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/block/private/call/user/${channelName}/${toBlock}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();

      if (parsedJson?.error || parsedJson?.e) {
        setErrMsg(parsedJson?.error || parsedJson?.m);
        setShowMsg(true);
        return;
      }

       await CTX.socketObj?.emit('block-user-stream', {
        room: channelName,
        remoteID: toBlock,
      });


      setLeaving(false);
      setIsModal(null);


  } catch (error) {
          setLeaving(false);
      setErrMsg('Network request failed');
      setShowMsg(true);
      console.log("error from blockUserHandler =>> ", error);
  }
}

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModal?.length > 1}
        onRequestClose={() => setIsModal(null)}
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
                {!leaving && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsModal(null)}
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
                {isModal == 'close' ? 'End live' : 'Block user'}
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {isModal == 'close'
                  ? "You want to close live streaming. When you end a stream, it won't be saved"
                  : `You are about to block ${toBlock?.toString().slice(-4)}. Blocked user can't join this stream again`}
              </Text>

              <Button
                loading={leaving}
                onPress={() => {
                  if (isModal == 'close') {
                    leave();
                  } else {
                    blockUser();
                  }
                }}
                label={'Continue'}
                style={{ width: '100%', marginTop: 30, height: 50 }}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>

      {token ? (
        <View
          style={{
            display: 'flex',
            backgroundColor: '#000',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 10,
              // overflow: "scroll"
              width: '100%',
            }}
          >
            <Suspense fallback={<Fallback />}>
              {/* {isJoined && ( */}
              <TopDetailsHere
                // leaveChannel={leaveChannel}
                leaveChannel={() => setIsModal('close')}
                openMenu={openMenu}
                messages={messages}
                isJoined={token}
                timer={timer}
              />
              {/* )} */}

              {allUsers?.length > 0 && (
                <AllUsersMap
                  allUsers={allUsers}
                  blockUser={item => {
                    setIsModal('block');
                    setToBlock(item);
                  }}
                />
              )}
            </Suspense>
          </View>

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

          {token && (
            <Suspense fallback={<Fallback />}>
              <BottomBtns
                join={join}
                isJoined={token}
                leaveChannel={leave}
                messages={messages}
                room={channelName}
                setMessages={setMessages}
                scrollToBottom={scrollToBottom}
                timer={timer}
                scrollViewRef={scrollViewRef}
              />
            </Suspense>
          )}
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentInsetAdjustmentBehavior="automatic"
          style={{
            display: 'flex',
            backgroundColor: '#000',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <View style={{ width: '100%', height: 400, paddingTop: 98 }}>
            <MappedLivers token={token} shouldRefresh={shouldRefresh} />
          </View>
          <View
            style={{
              height: 250,
              alignItems: 'center',
              width: '100%',
            }}
          >
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
              onPress={join}
              style={styles.startCallHere}
            >
              {joinLoading ? (
                <ActivityIndicator color={'#fff'} size={20} />
              ) : (
                <>
                  <Fontisto name="livestream" color="#fff" size={19} />
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
        </ScrollView>
      )}
    </>
  );
};

export default PrivateProfile;

const styles = StyleSheet.create({
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
  rememberTextCover: {
    flexWrap: 'nowrap',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: '#d1d1d1',
    justifyContent: 'center',
    borderBottomWidth: 2,
    marginTop: 50,
  },
  rememberText: {
    color: '#fff',
    fontFamily: 'Gilroy-Medium',
  },
  videoView: { width: '100%', height: '100%' },
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
