import {
  View,
  Text,
  ActivityIndicator,
  Platform,
  StatusBar,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// import Button from '../../../../components/button';
import {MainContext} from '../../../../../App';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from '../anythingAboutPrivate/styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {PostContext} from '../../../../../postVideoCTX';

// const Post = React.lazy(() =>
//   import('../../../../components/personalPost/post'),
// );
const Post = React.lazy(() => import('../../../../components/post/eventPost'));
// const TopButtons = React.lazy(() => import('./topButtons'));
const EventTags = React.lazy(() =>
  import('../anythingAboutPrivate/tags/eventTags'),
);
const EventStats = React.lazy(() => import('./stats/eventStats'));
const Following = ({createThreeButtonAlert, setParentScrollEnabled, data}) => {
  const [isMe, setIsMe] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const isFocused = useIsFocused();
  const PostCTX = useContext(PostContext);
  const CTX = useContext(MainContext);
  const masterRef = useRef({});
  const calcSafeArea = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const [isTagModal, setIsTagModal] = useState(false);
  const snapping = isTagModal ? ['45%', '45%'] : ['25%', '35%'];
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [...snapping], []);
  const [privateUserId, setPrivateUserIdUserId] = useState(null);
  const mediaRefs = useRef([]);
  const viewableItemsRef = useRef([]);
  const [mainPost, setMainPost] = useState({tags: [], _id: ''});
  const navigation = useNavigation();
  const [paused, setPaused] = useState(true);

  const handlePresentModalPress = useCallback(_id => {
    try {
      setPrivateUserIdUserId(_id);
      setIsTagModal(false);
      setShowAbsolute(true);
      // bottomSheetModalRef.current?.present();
    } catch (error) {
      console.log('error from handlePresentModalPress =>> ', error);
    }
  }, []);

  const handleTagShow = useCallback(payload => {
    try {
      setMainPost(payload);
      setIsTagModal(true);
      setShowAbsolute(true);
      // bottomSheetModalRef.current?.present();
    } catch (error) {
      console.log('error from handleTagShow =>> ', error);
    }
  }, []);

  const closeModalPress = useCallback(() => {
    try {
      setShowAbsolute(false);
      bottomSheetModalRef.current?.close();
    } catch (error) {
      console.log('error from closeModalPress =>> ', error);
    }
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

  useEffect(() => {
    if (isFocused) {
      // Your logic here when the screen is focused (e.g., console.log, state update)
      CTX.setStatusBarColor('#000000');
    }
    return () => {
      setPaused(true);
      setIsPaused(true);
      bottomSheetModalRef.current?.close();
      setShowAbsolute(false);
    };
  }, []);

  

  return (
    <>
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
                  {isTagModal ? 'Tags' : 'Statistics'}
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
                  <EventStats obj={privateUserId} />
                </Suspense>
              )}
            </BottomSheetScrollView>
          </BottomSheet>
        </Pressable>
      )}

      {/* <Suspense
        fallback={
          <View style={styles.activityCover}>
            <ActivityIndicator color={'#fff'} size={40} />
          </View>
        }>
        <TopButtons isMe={isMe} setIsMe={setIsMe} />
      </Suspense> */}
      <Suspense
        fallback={
          <View style={styles.activityCover}>
            <ActivityIndicator color={'#fff'} size={40} />
          </View>
        }>
        <Post
          personalPost={true}
          isPlaying={true}
          handleVideoPressToFalse={() => setIsPaused(false)}
          isPaused={isPaused}
          onVideoPress={() => setIsPaused(true)}
          item={data}
          showComment={handlePresentModalPress}
          showTags={handleTagShow}
          videoRefs={masterRef}
          paused={paused}
          setPaused={setPaused}
        />
      </Suspense>
    </>
  );
};

export default Following;

// under settings, toggle comments on or off
// see how many views a post got
// view post stats
