import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  BackHandler,
  SafeAreaView,
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
import {MainContext} from '../../../App';
import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/button';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
import ErrMessage from '../../components/errMessage/errMessage';
import {useWebSocket} from '../../../WebSocketContext';
// import Fallback from '../../components/fallback/fallback';

const EventStartConversation = React.lazy(() =>
  import('./startConversation/eventStartConversation'),
);
const ChaListHere = React.lazy(() => import('./chatlist'));
const EventChatlist = () => {
  const CTX = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [isFoundDetails, setIsFoundDetails] = useState(null);
  const [searched, setSearched] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const isFocused = useIsFocused();
  const snapping = ['100%', '100%'];
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [...snapping], []);
  const [selectedArr, setSelectedArr] = useState([]);
  const [isBlockVisible, setIsBlockVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const {connectionStatus, sendMessage, ws} = useWebSocket();
  const [loading_pin, setLoading_pin] = useState(false);
  const [text, setText] = useState('Others');

  // const getChat = useCallback(async isCodedly => {
  //   setShowMsg(false);
  //   try {
  //     const fetching = await fetch(`${CTX.url}user/chat/list/messages`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `bearer ${CTX.sessionToken}`,
  //       },
  //     });
  //     const parsedJson = await fetching.json();
  //     // if (parsedJson?.isRemoved) {
  //     //   return CTX.logoutUser();
  //     // }
  //     setLoading(false);
  //     if (!isCodedly && parsedJson?.e) {
  //       setErrMsg(parsedJson?.m);
  //       setShowMsg(true);
  //       return;
  //     }
  //     setShowMsg(false);
  //     // console.log("parsedJson?.data?.data from EventChatlist", parsedJson?.data?.data);
  //     setIsFoundDetails(parsedJson?.data);
  //   } catch (error) {
  //     console.log('error fetching data for session! => ', error);
  //     setLoading(false);
  //     setErrMsg('Network request failed');
  //     setShowMsg(true);
  //   }
  // }, []);

  const handleBottomShow = useCallback(payload => {
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

  // cancel pressed
  const cancelOnPressHandler = () => {
    if (loading_pin) return;
    if (deleteLoading) {
      return;
    }

    setIsBlockVisible(false);
    setSelectedArr([]);
  };

  const deleteHandler = async () => {
    if (loading_pin) return;
    if (deleteLoading) {
      return;
    }
    setDeleteLoading(true);
    setShowMsg(false);
    try {
      const fetching = await fetch(`${CTX.url}user/chat/remove/id/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
        body: JSON.stringify({ids: selectedArr.map(v => v._id)}),
      });
      const parsedJson = await fetching.json();
      setLoading_pin(false);
      setDeleteLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }

      sendMessage({
        action: 'chatlistwebsocket',
        token: CTX.sessionToken,
        payload: {
          action: 'list_chat',
        },
      });
      setShowMsg(false);
      setErrMsg('');
      cancelOnPressHandler();
    } catch (error) {
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      setLoading_pin(false);
      setDeleteLoading(false);
      setShowMsg(true);
    }
  };

  // const connectSocketHere = async () => {
  //   if (connectionStatus == 'connected') return;

  //   try {
  //     ws.current = new WebSocket(CTX.webSocketURL);
  //     ws.current.onopen = () => {
  //       setConnectionStatus('connected');
  //       ws.current.send(
  //         JSON.stringify({
  //           action: 'chatlistwebsocket',
  //           token: CTX.sessionToken,
  //         }),
  //       );
  //     };

  //     ws.current.onmessage = async event => {
  //       const receivedData = await JSON.parse(event.data);
  //       setIsFoundDetails(receivedData?.data);
  //     };

  //     ws.current.onclose = () => {
  //       console.log('chat closed ❌, reconnecting...');
  //       setConnectionStatus('disconnected');
  //       // Attempt to reconnect after a short delay
  //       setTimeout(connectSocketHere, 4000); // Reconnect after delay
  //     };

  //     ws.current.onerror = err => {
  //       console.log('chat ws error 🚨:', err);
  //       setConnectionStatus('disconnected');
  //     };
  //     // }
  //   } catch (error) {
  //     console.log('connectSocketHere ERROR =>> ', error);
  //   }
  // };

  const connectSocketHere = () => {
    if (!ws.current) return console.log('CHECK UR INTERNET CONNECTION!!');
    // console.log("send money here!! =>>> ");
    setLoading(true);

    // console.log('HUNGRY HUNGRY HUNGRY');

    sendMessage({
      action: 'chatlistwebsocket',
      token: CTX.sessionToken,
      payload: {
        action: 'list_chat',
      },
    });
  };

  // useEffect(() => {
  //   CTX.setStatusBarColor('#fff');
  //   if (isFocused) {
  //     connectSocketHere();
  //   }
  // }, [isFocused]);

  

  useFocusEffect(
    useCallback(() => {
      if (connectionStatus == 'connected') {
        console.log('Screen focused, connecting socket...');
        connectSocketHere();
        // checkFCMToken();
      }

      // return () => {
      //   console.log('Screen unfocused, disconnecting socket...');
      //   disconnectSocketHere();
      // };
    }, [isFocused, connectionStatus]),
  );

  // useEffect(() => {
  //   setIsFoundDetails(CTX.chat_list);
  // }, [isFocused, CTX.chat_list]);

  const pinChatHandler = async () => {
    if (deleteLoading) {
      return;
    }

    if (loading_pin) return;
    console.log(
      'isBlockVisible =>> ',
      selectedArr.map(v => v._id),
      isBlockVisible,
    );

    setLoading_pin(true);
    setShowMsg(false);
    try {
      const fetching = await fetch(`${CTX.url}user/chat/pin-unpin-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
        body: JSON.stringify({
          ids: selectedArr.map(v => v._id),
          category: text.toLowerCase() == 'others' ? 'pinned' : 'others',
        }),
      });
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      setLoading_pin(false);
      setDeleteLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      sendMessage({
        action: 'chatlistwebsocket',
        token: CTX.sessionToken,
        payload: {
          action: 'list_chat',
        },
      });
      setErrMsg('');
      setShowMsg(false);
      cancelOnPressHandler();
    } catch (error) {
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      setDeleteLoading(false);
      setLoading_pin(false);
      setShowMsg(true);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff', flex: 1},
      ]}>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}
      <DismissKeyboardWrapper>
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
                    Start conversation
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={closeModalPress}
                    style={styles.closeLine}>
                    <Ionicons color={'#838289'} name="close" size={23} />
                  </TouchableOpacity>
                </View>
              )}>
              <Pressable
                style={{width: '100%', heigth: '100%'}}
                onPress={() => {
                  return;
                }}>
                <Suspense fallback={null}>
                  <EventStartConversation />
                </Suspense>
              </Pressable>
            </BottomSheet>
          </Pressable>
        )}
        <Suspense fallback={null}>
          <ChaListHere
            isFoundDetails={isFoundDetails}
            searched={searched}
            setSearched={setSearched}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            setErrMsg={setErrMsg}
            setShowMsg={setShowMsg}
            loading={
              (connectionStatus !== 'connected' && CTX.chat_list?.length < 1) ||
              (loading && CTX.chat_list?.length < 1)
            }
            setLoading={setLoading}
            handleBottomShow={handleBottomShow}
            isBlockVisible={isBlockVisible}
            selectedArr={selectedArr}
            setSelectedArr={setSelectedArr}
            setIsBlockVisible={setIsBlockVisible}
            pinChatHandler={pinChatHandler}
            loading_pin={loading_pin}
            cancelOnPressHandler={cancelOnPressHandler}
            deleteLoading={deleteLoading}
            text={text}
            setText={setText}
          />
        </Suspense>
        {isBlockVisible && (
          <View style={styles.bottomSTY}>
            <Button
              label={'Cancel'}
              color="#e20154"
              style={styles.cancleBTN}
              onPress={cancelOnPressHandler}
            />
            <Button
              onPress={deleteHandler}
              loading={deleteLoading}
              label={'Remove'}
              style={{height: 40}}
            />
          </View>
        )}
      </DismissKeyboardWrapper>
    </SafeAreaView>
  );
};

export default EventChatlist;

const styles = StyleSheet.create({
  bottomSTY: {
    height: 50,
    width: '100%',
    // backgroundColor: '#0a171e',
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancleBTN: {
    height: 40,
    backgroundColor: 'transparent',
    borderColor: '#e20154',
    color: '#e20154',
    borderWidth: 2,
  },
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
    fontFamily: 'Gilroy-Bold',
    textAlign: 'center',
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
