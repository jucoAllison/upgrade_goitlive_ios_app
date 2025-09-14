import {
  View,
  Text,
  TouchableWithoutFeedback,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useRef, useState} from 'react';
import {styles} from './post.styles';
import Video from 'react-native-video';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import happyEyes from '../../assets/json/happyEyes.json';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import {PostContext} from '../../../postVideoCTX';
import {MainContext} from '../../../App';

const ProgressBar = React.lazy(() => import('./progressBar'));
const Bottom = React.lazy(() => import('./bottom'));
const Right = React.lazy(() => import('./right'));
const RemoveMoneyCom = React.lazy(() => import('./removeMoney'));
const Post = ({
  item,
  videoRefs,
  active,
  index,
  isPlaying,
  setSelfDuration,
  handleVideoPress,
  videoLoad,
  selfDuration,
  selfProgress,
  showCaring,
  hasWatchedToCompleted,
  showComment,
  showTags,
  onBufferHandler,
  onEndHandler,
  progressHandler,
  setParentScrollEnabled,
  setViewedCount,
  elapsedTime,
  setElapsedTime,
}) => {
  const doubleTapRef = useRef(null);
  let lastTap = useRef(null);
  const heartScale = useSharedValue(1);
  const [likeNum, setLikeNum] = useState(item?.totalLikes);
  const [isUserLiked, setIsUserLiked] = useState(item?.isUserLiked);
  const PostCTX = useContext(PostContext);
  const CTX = useContext(MainContext);

  const likeFunction = async () => {
    // console.log(
    //   `${CTX.systemConfig?.p}account/user/private-live/like/${item?._id} HERE!!`,
    // );
    setIsUserLiked(!isUserLiked);
    animateHeart();
    if (PostCTX.upLoading) return;

    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}account/user/private-live/like/${item?._id}`,
        {
          method: 'POST',
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

      // console.log('parsedJson =>> ', parsedJson);

      // resetUpperArr(parsedJson.data);
    } catch (error) {
      // setLoading(false);
      console.log('error liking a private => ', error);
      // setErrMsg('Network request failed');
      // setShowMsg(true);
    }
  };
  // animating the heart after like or unlikng the post

  const animateHeart = () => {
    try {
      heartScale.value = withTiming(1.5, {duration: 200}, () => {
        heartScale.value = withSpring(1, {damping: 2, stiffness: 300});
      });
    } catch (error) {
      console.log('error => ', error);
    }
  };

  // like a post from the right component
  const onPressLike = async () => {
    try {
      if (!isUserLiked) {
        let add = parseInt(likeNum) + 1;
        setLikeNum(add);
        likeFunction();
      } else {
        let add = parseInt(likeNum) - 1;
        setLikeNum(add);
        likeFunction();
      }
    } catch (error) {
      console.log('error liking post here => ', error);
    }
  };

  const handleDoubleTap = ({nativeEvent}) => {
    if (nativeEvent.state === State.ACTIVE) {
      // const now = Date.now();
      const now = new Date().getTime();
      if (lastTap.current && now - parseInt(lastTap.current) < 900) {
        // console.log("LIKE VIDEO HERE!!! ! =>> ", Math.random());
        // console.log('LIKE VIDEO HERE!!!!');
        onPressLike();
        lastTap.current = null;
      } else {
        lastTap.current = now;
        // Set a timeout to detect if this was a single tap
        setTimeout(() => {
          if (lastTap.current) {
            handleVideoPress();
            lastTap.current = null;
          }
        }, 300);
      }
    }
  };

  const unloadVideo = async () => {
    try {
      // console.log('unloadVideo HERE!!!');
      // console.log('unloadVideo HERE!!!');
      if (videoRefs.current[index]) {
        console.log('unloadVideo HERE!!! ==>>> ', Math.random());
        // setPauseOverRide(true);
        // setPaused(true);
        await videoRefs.current[index]?.unloadAsync();
      }
    } catch (error) {
      console.log('error liking a from unloadVideo => ', error);
    }
  };

  useEffect(() => {
    setLikeNum(item?.totalLikes || 0);
    setIsUserLiked(item?.isUserLiked || false);
  }, [item]);

  useEffect(() => {
    setViewedCount();

    return () => unloadVideo();
  }, []);

  //   function modifyCloudinaryUrl(url) {
  //     const uploadSegment = "/upload/";
  //     const transformation = "q_auto:best/";

  //     // Find the position of the /upload/ segment
  //     const position = url.indexOf(uploadSegment) + uploadSegment.length;

  //     // Insert the transformation right after /upload/
  //     const modifiedUrl = url.slice(0, position) + transformation + url.slice(position);

  //     return modifiedUrl;
  // }

  // function modifyCloudinaryUrl(url) {
  //   const uploadSegment = "/upload/";
  //   const transformation = "q_auto:best,sp_auto/";

  //   // Find the position of the /upload/ segment
  //   const position = url.indexOf(uploadSegment) + uploadSegment.length;

  //   // Insert the transformation right after /upload/
  //   const modifiedUrl = url.slice(0, position) + transformation + url.slice(position);
  // console.log("modifiedUrl HERER!!! =>> ", modifiedUrl);

  //   return modifiedUrl;
  // }

  function modifyCloudinaryUrl(url) {
    const uploadSegment = '/upload/';
    const existingTransformations = 'sp_auto/'; // Define the existing transformations to be moved
    // const transformation = "q_auto:best,sp_auto/";
    const transformation = "q_auto:best/";
    // const transformation = 'q_99:qmax_99/';

    // Find the position of the /upload/ segment
    const position = url.indexOf(uploadSegment) + uploadSegment.length;

    // Check if the URL already contains sp_auto
    if (url.includes(existingTransformations)) {
      // Remove the existing sp_auto from the original URL
      const urlWithoutExistingTransformations = url.replace(
        existingTransformations,
        '',
      );
      // Insert the combined transformation right after /upload/
      const modifiedUrl =
        urlWithoutExistingTransformations.slice(0, position) +
        transformation +
        urlWithoutExistingTransformations.slice(position);
      // console.log("FESS modifiedUrl HERER!!! =>> ", modifiedUrl);
      return modifiedUrl;
    } else {
      // Insert the transformation right after /upl?oad/ if sp_auto is not present
      const modifiedUrl =
        url.slice(0, position) + transformation + url.slice(position);
      // console.log("SECOND modifiedUrl HERER!!! =>> ", modifiedUrl);
      return modifiedUrl;
    }
  }

  const modifiedUrl = modifyCloudinaryUrl(item?.video);

  return (
    <View style={styles.container}>
      {/* <Text>Leave the door open!</Text> */}
      {/* <TouchableWithoutFeedback
        onPress={handleVideoPress}
        // onLongPress={onLongPressHandler}
        > */}
      <TapGestureHandler
        ref={doubleTapRef}
        onHandlerStateChange={handleDoubleTap}
        numberOfTaps={1}>
        <View style={styles.videoContainer}>
          <Video
            // onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            resizeMode={item?.isCover ? 'cover' : 'contain'}
            // resizeMode={'cover'}
            source={{
              // uri: item?.data?.url,
              uri: item?.video,
              // uri: modifiedUrl,
            }}
            // ref={videoRef}
            ref={ref => (videoRefs.current[index] = ref)}
            style={styles.video}
            paused={
              // parseInt(currentVideoIndex) < 0
              //   ? false
              //   : index !== currentVideoIndex ||
              // isScrolling ||
              // pauseOverRide ||
              active || isPlaying || videoLoad
            }
            onProgress={progressHandler}
            onError={e => {
              Alert.alert('Error', e?.error?.localizedDescription, [
                {
                  text: 'Close',
                  onPress: () => console.log('Close pressed'),
                },
              ]);

              console.log('ERROR!! from onError => ', e);
            }}
            onLoad={async meta => {
              setSelfDuration(meta.duration);
            }}
            repeat={true}
            onEnd={onEndHandler}
            onBuffer={onBufferHandler}
            preferredDecoder={'software'}
            shouldPlay={false}
            useNativeControls={true}
          />
          {/* Add loading indicator if needed */}
          {videoLoad && (
            <View style={styles.coverVideoLoading}>
              <Text style={{fontSize: 15, color: 'white'}}>
                Video Is loading, please wait...
              </Text>
            </View>
          )}
        </View>
      </TapGestureHandler>
      {/* </TouchableWithoutFeedback> */}
      {isPlaying && (
        <Pressable onPress={handleVideoPress} style={styles.pausedIcon}>
          <Ionicon name="play" color="#e5e5e597" size={68} />
        </Pressable>
      )}
      {showCaring && (
        <Pressable style={{...styles.pausedIcon, opacity: 0.7}}>
          <Lottie source={happyEyes} autoPlay loop />
        </Pressable>
      )}
      {/* right Container Section */}
      <Suspense
        fallback={
          null
          // <View style={styles.activityCover}>
          //   <ActivityIndicator color={'#fff'} size={40} />
          // </View>
        }>
        <Right
          showComment={showComment}
          showTags={showTags}
          item={item}
          onPressLike={onPressLike}
          // setLikeNum={setLikeNum}
          // likesArrState={likesArrState}
          heartScale={heartScale}
          viewCounts={0}
          likeNum={likeNum}
          isUserLiked={isUserLiked}
        />
      </Suspense>

      {/* bottom Container Section */}
      <Suspense
        fallback={
          <View style={styles.activityCover}>
            <ActivityIndicator color={'#fff'} size={40} />
          </View>
        }>
        <Bottom
          item={item}
          VideoLoad={videoLoad}
          setParentScrollEnabled={setParentScrollEnabled}
        />

        <ProgressBar
          duration={selfDuration}
          // videoRef={videoRef}
          videoRef={videoRefs.current[index]}
          progress={selfProgress}
          pauseOverRide={false}
          hasWatchedToCompleted={hasWatchedToCompleted}
        />

        {CTX.userObj._id !== item?.user?._id && (
          <RemoveMoneyCom
            active={active}
            videoLoad={videoLoad}
            isPlaying={isPlaying}
            item={item}
            timeLeft={elapsedTime}
            setTimeLeft={setElapsedTime}
          />
        )}
      </Suspense>
    </View>
  );
};

export default Post;
