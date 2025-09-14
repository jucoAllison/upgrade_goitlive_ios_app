import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import React, {Suspense, useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {MainContext} from '../../../App';
// import ErrMessage from '../../components/errMessage/errMessage';
import Button from '../../components/button';
const DeleteAmass = React.lazy(() => import('./requestNewBackup'));
const EventRequestNewBackup = () => {
  const [backup, setBackup] = useState('');
  const navigation = useNavigation();
  const [isModal, setIsModal] = useState(false);
  const CTX = useContext(MainContext);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [loading, setLoading] = useState(false);

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);


  const submitHandler = async () => {
    setShowMsg(false);
    setErrMsg('');
    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/change/backup/code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({backup}),
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      setLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m)
        setShowMsg(true);
        return;
      }
      setShowMsg(false);
      setIsModal(true);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
        createThreeButtonAlert("Network request failed")
        setShowMsg(true);
    }
  };

  return (
    <>
      {/* {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )} */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModal}
        onRequestClose={() => setIsModal(!isModal)}>
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
                  name="celebration"
                  size={40}
                  style={{marginBottom: 12}}
                  color="#e20154"
                />
              </View>

              <Text
                style={{
                  color: '#555',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                Hurray!
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Successfully changed backup code, Upon your next login, use the
                new back up code sent to your email. Keep it safe.
              </Text>

              <Button
                // loading={leaving}
                onPress={() => {
                  navigation.goBack()
                  setIsModal(false);
                }}
                label={'Continue'}
                style={{width: '100%', marginTop: 30, height: 50}}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>

      <Suspense fallback={null}>
        <DeleteAmass
          navigation={navigation}
          backup={backup}
          setBackup={setBackup}
          submitHandler={submitHandler}
          loading={loading}
        />
      </Suspense>
    </>
  );
};

export default EventRequestNewBackup;

const styles = StyleSheet.create({
  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    // height: "90%",
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

  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    // marginTop: 22,
    backgroundColor: '#00000066',
  },
});
