import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    PermissionsAndroid,
    Linking,
    Alert,
    Platform,
    Modal,
    Pressable,
    TouchableOpacity,
    Dimensions,
    StatusBar,
  } from 'react-native';
  import React, {Suspense, useContext, useEffect, useRef, useState} from 'react';
  import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
  import createAgoraRtcEngine, {
    AudienceLatencyLevelType,
    ChannelMediaOptions,
    ChannelProfileType,
    ClientRoleType,
  } from 'react-native-agora';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import {MainContext} from '../../../App';
  import ErrMessage from '../../components/errMessage/errMessage';
  import Button from '../../components/button';
  import ImgAbc from '../../assets/ic_launcher.png';
  
  // const RemoveMoneyLive = React.lazy(() => import('./removeMoneyLive'));
  const JoinedLive = React.lazy(() => import('./joinedLive'));
  const EventJoinedLive = ({navigation}) => {
    const CTX = useContext(MainContext);
    const route = useRoute();
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
    const {_id, username} = route?.params;
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [showMsg, setShowMsg] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [appId, setAppId] = useState(CTX.systemConfig?.A_appId);
    const [channelName, setChannelName] = useState(null);
    const [token, setToken] = useState(null);
    const [uid, setUid] = useState(null);
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    // const navigation = useNavigation();
    const agoraEngineRef = useRef(); // Agora engine instance
    const [isSetting, setIsSetting] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const permissions = [
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ];
  
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
      ('granted');
  
      const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA];
      ('granted');
  
      if (
        recordAudioGranted == 'never_ask_again' ||
        cameraGranted == 'never_ask_again'
      ) {
        return Linking.openSettings();
      }
  
      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert('Permissions not granted');
        Linking.openSettings();
        return;
      }
      // } else {
      setPermissionGranted(true);
    };
  
    const checkPermission = async () => {
      try {
        const details = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
  
        // .then(response => {
        if (details === true) {
          setPermissionGranted(true);
        } else if (details === false) {
          // Alert.alert('Please enable camera permission in device settings.');
          getPermissions();
        }
        // });
      } catch (error) {
        console.log('error HERE =>> from checkPermission =>>>', error);
      }
    };
  
    useEffect(() => {
      if (Platform.OS === 'android') {
        checkPermission();
      } else {
        setPermissionGranted(true);
      }
    }, [permissionGranted]);
  
    const getTokenAndId = async () => {
      setLoading(true);
      setShowMsg(false);
      const num = 0;
      try {
        const fetching = await fetch(
          // `${CTX.systemConfig?.ats}get/token?channelName=myChannel&role=CLIENT_ROLE_AUDIENCE&uid=123&expireTime=86300`,
          `${CTX.systemConfig?.ats}rtc/${username}/audience/${num}`,
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
        setChannelName(parsedJson?.channelName);
        // console.log('parsedJson HERE!!! ==>>> _connection :::', parsedJson);
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
  
    const setupVideoSDKEngine = async () => {
      if (isSetting) return;
  
      setIsSetting(true);
      try {
        // use the helper function to get permissions
  
        agoraEngineRef.current = await createAgoraRtcEngine();
        const agoraEngine = agoraEngineRef.current;
  
        await agoraEngine.initialize({
          appId: appId,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });
        await agoraEngine.registerEventHandler({
          onJoinChannelSuccess: () => {
            setIsJoined(true);
          },
          onUserJoined: (_connection, Uid) => {
            if (!isJoined) {
              CTX.socketObj?.emit('join-private-room', {room: _id});
            }
            setIsSetting(false);
            setRemoteUid(Uid);
          },
          onUserOffline: (_connection, Uid) => {
            console.log('onUserOffline HERE!!! ==>>> _connection :::');
            console.log('onUserOffline HERE!!! ==>>> err :::', Uid);
            leave();
            navigation.goBack();
  
            // setRemoteUid(0);
          },
          onError: (err, msg) => {
            console.log('onError HERE!!! ==>>> err :::');
            console.log('onError HERE!!! ==>>> err :::', err);
            console.log('onError HERE!!! ==>>> msg :::', msg);
            console.log('onError HERE!!! ==>>> msg :::');
          },
          onChannelJoinError: aaaa => {
            console.log('onChannelJoinError HERE!!! ==>>> msg :::', aaaa);
          },
        });
        agoraEngineRef.current?.startPreview();
  
        // setTimeout(() => {
        join();
        // }, 1000);
        await agoraEngine.enableVideo();
        setIsSetting(false);
      } catch (e) {
        setIsSetting(false);
        setErrMsg('There was an error setting up video engine');
        setShowMsg(true);
        console.log('error from setUpVideoSDKEgine ==>> ', e);
      }
    };
  
    useEffect(() => {
      // Initialize Agora engine when the app starts
      if (!token) return;
      if (!channelName) return;
  
      setupVideoSDKEngine();
    }, [token, channelName]);
  
    const join = async () => {
      if (isJoined) {
        return;
      }
      try {
        var channeloptions = new ChannelMediaOptions();
        channeloptions.audienceLatencyLevel =
          AudienceLatencyLevelType.AudienceLatencyLevelLowLatency;
        agoraEngineRef.current?.updateChannelMediaOptions(channeloptions);
        agoraEngineRef.current?.joinChannel(token, channelName, 0, {
          clientRoleType: ClientRoleType.ClientRoleAudience,
        });
      } catch (e) {
        console.log('e from join handler => ', e);
      }
    };
  
    const leave = () => {
      try {
        CTX.socketObj?.emit('leave-room', {room: _id});
        setAppId(null);
        setChannelName(null);
        setToken(null);
        setLoading(false);
        setIsSetting(false);
        agoraEngineRef.current?.leaveChannel();
        setRemoteUid(0);
        setShowModal(false);
        setIsJoined(false);
        // setIsSelected(null);
      } catch (e) {
        console.log('e from leave handler => ', e);
      }
    };
  
    useEffect(() => {
      if (elapsedTime === 17) {
        setShowModal(true);
      }
    }, [elapsedTime]);
  
    useEffect(() => {
      let timer;
  
      if (isFocused) {
        // Start the timer when the video is visible
        if (!showModal && remoteUid === 0) {
          timer = setInterval(() => {
            // Update elapsed time every second
            setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
          }, 1000);
        } else {
          console.log('clearInterval => ');
          // Reset the timer when the video goes out of view
          clearInterval(timer);
        }
      }
  
      return () => {
        clearInterval(timer); // Clean up the timer on unmount
      };
    }, [loading, isSetting, showModal, remoteUid]);
  
    useEffect(() => {
      if (isJoined) return;
      if (isFocused) {
        CTX.setStatusBarColor('#0a171e');
        getTokenAndId();
      }
  
      return () => {
        leave();
        setElapsedTime(0);
        setShowModal(false);
      };
    }, [isFocused]);
  
    return (
      <>
        <StatusBar
          barStyle="light-content"
          animated={true}
          backgroundColor={CTX.statusBarColor}
        />
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(!showModal)}>
          <Pressable style={styles.centeredView}>
            <View style={{...styles.modalView}}>
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    position: 'relative',
                  }}>
                  <AntDesign
                    name="disconnect"
                    size={40}
                    style={{marginBottom: 12}}
                    color="#e20154"
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setElapsedTime(0);
                      setShowModal(false);
                    }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      width: 34,
                      height: 34,
                    }}>
                    <AntDesign
                      name="close"
                      size={20}
                      style={{marginLeft: 'auto'}}
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
                  }}>
                  Closed
                </Text>
  
                <Text
                  style={{
                    color: '#555',
                    fontWeight: '300',
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                  {/* @{username} has closed the stream */}
                  Stream has been closed or expired
                </Text>
  
                <Button
                  // loading={leaving}
                  onPress={() => {
                    navigation.goBack();
                    leave();
                  }}
                  label={'Go back'}
                  style={{width: '100%', marginTop: 30, height: 50}}
                />
              </>
              {/* )} */}
            </View>
          </Pressable>
        </Modal>
  
        <Suspense
          fallback={
            <View style={styles.activityCover}>
              <ActivityIndicator color={'#0a171e'} size={40} />
            </View>
          }>
          <JoinedLive
            leave={leave}
            remoteUid={remoteUid}
            room={_id}
            messages={messages}
            setMessages={setMessages}
            loading={loading}
            isSetting={isSetting}
            username={username}
            showMsg={showMsg}
            errMsg={errMsg}
            CTX={CTX}
            _id={_id}
            navigation={navigation}
          />
        </Suspense>
      </>
    );
  };
  
  export default EventJoinedLive;
  
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