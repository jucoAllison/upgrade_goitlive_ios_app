import Fallback from '../../components/fallback/fallback';
import React, { Suspense, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import ImageKit from 'imagekit-javascript';
import ImageCropPicker from 'react-native-image-crop-picker';

import { MainContext } from '../../../App';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
import { useWebSocket } from '../../../WebSocketContext';
import ErrMessage from '../../components/errMessage/errMessage';
const EditProfile = React.lazy(() => import('./editProfile'));
const EventEditProfile = () => {
  const CTX = useContext(MainContext);
  const [full_name, setFull_name] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState(CTX.userObj?.bio);
  const [usernameErr, setUsernameErr] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [label, setLabel] = useState('Save Changes');
  // const resultUploadFile = uploadFile(pickedImage);
  const { urlEndpoint, publicKey, authenticationEndpoint } = CTX?.systemConfig;
  const { sendMessage } = useWebSocket();

  var imagekitConfigOptions = { urlEndpoint };
  if (publicKey) imagekitConfigOptions.publicKey = publicKey;
  if (authenticationEndpoint)
    imagekitConfigOptions.authenticationEndpoint = authenticationEndpoint;

  const imagekit = new ImageKit(imagekitConfigOptions);

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const editProfileHandler = async () => {
    if (loading || usernameLoading) {
      return null;
    }
    if (usernameErr) {
      setErrMsg('Change username and continue');
      createThreeButtonAlert('Change username and continue');
      setShowMsg(true);
      return;
    }

    // console.log("username =... ", username);
    

    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/settings/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({
            full_name:
              !full_name || full_name.trim().length < 1
                ? CTX.userObj?.full_name
                : full_name,
            username:
              !username || username.trim().length < 1
                ? CTX.userObj?.username
                : username,
            bio: !bio || bio.trim().length < 1 ? CTX.userObj?.bio : bio,
          }),
        },
      );
      const parsedJson = await fetching.json();

      // if (parsedJson?.isRemoved) {
      //   return CTX.logoutUser();
      // }
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        // createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        // setTimeout(() => {
        //   setLabel('Save Changes');
        // }, 5000);
        // setLabel('Saved');
        setLoading(false);
        return;
      }

      // console.log(
      //   'parsedJson?.data hello from editing something =>> ',
      //   parsedJson,
      // );
      sendMessage({
        action: 'rebringuserdetails',
        token: CTX.sessionToken,
      });
      CTX.setSessionToken(parsedJson?.data);
      setTimeout(() => {
        setLabel('Save Changes');
      }, 5000);
      setLabel('Saved');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error verifying create account => ', error);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  // everything about username here
  const setUsernameHandler = e => {
    // const belowFour = /^[a-zA-Z_.]+$/;
    // const onlyAccept = /^[a-zA-Z0-9_.]+$/;
    // let revap = e;
    // const splited = e.split('');
    // let testing = revap.length > 4 ? onlyAccept.test(e) : belowFour.test(e);
    // if (!testing) {
    //   return;
    // }
    addUserName(e);
    // === Validate Character Set ===
    const hasInvalidChars = /[^a-zA-Z0-9._]/.test(e);
    if (hasInvalidChars) {
      setUsernameErr(
        'Invalid Characters. Username can include only letters, numbers, underscores, or periods',
      );
      return;
    }

    // === Validate Number in First 4 Characters ===
    const firstFour = e.slice(0, 4);
    const hasNumberInFirstFour = /[0-9]/.test(firstFour);
    if (hasNumberInFirstFour) {
      setUsernameErr('Invalid Input. Numbers can follow after four characters');
      return;
    }

    // === Validate Length ===
    if (e.length > 26) {
      setUsernameErr('Limit Reached. Maximum character length is 26');
      return;
    }

    // ✅ All validations passed
    setUsernameErr(null);

    // checkUsernameExist(e);
  };

  const checkUsernameExist = async revap => {
    setUsernameLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.url}auth/user/account/check/username`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: revap }),
        },
      );
      const parsedJson = await fetching.json();
      setUsernameLoading(false);
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.e) {
        return setUsernameErr(true);
      }
      setUsernameErr(false);
      return;
    } catch (error) {
      setUsernameLoading(false);
      setUsernameErr(true);
      console.log('checkUsernameExist ERROR! => ', error);
    }
  };
  const clearAllUsername = () => {
    setUsername('');
  };
  const addUserName = value => {
    // console.log('valueHERER => ', value);
    setUsername(value);
  };

  const selectImageHandler = () => {
    if (loadingImg) return;

    try {
      ImageCropPicker.openPicker({
        // path: response.assets[0]?.uri,
        width: 1160,
        mediaType: 'photo',
        height: 1160,
        cropping: true,
      })
        .then(image => {
          // ImageCropPicker.openCropper({
          //   path: image?.sourceURL,
          //   width: 1160,
          //   height: 1160,
          //   cropping: true,
          // }).then(anoimage => {
          //   console.log('anoimage HERRE!! =>> ', anoimage);

          mainImageKit({
            ...image,
            type: image?.mime,
            // name: image?.filename,
            name: image?.path.split('/').pop(),
            // uri: image?.sourceURL,
            uri: image?.path,
            width: image.width,
            folder: 'profilePic',
          });
          // });
        })
        .catch(err => {
          console.log('Image picker error => ', err.message);
          createThreeButtonAlert(err.message);
          // createThreeButtonAlert(err);
        });
    } catch (error) {
      console.log('Error here!! =>> ', error);
      createThreeButtonAlert('Error picking new profile picture');
    }
  };

  const getTokenDetails = async () => {
    try {
      const response = await fetch(authenticationEndpoint);
      const jsoned = response.json();
      return jsoned;
    } catch (error) {
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
    }
  };

  const mainImageKit = async file => {
    setLoadingImg(true);
    try {
      const abcd = await getTokenDetails();
      const result = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            // path: file.uri,
            // urlEndpoint: file.uri,
            useUniqueFileName: true,
            file,
            fileName: file.name, // you can change this and generate your own name if required
            folder: file.folder, // change this or remove it if you want
            expire: abcd.expire,
            signature: abcd.signature,
            token: abcd.token,
          },
          function (err, result) {
            if (err) reject(err);
            resolve(result);
          },
        );
      });

      uploadImageHereToSever(result);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // rethrow the error to propagate it further if needed
    }
  };

  // upload image here
  const uploadImageHereToSever = async obj => {
    setLoadingImg(true);
    try {
      // console.log(`${CTX.systemConfig?.p}upload_image ===>> `, obj);

      const fetching = await fetch(
        `${CTX.systemConfig?.am}account/user/upload_image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({ imgData: obj, photo: obj?.thumbnailUrl }),
        },
      );
      const parsedJson = await fetching.json();
      // if (parsedJson?.isRemoved) {
      //   return CTX.logoutUser();
      // }
      if (parsedJson?.e) {
        setLoadingImg(false);
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        console.log('Error from uploading file');
        console.log('Error from uploading file');
        return;
      }
      setLoadingImg(false);
      // console.log('v parsedJson ==> ', parsedJson);
      sendMessage({
        action: 'rebringuserdetails',
        token: CTX.sessionToken,
      });
      CTX.setSessionToken(parsedJson?.token);
      // const userDetails = await GetUserDetails(CTX.url, CTX.sessionToken);
      // if (userDetails.user) {
      //   CTX.setUserObj(userDetails.user);
      //   return;
      // }
    } catch (error) {
      setLoadingImg(false);
      console.log('error from uploadImageHere function => ', error);
      createThreeButtonAlert('Network request failed');
      // setErrMsg('Network request failed');
      // setShowMsg(true);
    }
  };

  const sendToServer = async item => {
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/settings/category`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({
            category: item.name,
          }),
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.e) {
        return createThreeButtonAlert(
          parsedJson?.m || 'Unable to complete request',
        );
      }

      CTX.setSessionToken(parsedJson.data);

      //   navigation.navigate(parsedJson?.data?.goTo, {
      //     phone: parsedJson?.data?.phone,
      //   });
    } catch (error) {
      console.log('error from sendToServer => ', error);
      createThreeButtonAlert(
        'Network request failed, check your internet connections',
      );
    }
  };

  return (
    <DismissKeyboardWrapper>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <Suspense fallback={<Fallback />}>
        <EditProfile
          editProfileHandler={editProfileHandler}
          full_name={full_name}
          setFull_name={setFull_name}
          username={username}
          setUsername={setUsernameHandler}
          bio={bio}
          setBio={setBio}
          usernameLoading={usernameLoading}
          clearAllUsername={clearAllUsername}
          usernameErr={usernameErr}
          loading={loading}
          selectImageHandler={selectImageHandler}
          sendToServer={sendToServer}
          loadingImg={loadingImg}
          label={label}
        />
      </Suspense>
    </DismissKeyboardWrapper>
  );
};

export default EventEditProfile;
