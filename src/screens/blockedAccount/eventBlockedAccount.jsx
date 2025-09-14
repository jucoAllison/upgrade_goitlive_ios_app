import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {MainContext} from '../../../App';
import Fallback from '../../components/fallback/fallback';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BlockedAccount = React.lazy(() => import('./blockedAccount'));
const EventBlockedAccount = () => {
  const CTX = useContext(MainContext);
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [mainData, setMainData] = useState([]);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const mapLoading = Array(7)
    .fill('sds')
    .map((v, i) => {
      return (
        <View style={styles.coverNot} key={i}>
          <View
            style={{
              ...styles.loadingImg,
              backgroundColor: '#efefef',
              width: 44,
              height: 44,
            }}></View>

          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  marginBottom: 3,
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: '#efefef',
                  width: 95,
                  height: 15,
                }}></View>
            </View>

            <View
              style={{
                backgroundColor: '#efefef',
                width: 75,
                height: 12,
              }}></View>
          </View>

          <View
            style={{
              marginLeft: 'auto',
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: '#efefef',
              width: 30,
              height: 30,
            }}></View>
        </View>
      );
    });
  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const getBlockedHere = async () => {
    setShowMsg(false);
    setLoading(true);

    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/get/blocked/${CTX?.userObj?._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setLoading(false);
      setMainData(parsedJson?.data);
      console.log('parsedJson?.data =>>> ', parsedJson?.data);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for session! => ', error);
      createThreeButtonAlert('Network request failed');
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
      getBlockedHere();
    }
  }, [isFocused]);

  return (
    <>
      {loading ? (
        <View style={{backgroundColor: '#fff', padding: 20, flex: 1}}>
          {mapLoading}
        </View>
      ) : showMsg ? (
        <>
          <View style={{...styles.activityCover}}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{alignItems: 'center'}}
              onPress={() => getBlockedHere()}>
              <FontAwesome5 size={40} color="#000" name="holly-berry" />
              <Text style={{...styles.pleaseRetry, marginTop: 10}}>
                {errMsg || 'Error happened'}
              </Text>
              <Text style={{...styles.pleaseRetry}}>Tap to retry</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Suspense fallback={<Fallback />}>
          <BlockedAccount
            CTX={CTX}
            mainData={mainData}
            getMembersHere={getBlockedHere}
            navigation={navigation}
          />
        </Suspense>
      )}
    </>
  );
};

export default EventBlockedAccount;

const styles = StyleSheet.create({
  coverNot: {
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: 2,
    alignItems: 'center',
  },
  eachImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  username: {
    color: '#3b3b3b',
    fontWeight: 'bold',
    fontFamily: 'Overpass-Regular',
    fontSize: 18,
  },
  isActive: {
    width: 13,
    height: 13,
    backgroundColor: '#3cca0b',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    position: 'absolute',
    top: 7,
    left: -4,
    zIndex: 10,
  },
  coverStatusRound: {
    marginRight: 8,
    padding: 1,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#9e005d98',
    borderBottomEndRadius: 30,
    borderRightColor: '#9e005d',
  },
  loadingImg: {
    width: 42,
    height: 42,
    overflow: 'hidden',
    borderRadius: 50,
    borderBottomEndRadius: 20,
    marginRight: 10,
  },
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pleaseRetry: {
    color: '#000',
    fontFamily: 'Overpass-Regular',
    textAlign: 'center',
  },
});
