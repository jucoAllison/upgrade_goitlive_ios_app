import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  Keyboard,
  LayoutAnimation,
  Platform,
  SectionList,
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
import moment from 'moment';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { MainContext } from '../../../App';
import Fallback from '../../components/fallback/fallback';
import chat_bg from '../../assets/chat_bg.png';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
const ChatMessage = React.lazy(() => import('./chatMessage'));
const EmptyMessage = React.lazy(() => import('./emptyMessage'));
const EachChatHeader = React.lazy(() => import('./eachChatHeader'));
const EachChatTextInput = React.lazy(() => import('./eachChatTextInput'));
const EachChat = ({
  setMessageHere,
  content,
  setContent,
  loading,
  dataDetails,
  replying,
  textInputRef,
  replyTo,
  setReplying,
  emitMsgToSocket,
  setErrMsg,
  setShowMsg,
  reSetDataDetails,
  chatId,
  selectedArr,
  setSelectedArr,
  blobUri,
  receiptID,
  chatMessage,
  loadMoreMessages,
  deleteMSGhandler,
}) => {
  const CTX = useContext(MainContext);
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const [isBlockVisible, setIsBlockVisible] = useState(false);
  const [loadUntilIndex, setLoadUntilIndex] = useState(69);
  const sectionListRef = useRef(null);
  const listCate = [{ name: 'Personal' }, { name: 'Business' }];
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['40%', '40%'], []);

  // console.log("dataDetails?.users?.filter(v=>v._id !== CTX.userObj?._id)[0]?._id =>>> ", dataDetails?.users?.filter(v=>v._id !== CTX.userObj?._id)[0]?._id);

  useEffect(() => {
    if (flatListRef) {
      if (dataDetails?.messages?.length > 0) {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
        });
      }
    }
  }, [index]);

  const findReplyIndex = async replyId => {
    try {
      const findIndex = await dataDetails.messages.findIndex(
        v => v._id == replyId,
      );
      if (!findIndex) {
        setErrMsg("Can't find message");
        setShowMsg(true);
        return;
      }
      if (findIndex.toString() == '-1') {
        setErrMsg("Can't find message");
        setShowMsg(true);
        return;
      }
      setIndex(findIndex);
      console.log('findIndex => ', findIndex);
    } catch (error) {
      setErrMsg('Error catch from findReplyIndex function ');
      setShowMsg(true);
    }
  };

  const handleScroll = event => {
    try {
      const offsetY = event.nativeEvent.contentOffset.y;
      const currentIndex = Math.floor(offsetY / 50);

      // console.log('offsetY => ', offsetY);
      // console.log('currentIndex => ', currentIndex);

      // Determine the number of videos you want to load ahead
      const loadAheadCount = 26;

      // Calculate the index up to which you want to load videos
      const newIndex = currentIndex + loadAheadCount;

      // Update loadUntilIndex if it has changed
      if (newIndex !== loadUntilIndex) {
        setLoadUntilIndex(newIndex);
      }
    } catch (error) {
      console.log('error liking a from handleScroll => ', error);
    }
  };

  // console.log(
  //   'dataDetails.messages?.length =.==>> ',
  //   dataDetails.messages?.length,
  // );

  // console.log(
  //   'dataDetails.messages.slice(0, loadUntilIndex + 1) ',
  //   dataDetails?.messages?.slice(0, loadUntilIndex + 1)?.length,
  // );

  // console.log("chatMessage =>>> ", chatMessage);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        LayoutAnimation.easeInEaseOut();
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        LayoutAnimation.easeInEaseOut();
        setKeyboardHeight(0);
      },
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // function groupMessagesByDate(messages) {
  //   if (messages) {
  //     return Object?.entries(
  //       messages?.reduce((groups, msg) => {
  //         const date = moment(msg.createdAt)?.format('YYYY-MM-DD');
  //         if (!groups[date]) groups[date] = [];
  //         groups[date]?.push(msg);
  //         return groups;
  //       }, {}),
  //     ).map(([date, data]) => ({date, data}));
  //   }
  // }

  // function groupMessagesByDate(messages = []) {
  //   if (messages) {
  //     return Object?.entries(
  //       messages?.reduce((groups, msg) => {
  //         const date = moment(msg?.createdAt)?.format('YYYY-MM-DD');
  //         if (!groups[date]) groups[date] = [];
  //         groups[date]?.push(msg);
  //         return groups;
  //       }, {}),
  //     ).map(([date, data]) => ({ date, data }));
  //   }
  // }

  // function groupMessagesByDate(messages = []) {
  //   if (!messages?.length) return [];

  //   return Object.entries(
  //     messages.reduce((groups, msg) => {
  //       // Ensure it's parsed as a Date
  //       const date = moment(msg?.createdAt).local().format('YYYY-MM-DD');
  //       if (!groups[date]) groups[date] = [];
  //       groups[date].push(msg);
  //       return groups;
  //     }, {}),
  //   ).map(([date, data]) => ({ date, data }));
  // }

  function groupMessagesByDate(messages = []) {
  if (!messages?.length) return [];

  // Group messages by day
  const grouped = messages.reduce((groups, msg) => {
    const date = moment(msg.createdAt).local().format('YYYY-MM-DD');
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg); // keep order from backend
    return groups;
  }, {});

  // Convert to array of sections for SectionList
  return Object.entries(grouped)
    // Sort dates descending so newest day is first in inverted SectionList
    .sort(([a], [b]) => (a > b ? -1 : 1))
    .map(([date, data]) => ({
      date,
      data, // keep original order from backend
    }));
}

// console.log("groupMessagesByDate =>>> ", groupMessagesByDate(chatMessage || []));


  // const get_group = groupMessagesByDate(chatMessage);

  // console.log('chatMessage =>>> ', chatMessage[0]);

  const findMessageLocation = messageId => {
    const sections = groupMessagesByDate(chatMessage || []);
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      const itemIndex = section.data.findIndex(msg => msg._id === messageId);
      if (itemIndex !== -1) {
        return { sectionIndex, itemIndex };
      }
    }
    return null;
  };

  // const scrollToMessage = messageId => {
  //   const location = findMessageLocation(messageId);
  //   if (location) {
  //     sectionListRef.current.scrollToLocation({
  //       sectionIndex: location.sectionIndex,
  //       itemIndex: location.itemIndex,
  //       animated: true,
  //       viewPosition: 0.5, // centers message in the viewport
  //     });
  //   }
  // };

  const scrollToMessage = async messageId => {
    const location = findMessageLocation(messageId);

    if (location) {
      // Already loaded → scroll
      sectionListRef.current.scrollToLocation({
        sectionIndex: location.sectionIndex,
        itemIndex: location.itemIndex,
        animated: true,
        viewPosition: 0.5,
      });
    } else {
      // Not loaded yet → fetch older messages
      const more = await loadMoreMessages(); // should return true if more exist
      if (more) {
        // Try again (recursive until found or no more messages)
        scrollToMessage(messageId);
      } else {
        console.log('Message not found, reached beginning of chat');
      }
    }
  };

  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute(true);
    // bottomSheetModalRef.current?.present();
  }, []);

  const closeModalPress = useCallback(() => {
    setShowAbsolute(false);
    bottomSheetModalRef.current?.close();
  }, []);

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

  const isFocused = useIsFocused();

  if (!isFocused) {
    return null; // 🔹 Render nothing if screen not focused
  }

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        barStyle={CTX.isDarkMode ? 'light-content' : 'dark-content'}
      />

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
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            snapPoints={snapPoints}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
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
            <BottomSheetView style={{ width: '100%', height: '100%' }}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  return null;
                }}
              >
                <View style={{ flex: 1 }}>
                  <EmojiSelector
                    category={Categories.emotion}
                    showSearchBar={false}
                    showSectionTitles={false}
                    placeholder="Search..."
                    showHistory={false}
                    theme="#e20154"
                    columns={9}
                    showTabs={true}
                    onEmojiSelected={emoji => console.log(emoji)}
                  />
                </View>
              </Pressable>
            </BottomSheetView>
          </BottomSheet>
        </Pressable>
      )}

      <Suspense fallback={null}>
        <View>
          <EachChatHeader
            selectedArr={selectedArr}
            setSelectedArr={setSelectedArr}
            reSetDataDetails={reSetDataDetails}
            chatId={chatId}
            deleteMSGhandler={deleteMSGhandler}
          />
        </View>
      </Suspense>
      <ImageBackground source={chat_bg} style={styles.styleLandingLogo}>
        {!CTX.chatMessage && !CTX.chatDetails && <Fallback />}
        <View
          style={{
            width: '100%',
            padding: 20,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: CTX.isDarkMode ? '#000000b8' : '#fbefe3a7',
          }}
        ></View>

        <View
          style={{
            ...styles.positionAbsoluteView,
            height: Dimensions.get('window').height - 161 - keyboardHeight,
          }}
        >
          {!chatMessage && <Fallback />}
          {chatMessage?.length < 1 ? (
            <Suspense fallback={<Fallback />}>
              <EmptyMessage />
            </Suspense>
          ) : (
            <View style={styles.containerCover}>
              <SectionList
                sections={groupMessagesByDate(chatMessage || [])}
                ref={sectionListRef}
                // keyExtractor={item => item?._id}
                // keyExtractor={item =>  item?._id?.toString()|  `msg-${index}`}
                keyExtractor={item => Math.random().toString().split('.')[1]}
                // renderSectionHeader={({ section: { date } }) => (
                //   <Text
                //     style={{
                //       alignSelf: 'center',
                //       marginVertical: 11,
                //       color: CTX.isDarkMode ? '#fff' : '#000',
                //       fontFamily: 'Gilroy-Bold',
                //       fontSize: 12,
                //     }}
                //   >
                //     {moment(date).calendar(null, {
                //       sameDay: '[Today]',
                //       lastDay: '[Yesterday]',
                //       lastWeek: 'dddd',
                //       sameElse: 'MMM D, YYYY',
                //     })}
                //   </Text>
                // )}
                renderItem={({ item, section, index }) => (
                  <View>
                     {section.data[section.data.length - 1]?._id === item?._id && (
                      <Text
                        style={{
                          alignSelf: 'center',
                          marginVertical: 11,
                          color: CTX.isDarkMode ? '#fff' : '#000',
                          fontFamily: 'Gilroy-Bold',
                          fontSize: 12,
                        }}
                      >
                        {moment(section.date).calendar(null, {
                          sameDay: '[Today]',
                          lastDay: '[Yesterday]',
                          lastWeek: 'dddd',
                          sameElse: 'MMM D, YYYY',
                        })}
                      </Text>
                    )} 
                    {item?.deleted_from?.some(
                      r => r == CTX.userObj._id,
                    ) ? null : CTX.deletedMessages.some(
                        q => q._id == item._id,
                      ) ? null : (
                      <ChatMessage
                        setIndex={setIndex}
                        message={item}
                        replyTo={replyTo}
                        findReplyIndex={scrollToMessage}
                        isBlockVisible={isBlockVisible}
                        selectedArr={selectedArr}
                        setSelectedArr={setSelectedArr}
                        setReplying={setReplying}
                        setIsBlockVisible={setIsBlockVisible}
                      />
                    )}
                  </View>
                )}
                inverted
                onEndReached={loadMoreMessages}
                onEndReachedThreshold={0.1}
                ListFooterComponent={
                  CTX?.load_more_msg ? (
                    <ActivityIndicator
                      style={{ marginVertical: 17 }}
                      color={CTX.isDarkMode ? '#fff' : '#000'}
                      size={20}
                    />
                  ) : null
                }
              />
            </View>
          )}
          <Suspense fallback={<Fallback />}>
            <EachChatTextInput
              // receiptID is the ID of the person the are chatting with
              // receiptID={dataDetails?.users?.filter(v=>v._id !== CTX.userObj?._id)[0]?._id}
              receiptID={receiptID}
              setMessageHere={setMessageHere}
              content={content}
              loading={loading}
              setContent={setContent}
              replying={replying}
              setReplying={setReplying}
              textInputRef={textInputRef}
              emitMsgToSocket={write_up => {
                emitMsgToSocket(write_up);
                setIndex(0);
              }}
              dataDetails={dataDetails}
              blobUri={blobUri}
            />
          </Suspense>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  styleLandingLogo: {
    width: '100%',
    flex: 1,
  },
  positionAbsoluteView: {
    width: '100%',
    position: 'absolute',
    flex: 1,
  },
  containerCover: {
    width: '100%',
    flex: 1,
    paddingBottom: 62,
  },

  activiityCover: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pleaseRetry: {
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
  coverMain: {
    flex: 1,
    width: '100%',
    heigth: '100%',
    backgroundColor: '#000',
  },
  activityCover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    // backgroundColor: '#0a171e53',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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

  showAbsolute: {
    position: 'absolute',
    backgroundColor: '#00003330',
    width: '100%',
    height: '100%',
    zIndex: 22,
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
});
export default EachChat;
