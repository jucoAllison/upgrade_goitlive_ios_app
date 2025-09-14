import {
  View,
  Text,
  RefreshControl,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Lottie from 'lottie-react-native';
import createAgoraRtcEngine, {
  AudienceLatencyLevelType,
  ChannelMediaOptions,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';
import Fallback from '../../../components/fallback/fallback';
import animationData from '../../../assets/json/loading.json';
import { MainContext } from '../../../../App';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ErrMessage from '../../../components/errMessage/errMessage';
import { useAgoraEngine } from '../../../../AgoraEngineContext';
import DismissKeyboardWrapper from '../../../components/dismissKeyboard';

const ListedLives = React.lazy(() => import('./listedLives'));
const EventListedLives = ({
  data,
  setData,
  onRefreshOthers,
  loading,
  loadMore,
  overRideShow,
}) => {
  const CTX = useContext(MainContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loadUntilIndex, setLoadUntilIndex] = useState(1); // Load videos up to the first index initially
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [currentVideo, setCurrentVideo] = useState(data[0] || null);
  const flatListRef = useRef(null);
  const [isSetting, setIsSetting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [appId, setAppId] = useState(CTX.systemConfig?.A_appId);
  const navigation = useNavigation();
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [joinError, setJoinError] = useState(null);
  const agoraEngine = useAgoraEngine();
  const isFocused = useIsFocused();
  const [isToComment, setIsToComment] = useState(false);

  const onRefresh = () => {
    try {
      setRefreshing(true);
      onRefreshOthers().then(() => setRefreshing(false));
    } catch (error) {
      console.log('error liking a from onRefresh => ', error);
    }
  };

  const handleScroll = event => {
    try {
      const offsetY = event.nativeEvent.contentOffset.y;
      const currentIndex = Math.floor(
        offsetY / Dimensions.get('window').height,
      );

      // Determine the number of videos you want to load ahead
      const loadAheadCount = 2;

      // Calculate the index up to which you want to load videos
      const newIndex = currentIndex + loadAheadCount;

      // Update loadUntilIndex if it has changed
      if (newIndex !== loadUntilIndex) {
        setLoadUntilIndex(newIndex);
        //   setIsPlaying(false);
        //   setElapsedTime(0); // Reset the timer when the index changes
        //   setPauseOverRide(false);
      }

      setCurrentVideoIndex(currentIndex);
    } catch (error) {
      console.log('error liking a from handleScroll => ', error);
    }
  };

  const setupVideoSDKEngine = async () => {
    if (isSetting) return;

    setIsSetting(true);
    try {
      // use the helper function to get permissions

      await agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      await agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          setIsJoined(true);
          setJoinError(null);
          CTX.socketObj?.emit('join-private-room', {
            room: currentVideo?._id,
          });
        },
        onUserJoined: (_connection, Uid) => {
          // if (!isJoined) {
          // }
          setIsSetting(false);
          setRemoteUid(Uid);
          console.log('onUserJoined called =>>> ', Uid);
        },
        onUserOffline: (_connection, Uid) => {
          console.log('onUserOffline HERE!!! ==>>> _connection :::');
          console.log('onUserOffline HERE!!! ==>>> err :::', Uid);
          leave(currentVideo?._id);

          console.log('Host ended live:', Uid);
          setJoinError('The live has ended.');

          setErrMsg('The live has ended');
          setShowMsg(true);
          if (data.length == 1) {
            // reset data
            setData([]);
          }
        },
        onError: (err, msg) => {
          console.log('onError HERE!!! ==>>> err :::');
          console.log('onError HERE!!! ==>>> err :::', err);
          console.log('onError HERE!!! ==>>> msg :::', msg);
          console.log('onError HERE!!! ==>>> msg :::');

          setJoinError('Failed to join live.');

          setErrMsg('Failed to join live');
          setShowMsg(true);
        },
        onChannelJoinError: aaaa => {
          console.log('onChannelJoinError HERE!!! ==>>> msg :::', aaaa);
        },
      });
      agoraEngine?.startPreview();
      await agoraEngine.enableVideo();
      setIsSetting(false);
    } catch (e) {
      setIsSetting(false);
      setErrMsg('There was an error setting up video engine');
      setShowMsg(true);
      console.log('error from setUpVideoSDKEgine ==>> ', e);
    }
  };

  const join = async dataa => {
    // if (isJoined) {
    //   return;
    // }
    if (!dataa) return;

    if (!agoraEngine) {
      console.warn('Agora engine not ready yet (waiting for appId).');
      return;
    }

    // console.log('joined is called with =>> ', dataa);

    try {
      var channeloptions = new ChannelMediaOptions();

      channeloptions.audienceLatencyLevel =
        AudienceLatencyLevelType.AudienceLatencyLevelLowLatency;

      // 👇 make sure audience subscribes to video & audio
      channeloptions.autoSubscribeAudio = true;
      channeloptions.autoSubscribeVideo = true;

      agoraEngine?.updateChannelMediaOptions(channeloptions);
      agoraEngine?.joinChannel(dataa?.token, dataa?.channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleAudience,
      });
    } catch (e) {
      console.log('e from join handler => ', e);
    }
  };

  const leave = room => {
    try {
      CTX.socketObj?.emit('leave-room', { room });
      agoraEngine?.stopPreview();
      agoraEngine?.leaveChannel();
    } catch (e) {
      console.log('e from leave handler => ', e);
    }
  };

  useEffect(() => {
    setupVideoSDKEngine();
  }, []);

  // console.log('remoteUid =>>> ', remoteUid);

  useEffect(() => {
    if (!currentVideo) return;
    join(currentVideo);

    return () => {
      leave(currentVideo?._id);
    };
  }, [currentVideo]);

  // if after 17 seconds, there is nothing, return back to go live
  useEffect(() => {
    if (elapsedTime === 17) {
      setData([]);
    }
  }, [elapsedTime]);

  console.log('currentVideo =>. ', currentVideo);

  useEffect(() => {
    let timer;

    if (isFocused) {
      // Start the timer when the video is not visible
      if (remoteUid === 0) {
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
  }, [isFocused, currentVideo, isSetting, remoteUid]);

  const renderLoader = () => {
    return (
      <>
        {loading && (
          <View
            style={{
              height: 50,
              alignItems: 'center',
              backgroundColor: '#000',
            }}
          >
            <Lottie
              style={styles.Lottie}
              source={animationData}
              autoPlay
              loop
            />
          </View>
        )}
      </>
    );
  };

  // const onViewableItemsChanged = useCallback(({ viewableItems }) => {
  //   if (viewableItems.length > 0) {
  //     setCurrentVideo(viewableItems[0].item);
  //   }
  // }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const nextVideo = viewableItems[0].item;
        if (currentVideo?._id !== nextVideo._id) {
          leave(currentVideo?._id); // disconnect old
          setCurrentVideo(nextVideo); // set new
        }
      }
    },
    [currentVideo],
  );

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  console.log('remoteUid =>>> ', remoteUid);

  return (
    <>
      <View>
        {showMsg && (
          <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
        )}
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={data.slice(0, loadUntilIndex + 1)} // Only render videos up to loadUntilIndex
          renderItem={({ item, index }) => (
            <Suspense fallback={<Fallback />}>
              <ListedLives
                item={item}
                index={index}
                currentVideoIndex={currentVideoIndex}
                isPlaying={item._id === currentVideo._id}
                leave={() => leave(currentVideo?._id)}
                remoteUid={remoteUid}
                loading={loading}
                isSetting={isSetting}
                isToComment={isToComment}
                setIsToComment={setIsToComment}
              />
            </Suspense>
          )}
          keyExtractor={item => item._id}
          // keyExtractor={item => Math.random().toString().split(".")[1]}
          // onMomentumScrollBegin={handleMomentumScrollBegin}
          // onMomentumScrollEnd={handleMomentumScrollEnd}
          ref={flatListRef}
          scrollEnabled={true}
          onScroll={handleScroll}
          pagingEnabled
          windowSize={3}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          snapToInterval={Dimensions.get('window').height}
          snapToAlignment={'end'}
          decelerationRate={'fast'}
          disableIntervalMomentum
          initialScrollIndex={0}
          ListFooterComponent={renderLoader}
          onEndReached={loadMore}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        {!isToComment && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={overRideShow}
            style={styles.startNewChat}
          >
            <Ionicons name="add-sharp" color={'#fff'} size={24} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default EventListedLives;

const styles = StyleSheet.create({
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  showAbsolute: {
    position: 'absolute',
    // backgroundColor: '#e010b400',
    backgroundColor: '#00003330',
    width: '100%',
    height: '100%',
    zIndex: 22,
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
  Lottie: {
    flex: 1,
    top: 0,
    height: '100%',
  },
});
