import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DeviceInfo from 'react-native-device-info';

//   import ErrMessage from '../../components/errMessage/errMessage';
import { MainContext } from '../../../App';
import Button from '../../components/button';
import { useNavigation } from '@react-navigation/native';
import { useWebSocket } from '../../../WebSocketContext';
const LastLogin = ({isSession}) => {
  const CTX = useContext(MainContext);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [sesssions, setSesssions] = useState([]);
  const [topIndex, setIndex] = useState(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [item, setItem] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [backup, setBackup] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const navigation = useNavigation();
  const { sendMessage } = useWebSocket();

  // useEffect(() => {
  //   setIndex(null)
  // }, [])

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  //  getSessions
  const getMySessions = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}account/profile/user/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
      });
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setSesssions(parsedJson.data);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  const abce = async () => {
    const rerte = await DeviceInfo.getDeviceName();
    // console.log('rerte =>> ', rerte);
    setDeviceName(rerte);
    getMySessions();
  };
  useEffect(() => {
    abce();
  }, [isSession]);

  const showMainDeleteHandler = (index, item) => {
    console.log("index, item =>>> ", index, item);
    
    setIndex(index);
    setIsModalDelete(true);
    setItem(item);
  };

  const deleteSessionHandler = async id => {
    if (backup.trim().length < 7) {
      return;
    }
    setLoadingDelete(true);
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/user/session/${id}/${backup.trim()}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();

      setLoadingDelete(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setIsModalDelete(false);
      setSesssions(parsedJson.data);
      sendMessage({
        action: 'rebringuserdetails',
        token: CTX.sessionToken,
      });
      // getMySessions();
    } catch (error) {
      setLoadingDelete(false);
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  // console.log('deviceName =>> ', deviceName);

  const renderItem = useCallback(
    (v, i) => (
      <View style={styles.eachLogin} key={v._id}>
        <View>
          <Text style={{ color: '#3b3b3b' }}>{v.device_id}</Text>
          <Text
            style={{
              color: '#3b3b3b',
              fontWeight: 'bold',
              fontFamily: 'Satoshi',
            }}
          >
            {v.device_name}
          </Text>
          <Text style={{ color: '#3b3b3b', fontSize: 12 }}>{v.systemName}</Text>
          <Text style={{ color: '#3b3b3b', fontSize: 12 }}>{v.date}</Text>
        </View>
        {v.device_name?.toLowerCase() !== deviceName?.toLowerCase() && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ display: i == topIndex ? 'none' : 'flex' }}
            onPress={() => showMainDeleteHandler(i, v)}
          >
            <AntDesign name="delete" size={26} color="#3b3b3b" />
          </TouchableOpacity>
        )}
      </View>
    ),
    [],
  );

  const mapSessions = sesssions?.map(renderItem);

  return (
    <BottomSheetScrollView
    // style={{marginTop: 20}}
    // style={{width: '100%', height: '100%'}}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalDelete}
        onRequestClose={() => setIsModalDelete(!isModalDelete)}
      >
        <Pressable style={styles.anocenteredView}>
          <View style={{ ...styles.anomodalView }}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <MaterialIcons
                  name="delete"
                  size={40}
                  color={'#e20154'}
                  style={{ marginBottom: 12 }}
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsModalDelete(!isModalDelete)}
                  style={styles.closeLine}
                >
                  <Ionicons color={'#838289'} name="close" size={23} />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  color: '#555',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}
              >
                Delete session
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                Deleting a session requires backup code.
              </Text>

              <View style={styles.positionAbsoluteView}>
                <Text style={styles.whatsYourNumber}>
                  Enter your backup code to continue
                </Text>

                <TextInput
                  style={{ ...styles.inputTextInput }}
                  placeholder="eg | 32yGWs8I8e"
                  value={backup}
                  onChangeText={setBackup}
                  placeholderTextColor={'#262626'}
                />
              </View>

              <Button
                loading={loadingDelete}
                onPress={() => deleteSessionHandler(item._id)}
                label={'Continue'}
                style={{ width: '100%', marginTop: 30, height: 50 }}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>
      <View>
        {loading ? (
          <View style={styles.activityCover}>
            <ActivityIndicator color={'#3b3b3b'} size={40} />
          </View>
        ) : (
          <View>
            <View style={{ paddingHorizontal: 20, marginBottom: 13 }}>
              <Text style={styles.commentOwner}>Account information</Text>
              <Text style={{ ...styles.upperText, marginTop: 6 }}>
                Much incomes made from interesting videos upload by you on
                Private Live. can actually get your account monetize.
              </Text>
              <Text
                style={{
                  color: 'blue',
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontFamily: 'Gilroy-Bold',
                }}
                onPress={() =>
                  navigation.navigate('AppEventFeatures', { scrollTo: 2020 })
                }
              >
                Learn more
              </Text>

              <View style={styles.linkSection}>
                <Text style={styles.comment}>Date Joined</Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: '#9f9f9f',
                    marginTop: 8,
                    fontFamily: 'Gilroy-Regular',
                  }}
                >
                  {CTX?.userObj?.reg_date}
                </Text>
              </View>

              <View style={styles.linkSection}>
                <Text style={styles.comment}>Account type</Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: '#9f9f9f',
                    marginTop: 0,
                    marginLeft: 'auto',
                    fontFamily: 'Gilroy-Regular',
                    textTransform: 'capitalize',
                  }}
                >
                  {CTX?.userObj?.account_type}
                </Text>
              </View>
            </View>

            {mapSessions}
          </View>
        )}
      </View>
    </BottomSheetScrollView>
  );
};

export default LastLogin;

const styles = StyleSheet.create({
  activityCover: {
    width: '100%',
    marginTop: 30,
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eachLogin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 1,
  },
  coverDel: {
    backgroundColor: 'red',
    width: 70,
    height: '100%',
    paddingTop: 20,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  coverArr: {
    backgroundColor: '#e1e1e1',
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentOwner: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 25,
    fontFamily: 'Gilroy-Bold',
    // textAlign: 'center',
    color: '#3b3b3b',
  },
  upperText: {
    color: '#9f9f9f',
    fontFamily: 'Gilroy-Regular',
    fontSize: 13,
  },
  comment: {
    color: '#3b3b3b',
    fontSize: 19,
  },
  linkSection: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    // borderBottomColor: 'red',
    // borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  sideText: {
    color: '#3b3b3b',
    marginLeft: 'auto',
  },

  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    backgroundColor: '#00000066',
  },
  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeLine: {
    position: 'absolute',
    top: 8,
    right: 5,
    backgroundColor: '#e1e1e1',
    width: 34,
    height: 34,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  positionAbsoluteView: {
    marginTop: 40,
    width: '100%',
  },
  whatsYourNumber: {
    color: '#111',
    fontSize: 16,
  },

  textInputLinkCover: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#fff',
    zIndex: 2000,
  },
  inputTextInput: {
    paddingLeft: 20,
    color: '#3b3b3b',
    width: '100%',
    height: 50,
    paddingRight: 15,
    borderRadius: 5,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: '#9f9f9f',
  },
});
