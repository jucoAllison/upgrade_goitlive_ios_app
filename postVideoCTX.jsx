import { View, Text, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import StackNavigation from './stackNavigation';
import { MainContext } from './App';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
// import {Video as CVideo} from 'react-native-compressor';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostVideoCTX = () => {
  const CTX = useContext(MainContext);
  const [uploadVideo, setVideo] = useState(
    null,
    //   {
    //   creationDate: null,
    //   cropRect: null,
    //   data: null,
    //   duration: 26000,
    //   exif: null,
    //   filename: 'IMG_0010.MP4',
    //   height: 480,
    //   localIdentifier: '05C6C77F-130E-4B76-9A23-F46C135DAF6B/L0/001',
    //   mime: 'video/mp4',
    //   modificationDate: null,
    //   path: 'file:///Users/juco/Library/Developer/CoreSimulator/Devices/40B8BCEE-0D19-45AE-AF7D-15542707EE73/data/Containers/Data/Application/0B5B7BC3-B002-4CC3-A274-BFA0F77DEB6C/tmp/react-native-image-crop-picker/D8901D5A-752C-4426-8BF9-5FE47523E2EC.mp4',
    //   size: 2814599,
    //   sourceURL:
    //     'file:///Users/juco/Library/Developer/CoreSimulator/Devices/40B8BCEE-0D19-45AE-AF7D-15542707EE73/data/Media/DCIM/100APPLE/IMG_0010.MP4',
    //   width: 272,
    // }
  );
  const [isCover, setIsCover] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [duration, setDuration] = useState(0);
  const [msgInput, setMsgInput] = useState('');
  const [selectedTags, setSelectedTags] = useState([
    // {
    //   _id: '66b4ddcaee60c3f638516a2e',
    //   active: false,
    //   full_name: 'Polis po po',
    //   monetize: false,
    //   username: 'opopo_nat',
    //   verify: false,
    // },
    // {
    //   _id: '66ae3a26d36479398152d8af',
    //   active: false,
    //   full_name: 'Anita 300',
    //   monetize: false,
    //   username: 'anita_404',
    //   verify: false,
    // },
  ]);
  const navigation = useNavigation();
  const [minimize, setMinimize] = useState(false);
  const [upLoading, setUpLoading] = useState(false);
  const [hideComment, setHideComment] = useState(false);
  const [compressingProgress, setCompressingProgress] = useState(null);
  const backgroundMode = true;
  const [topIndex, setIndex] = useState({
    svg: <FontAwesome name="globe" size={20} color="#262626" />,
    subs: '',
    name: 'Everyone (Default)',
  });

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const conpressVideoHere = async () => {
    setUpLoading(true);
    // // const source = uploadVideo?.path;
    // const spread = {...uploadVideo};

    // const result = await CVideo.compress(
    //   source,
    //   {
    //     compressionMethod: 'auto',
    //   },
    //   progress => {
    //     if (backgroundMode) {
    //       // console.log('Compression Progress: ', progress);
    //       setCompressingProgress(progress * 100);
    //     }
    //   },
    // );

    // // console.log('uploadVideo?.uri ==>> ', uploadVideo?.uri);
    // console.log('result from conpressVideoHere => ', selectedTags);
    // console.log('uploadVideo from conpressVideoHere => ', uploadVideo);
    // setVideo({...spread, sourceURL: result});

    // setMinimize(true);

    setIsUploadingNew(false);
    // console.log('uploadVideo?.path =>>> ', uploadVideo);
    // uploadVideoToServer(uploadVideo?.path);
    uploadVideoToServer(uploadVideo?.uri);

    navigation.navigate('Private', { screen: 'personalPrivate' });
  };

  // const uploadVideoToServer = async details => {
  //   // const user = auth().currentUser;

  //   // console.error('User was found ==>> ', user);
  //   const theFile = {
  //     uri: 'file://' + details.split('file:/').pop(),
  //     type: uploadVideo?.type,
  //     name: uploadVideo?.uri.split('/').pop(),
  //   };

  //   const reference = storage().ref(`videos/${theFile?.name}`);
  //   setUpLoading(true);

  //   try {
  //     const abcd = await reference.putFile(theFile?.uri);

  //     // Get the public URL

  //     const publicURL = `https://firebasestorage.googleapis.com/v0/b/${
  //       abcd?.metadata?.bucket
  //     }/o/${encodeURIComponent(abcd.metadata?.fullPath)}?alt=media`;

  //     // console.log('Video uploaded successfully! ==>>> ', abcd);
  //     // console.log('getMetadata HERE! Public URL:', publicURL);
  //     // console.log('getMetadata HERE! Public URL:');
  //     // console.log('getMetadata HERE! Public URL:');
  //     // setUpLoading(false);
  //     // setMinimize(false);
  //     // setIsModal(false);

  //     // // setMinimize(true);
  //     // const theFile = {
  //     //   uri: 'file://' + details.split('file:/').pop(),
  //     //   type: uploadVideo.type,
  //     //   name: uploadVideo.uri.split('/').pop(),
  //     // };
  //     // const formData = new FormData();
  //     // formData.append('file', theFile);
  //     // formData.append('note', msgInput);
  //     // formData.append('tags', JSON.stringify(selectedTags));
  //     // formData.append('isCover', isCover);

  //     const fetching = await fetch(`${CTX.systemConfig?.p}user/private-live`, {
  //       method: 'POST',
  //       headers: {
  //         // 'Content-Type': 'multipart/form-data',
  //         'Content-Type': 'application/json',
  //         Authorization: `bearer ${CTX.sessionToken}`,
  //       },
  //       // body: formData,
  //       body: JSON.stringify({
  //         data: abcd,
  //         publicURL: publicURL,
  //         note: msgInput,
  //         tags: selectedTags,
  //         isCover: isCover,
  //       }),
  //     });
  //     const response = await fetching.json();
  //     if (response?.data?.isRemoved) {
  //       return CTX.logoutUser();
  //     }

  //     if (response?.data.error) {
  //       setUpLoading(false);
  //       setMinimize(false);
  //       setErrMsg(response?.data?.msg);
  //       setShowMsg(true);
  //       return;
  //     }

  //     // console.log('response File uploaded successfully:', response);
  //     setUpLoading(false);
  //     setMinimize(false);
  //     setIsModal(true);
  //     navigation.navigate('NewToPrivateLive');
  //   } catch (error) {
  //     setMinimize(false);
  //     setUpLoading(false);
  //     console.log('error from PostCTX.uploadVideoToServer ==>> ', error);
  //     console.log(
  //       'error from PostCTX.uploadVideoToServer ==>> ',
  //       error?.response,
  //     );
  //     setErrMsg('Network request failed');
  //     setShowMsg(true);
  //   }
  // };

  const uploadVideoToServer = async compressedUri => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: compressedUri,
        path: compressedUri,
        name: 'video.mp4',
        type: 'video/mp4',
      });
      formData.append('tags', JSON.stringify(selectedTags));
      formData.append('note', msgInput);
      formData.append('isCover', isCover);
      formData.append('hide_comment', hideComment);

      // console.log(`${CTX.systemConfig?.p}account/user/upload/private-live =>>`);

      const response = await axios.post(
        `${CTX.systemConfig?.p}account/user/upload/private-live`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          onUploadProgress: progressEvent => {
            const totalLength = progressEvent.total;
            if (totalLength) {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / totalLength,
              );
              // console.log(`Upload Progress: ${percentage}%`);
              // You can update your UI or state with this percentage
            }
          },
          timeout: 1200000, // Increase the timeout to 60 seconds or more
        },
      );

      navigation.navigate('Private', { screen: 'otherPrivate' });

      // console.log('Upload successful:');
      // console.log('Upload successful:', Math.random());
      // console.log('Upload successful:', Math.random());
      // console.log('Upload successful:', response);
      // console.log('Upload successful:');
      // console.log('Upload successful:');
      // console.log('Upload successful:');
      CTX.setSessionToken(response.data.token);
      CTX.setUserObj(response.data.user);
      await AsyncStorage.setItem(
        '@userObj',
        JSON.stringify(response.data.user),
      );
      setUpLoading(false);
      setMinimize(false);
      setIsUploadingNew(false);
      setUpLoading(false);
      setMinimize(false);
      setIsUploadingNew(false);
    } catch (error) {
      setUpLoading(false);
      console.error('Upload failed:', error);
      console.error('Upload failed:', error?.message);
      console.error('Upload failed:', error?.response);
      createThreeButtonAlert(
        'Unable to upload video, Video file not supported',
      );
    }
  };

  const toggleCareHandler = async id => {
    try {
      const fetchUser = await fetch(
        `${CTX.systemConfig?.p}account/user/profile/toggle/care/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CTX.sessionToken}`,
          },
        },
      );
      const jsoned = await fetchUser?.json();
      if (jsoned?.e) {
        createThreeButtonAlert(jsoned?.m);
        return;
      }
    } catch (error) {
      console.log('error toggling careHandler from POSTCTX HERE! => ', error);
      createThreeButtonAlert('Network request failed');
      setSelected(null);
    }
  };

  return (
    <PostContext.Provider
      value={{
        errMsg,
        setErrMsg,
        setShowMsg,
        showMsg,
        uploadVideo,
        setVideo,
        isCover,
        setIsCover,
        duration,
        setDuration,
        msgInput,
        setMsgInput,
        selectedTags,
        setSelectedTags,
        topIndex,
        setIndex,
        conpressVideoHere,
        minimize,
        upLoading,
        compressingProgress,
        setMinimize,
        isUploadingNew,
        setIsUploadingNew,
        hideComment,
        setHideComment,
        toggleCareHandler,
      }}
    >
      <StackNavigation />
    </PostContext.Provider>
  );
};

export default PostVideoCTX;

export const PostContext = React.createContext({
  hideComment: null,
  setHideComment: () => {},
  isUploadingNew: null,
  setIsUploadingNew: () => {},
  uploadVideo: null,
  setVideo: () => {},
  selectedTags: null,
  setSelectedTags: () => {},
  isCover: null,
  setIsCover: () => {},
  errMsg: null,
  setErrMsg: () => {},
  showMsg: null,
  setShowMsg: () => {},
  duration: null,
  setDuration: () => {},
  msgInput: null,
  setMsgInput: () => {},
  isModal: null,
  setIsModal: () => {},
  compressingProgress: null,
  setCompressingProgress: () => {},
  upLoading: null,
  setUpLoading: () => {},
  topIndex: null,
  setIndex: () => {},
  conpressVideoHere: () => {},
  minimize: null,
  setMinimize: () => {},
  toggleCareHandler: () => {},
});
