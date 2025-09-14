import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Lottie from 'lottie-react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';

import animationData from '../../../../assets/json/loading.json';
import ErrMessage from '../../../../components/errMessage/errMessage';
const TopButtons = React.lazy(() => import('./topButtons'));
const EventTags = React.lazy(() => import('./tags/eventTags'));
const Comments = React.lazy(() => import('./comments/eventComment'));
const Post = React.lazy(() => import('../../../../components/post/eventPost'));
const Private = ({
  onRefreshOthers,
  data,
  setSwipeEnabled,
  currentPage,
  loading,
  checkIfUserHasPrivateAccount,
  hasMore,
  isFocused,
  CTX,
}) => {
  const flatListRef = useRef(null);
  const videoRefs = useRef({});
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadUntilIndex, setLoadUntilIndex] = useState(1); // Load videos up to the first index initially
  const [isMe, setIsMe] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const calcSafeArea = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const [isTagModal, setIsTagModal] = useState(false);
  const snapping = isTagModal ? ['45%', '45%'] : ['25%', '40%', '70%'];
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [...snapping], []);
  const [mainPost, setMainPost] = useState({tags: [], _id: ''});
  const [privateUserId, setPrivateUserIdUserId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [pauseOverRide, setPauseOverRide] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // const handleScroll = event => {
  //   const offsetY = event.nativeEvent.contentOffset.y;
  //   const currentIndex = Math.floor(offsetY / Dimensions.get('window').height);
  //   setCurrentVideoIndex(currentIndex);
  // };

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
        setIsPlaying(false);
        setElapsedTime(0); // Reset the timer when the index changes
        setPauseOverRide(false);
      }

      setCurrentVideoIndex(currentIndex);
    } catch (error) {
      console.log('error liking a from handleScroll => ', error);
    }
  };

  const handleMomentumScrollBegin = () => {
    try {
      setIsScrolling(true);
    } catch (error) {
      console.log('error liking a from handleMomentumScrollBegin => ', error);
    }
  };

  const handleMomentumScrollEnd = () => {
    try {
      setIsScrolling(false);
    } catch (error) {
      console.log('error liking a from handleMomentumScrollEnd => ', error);
    }
  };

  const handleVideoPress = index => {
    try {
      if (pauseOverRide) {
        return console.log("override is true can't pause or play");
      }

      setIsPaused(true);

      // if (currentVideoIndex !== index) {
      //   if (videoRefs.current[currentVideoIndex]) {
      //     videoRefs.current[currentVideoIndex].seek(0);
      //     videoRefs.current[currentVideoIndex].setNativeProps({paused: true});
      //   }

      //   videoRefs.current[index]?.seek(0);
      //   videoRefs.current[index]?.setNativeProps({paused: false});

      //   setCurrentVideoIndex(index);
      //   setIsPlaying(true);
      // } else {
      //   const isPaused = !isPlaying;
      //   setIsPlaying(isPaused);
      //   videoRefs.current[index].setNativeProps({paused: isPaused});
      // }
    } catch (error) {
      console.log('error liking a from handleVideoPress => ', error);
    }
  };

  const handlePresentModalPress = useCallback(_id => {
    setPrivateUserIdUserId(_id);
    setIsTagModal(false);
    setSwipeEnabled(false);
    setShowAbsolute(true);
    // bottomSheetModalRef.current?.open();
  }, []);

  const handleTagShow = useCallback(payload => {
    setMainPost(payload);
    setSwipeEnabled(false);
    setIsTagModal(true);
    setShowAbsolute(true);
    // bottomSheetModalRef.current?.open();
  }, []);

  const closeModalPress = useCallback(() => {
    setSwipeEnabled(true);
    setShowAbsolute(false);
    bottomSheetModalRef.current?.close();
  }, []);

  useEffect(() => {
    CTX.setStatusBarColor('#000000');

    return () => {
      setSwipeEnabled(true);
      setIsPlaying(true);
      bottomSheetModalRef.current?.close();
      setShowAbsolute(false);
    };
  }, [isFocused]);

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

  const loadMoreItem = () => {
    console.log('hasMore from loadMoreItem ==>> ', hasMore);
    checkIfUserHasPrivateAccount();
  };

  const renderLoader = () => {
    return (
      <>
        {loading && (
          <View
            style={{height: 50, alignItems: 'center', backgroundColor: '#000'}}>
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

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      // console.log("viewableItems[0] =>>> ", viewableItems[0]);
      setIsPaused(false);
      setCurrentVideo(viewableItems[0].item._id);
    }
  }, []);

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}
      {showAbsolute && (
        <Pressable
          onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
            // display: showAbsolute ? 'flex' : 'none',
          }}>
          <BottomSheet
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            // onChange={handleSheetChange}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{...styles.reactionText, color: '#fff'}}>
                  {isTagModal ? 'Tags' : 'Comments'}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={closeModalPress}
                  style={styles.closeLine}>
                  <Ionicons color={'#838289'} name="close" size={23} />
                </TouchableOpacity>
              </View>
            )}>
            <BottomSheetScrollView style={{width: '100%', height: '100%'}}>
              <Suspense fallback={null}>
                {isTagModal ? (
                  <Suspense fallback={null}>
                    <EventTags
                      tag={mainPost?.tags}
                      _id={mainPost?._id}
                      resetTagg={() => {
                        return null;
                      }}
                      closeModalPress={closeModalPress}
                    />
                  </Suspense>
                ) : (
                  <Suspense fallback={null}>
                    <Comments obj={privateUserId} />
                  </Suspense>
                )}
              </Suspense>
            </BottomSheetScrollView>
          </BottomSheet>
        </Pressable>
      )}
      <Suspense
        fallback={
          <View style={styles.activityCover}>
            <ActivityIndicator color={'#fff'} size={40} />
          </View>
        }>
        <TopButtons isMe={isMe} setIsMe={setIsMe} />
      </Suspense>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={data.slice(0, loadUntilIndex + 1)} // Only render videos up to loadUntilIndex
        renderItem={({item, index}) => (
          <Suspense
            fallback={
              <View style={styles.activityCover}>
                <ActivityIndicator color={'#fff'} size={40} />
              </View>
            }>
            <Post
              item={item}
              index={index}
              currentVideoIndex={currentVideoIndex}
              isScrolling={isScrolling}
              onVideoPress={handleVideoPress}
              videoRefs={videoRefs}
              // isPlaying={isPlaying}
              isPlaying={item._id === currentVideo}
              showComment={handlePresentModalPress}
              showTags={handleTagShow}
              setSwipeEnabled={setSwipeEnabled}
              elapsedTime={elapsedTime}
              setElapsedTime={setElapsedTime}
              setErrMsg={setErrMsg}
              setShowMsg={setShowMsg}
              pauseOverRide={pauseOverRide}
              setPauseOverRide={setPauseOverRide}
              isPaused={isPaused}
              handleVideoPressToFalse={() => setIsPaused(false)}
            />
          </Suspense>
        )}
        keyExtractor={item => item._id}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        ref={flatListRef}
        scrollEnabled={true}
        onScroll={handleScroll}
        pagingEnabled
        windowSize={5}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        removeClippedSubviews={false} // allow buffering in background
        showsVerticalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').height}
        snapToAlignment={'end'}
        decelerationRate={'fast'}
        disableIntervalMomentum
        initialScrollIndex={0}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </>
  );
};

export default Private;

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
  Lottie: {
    flex: 1,
    top: 0,
    height: '100%',
  },
});
