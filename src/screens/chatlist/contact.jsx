import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';
import {getCurrencies, getLocales} from 'react-native-localize';
import {MainContext} from '../../../App';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {useWebSocket} from '../../../WebSocketContext';
import {useNavigation} from '@react-navigation/native';

const Contact = ({setErrMsg, setShowMsg}) => {
  const CTX = useContext(MainContext);
  const [contactPermission, setContactPermission] = useState('second');
  const {latestMessage, connectionStatus} = useWebSocket();
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mainData, setMainData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (latestMessage) {
      setProfileDetails(latestMessage);
    }
  }, [latestMessage]);

  // function normalizeNumber(rawNumber) {
  //   const phoneNumber = parsePhoneNumberFromString(
  //     rawNumber,
  //     profileDetails?.country_obj?.country_code?.toUpperCase() || 'NG',
  //     //    'US',
  //   ); // fallback region

  //   console.log(phoneNumber.isValid());
  //   if (phoneNumber.isValid()) {
  //     return phoneNumber ? phoneNumber.number : null; // E.164 format
  //   }
  // }

  const checkphones = async () => {
    try {
      const all_contacts = await Contacts.getAll();

      const contactsToSend = all_contacts
        .flatMap(c =>
          c.phoneNumbers.map(p => {
            const phoneNumber = parsePhoneNumberFromString(
              p.number,
              profileDetails?.country_obj?.country_code?.toUpperCase() || 'NG',
            );

            if (phoneNumber && phoneNumber.isValid()) {
              return {
                name: c.givenName + (c.familyName ? ` ${c.familyName}` : ''),
                number: phoneNumber.number, // E.164 format
              };
            }
            return null;
          }),
        )
        .filter(Boolean);

      // console.log('contactsToSend =>> ', contactsToSend);
      sendTOserver(contactsToSend);
    } catch (error) {}
  };

  const checkAllow = async () => {
    const permission = await Contacts.checkPermission(); // 'authorized', 'denied', 'undefined'
    setContactPermission(permission);
    // console.log('permission =?>.> ', permission);

    if (permission == 'authorized') {
      checkphones();
      return;
    }
  };

  async function sendTOserver(contact) {
    // console.log('contact => >> ', contact);

    if (loading) return;
    setLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}user/chat/get/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
        body: JSON.stringify({
          contacts: contact,
        }),
      });
      const parsedJson = await fetching.json();

      // console.log('parsedJson =>>>', parsedJson);

      setLoading(false);
      if (parsedJson?.e) {
        setLoading(false);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }

      setErrMsg('');
      setShowMsg(false);
      setMainData(parsedJson.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  }

  const allowHere = async () => {
    try {
      if (contactPermission == 'denied') {
        Alert.alert(
          'Permission Required',
          'We need access to your contacts. Please enable it in settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => {
                try {
                  console.log('ok pressed');

                  Linking.openSettings(); // Opens the app's settings page
                } catch (error) {
                  console.log('error =>> ', error);
                }
              },
            },
          ],
          {cancelable: true}, // Android only
        );
      } else {
        // Will trigger system popup
        const newPermission = await Contacts.requestPermission();
        console.log('New permission:', newPermission);
        checkphones();
      }
    } catch (error) {
      console.log('error from allowHere =>>> ', error);
    }
  };

  // for andriod
  async function requestContactsPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message:
            'This app needs access to your contacts to show who’s using it.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted');
        // Now you can call Contacts.getAll()
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Denied',
          'Please go to settings and enable contacts permission manually.',
        );
      } else {
        console.log('Permission denied');
      }
    }
  }

  useEffect(() => {
    checkAllow();
  }, []);

  const onPressHandler = filtered => {
    navigation.navigate('MainChat', {
      ...filtered,
      isChat: false
    });
  };

  // console.log("profileDetails =>>> ", profileDetails);
  

  const registeredMapp = mainData?.registered?.filter(v => v?.phone != profileDetails?.phone)?.map((v, i) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressHandler(v)}
        style={{
          ...styles.coverNot,
        }}
        key={i}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (v?.status?.length > 0) {
              navigation.navigate('StatusMenu', {
                _id: v._id,
              });
            }
          }}
          style={{
            ...styles.coverStatusRound,
            // borderWidth: filtered?.status?.length > 0 ? 1 : 0,
            borderWidth: 1,
          }}>
          <Image
            source={{
              uri: v?.photo
                ? v?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={styles.eachImg}
          />
          {v?.active && <View style={styles.isActive}></View>}
        </TouchableOpacity>

        <View>
          <Text
            style={{
              ...styles.username,
              fontSize: 14,
              color: CTX.isDarkMode ? '#fff' : '#000',
            }}>
            {v?.full_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 3,
            }}>
            <Text
              style={{
                ...styles.username,
                fontSize: 12,
                fontFamily: 'Gilroy-Medium',
                color: CTX.isDarkMode ? '#cbd0d5' : '#8a8a8a',
              }}>
              @{v?.username}
            </Text>
          </View>
        </View>
        {/* <Text style={styles.dateText}>{v?.messages[0].createdAt}</Text>
        {!isBlockVisible ? (
          <>
            {v?.unreadCount > 0 ? (
              <View
                style={{
                  ...styles.dateText,
                  backgroundColor: '#e20154',
                  borderRadius: 190,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 17,
                  height: 17,
                }}>
                <Text
                  style={{
                    paddingTop: 2,
                    fontFamily: 'Gilroy-Black',
                    color: '#fff',
                    fontSize: 10,
                  }}>
                  {v?.unreadCount}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  ...styles.dateText,
                  fontSize: 12,
                  color: CTX.isDarkMode ? '#fff' : '#000',
                }}>
                {moment(v?.messages?.createdAt).format('LT')}
              </Text>
            )}
          </>
        ) : (
          <View style={styles.rightFeatherHere}>
            {selectedArr.some(f => f._id?.toString() == v._id?.toString()) ? (
              <Ionicons color="#fff" name="checkbox" size={18} />
            ) : (
              <Feather color="#fff" name="square" size={18} />
            )}
          </View>
        )} */}
      </TouchableOpacity>
    );
  });

  const inviteFriend = phone => {
    const message =
      "🚀 Join me on GoItLive – the new way to stream, connect & earn! Download now 👉 https://goitlive.com";
    let url = '';

    if (Platform.OS === 'android') {
      url = `sms:${phone}?body=${encodeURIComponent(message)}`;
    } else {
      // iOS uses & instead of ?
      url = `sms:${phone}&body=${encodeURIComponent(message)}`;
    }

    Linking.openURL(url).catch(err => console.error('Error opening SMS:', err));
  };

  const unRegisteredMapp = mainData?.unregistered?.map((v, i) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          ...styles.coverNot,
        }}
        key={i}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (v?.status?.length > 0) {
              navigation.navigate('StatusMenu', {
                _id: v._id,
              });
            }
          }}
          style={{
            ...styles.coverStatusRound,
            // borderWidth: filtered?.status?.length > 0 ? 1 : 0,
            borderWidth: 1,
          }}>
          <Image
            source={{
              uri: 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={styles.eachImg}
          />
          {v?.active && <View style={styles.isActive}></View>}
        </TouchableOpacity>

        <View>
          <Text
            style={{
              ...styles.username,
              fontSize: 14,
              color: CTX.isDarkMode ? '#fff' : '#000',
            }}>
            {v?.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 3,
            }}>
            <Text
              style={{
                ...styles.username,
                fontSize: 12,
                fontFamily: 'Gilroy-Medium',
                color: CTX.isDarkMode ? '#cbd0d5' : '#8a8a8a',
              }}>
              {v?.number}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => inviteFriend(v?.number)}
          style={{marginLeft: 'auto'}}>
          <Text style={{color: '#e20154', fontFamily: 'Gilroy-Bold'}}>
            Invite
          </Text>
        </TouchableOpacity>
        {/* <Text style={styles.dateText}>{v?.messages[0].createdAt}</Text>
        {!isBlockVisible ? (
          <>
            {v?.unreadCount > 0 ? (
              <View
                style={{
                  ...styles.dateText,
                  backgroundColor: '#e20154',
                  borderRadius: 190,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 17,
                  height: 17,
                }}>
                <Text
                  style={{
                    paddingTop: 2,
                    fontFamily: 'Gilroy-Black',
                    color: '#fff',
                    fontSize: 10,
                  }}>
                  {v?.unreadCount}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  ...styles.dateText,
                  fontSize: 12,
                  color: CTX.isDarkMode ? '#fff' : '#000',
                }}>
                {moment(v?.messages?.createdAt).format('LT')}
              </Text>
            )}
          </>
        ) : (
          <View style={styles.rightFeatherHere}>
            {selectedArr.some(f => f._id?.toString() == v._id?.toString()) ? (
              <Ionicons color="#fff" name="checkbox" size={18} />
            ) : (
              <Feather color="#fff" name="square" size={18} />
            )}
          </View>
        )} */}
      </TouchableOpacity>
    );
  });

  return (
    <>
      {loading ? (
        <View
          style={{
            width: '100%',
            height: 300,
            // backgroundColor: "red",
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            size={26}
            color={CTX.isDarkMode ? '#fff' : '#000'}
          />
        </View>
      ) : mainData ? (
        <>
          {registeredMapp?.length > 0 && (
            <View style={{marginTop: 26, width: '100%'}}>
              <Text
                style={{
                  ...styles.username,
                  fontSize: 13.4,
                  color: CTX.isDarkMode ? '#fff' : '#000',
                  marginTop: 24,
                  marginBottom: 14,
                }}>
                Contacts on GoitLive
              </Text>

              {registeredMapp}
            </View>
          )}
          {unRegisteredMapp?.length > 0 && (
            <View style={{marginTop: registeredMapp?.length > 0 ? 0 : 26, width: '100%'}}>
              <Text
                style={{
                  ...styles.username,
                  fontSize: 13.4,
                  color: CTX.isDarkMode ? '#fff' : '#000',
                  marginTop: 14,
                  marginBottom: 14,
                }}>
                Invite to GoitLive
              </Text>
              {unRegisteredMapp}
            </View>
          )}
        </>
      ) : (
        <>
          {contactPermission !== 'authorized' && (
            <View>
              <Text
                style={{
                  ...styles.username,
                  color: CTX.isDarkMode ? '#fff' : '#000',
                  marginTop: 44,
                }}>
                Permission
              </Text>
              <Text
                style={{
                  ...styles.username,
                  fontFamily: 'Gilroy-Medium',
                  marginTop: 17,
                  fontSize: 15,
                  color: CTX.isDarkMode ? '#aaa' : '#333',
                }}>
                Allow access to your contacts so you can see which of your
                friends are already using GoitLive. This helps you connect with
                them easily and stay in touch!
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => allowHere()}
                style={{paddingTop: 40, width: '100%'}}>
                <View style={styles.eachBtnCover}>
                  <Text style={styles.eachBtnText}>Allow</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default Contact;

const styles = StyleSheet.create({
  eachImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },

  dateText: {
    position: 'absolute',
    top: 8,
    fontFamily: 'Gilroy-Regular',
    right: 6,
    color: '#9f9f9f',
  },

  coverStatusRound: {
    marginRight: 13,
    padding: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#e20154',
    borderBottomEndRadius: 30,
    borderRightColor: '#e20154',
  },
  coverNot: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 4,
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    marginTop: 2,
  },
  eachBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  eachBtnCover: {
    backgroundColor: '#e20154',
    paddingHorizontal: 20,
    borderRadius: 60,
    height: 47,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  username: {
    fontSize: 26,
    fontFamily: 'Gilroy-Bold',
  },
});
