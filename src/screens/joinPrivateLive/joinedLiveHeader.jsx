import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import Lottie from 'lottie-react-native';

import Ebere from '../../assets/ebere.webp';
import { MainContext } from '../../../App';
import cryingEyes from '../../assets/json/Crying_emoji.json';
const JoinedLiveHeader = ({ showBottomStm, item }) => {
  const navigation = useNavigation();
  const { photo, full_name, _id, username, verify, status } = item;
  const [isJoining, setIsJoining] = useState(false);
  const [isUserCaring, setIsUserCaring] = useState(false);
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
    if (isJoining) return;
    setIsJoining(true);
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}account/user/profile/toggle/care/${_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      setIsJoining(false);

      setIsUserCaring(true);
      // console.log('error from careHandler => ', parsedJson);
      // resetUpperArr(parsedJson.data);
    } catch (error) {
      setIsJoining(false);
      // setLoading(false);
      console.log('error from careHandler at top => ', error);
      // setErrMsg('Network request failed');
      // setShowMsg(true);
    }
  };

  return (
    <Animated.View style={[styles.headShown, animatedStyles]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.backTouchableOpacity}
        onPress={() => navigation.goBack()}
      >
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
            // borderWidth: status?.length > 0 ? 1 : 0,
          }}
        >
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                ...styles.username,
                fontSize: 14,
                color: '#cbd0d5',
                marginTop: 3,
                fontFamily: 'Gilroy-Bold',
              }}
            >
              @{username}
            </Text>
            {verify && (
              <MaterialIcons
                style={{ marginLeft: 5 }}
                name="verified"
                color="#91ff91"
                size={17}
              />
            )}
          </View>
        </View>

        {!isUserCaring && (
          <>
            {!item?.is_user_caring && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={careUserHandler}
                // onPress={() => {
                //   console.warn('clicked');
                //   console.log('clicked');
                // }}
                style={styles.startCallHere}
              >
                {isJoining ? (
                  <ActivityIndicator color={'#fff'} size={20} />
                ) : (
                  <>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lottie
                        source={cryingEyes}
                        autoPlay
                        loop
                        style={{ width: 29, height: 29 }}
                      />
                    </View>

                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Gilroy-Bold',
                      }}
                    >
                      Care
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </Animated.View>
  );
};

export default JoinedLiveHeader;

const styles = StyleSheet.create({
  startCallHere: {
    // backgroundColor: '#00000099',
    width: 89,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 20,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#e20154',
  },
  headShown: {
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 20,
    position: 'absolute',
    // alignItems: 'center',
    marginTop: 53,
  },
  backTouchableOpacity: {
    // paddingLeft: 4,
    // backgroundColor: "red",
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    // paddingRight: 20,
    width: 40,
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
    position: 'relative',
    alignItems: 'center',
    width: Dimensions.get('window').width - 40,
  },
  eachImg: {
    width: 44,
    height: 44,
    borderRadius: 50,
  },
  username: {
    color: '#fcfeff',
    fontWeight: '400',
    fontFamily: 'Gilroy-Regular',
    fontSize: 18,
  },

  coverStatusRound: {
    marginRight: 8,
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
