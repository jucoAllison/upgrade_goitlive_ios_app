import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, {memo, Suspense, useContext, useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {MainContext} from '../../../App';
const Search = React.lazy(() => import('./search'));
const CaredCom = React.lazy(() => import('../../components/careScreen/cared'));
const Cared = ({toggle, route}) => {
  const CTX = useContext(MainContext);
  const [cared, setCared] = useState([]);
  const [caredPage, setCaredPage] = useState(1);
  const [hasMoreCared, setHasMoreCared] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  // console.log('response  from cared  ==>>> ', cared);

  const getCared = async () => {
    if (!hasMoreCared || loading) return console.log('toggle && !hasMoreCared'); // Prevent fetching if there are no more items or already fetching
    // if (!toggle && !hasMoreCaring)
    //   return console.log('!toggle && !hasMoreCaring'); // Prevent fetching if there are no more items or already fetching

    setLoading(true);
    setShowMsg(false);
    setErrMsg('');
    try {
      let urlHere = `${CTX.systemConfig?.p}user/profile/get/caring/${route?.params?._id}/${caredPage}/90`;

      // console.log('route?.params?._id ==>> ', route?.params?._id);
      // console.log('urlHere ==>> ', urlHere);
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
      let spreading = [...cared, ...response?.data?.data];
      setCared(spreading);
      setHasMoreCared(response?.data?.hasMore);
      setCaredPage(prevPage => prevPage + 1);
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
    setHasMoreCared(true);
    setTimeout(() => {
      getCared();
    }, 200);
  };

  useEffect(() => {
    if (!toggle) {
      getCared();
    }
    return () => {
      setHasMoreCared(true);
    };
    // Your logic here when the screen is focused (e.g., console.log, state update)
  }, [toggle, route?.params]);

  return (
    <View style={{padding: 20}}>
      {loading ? (
        <ActivityIndicator
          size={24}
          color={'#262626'}
          style={{marginTop: 100}}
        />
      ) : (
        <>
          {showMsg ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={reGetHere}
              style={{marginTop: 60, ...styles.activiityCover}}>
              <FontAwesome5 size={40} color="#262626" name="holly-berry" />
              <Text style={styles.pleaseRetry}>
                {errMsg || 'Error happened, click to retry'}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {cared.length < 1 ? (
                <TouchableOpacity
                  activeOpacity={0.8}
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
                      searchType={'caring'}
                      lookup={'carer'}
                      setParent={setCared}
                      userID={route?.params?._id}
                      setErrMsg={setErrMsg}
                      setShowMsg={setShowMsg}
                      reGetHere={reGetHere}
                    />
                  </Suspense>

                  <View style={{paddingVertical: 20}}>
                    <FlatList
                      data={cared}
                      renderItem={({item}) => (
                        <Suspense
                          fallback={
                            <View style={styles.activityCover}>
                              <ActivityIndicator color={'#0a171e'} size={40} />
                            </View>
                          }>
                          <CaredCom data={item} />
                        </Suspense>
                      )}
                    />
                  </View>
                </>
              )}
            </>
          )}
        </>
      )}
    </View>
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
    flexDirection: 'row',
  },
  sortTxt: {
    color: '#9f9f9f',
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
  },
  showAbsolute: {
    position: 'absolute',
    backgroundColor: '#e010b400',
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
});

export default memo(Cared);
