import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {MainContext} from '../../../App';

const EachChatHeader = ({
  reSetDataDetails,
  selectedArr,
  chatId,
  setSelectedArr,
  deleteMSGhandler,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {photo, full_name, _id, username, active, status, verify} =
    route.params;
  const CTX = useContext(MainContext);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const setMessageHere = async () => {
    // console.log('parsedJson?.data?.data HERE!! =>> ', selectedArr);
    if (loading) {
      return null;
    }
    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.url}user/chat/message/delete-selected`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({
            selectedArr,
            chatId: chatId,
          }),
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);
      // if (parsedJson?.isRemoved) {
      //   return CTX.logoutUser();
      // }
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setSelectedArr([]);
      reSetDataDetails(parsedJson?.data);
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    } catch (error) {
      setLoading(false);
      console.log('error creating first messages => ', error);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  const video_audio_handler = () => {
    Alert.alert('GoitLive', 'Coming soon to GoitLive.', [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);
  };

  return (
    <>
      <View style={styles.headShown}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backTouchableOpacity}
          onPress={() => navigation.goBack()}>
          <SimpleLineIcons
            size={20}
            name="arrow-left"
            color={CTX.isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        {selectedArr.length > 0 ? (
          <>
            {loading ? (
              <View style={styles.dateText}>
                <ActivityIndicator
                  color={CTX.isDarkMode ? '#fff' : '#000'}
                  size={20}
                />
              </View>
            ) : (
              <View style={styles.dateText}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={deleteMSGhandler}>
                  <MaterialIcons
                    name="delete"
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                    style={{
                      paddingHorizontal: 5,
                      alignSelf: 'flex-end',
                      marginLeft: 13,
                      marginBottom: 9,
                    }}
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedArr([])}>
                  <AntDesign
                    name="closecircle"
                    color={CTX?.isDarkMode ? '#fff' : '#000'}
                    style={{
                      paddingHorizontal: 5,
                      alignSelf: 'flex-end',
                      marginLeft: 13,
                      marginBottom: 9,
                    }}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <></>
          // <TouchableOpacity
          //   activeOpacity={0.8}
          //   onPress={() =>
          //     navigation.navigate('ChatMenu', {
          //       header: {photo, full_name, _id, username},
          //       group_id: _id,
          //       chatId,
          //     })
          //   }
          //   style={styles.dateText}>
          //   <Entypo
          //     name="dots-three-horizontal"
          //     color={'#fff'}
          //     style={{
          //       paddingHorizontal: 5,
          //       alignSelf: 'flex-end',
          //       marginLeft: 13,
          //       marginBottom: 9,
          //     }}
          //     size={20}
          //   />
          // </TouchableOpacity>
        )}
        <View style={styles.coverNot}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (status?.length > 0) {
                navigation.navigate('StatusMenu', {
                  _id: _id,
                });
                return;
              }
              navigation.navigate('HELLO_WORLD', {
                ...route.params,
              });
            }}
            style={{
              ...styles.coverStatusRound,
              // borderWidth: status?.length > 0 ? 1 : 0,
              borderWidth: 1,
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

          {selectedArr.length < 1 && (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                position: 'relative',
              }}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    onPress={() => {
                      navigation.navigate('HELLO_WORLD', {
                        ...route.params,
                      });
                    }}
                    style={{
                      ...styles.username,
                      color: CTX.isDarkMode ? '#fcfeff' : '#0e0e0e',
                    }}>
                    {full_name}
                  </Text>
                  {verify && (
                    <MaterialIcons
                      style={{marginLeft: 5}}
                      name="verified"
                      color="#91ff91"
                      size={16}
                    />
                  )}
                </View>
                <View style={{flexDirection: 'row', marginTop: 3}}>
                  {CTX.typing?.some(w => w.chat_id == CTX?.chatDetails?._id) ? (
                    <Text
                      onPress={() => {
                        navigation.navigate('HELLO_WORLD', {
                          ...route.params,
                        });
                      }}
                      style={{
                        ...styles.username,
                        fontSize: 12,
                        color: CTX.isDarkMode ? '#fcfeff' : '#0e0e0e',
                        // color: '#cbd0d5',
                        fontFamily: 'Gilroy-Regular',
                      }}>
                      Typing . . .
                    </Text>
                  ) : active ? (
                    <Text
                      onPress={() => {
                        navigation.navigate('HELLO_WORLD', {
                          ...route.params,
                        });
                      }}
                      style={{
                        ...styles.username,
                        fontSize: 12,
                        color: CTX.isDarkMode ? '#fcfeff' : '#0e0e0e',
                        // color: '#cbd0d5',
                        fontFamily: 'Gilroy-Regular',
                      }}>
                      Online
                    </Text>
                  ) : null}
                </View>
              </View>

              <View
                style={{
                  backgroundColor: CTX.isDarkMode ? '#202d3489' : '#efefef',
                  width: 78.2,
                  height: 35,
                  position: 'absolute',
                  top: -5,
                  right: 30,
                  borderRadius: 11,
                  marginLeft: 'auto',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={video_audio_handler}>
                  <Feather
                    name="phone"
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                    size={21}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: CTX.isDarkMode ? '#fff' : '#000',
                    fontFamily: 'Gilroy-Medium',
                    fontSize: 20,
                  }}>
                  |
                </Text>
                <TouchableOpacity onPress={video_audio_handler}>
                  <Feather
                    name="video"
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                    size={21}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default EachChatHeader;

const styles = StyleSheet.create({
  headShown: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 17,
    width: '100%',
    alignItems: 'center',
    // backgroundColor: "red",
    borderBottomColor: '#7c90b0',
  },
  backTouchableOpacity: {
    paddingLeft: 4,
    paddingRight: 17.9,
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
    // marginTop: 20,
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
