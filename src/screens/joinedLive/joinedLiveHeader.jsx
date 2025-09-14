import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ebere from '../../assets/ebere.webp';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import {MainContext} from '../../../App';

const JoinedLiveHeader = ({showBottomStm, navigation}) => {
  // const navigation = useNavigation();
  const route = useRoute();
  const {photo, full_name, _id, username, active, status} = route.params;
  const [isJoining, setIsJoining] = useState(false);
  const [isUserCaring, setIsUserCaring] = useState(true);
  const CTX = useContext(MainContext);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        // translateY: withSequence(withTiming(85), withDelay(100, withTiming(0))),
        translateY: -showBottomStm
          ? withSequence(withTiming(0), withDelay(100, withTiming(-85)))
          : withSequence(withTiming(0), withDelay(100, withTiming(0))),
      },
    ],
  }));

  const careUserHandler = async () => {
    let URLHere = `${CTX.systemConfig?.p}user/profile/care/${_id}`;
    // care Here
    // console.log('care Here ==>> ', URLHere);
    try {
      const fetching = await fetch(URLHere, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
      });
      const parsedJson = await fetching.json();

      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }

      setIsUserCaring(true);
      // console.log('error from careHandler => ', parsedJson);
      // resetUpperArr(parsedJson.data);
    } catch (error) {
      // setLoading(false);
      console.log('error from careHandler => ', error);
      // setErrMsg('Network request failed');
      // setShowMsg(true);
    }
  };


  const getIfAlreadyCaring = async () => {
    let URLHere = `${CTX.systemConfig?.p}user/profile/care/${_id}`;
    // care Here
    // console.log('care Here ==>> ', URLHere);
    try {
      const fetching = await fetch(URLHere, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
      });
      const parsedJson = await fetching.json();

      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }

      setIsUserCaring(parsedJson?.data?.isUserCaring);
      // resetUpperArr(parsedJson.data);
    } catch (error) {
      // setLoading(false);
      console.log('error from careHandler => ', error);
      // setErrMsg('Network request failed');
      // setShowMsg(true);
    }
  }

  useEffect(() => {
    getIfAlreadyCaring()

    return () => {
      setIsUserCaring(true) 
    }
  },[])

  return (
    <Animated.View style={[styles.headShown, animatedStyles]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.backTouchableOpacity}
        onPress={() => navigation.goBack()}>
        <SimpleLineIcons size={20} name="arrow-left" color={'#fff'} />
      </TouchableOpacity>
      {/* <TouchableOpacity
        activeOpacity={0.8}
        onPress={
          () =>
            // console.log('{photo, full_name, _id, username} ==>> ', {
            //   photo,
            //   full_name,
            //   _id,
            //   username,
            // })
          navigation.navigate('ChatMenu', {
            header: {photo, full_name, _id, username},
          })
        }
        style={styles.dateText}>
        <Entypo
          name="dots-three-horizontal"
          color={'#fff'}
          style={{
            paddingHorizontal: 5,
            alignSelf: 'flex-end',
            marginLeft: 13,
            marginBottom: 9,
          }}
          size={20}
        />
      </TouchableOpacity> */}
      <View style={styles.coverNot}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (status?.length > 0) {
              navigation.navigate('StatusMenu', {
                _id: _id,
              });
            }
          }}
          style={{
            ...styles.coverStatusRound,
            borderWidth: status?.length > 0 ? 1 : 0,
          }}>
          <Image
            source={{
              uri: photo
                ? photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={styles.eachImg}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.username}>{full_name}</Text>
          <View style={{flexDirection: 'row'}}>
            {active && (
              <Text
                style={{...styles.username, fontSize: 14, color: '#cbd0d5'}}>
                Online
              </Text>
            )}
          </View>
        </View>

        {!isUserCaring && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={careUserHandler}
            style={styles.startCallHere}>
            {isJoining ? (
              <ActivityIndicator color={'#fff'} size={20} />
            ) : (
              <>
                <View style={{width: 36, height: 36, marginTop: 13}}>
                  <Image
                    source={Ebere}
                    style={{width: 24, height: 24}}
                    resizeMode="cover"
                  />
                </View>

                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  Care
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default JoinedLiveHeader;

const styles = StyleSheet.create({
  startCallHere: {
    // backgroundColor: '#00000099',
    width: 90,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    height: 35,
    borderRadius: 18,
    backgroundColor: '#e20154',
    // marginTop: 55,
  },
  headShown: {
    paddingTop: 4,
    borderBottomWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 20,
    position: 'absolute',
    alignItems: 'center',
    // marginBottom: 30,
    backgroundColor: '#0a171e',
    borderBottomColor: '#7c90b0',
  },
  backTouchableOpacity: {
    paddingLeft: 4,
    paddingRight: 30,
  },
  dateText: {
    position: 'absolute',
    top: 22,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  coverNot: {
    flexDirection: 'row',
    marginBottom: 10,
    position: 'relative',
    alignItems: 'center',
    width: '80%',
  },
  eachImg: {
    width: 48,
    height: 48,
    borderRadius: 50,
  },
  username: {
    color: '#fcfeff',
    fontWeight: '400',
    fontSize: 18,
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
  },
});
