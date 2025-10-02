import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MainContext } from '../../../../../App';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import ErrMessage from '../../../../components/errMessage/errMessage';
import { usePermissions } from '../../../../helper/usePermissions';
import Fallback from '../../../../components/fallback/fallback';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GiftAnimation from '../../../../components/gift_animation';
const PrivateProfile = React.lazy(() => import('./privateProfile'));
const EventEachUserPrivateProfile = ({ setSwipeEnabled }) => {
  const CTX = useContext(MainContext);
  const bottomSheetModalRef = useRef(null);
  const snapping = ['25%', '40%', '70%'];
  const snapPoints = useMemo(() => [...snapping], []);
  const [loading, setLoading] = useState(false);
  const [showAbsolute, setShowAbsolute] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [channelName, setChannelName] = useState(null);
  const { granted, loading: loadingPermission } = usePermissions();
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState('');
  const [text, setText] = useState('Active');
  const subs = ['Active', 'All', 'Gifts'];

  const openMenu = useCallback(() => {
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

  const getCallDetails = async () => {
    if (!channelName) return;
    setLoading(true);
    try {
      console.log(
        `${CTX.systemConfig?.p}get/account/get/call/details/${channelName}`,
      );

      // first create call model data
      const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/get/call/details/${channelName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);

      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setData(parsedJson?.data);
    } catch (e) {
      setLoading(false);
      setErrMsg('HAHAHAHAHAHAHA');
      setShowMsg(true);
      console.log('ERROR from getCallDetails =>> ', e);
    }
  };

  useEffect(() => {
    if (showAbsolute) {
      getCallDetails();
    }
  }, [channelName, showAbsolute]);

  const mappedHeaders = subs.map((item, i) => (
    <View
      style={{
        alignSelf: 'flex-start',
      }}
      key={i}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setText(item);
        }}
      >
        <View
          style={{
            ...styles.eachBtnCover,
            backgroundColor:
              text == item
                ? '#e20154'
                : CTX.isDarkMode
                ? '#202d3489'
                : '#efefef',
          }}
        >
          <Text
            style={{
              ...styles.eachBtnText,
              color:
                text == item ? '#fff' : CTX.isDarkMode ? '#fff' : '#262626',
              fontFamily: 'Gilroy-Bold',
            }}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  ));

  const mappActive = data?.active?.map((v, i) => {
    return (
      <View style={styles.coverNot} key={i}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            ...styles.coverStatusRound,
            // borderWidth: status?.length > 0 ? 1 : 0,
            borderWidth: 1,
          }}
        >
          <Image
            source={{
              uri: v?.uid?.photo
                ? v?.uid?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={styles.eachImg}
          />
        </TouchableOpacity>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                ...styles.username,
                color: '#0e0e0e',
              }}
            >
              {v?.uid?.full_name}
            </Text>
            {v?.uid?.verify && (
              <MaterialIcons
                style={{ marginLeft: 5 }}
                name="verified"
                color="#91ff91"
                size={16}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <Text
              style={{
                ...styles.username,
                fontSize: 12,
                color: '#0e0e0e',
                // color: '#cbd0d5',
                fontFamily: 'Gilroy-Regular',
              }}
            >
              @{v?.uid?.username}
            </Text>
          </View>
        </View>

        <Text
          style={{
            ...styles.username,
            color: '#0e0e0e',
            fontFamily: 'Gilroy-Bold',
            marginLeft: 'auto',
          }}
        >
          {v?.uid?._id == CTX.userObj?._id
            ? 'You'
            : v?.random.toString().slice(-4)}
        </Text>
      </View>
    );
  });

  const mappAll = data?.subscribers?.map((v, i) => {
    return (
      <View style={styles.coverNot} key={i}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            ...styles.coverStatusRound,
            // borderWidth: status?.length > 0 ? 1 : 0,
            borderWidth: 1,
          }}
        >
          <Image
            source={{
              uri: v?.uid?.photo
                ? v?.uid?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={styles.eachImg}
          />
        </TouchableOpacity>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                ...styles.username,
                color: '#0e0e0e',
              }}
            >
              {v?.uid?.full_name}
            </Text>
            {v?.uid?.verify && (
              <MaterialIcons
                style={{ marginLeft: 5 }}
                name="verified"
                color="#91ff91"
                size={16}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <Text
              style={{
                ...styles.username,
                fontSize: 12,
                color: '#0e0e0e',
                // color: '#cbd0d5',
                fontFamily: 'Gilroy-Regular',
              }}
            >
              @{v?.uid?.username}
            </Text>
          </View>
        </View>

        <Text
          style={{
            ...styles.username,
            color: '#0e0e0e',
            fontFamily: 'Gilroy-Bold',
            marginLeft: 'auto',
          }}
        >
          {v?.uid?._id == CTX.userObj?._id
            ? 'You'
            : v?.random.toString().slice(-4)}
        </Text>
      </View>
    );
  });

  const mappGifts = data?.gifts?.map((v, i) => {
    return (
      <View style={styles.coverNot} key={i}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            ...styles.coverStatusRound,
            // borderWidth: status?.length > 0 ? 1 : 0,
            borderWidth: 1,
          }}
        >
          <Image
            source={{
              uri: v?.from?.photo
                ? v?.from?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={styles.eachImg}
          />
        </TouchableOpacity>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                ...styles.username,
                color: '#0e0e0e',
              }}
            >
              {v?.from?.full_name}
            </Text>
            {v?.from?.verify && (
              <MaterialIcons
                style={{ marginLeft: 5 }}
                name="verified"
                color="#91ff91"
                size={16}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <Text
              style={{
                ...styles.username,
                fontSize: 12,
                color: '#0e0e0e',
                // color: '#cbd0d5',
                fontFamily: 'Gilroy-Regular',
              }}
            >
              @{v?.display_name}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginLeft: 'auto',
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 40 }}>{v?.json}</Text>

          <Text
            style={{
              fontFamily: 'Gilroy-Bold',
              color: '#262626',
              fontSize: 11,
              textTransform: 'capitalize',
            }}
          >
            {v?.name}
          </Text>

          {/* <Text
            style={{
              ...styles.username,
              color: '#0e0e0e',
              fontFamily: 'Gilroy-Bold',
            }}
          >
          </Text> */}
        </View>
      </View>
    );
  });

  if (loadingPermission) {
    return <Fallback />; // or a spinner
  }

  if (!granted) {
    return <Fallback />;
  }

  return (
    <>
      <View style={{ backgroundColor: '#000' }}>
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          barStyle={'light-content'}
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
              snapPoints={snapPoints}
              backdropComponent={renderBackdrop}
              handleComponent={() => (
                <View style={styles.handleComponentStyle}>
                  <Text style={{ ...styles.reactionText, color: '#fff' }}>
                    Details
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
                <BottomSheetScrollView>
                  {loading ? (
                    <View style={styles.loadingActivityCover}>
                      <ActivityIndicator color={'#3b3b3b'} size={40} />
                    </View>
                  ) : (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          paddingTop: 10,
                          paddingRight: 20,
                          paddingBottom: 20,
                          paddingLeft: 20,
                          alignItems: 'center',
                        }}
                      >
                        {mappedHeaders}
                      </View>
                      <View
                        style={{
                          gap: 1,
                          // paddingTop: 10,
                          paddingRight: 20,
                          paddingBottom: 20,
                          paddingLeft: 20,
                          alignItems: 'center',
                        }}
                      >
                        {text == 'Active' ? (
                          <>
                            {mappActive?.length < 1 ? (
                              <View
                                style={{
                                  ...styles.activiityCover,
                                  marginTop: 80,
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="terraform"
                                  color={'#000'}
                                  size={40}
                                />
                                <View
                                  style={{
                                    marginTop: 20,
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...styles.pleaseRetry,
                                      color: '#000',
                                    }}
                                  >
                                    No active user has joined your private
                                    stream yet
                                  </Text>
                                  {/* <TouchableOpacity
                                              activeOpacity={0.8}
                                            >
                                              <Text style={{ ...styles.pleaseRetry, color: 'skyblue' }}>
                                                Others category.
                                              </Text>
                                            </TouchableOpacity> */}
                                </View>
                              </View>
                            ) : (
                              mappActive
                            )}
                          </>
                        ) : text == 'All' ? (
                          <>
                            {mappAll?.length > 0 ? (
                              mappAll
                            ) : (
                              <View
                                style={{
                                  ...styles.activiityCover,
                                  marginTop: 80,
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="terraform"
                                  color={'#000'}
                                  size={40}
                                />
                                <View
                                  style={{
                                    marginTop: 20,
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...styles.pleaseRetry,
                                      color: '#000',
                                    }}
                                  >
                                    No user has joined your private stream yet
                                  </Text>
                                </View>
                              </View>
                            )}
                          </>
                        ) : (
                          <>
                            {mappGifts?.length > 0 ? (
                              mappGifts
                            ) : (
                              <View
                                style={{
                                  ...styles.activiityCover,
                                  marginTop: 80,
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="terraform"
                                  color={'#000'}
                                  size={40}
                                />
                                <View
                                  style={{
                                    marginTop: 20,
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...styles.pleaseRetry,
                                      color: '#000',
                                    }}
                                  >
                                    No user has gifted you yet!
                                  </Text>
                                </View>
                              </View>
                            )}
                          </>
                        )}
                      </View>
                    </>
                  )}
                </BottomSheetScrollView>
              </Pressable>
            </BottomSheet>
          </Pressable>
        )}

        <GiftAnimation />

        <Suspense fallback={<Fallback />}>
          <PrivateProfile
            setSwipeEnabled={setSwipeEnabled}
            openMenu={openMenu}
            showMsg={showMsg}
            setShowMsg={setShowMsg}
            errMsg={errMsg}
            setErrMsg={setErrMsg}
            channelName={channelName}
            setChannelName={setChannelName}
          />
        </Suspense>
      </View>
    </>
  );
};

export default EventEachUserPrivateProfile;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 12,
  },
  text: {
    fontSize: 20,
    color: '#fff',
  },
  eachImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  username: {
    fontWeight: '400',
    fontFamily: 'Gilroy-Medium',
    fontSize: 17,
  },
  coverStatusRound: {
    marginRight: 13,
    padding: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#9e005d98',
    borderBottomEndRadius: 30,
    // botop
    borderRightColor: '#9e005d',
  },
  loadingActivityCover: {
    width: '100%',
    marginTop: 30,
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverNot: {
    flexDirection: 'row',
    marginBottom: 10,
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
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
    zIndex: 220,
  },

  activiityCover: {
    width: '80%',
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // justifyContent: 'center',
    alignItems: 'center',
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
  pleaseRetry: {
    color: '#0a171e',
    textAlign: 'center',
  },
  eachBtnCover: {
    backgroundColor: '#efefef',
    paddingHorizontal: 25,
    borderRadius: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
