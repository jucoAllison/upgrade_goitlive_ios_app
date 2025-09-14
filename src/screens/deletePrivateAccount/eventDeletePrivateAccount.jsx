import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MainContext} from '../../../App';
// import ErrMessage from '../../components/errMessage/errMessage';
import Button from '../../components/button';
import {GetUserDetails} from '../../helper/getUserHelper';
const DeleteAmass = React.lazy(() => import('./deletePrivateAccount'));
const EventDeletePrivateAccount = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [gottenParams, setGottenParams] = useState(null);
  const [mainData, setMainData] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [users, setUsers] = useState([]);
  const [isUserJoined, setIsUserJoined] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [memberShipDetails, setMemberShipDetails] = useState(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [backup, setBackup] = useState("")

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
    }
  }, [isFocused]);

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  // delete Handler HEre!!
  const deleteHandlerHerec = async () => {
    if (loadingDelete) return;

    if (backup.trim().length < 7) {
      return;
    }

    setLoadingDelete(true);
    setShowMsg(false);
    setErrMsg('');
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}account/user/delete/private/account/${backup.trim()}`,
        {
          method: 'DELETE',
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

      // console.log('EventMyStories ==>>> ', response);
      if (response.e) {
        setLoadingDelete(false);
        setErrMsg(response.m);
        createThreeButtonAlert(response.m)
        setShowMsg(true);
        return;
      }

      // const userDetails = await GetUserDetails(CTX.url, CTX.sessionToken);
      // if (userDetails.user) {
      //   CTX.setToken(userDetails.token);
      //   CTX.setUserObj(userDetails.user);
      // }

      CTX.setSessionToken(response.token);
      CTX.setUserObj(response.data);
      await AsyncStorage.setItem(
        '@userObj',
        JSON.stringify(response.data),
      );

      setIsModalDelete(false);
      setLoadingDelete(false);
      setShowMsg(false);
      setErrMsg('');
      navigation.goBack();
    } catch (error) {
      setLoadingDelete(false);
      console.log('error from uploadVideoToServer ==>> ', error);
        createThreeButtonAlert('Error happened, click to retry')
        setErrMsg('Error happened, click to retry');
      setShowMsg(true);
    }
  };

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        translucent={false}
        barStyle={'dark-content'}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalDelete}
        onRequestClose={() => setIsModalDelete(!isModalDelete)}>
        <Pressable style={styles.anocenteredView}>
          <View style={{...styles.anomodalView}}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                }}>
                <MaterialIcons
                  name="delete"
                  size={40}
                  color={'#e20154'}
                  style={{marginBottom: 12}}
                />

                <TouchableOpacity activeOpacity={0.8}
                  onPress={() => setIsModalDelete(!isModalDelete)}
                  style={styles.closeLine}>
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
                }}>
                Delete private account!
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Do you really want to delete your GoItLive private account?
              </Text>

              <View style={styles.positionAbsoluteView}>
                <Text style={styles.whatsYourNumber}>
                  Enter your backup code to continue
                </Text>

                <TextInput
                  style={{...styles.inputTextInput}}
                  placeholder="eg | 32yGWs8I8e"
                  value={backup}
                  onChangeText={setBackup}
                  placeholderTextColor={'#262626'}
                />
              </View>


              <Button
                loading={loadingDelete}
                onPress={deleteHandlerHerec}
                label={'Delete'}
                style={{width: '100%', marginTop: 30, height: 50}}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>

      {/* {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )} */}
      <Suspense fallback={null}>
        <DeleteAmass
          loading={loadingDelete}
          navigation={navigation}
          firstDelete={() => setIsModalDelete(!isModalDelete)}
        />
      </Suspense>
    </>
  );
};

export default EventDeletePrivateAccount;

const styles = StyleSheet.create({
  imag: {
    borderWidth: 2,
    borderColor: '#fff',
    width: 40,
    height: 40,
    overflow: 'hidden',
    borderRadius: 49,
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
    marginTop: 20,
    width: '100%',
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
  whatsYourNumber: {
    color: '#111',
    fontSize: 16,
  },
});
