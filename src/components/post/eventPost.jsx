import {View, Text, Alert} from 'react-native';
import React, {
  forwardRef,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react';
import {MainContext} from '../../../App';
// import {captureRef} from 'react-native-view-shot';
// import {Image} from 'react-native-compressor';
// import RNFetchBlob from 'rn-fetch-blob';

const Post = React.lazy(() => import('./post'));
const EventPost = ({
  item,
  isPlaying,
  onVideoPress,
  handleVideoPressToFalse,
  showComment,
  showTags,
  setParentScrollEnabled,
  videoRefs,
  isPaused,
  index,
  personalPost,
}) => {
  const [videoLoad, setVideoLoad] = useState(true);
  const [selfDuration, setSelfDuration] = useState(0);
  const [selfProgress, setSelfProgress] = useState(0);
  const [isCaring, setIsCaring] = useState(item?.isCaring);
  const [likesArrState, setLikesArrState] = useState(item?.likesArr);
  const [showCaring, setShowCaring] = useState(false);
  // const [pauseOverRide, setPauseOverRide] = useState(false);
  const CTX = useContext(MainContext);
  const [hasSkipped, setHasSkipped] = useState(false);
  const [previousTime, setPreviousTime] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [hasWatchedToCompleted, setHasWatchedToCompleted] = useState(false);
  const [viewCounts, setViewCounts] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(59);
  const [pauseOverRide, setPauseOverRide] = useState(false);

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const onBufferHandler = isBuffering => {
    try {
      if (isBuffering.isBuffering) {
        setVideoLoad(true);
        return;
      } else {
        setVideoLoad(false);
        return;
      }
    } catch (error) {
      console.log('error liking a from onBufferHandler => ', error);
    }
  };

  const onEndHandler = async () => {
    setElapsedTime(59);
    // setHasSkipped(false);

    try {
      // Verify if the video was watched without skipping
      if (!hasSkipped) {
        // Video was watched without skipping
        // console.log('Video watched without skipping');
        // call request for watchedToCompletion
        const fetching = await fetch(
          `${CTX.systemConfig?.p}account/user/post/watchedToCompletion/${item?._id}`, // we get three fetching here as
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${CTX.sessionToken}`,
            },
          },
        );
        const response = await fetching.json();
        if (response?.isRemoved) {
          return CTX.logoutUser();
        }

        if (response.e) {
          // setErrMsg(response?.m);
          createThreeButtonAlert(response?.m);
          // setShowMsg(true);
          return;
        }

        // console.log('response here! from onEndHandler =+>> ', response);
        setHasWatchedToCompleted(response.watchedToCompletion);
      } else {
        console.log('Video skipped during playback');
      }
    } catch (error) {
      console.log('error from onEndHandler => ', error);
    }
  };

  const progressHandler = progress => {
    const progressing = progress.currentTime / selfDuration;
    setSelfProgress(progressing);

    const currentTime = progress.currentTime;
    const timeDifference = currentTime - previousTime;

    // Detect skipping based on time difference threshold
    if (timeDifference > 4) {
      setHasSkipped(true);
    }

    // Update previous time for next comparison
    setPreviousTime(currentTime);
  };

  const handleVideoPress = () => {
    try {
      if (pauseOverRide) {
        // setPauseOverRide(false);
        Alert.alert(
          'Error',
          'To continue watching this video, please fund your account. It appears that your current balance is insufficient.',
          [
            {
              text: 'Close',
              onPress: () => console.log('Close pressed'),
            },
          ],
        );
        return;
      }
      onVideoPress();
    } catch (error) {
      console.log('error liking a from post handleVideoPress => ', error);
    }
  };

  const setViewedCount = async () => {
    setIsCounting(true);
  
    if (isCounting) return;
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}account/user/count/views/post/${item?._id}`, // we get three fetching here as
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const response = await fetching.json();
      if (response?.isRemoved) {
        return CTX.logoutUser();
      }

      if (response.e) {
        // setErrMsg(response?.m);
        createThreeButtonAlert(response?.m);
        // setShowMsg(true);
        return;
      }
      // console.log(
      //   'response.data.hasWatchedToCompleted from setViewedCount ==>> ',
      //   response,
      // );
      setHasWatchedToCompleted(response.hasWatchedToCompleted);
      setViewCounts(response.views);
    } catch (error) {
      setIsCounting(false);
      console.log('error from setViewedCount function => ', error);
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <Post
        onVideoPress={onVideoPress}
        personalPost={personalPost}
          isPaused={isPaused}
          item={item}
          // heartScale={heartScale}
          isPlaying={isPlaying}
          index={index}
          // currentVideoIndex={currentVideoIndex}
          // isScrolling={isScrolling}
          pauseOverRide={pauseOverRide}
          setPauseOverRide={setPauseOverRide}
          setSelfDuration={setSelfDuration}
          videoLoad={videoLoad}
          selfDuration={selfDuration}
          selfProgress={selfProgress}
          isCaring={isCaring}
          // likeNum={likeNum}
          likesArrState={likesArrState}
          // isUserLiked={isUserLiked}
          showCaring={showCaring}
          hasSkipped={hasSkipped}
          previousTime={previousTime}
          isCounting={isCounting}
          hasWatchedToCompleted={hasWatchedToCompleted}
          viewCounts={viewCounts}
          handleVideoPress={handleVideoPress}
          showComment={showComment}
          showTags={showTags}
          // setLikeNum={setLikeNum}
          // setIsUserLiked={setIsUserLiked}
          onBufferHandler={onBufferHandler}
          onEndHandler={onEndHandler}
          progressHandler={progressHandler}
          setParentScrollEnabled={setParentScrollEnabled}
          videoRefs={videoRefs}
          setViewedCount={() => console.log("setViewedCount function called: =>>> ")}
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
          handleVideoPressToFalse={handleVideoPressToFalse}
        />
      </Suspense>
    </>
  );
};

export default EventPost;
