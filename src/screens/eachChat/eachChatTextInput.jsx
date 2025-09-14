import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image as MainImage,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MainContext} from '../../../App';
import {useNavigation, useRoute} from '@react-navigation/core';
import * as ImagePicker from 'react-native-image-picker';
import {Image as Imagecom} from 'react-native-compressor';

const EachChatTextInput = ({
  setMessageHere,
  content,
  setContent,
  loading,
  replying,
  setReplying,
  textInputRef,
  emitMsgToSocket,
  dataDetails,
  blobUri,
  receiptID,
  // msg = 'Am so glad we made it, look how for we have come my babby, Am so glad we made it, look how for we have come my babby Am so glad we made it, look how for we have come my babby Am so glad we made it, look how for we have come my babby',
}) => {
  const CTX = useContext(MainContext);
  const route = useRoute();
  const [msg, setMsg] = useState('');
  const {photo, full_name, isChat, _id, username} = route.params;
  const navigation = useNavigation();
  var maxLength = 130;
  var result = msg.substring(0, maxLength) + '...';

  useEffect(() => {
    if (!replying) {
      return;
    } else {
      setMsg(replying.content);
      console.log('replying?.username =>>>', replying?._id);
    }
  }, [replying]);

  const trimText = async () => {
    if (content.trim().length < 1) {
      return;
    }
    // else if (!dataDetails) {
    //   setMessageHere();
    // }
    else {
      emitMsgToSocket(content);
    }
  };

  // selecting img
  const selectImageHandler = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'image',
        quality: 1,
        selectionLimit: 1,
        presentationStyle: 'pageSheet',
        includeExtra: true,
      },
      response => {
        if (response.assets) {
          if (response.assets[0]?.type?.includes('image')) {
            // setIsVideo(response.assets[0]?.type?.includes('video'));
            // console.log("response.assets[0] =>> , response.assets[0] >>> ", response.assets[0]);

            compressImageHere({...response.assets[0]});
            return;
          }
          return;
        }
      },
    );
  };

  const compressImageHere = async uploadVideo => {
    try {
      const source = uploadVideo?.uri;
      // console.log("uploadVideo >>> ", uploadVideo);
      const result = await Imagecom.compress(source, {
        compressionMethod: 'auto',
      });

      console.log('compressImageHere =>> , compressImageHere >>> ', result);
      console.log('uploadVideo uploadVideo uploadVideo =>>  >>> ', uploadVideo);

      // setDocumentFileHere({
      //   ...uploadVideo,
      //   name: uploadVideo?.uri?.split('/').pop(),
      //   uri: uploadVideo?.uri,
      //   folder: 'verification',
      // });
      // uploadFileToImagekit(result, uploadVideo);
    } catch (error) {
      console.log('error =>> , compressImageHere >>> ', error);
    }
  };

  return (
    <View style={styles.mainWriteUpCover}>
      {CTX.userObj?.blocked?.some(v => v == receiptID) ? (
        <Text style={{color: '#fff', marginBottom: 26}}>
          You blocked this user!
        </Text>
      ) : (
        <>
          {replying && (
            <View
              style={{
                ...styles.replyingTo,
                backgroundColor: CTX.isDarkMode ? '#ffffff36' : '#00000036',
              }}>
              {replying?.username == CTX.userObj.username ? (
                <Text
                  style={{
                    ...styles.time,
                    color: CTX.isDarkMode ? '#fff' : '#0a171e',
                  }}>
                  You
                </Text>
              ) : (
                <Text
                  style={{
                    ...styles.time,
                    color: CTX.isDarkMode ? '#fff' : '#0a171e',
                  }}>
                  @{replying?.username}
                </Text>
              )}
              <Pressable
                style={styles.closeCover}
                onPress={() => setReplying(null)}>
                <Text
                  style={{
                    ...styles.close,
                    color: CTX.isDarkMode ? '#fff' : '#0a171e',
                  }}>
                  X
                </Text>
              </Pressable>
              <Text
                style={{
                  color: CTX.isDarkMode ? '#999' : '#222',
                  fontFamily: 'Gilroy-Bold',
                  fontSize: 13,
                }}>
                {msg.length > maxLength ? result : msg}
              </Text>

              <View
                style={{height: 30, width: '100%', marginTop: 'auto'}}></View>
            </View>
          )}
          {blobUri?.blobUri?.length > 7 && (
            <View style={styles.replyingTo}>
              {blobUri?.username == CTX.userObj.username ? (
                <Text style={styles.time}>You</Text>
              ) : (
                <Text style={styles.time}>@{blobUri?.username}</Text>
              )}
              <Pressable
                style={styles.closeCover}
                onPress={() => setReplying(null)}>
                <Text style={styles.close}>X</Text>
              </Pressable>
              <Text style={{color: '#999', fontSize: 13}}>
                {blobUri?.where}
              </Text>
              <View
                style={{height: 30, width: '100%', marginTop: 'auto'}}></View>
              <View
                style={{
                  width: 100,
                  height: 70,
                  position: 'absolute',
                  backgroundColor: 'red',
                  right: 0,
                  marginLeft: 'auto',
                }}>
                <MainImage
                  source={{uri: blobUri?.blobUri}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover"
                />
              </View>
            </View>
          )}
          <View style={styles.writeUpCover}>
            <TextInput
              style={{...styles.styleTextInput}}
              placeholder={'Type something...'}
              ref={textInputRef}
              value={content}
              onChangeText={setContent}
              multiline={true}
              placeholderTextColor="#848d9d"
            />

            <Pressable onPress={trimText} style={styles.sendHereBG}>
              {CTX?.load_more_msg ? (
                <ActivityIndicator
                  size={23}
                  color="#fff"
                  style={{position: 'absolute'}}
                />
              ) : (
                <Ionicons size={20} name="send" color={'#fff'} />
              )}
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

export default EachChatTextInput;

// const styles = StyleSheet.create({
//   mainWriteUpCover: {
//     // position: 'absolute',
//     width: '100%',
//     paddingHorizontal: 20,
//     // backgroundColor: '#0a171e',
//     marginTop: -35,
//     // backgroundColor: '#d00',
//     justifyContent: 'center',
//     alignItems: 'center',
//     // bottom: 20,
//   },
//   writeUpCover: {
//     width: '100%',
//     // paddingVertical: 7
//     position: "relative",
//     // height: 44,
//     overflow: 'hidden',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     backgroundColor: '#202d34',
//     zIndex: 10,
//     // paddingTop: 2,
//     borderRadius: 35,
//   },
//   styleTextInput: {
//     paddingLeft: 30,
//     color: '#fff',
//     width: '100%',
//     // height: "100%",
//     fontFamily: 'Gilroy-Medium',
//     textAlignVertical: 'top',
//   },

//   sendHereBG: {
//     // backgroundColor: '#9e005d99',
//     backgroundColor: '#e20154',
//     width: 40,
//     right: 5,
//     bottom: 5,
//     height: 40,
//     alignSelf: 'flex-end',
//     position: 'absolute',
//     marginLeft: 'auto',
//     marginBottom: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 3,
//     borderRadius: 40,
//   },
//   time: {
//     alignSelf: 'flex-end',
//     // color: '#0a171e',
//     position: 'absolute',
//     top: 3,
//     fontFamily: 'Gilroy-Bold',
//     left: 4,
//     color: '#fff',
//     fontSize: 11,
//   },
//   close: {
//     color: '#999',
//     marginLeft: 'auto',
//     fontSize: 11,
//   },
//   closeCover: {
//     alignSelf: 'flex-end',
//     // color: '#0a171e',
//     position: 'absolute',
//     top: 3,
//     right: 7,
//     width: 40,
//     height: 40,

//     fontWeight: 'bold',
//   },
//   replyingTo: {
//     // backgroundColor: '#0a171e',
//     backgroundColor: '#ffffff36',
//     width: '100%',
//     overflow: 'hidden',
//     borderRadius: 5,
//     marginBottom: -27,
//     marginTop: -48,
//     borderLeftWidth: 4,
//     position: 'relative',
//     borderLeftColor: '#9e005d89',
//     padding: 8,
//     paddingTop: 24,
//   },
// });

const styles = StyleSheet.create({
  mainWriteUpCover: {
    // position: 'absolute',
    width: '100%',
    paddingHorizontal: 20,
    // backgroundColor: '#0a171e',
    justifyContent: 'center',
    alignItems: 'center',
    // bottom: 20,
  },
  writeUpCover: {
    width: '100%',
    // paddingVertical: 7,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#202d34',
    marginTop: -28,
    zIndex: 10,
    // paddingTop: 2,
    borderRadius: 35,
  },
  styleTextInput: {
    marginLeft: 30,
    color: '#fff',
    width: '70%',
    fontFamily: 'Overpass-Regular',
    textAlignVertical: 'top',
  },

  sendHereBG: {
    // backgroundColor: '#9e005d99',
    backgroundColor: '#e20154',
    width: 40,
    height: 40,
    position: 'relative',
    alignSelf: 'flex-end',
    marginRight: 7,
    marginLeft: 'auto',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    borderRadius: 40,
  },
  time: {
    alignSelf: 'flex-end',
    // color: '#0a171e',
    position: 'absolute',
    top: 3,
    left: 4,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  close: {
    color: '#999',
    marginLeft: 'auto',
    fontSize: 11,
  },
  closeCover: {
    alignSelf: 'flex-end',
    // color: '#0a171e',
    position: 'absolute',
    top: 3,
    right: 7,
    width: 40,
    height: 40,

    fontWeight: 'bold',
  },
  replyingTo: {
    // backgroundColor: '#0a171e',
    backgroundColor: '#ffffff36',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: -7,
    borderLeftWidth: 4,
    position: 'relative',
    borderLeftColor: '#9e005d89',
    padding: 8,
    paddingTop: 24,
  },
});
