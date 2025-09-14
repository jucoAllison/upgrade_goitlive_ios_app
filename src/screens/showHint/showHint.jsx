import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Switch,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import styles from '../amassCenter/styles';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import ErrMessage from '../../components/errMessage/errMessage';
import { MainContext } from '../../../App';

const ActivityStatus = () => {
  const navigation = useNavigation();
  const [switch1Value, setSwitch1Value] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const CTX = useContext(MainContext)

  const pressHeaderHere = () => {
    navigation.goBack();
  };

  const onchangeSomething = async () => {
    // setSwitch1Value(!switch1Value);
    if (loading) return;
    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/toggle/show-hint`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);

      if (parsedJson?.e) {
        // console.log('backupParsedJson', parsedJson?.m);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }

      CTX.setSessionToken(parsedJson.token);
      CTX.setUserObj(parsedJson.data);

      // console.log("parsedJson.data =>>> ", parsedJson.data);
      

    } catch (error) {
      console.log('error =>> ', error);
      setLoading(false);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    console.log("CTX.userOb =>>> ", CTX.userObj?.show_hint);
    setSwitch1Value(CTX.userObj?.show_hint)
  }, [CTX.userObj])

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          backgroundColor: '#fff',
          width: '100%',
          height: '100%',
        }}>
        <View style={{padding: 20, paddingTop: 16}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pressHeaderHere}
            style={{paddingTop: 0, width: 35}}>
            <Ionicons name="chevron-back" size={26} color="#000" />
            {/* <Ionicons name="chevron-back" color="#000" size={25} /> */}
          </TouchableOpacity>
          <Text style={styles.personalInfo}>Show hint</Text>

          <Text style={styles.topText}>
            When 'Show Hint' is toggled on, users will see helpful hints related
            to their credentials when they click 'Forgot backup code'. The
            system displays hints based on the provided username and phone
            number to assist in account recovery. To proceed with resetting your
            backup code, you must first enter both your username and phone
            number.
          </Text>
        </View>

        <Pressable style={styles.coverUserCommentSection}>
          <Feather name="activity" size={20} color="#3b3b3b" />
          <Text style={styles.sortText}>Show hint</Text>

          {loading ? (
            <ActivityIndicator size={'small'} style={{marginLeft: 'auto'}} />
          ) : (
            <Switch
              style={{marginLeft: 'auto'}}
              onValueChange={onchangeSomething}
              value={switch1Value}
              trackColor={{true: '#e2015496', false: '#ddd'}}
              thumbColor={switch1Value ? '#e20154' : '#bbb'}
              // colo/
            />
          )}
        </Pressable>
      </ScrollView>
    </>
  );
};

export default ActivityStatus;
