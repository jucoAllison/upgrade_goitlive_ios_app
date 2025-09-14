import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Btn from '../../components/button';
import {useNavigation, useIsFocused} from '@react-navigation/core';
import {MainContext} from '../../../App';
import Button from '../../components/button';
import {TextInput} from 'react-native-gesture-handler';
import ErrMessage from '../../components/errMessage/errMessage';
import moment from 'moment';

const RecoverDelete = ({profileDetails}) => {
  const CTX = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mainError, setMainError] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [backup, setBackup] = useState('');

  const pressHeaderHere = () => {
    navigation.goBack();
  };

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Alert!', msg, [
      {
        text: 'Close',
        onPress: () => navigation.navigate('Navigation', {screen: 'Profile'}),
      },
    ]);

  const deleteAccount = async () => {
    if (backup.trim().length < 7) {
      return;
    }
    if (loading) return;
    setLoading(true);
    setMainError(false);
    setError('');
    try {
      // await CTX.logoutUser();

      const fetching = await fetch(
        `${
          CTX.systemConfig?.am
        }account/user/cancel/deleting/main/account/${backup.trim()}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.e) {
        setError(parsedJson?.m);
        setLoading(false);
        setMainError(true);
        return;
      }
      setBackup('');
      setMainError(false);
      setIsModalDelete(false);
      setLoading(false);
      createThreeButtonAlert(
        "Welcome back! 🙌 We're so glad you decided to stay.",
      );
    } catch (error) {
      setError('Network connection failed');
      console.log('error Here! ==>> ', error);
      setMainError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#d00');
    }
  }, [isFocused]);

  // console.log("profileDetails =>>> ", profileDetails);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="light-content"
      />

      {mainError && (
        <ErrMessage msg={error} closeErr={() => setMainError(false)} />
      )}
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
                <Ionicons
                  name="arrow-undo"
                  size={40}
                  color={'#e20154'}
                  style={{marginBottom: 12}}
                />

                <TouchableOpacity
                  activeOpacity={0.8}
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
                Recover account
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Recovering your account requires your backup code.
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
                loading={loading}
                onPress={deleteAccount}
                label={'Continue'}
                style={{width: '100%', marginTop: 30, height: 50}}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        style={styles.scrollViewCover}
        contentInsetAdjustmentBehavior="automatic">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{paddingTop: 0, paddingBottom: 4, width: 35}}>
          <Ionicons name="chevron-back" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.personalInfo}>Recover account</Text>

        <Text style={{...styles.topText, display: 'flex'}}>
          Please note that your account is scheduled to be deleted on{' '}
          <Text style={{fontWeight: 'bold'}}>
            {' '}
            {profileDetails?.account_deleting_date}.
          </Text>{' '}
          We're sorry to see you go. The good news is that you can still recover
          your account if you change your mind.
        </Text>
      </ScrollView>
      {error.length > 0 && (
        <Text
          style={{
            backgroundColor: '#fff',
            paddingVertical: 8,
            fontSize: 12,
            color: '#d00',
          }}>
          {error}
        </Text>
      )}

      <View style={styles.bottomBtnColor}>
        <>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pressHeaderHere}
            style={{flexDirection: 'row', width: 150, alignItems: 'center'}}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
            <Text
              style={{
                color: '#000',
                textDecorationLine: 'underline',
                fontWeight: 'bold',
              }}>
              Back
            </Text>
          </TouchableOpacity>
          <View>
            <Btn
              label={'Recover Account'}
              // style={{}}
              onPress={() => setIsModalDelete(true)}
              style={{
                width: 170,
                marginTop: 0,
                backgroundColor: loading ? '#dd000059' : '#dd0000',
              }}
            />
          </View>
        </>
      </View>
    </>
  );
};

export default RecoverDelete;

const styles = StyleSheet.create({
  scrollViewCover: {
    padding: 16,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  personalInfo: {
    color: '#111',
    fontSize: 24,
    fontWeight: '500',
    marginVertical: 18,
  },
  coverProfile: {
    flexDirection: 'row',
    paddingVertical: 19,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    paddingRight: 100,
    alignItems: 'center',
  },
  coverProfilePic: {
    backgroundColor: '#0a224e',
    width: 45,
    height: 45,
    marginRight: 7,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {fontWeight: '400', color: 'rgb(112, 122, 138)', fontSize: 12},
  inputTextInput: {
    flexWrap: 'wrap',
    padding: 0,
    color: '#000',
    fontSize: 14,
    marginTop: -1,
  },
  bottomBtnColor: {
    marginTop: 'auto',
    width: '100%',
    borderTopColor: '#ccc',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  coverUserCommentSection: {
    width: '100%',
    paddingHorizontal: 20,
    height: 60,
    paddingLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomColor: "#d1d1d1",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

    justifyContent: 'space-between',
  },

  sortText: {
    color: '#3b3b3b',
    fontSize: 18,
  },
  clickable: {
    width: 28,
    height: 28,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d1d1d1',
    borderWidth: 2,
  },
  innerCircle: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  anotherText: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 0,
    paddingLeft: 14,
    paddingBottom: 9,
    fontSize: 13,
    color: '#000',
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
