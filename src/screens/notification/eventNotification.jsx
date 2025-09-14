import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Pressable,
  FlatList,
  TouchableOpacity,
  NativeModules,
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
import { MainContext } from '../../../App';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Fallback from '../../components/fallback/fallback';

import Notification from './notification';
// const Notification = React.lazy(() => import('./notification'));
const EventNotification = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [notification, setNotification] = useState([]);
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['40%', '60%'], []);
  const [topIndex, setIndex] = useState('all');
  const [listCate, setListCate] = useState([]);
  // const listCate = [
  //   {
  //     name: 'all',
  //   },
  //   {
  //     name: 'tag',
  //   },
  //   {
  //     name: 'care',
  //   },
  //   {
  //     name: 'like',
  //   },
  //   {
  //     name: 'comment',
  //   },
  // ];

  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute(true);
    // bottomSheetModalRef.current?.present();
  }, []);

  const closeModalPress = useCallback(() => {
    setShowAbsolute(false);
    bottomSheetModalRef.current?.close();
  }, []);

  const onChangeSelected = (v, e) => {
    setIndex(v);
    setTimeout(() => {
      closeModalPress();
    }, 500);
  };

  const getAllNotification = async () => {
    setLoading(true);
    setShowMsg(false);
    setErrMsg('');

    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/user/notification`,
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
      setShowMsg(false);
      setErrMsg('');
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }

      const mappedName = parsedJson?.data?.map(v => {
        return { name: v.type };
      });
      // Create a Set to store unique names
      const uniqueNames = new Set();

      // Loop through the array and add names to the Set
      mappedName.forEach(obj => {
        uniqueNames.add(obj.name);
      });

      // Convert the Set to an array to get unique names
      const uniqueNamesArray = Array.from(uniqueNames);

      // console.log("uniqueNamesArray HERE! =>>> ", uniqueNamesArray);
      // console.log("setNotification(parsedJson?.data) HERE! =>>> ", parsedJson?.data);

      setListCate(uniqueNamesArray);
      setNotification(parsedJson?.data);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for getAllNotification! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    // if (isFocused) {
    // navigation.setParams({screenName: 'Notification'});
    getAllNotification();
    CTX.setStatusBarColor('#fff');
    // }
  }, []);

  // should check if the user is to care back here with the _id
  // const checkIsToCareBack = async _id => {
  //   try {
  //     const fetching = await fetch(
  //       `${CTX.systemConfig?.p}user/account/caring/tag/${_id}/2`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `bearer ${CTX.sessionToken}`,
  //         },
  //       },
  //     );
  //     const parsedJson = await fetching.json();
  //     if (parsedJson?.isRemoved) {
  //       return CTX.logoutUser();
  //     }
  //     return parsedJson?.data?.data;
  //   } catch (error) {
  //     setLoading(false);
  //     console.log('error fetching data for getAllTagDetails! => ', error);
  //     // setTagErrMsg('Network request failed');skyblue
  //     // setTagShowMsg(true);
  //   }
  // };

  // useEffect(() => {
  //   if (notification.length < 1) {
  //     return;
  //   } else {
  //     // check for care something
  //     const spread = [...notification];
  //     if (spread.some(v => v.type == 'care')) {
  //       const remappedCare = spread.map(v => {
  //         return {...v, isToCareBack: checkIsToCareBack()};
  //       });
  //     }
  //   }
  // }, [notification]);

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

  return (
    <>
      <StatusBar
        // barStyle={'#fff'}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle={CTX.isDarkMode ? 'light-content' : 'dark-content'} // text/icons color: "dark-content" or "light-content"
      />

      {showAbsolute && (
        <Pressable
          onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
          }}
        >
          {/* <BottomSheetModalProvider> */}
          <BottomSheet
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{ ...styles.reactionText, color: '#fff' }}>
                  Filter notification
                </Text>

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
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                return null;
              }}
            >
              <BottomSheetView style={{ width: '100%', height: '100%' }}>
                {/* <Text style={{color: 'red'}}> HELLO WORLD HERE </Text> */}
                <View style={{ padding: 20 }}>
                  {/* <Text
                  style={{
                    ...styles.categoryText,
                    fontSize: 17,
                    textAlign: 'left',
                  }}>
                  Select account type
                </Text> */}

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onChangeSelected('all')}
                    style={styles.coverUserCommentSection}
                  >
                    {/* {item.svg} */}
                    <View style={{ marginLeft: 6 }}>
                      <Text style={styles.sortText}>all</Text>
                      {/* {item.subs && (
                          <Text
                            style={{
                              color: '#555555',
                              fontSize: 12,
                              fontFamily: 'Overpass-Regular',
                            }}>
                            {item.subs}
                          </Text>
                        )} */}
                    </View>
                    <View
                      style={{
                        ...styles.clickable,
                        backgroundColor: topIndex == 'all' ? '#e20154' : '#fff',
                      }}
                    >
                      <View style={styles.innerCircle}></View>
                    </View>
                  </TouchableOpacity>

                  {/* map the account type here */}
                  <FlatList
                    // style={{marginTop: 20}}
                    data={listCate}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onChangeSelected(item)}
                        key={index}
                        style={styles.coverUserCommentSection}
                      >
                        {/* {item.svg} */}
                        <View style={{ marginLeft: 6 }}>
                          <Text style={styles.sortText}>{item}</Text>
                          {/* {item.subs && (
                          <Text
                            style={{
                              color: '#555555',
                              fontSize: 12,
                              fontFamily: 'Overpass-Regular',
                            }}>
                            {item.subs}
                          </Text>
                        )} */}
                        </View>
                        <View
                          style={{
                            ...styles.clickable,
                            backgroundColor:
                              topIndex == item ? '#e20154' : '#fff',
                          }}
                        >
                          <View style={styles.innerCircle}></View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </BottomSheetView>
            </Pressable>
          </BottomSheet>

          {/* </BottomSheetModal> */}
          {/* </BottomSheetModalProvider> */}
        </Pressable>
      )}
      {/* <Suspense
        fallback={
          // <Fallback />
          <View style={styles.activityCover}>
            <ActivityIndicator color={'#0a171e53'} size={40} />
          </View>
        }> */}
      <Notification
        showMsg={showMsg}
        errMsg={errMsg}
        loading={loading}
        reTryStuff={getAllNotification}
        notification={notification}
        showBottomSheetHandler={showBottomSheetHandler}
        topIndex={topIndex}
        setShowMsg={setShowMsg}
        setErrMsg={setErrMsg}
        setLoading={setLoading}
        setNotification={setNotification}
      />
      {/* </Suspense> */}
    </>
  );
};

export default EventNotification;

const styles = StyleSheet.create({
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  activiityCover: {
    width: '80%',
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  pleaseRetry: {
    color: '#0a171e',
    textAlign: 'center',
  },

  showAbsolute: {
    position: 'absolute',
    backgroundColor: '#00003330',
    width: '100%',
    height: '100%',
    zIndex: 222,
  },
  reactionText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  coverMain: {
    flex: 1,
    width: '100%',
    heigth: '100%',
    backgroundColor: '#000',
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
  sortText: {
    color: '#111',
    fontFamily: 'Overpass-Regular',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  coverUserCommentSection: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    marginBottom: 5,
    // paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clickable: {
    width: 30,
    height: 30,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    borderColor: '#00000022',
    borderWidth: 1,
  },
  innerCircle: {
    width: 13,
    marginLeft: 0,
    height: 13,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
});
