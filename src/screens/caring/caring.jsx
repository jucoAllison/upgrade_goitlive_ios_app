import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {
  memo,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SortBy from './sortBy';
import {MainContext} from '../../../App';
const Search = React.lazy(() => import('./search'));
const CaredCom = React.lazy(() => import('../../components/careScreen/caring'));
const Cared = ({toggle, route}) => {
  const CTX = useContext(MainContext);
  const [caring, setCaring] = useState([]);
  const [caringPage, setCaringPage] = useState(1);
  const [hasMoreCaring, setHasMoreCaring] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(true);

  // const [showAbsolute, setShowAbsolute] = useState(false);
  // const bottomSheetModalRef = useRef(null);
  // // const snapPoints = useMemo(() => ['45%', '45%'], []);
  // const snapPoints = useMemo(() => [350, 350], []);

  // const showBottomSheetHandler = useCallback(() => {
  //   setShowAbsolute(true);
  //   bottomSheetModalRef.current?.present();
  // }, []);

  // const closeModalPress = useCallback(() => {
  //   setShowAbsolute(false);
  //   bottomSheetModalRef.current?.dismiss();
  // }, []);

  const getCaring = async () => {
    if (!hasMoreCaring || loading)
      return console.log('toggle && !hasMoreCaring'); // Prevent fetching if there are no more items or already fetching
    // if (toggle && !hasMoreCared) return console.log('toggle && !hasMoreCared'); // Prevent fetching if there are no more items or already fetching
    // if (!toggle && !)
    //   return console.log('!toggle && !hasMoreCaring'); // Prevent fetching if there are no more items or already fetching

    setLoading(true);
    setShowMsg(false);
    setErrMsg('');
    try {
      let urlHere = `${CTX.systemConfig?.p}user/profile/get/cared/${route?.params?._id}/${caringPage}/90`;

      const fetching = await fetch(
        urlHere, // we get three fetching here as
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

      if (response.error) {
        setLoading(false);
        setErrMsg(response?.msg);
        setShowMsg(true);
        return;
      }

      let spreading = [...caring, ...response?.data?.data];
      setCaring(spreading);
      setHasMoreCaring(response?.data?.hasMore);
      setCaringPage(prevPage => prevPage + 1);
      setLoading(false);
      setShowMsg(false);
      setErrMsg('');
    } catch (error) {
      setLoading(false);
      console.log('error from uploadVideoToServer ==>> ', error);
      setErrMsg('Error happened, click to retry');
      setShowMsg(true);
    }
  };

  const reGetHere = () => {
    setHasMoreCaring(true);
    setTimeout(() => {
      getCaring();
    }, 200);
  };

  useEffect(() => {
    if (toggle) {
      getCaring();
    }

    return () => {
      setHasMoreCaring(true);
    };
    // Your logic here when the screen is focused (e.g., console.log, state update)
  }, [toggle, route?.params]);

  return (
    <>
      {/* <Pressable
        onPress={closeModalPress}
        style={{
          ...styles.showAbsolute,
          display: showAbsolute ? 'flex' : 'none',
        }}>
        <BottomSheetModalProvider
        // onChange={handleSheetChanges}
        >
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            enablePanDownToClose={true}
            snapPoints={snapPoints}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{...styles.reactionText, color: '#fff'}}>
                  Sort by
                </Text>

                <TouchableOpacity activeOpacity={0.8}
                  onPress={closeModalPress}
                  style={styles.closeLine}>
                  <Ionicons color={'#838289'} name="close" size={23} />
                </TouchableOpacity>
              </View>
            )}>
            <Pressable
              style={{flex: 1}}
              onPress={() => {
                return null;
              }}>
              <SortBy />
            </Pressable>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </Pressable> */}

      {loading ? (
        <ActivityIndicator
          size={24}
          color={'#262626'}
          style={{marginTop: 100}}
        />
      ) : (
        <View style={{padding: 20}}>
          {showMsg ? (
            <TouchableOpacity activeOpacity={0.8}
              onPress={reGetHere}
              style={{marginTop: 60, ...styles.activiityCover}}>
              <FontAwesome5 size={40} color="#262626" name="holly-berry" />
              <Text style={styles.pleaseRetry}>
                {errMsg || 'Error happened, click to retry'}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {caring.length < 1 ? (
                <TouchableOpacity activeOpacity={0.8}
                  style={{marginTop: 60, ...styles.activiityCover}}>
                  <FontAwesome5 size={40} color="#262626" name="holly-berry" />
                  <Text style={styles.pleaseRetry}>No record found</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <Suspense
                    fallback={
                      <View style={styles.activityCover}>
                        <ActivityIndicator color={'#0a171e'} size={40} />
                      </View>
                    }>
                    <Search
                      searchType={'carer'}
                      lookup={'caring'}
                      setParent={setCaring}
                      userID={route?.params?._id}
                      setErrMsg={setErrMsg}
                      setShowMsg={setShowMsg}
                      reGetHere={reGetHere}
                    />
                  </Suspense>

                  {/* <View style={styles.sortedByDefault}>
              <Text style={{...styles.sortTxt, color: '#3b3b3b'}}>
                Sorted by{' '}
              </Text>
              <Text style={{...styles.sortTxt, color: '#262626'}}>Default</Text>
              <TouchableOpacity activeOpacity={0.8}
                onPress={showBottomSheetHandler}
                style={{marginLeft: 'auto'}}>
                <FontAwesome5
                  name="expand-arrows-alt"
                  color={'#262626'}
                  size={22}
                />
              </TouchableOpacity>
            </View> */}

                  <View style={{paddingVertical: 20}}>
                    <FlatList
                      data={caring}
                      renderItem={({item}) => (
                        <Suspense
                          fallback={
                            <View style={styles.activityCover}>
                              <ActivityIndicator color={'#0a171e'} size={40} />
                            </View>
                          }>
                          <CaredCom data={item} route={route} />
                        </Suspense>
                      )}
                    />
                  </View>
                </>
              )}
            </>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  coverSearchHere: {
    backgroundColor: '#efefef',
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 45,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  sortedByDefault: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    marginTop: 20,
  },
  innerTextInput: {
    color: '#262626',
    marginLeft: 10,
    width: '100%',
  },
  showAbsolute: {
    position: 'absolute',
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
    backgroundColor: '#9e005d',
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
  // activiityCover: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginTop: 80,
  // },
  pleaseRetry: {
    marginTop: 20,
    color: '#262626',
    textAlign: 'center',
  },
  coverScrollView: {
    height: '100%',
  },
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

  // pleaseRetry: {
  //   color: '#0a171e',
  //   textAlign: 'center',
  // },
});

export default memo(Cared);
