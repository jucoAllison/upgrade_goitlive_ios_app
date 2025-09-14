import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { memo, useContext, useEffect, useState } from 'react';
import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Pro';
import { useNavigation, useIsFocused } from '@react-navigation/core';

import styles from '../editProfile/editProfile.styles';
import { MainContext } from '../../../App';
import { GetUserDetails } from '../../helper/getUserHelper';
import { useWebSocket } from '../../../WebSocketContext';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';

const AddExternalLink = () => {
  const CTX = useContext(MainContext);
  const [allSocials, setAllSocials] = useState([
    { social: 'youtube', link: '' },
    { social: 'facebook', link: '' },
    { social: 'instagram', link: '' },
    { social: 'tiktok', link: '' },
  ]);
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [instagram, setInstagram] = useState(null);
  const [tiktok, setTiktok] = useState(null);
  const [youtube, setYoutube] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [label, setLabel] = useState('Save Changes');
  const isFocused = useIsFocused();
  const { sendMessage } = useWebSocket();

  function checkLinks() {
    const allEmpty = allSocials.every(item => item.link === '');
    return allEmpty ? null : 'Links are not all empty';
  }

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const editLinkHandler = async () => {
    if (loading) {
      return null;
    }
    if (!checkLinks()) {
      return null;
    }
    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/add/external-link`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({
            arr: allSocials,
          }),
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.e) {
        setLoading(false);
        createThreeButtonAlert(parsedJson?.m);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setTimeout(() => {
        setLabel('Save Changes');
      }, 5000);
      setLabel('Saved');
      setLoading(false);
      sendMessage({
        action: 'rebringuserdetails',
        token: CTX.sessionToken,
      });
      // console.log('parsedJson?.data from addlinks =>> ', parsedJson?.data);
      CTX.setSessionToken(parsedJson?.data);
    } catch (error) {
      setLoading(false);
      console.log('error verifying create account => ', error);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
      if (CTX.userObj?.external_links?.length > 0) {
        setAllSocials(CTX.userObj?.external_links);
      }
    }
  }, [isFocused]);

  const onChangeTextHandler = (e, i) => {
    console.log('{e, i} =>> ', { e, i });

    let spread = [...allSocials];
    if (spread[i]) {
      spread[i].link = e;
    }
    // spread[i]?.link = e
    setAllSocials(spread);
  };

  const mapLinks = allSocials?.map((v, i) => (
    <View key={i}>
      <Text
        style={{
          ...styles.sortText,
          marginTop: 20,
          textTransform: 'capitalize',
          fontFamily: 'Gilroy-Bold',
        }}
      >
        {v?.social}
      </Text>
      <View style={styles.textInputLinkCover}>
        {v?.social?.includes('instagram') ? (
          <FontAwesome5Brands
            name="instagram-square"
            size={22}
            color="#3b3b3b"
          />
        ) : v?.social?.includes('facebook') ? (
          <FontAwesome5Brands name="facebook-f" size={22} color="#3b3b3b" />
        ) : v?.social?.includes('youtube') ? (
          <FontAwesome5Brands name="youtube" size={22} color="#3b3b3b" />
        ) : (
          <FontAwesome5Brands name="tiktok" size={22} color="#3b3b3b" />
        )}
        <TextInput
          style={{ ...styles.inputTextInput, height: 44 }}
          value={v?.link}
          onChangeText={e => onChangeTextHandler(e, i)}
          placeholder={'Link URL'}
          placeholderTextColor={'#262626'}
        />
      </View>
    </View>
  ));

  // console.log("CTX.userObj =>> ", CTX.userObj);

  return (
    <DismissKeyboardWrapper>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="dark-content"
      />
      {/* {showMsg && (
          <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
        )} */}
      <View style={{ padding: 20, backgroundColor: '#fff', flex: 1 }}>
        <Text style={[styles.comment, { fontSize: 12, textAlign: 'left',
          fontFamily: 'Gilroy-Regular'
         }]}>
          Add all your other social media profile link here and save
        </Text>

        {mapLinks}

        {/* <Text style={{...styles.sortText, marginTop: 20}}>Tiktok</Text>
        <View style={styles.textInputLinkCover}>
          <FontAwesome5Brands name="tiktok" size={22} color="#3b3b3b" />
          <TextInput
            style={{...styles.inputTextInput, height: 44}}
            placeholder={CTX.userObj.tiktok ? CTX.userObj.tiktok : 'Link URL'}
            placeholderTextColor={'#262626'}
            value={tiktok}
            onChangeText={setTiktok}
          />
        </View>

        <Text style={{...styles.sortText, marginTop: 20}}>Youtube</Text>
        <View style={styles.textInputLinkCover}>
          <FontAwesome5Brands name="youtube" size={22} color="#3b3b3b" />
          <TextInput
            style={{...styles.inputTextInput, height: 44}}
            placeholder={CTX.userObj.youtube ? CTX.userObj.youtube : 'Link URL'}
            placeholderTextColor={'#262626'}
            value={youtube}
            onChangeText={setYoutube}
          />
        </View>

        <Text style={{...styles.sortText, marginTop: 20}}>Facebook page</Text>
        <View style={styles.textInputLinkCover}>
          <FontAwesome5Brands name="facebook-f" size={22} color="#3b3b3b" />
          <TextInput
            style={{...styles.inputTextInput, height: 44}}
            placeholder={CTX.userObj.twitter ? CTX.userObj.twitter : 'Link URL'}
            placeholderTextColor={'#262626'}
            value={twitter}
            onChangeText={setTwitter}
          />
        </View> */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => editLinkHandler()}
          style={{ paddingTop: 50 }}
        >
          <View style={styles.eachBtnCover}>
            {loading ? (
              <ActivityIndicator color="#262626" size={30} />
            ) : (
              <Text
                style={{ ...styles.eachBtnText, fontFamily: 'Gilroy-Bold' }}
              >
                {label}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </DismissKeyboardWrapper>
  );
};

export default AddExternalLink;

// const styles = StyleSheet.create({

// });
