import React, {
  memo,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useNavigation} from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import SvgUpload from '../../assets/upload.png';
import Button from '../../components/button';
import Unsupported from '../../assets/unsupported.png';
import {MainContext} from '../../../App';
import {PostContext} from '../../../postVideoCTX';
const CommentSections = React.lazy(() => import('./commentSections'));
const Upload = ({
  uploadVideo,
  compressingMsg = 'compressingMsg HERE!!',
  showBottomSheetHandler,
}) => {
  const CTX = useContext(MainContext);
  const PostCTX = useContext(PostContext);
  const navigation = useNavigation();
  const [isVideo, setIsVideo] = useState(null);
  const [isCompression, setIsCompression] = useState(false);
  const playerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const selectVideoHandler = () => {
    const calcTimeFrame = CTX.userObj?.monetize ? 600 : 120;
    setIsPaused(true);

    ImagePicker.launchImageLibrary(
      {
        mediaType: 'video',
        quality: 1,
        selectionLimit: 1,
        presentationStyle: 'pageSheet',
        includeExtra: true,
        includeBase64: true,
        durationLimit: 60,
      },
      response => {
        if (response.errorCode) {
          console.log('ImagePicker Error: ', response);
          createThreeButtonAlert(response.errorMessage || 'Permission needed');
          return;
        }

        if (response.assets) {
          if (response.assets[0]?.duration > calcTimeFrame) {
            PostCTX.setErrMsg(
              CTX.userObj?.monetize
                ? 'Video file size is too big, 10 minutes video is enough'
                : 'Video must be at least a one minute video',
            );
            PostCTX.setShowMsg(true);
            return;
          }

          setIsVideo(response.assets[0]?.type?.includes('video'));
          PostCTX.setVideo({...response.assets[0]});
          // conpressVideoHere(response.assets[0]);

          // console.log("RNFS.TemporaryDirectoryPath =>>> ");
          // console.log("RNFS.TemporaryDirectoryPath =>>> ", RNFS.TemporaryDirectoryPath);
          // console.log("response.assets[0] =>>> ", response.assets[0].uri);
          // console.log("RNFS.TemporaryDirectoryPath =>>> ");
          // console.log("RNFS.TemporaryDirectoryPath =>>> ");

          // if (response.assets[0]?.type?.includes('video')) {
          //   compressVideo(response.assets[0].uri);
          //   getFFmpegDetails();
          // }
          // return;
        }
        return;
      },
    );
  };

  const onLoadHandler = meta => {
    playerRef.current.seek(0);
    PostCTX.setDuration(meta.duration);
  };
  const showErrorHandler = () => {
    PostCTX.setErrMsg('There error loading the video');
    PostCTX.setShowMsg(true);
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        <View style={styles.firstVersion}>
          <Pressable
            onPress={() => {
              navigation.replace('Navigation');
              PostCTX?.setIsUploadingNew(false);
            }}>
            <AntDesign name="close" size={30} color="#000" />
          </Pressable>
        </View>

        {showComment ? (
          <Suspense
            fallback={
              <View style={styles.activityCover}>
                <ActivityIndicator color={'#fff'} size={40} />
              </View>
            }>
            <CommentSections
              setShowComment={setShowComment}
              uploadVideo={uploadVideo}
              isVideo={isVideo}
              showBottomSheetHandler={showBottomSheetHandler}
            />
          </Suspense>
        ) : (
          <>
            {/* {!uploadVideo ? ( */}
            {!uploadVideo && <View style={{width: '100%', padding: 20}}>
              <Text
                style={{
                  ...styles.hiCover,
                  // fontFamily: "SofiaSansSemiCondensed-Regular",
                  fontFamily: 'Overpass-Regular',
                  // textTransform: 'capitalize',
                }}>
                Hi {CTX?.userObj?.username},
              </Text>

              {CTX.userObj?.monetize && CTX.userObj?.private_life ? (
                <Text
                  style={{
                    ...styles.secondVersionBody,
                    fontFamily: 'Overpass-Regular',
                  }}>
                  Your account is monetized. you can now upload up to a 5
                  minutes video on your private live account.
                </Text>
              ) : !CTX.userObj?.monetize && CTX.userObj?.private_life ? (
                <View>
                  <Text
                    style={{
                      ...styles.secondVersionBody,
                      fontFamily: 'Overpass-Regular',
                    }}>
                    You are about to change your private live video. Upload more
                    interesting videos to get more audience so you can actually
                    get your account monetize.
                  </Text>
                  <Text
                    style={{
                      color: 'blue',
                      fontSize: 15,
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}>
                    Learn more
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    ...styles.secondVersionBody,
                    fontFamily: 'Overpass-Regular',
                  }}>
                  You are one step to access the private live section please
                  upload at least a one minute video.
                </Text>
              )}
            </View>}

            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {!uploadVideo && !isVideo ? (
                <Image
                  style={{...styles.imageHere, marginLeft: 30}}
                  source={SvgUpload}
                />
              ) : uploadVideo && !isVideo ? (
                <View style={styles.backgroundVideoCover}>
                  <Image
                    style={{...styles.imageHere, width: '100%'}}
                    source={Unsupported}
                  />
                  <Text
                    style={{color: 'red', textAlign: 'center', marginTop: 10}}>
                    {PostCTX.errMsg?.length > 1
                      ? PostCTX.errMsg
                      : ' Unsupported file type'}
                  </Text>
                </View>
              ) : (
                <>
                  {isCompression ? (
                    //  video is compressing
                    <Pressable
                      style={{
                        ...styles.backgroundVideoCover,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80%',
                      }}>
                      <Text
                        style={{...styles.secondVersionBody, marginBottom: 20}}>
                        {compressingMsg}
                      </Text>
                    </Pressable>
                  ) : (
                    <>
                      <Pressable
                        onPress={() => setIsPaused(!isPaused)}
                        style={{...styles.backgroundVideoCover}}>
                        {isPaused && (
                          <Pressable
                            onPress={() => setIsPaused(false)}
                            style={styles.pausedIcon}>
                            <Ionicon name="play" color="#a5a5a597" size={68} />
                          </Pressable>
                        )}

                        <Video
                          source={{
                            uri: uploadVideo?.uri,
                          }}
                          style={styles.backgroundVideo}
                          repeat={true}
                          // onBuffer={this.onBuffer}
                          ref={playerRef}
                          resizeMode={PostCTX.isCover ? 'cover' : 'contain'}
                          paused={isPaused}
                          onError={showErrorHandler}
                          // onProgress={progressHandler}
                          onLoad={onLoadHandler} // this will set first frame of video as thumbnail
                          preferredDecoder={'software'}
                        />

                        {/* <Text style={styles.selectedFileName}>
                          {uploadVideo?.fileName}
                        </Text> */}
                      </Pressable>
                    </>
                  )}
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <View style={styles.bottomSmth}>
        {showComment ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowComment(false)}
              style={styles.editIconHereCover}>
              <Text
                style={{
                  color: '#e20154',
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                Back
              </Text>
            </TouchableOpacity>
            <Button
              loading={PostCTX.upLoading}
              label={'Upload Video'}
              pressableStyle={{
                width: 160,
                height: 40,
              }}
              onPress={PostCTX.conpressVideoHere}
            />
          </>
        ) : (
          <>
            {isVideo ? (
              <>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={selectVideoHandler}
                    style={styles.editIconHereCover}>
                    <Text
                      style={{
                        color: '#e20154',
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}>
                      Change Video
                    </Text>
                  </TouchableOpacity>

                  <Pressable
                    onPress={() => PostCTX.setIsCover(!PostCTX.isCover)}
                    style={styles.setIsCover}>
                    <MaterialCommunityIcons
                      size={37}
                      name={PostCTX.isCover ? 'contain' : 'resize'}
                      color={'#000'}
                    />
                  </Pressable>
                </View>

                <Button
                  label={'Next'}
                  pressableStyle={{
                    width: 110,
                    height: 40,
                  }}
                  onPress={() => setShowComment(true)}
                />
              </>
            ) : (
              <>
                <View style={{width: '65%'}}>
                  <Text
                    style={{
                      ...styles.hiCover,
                      paddingVertical: 0,
                      fontSize: 18,
                      marginTop: 0,
                    }}>
                    Browse file
                  </Text>

                  <Text
                    style={{
                      color: '#555555',
                      fontSize: 12,
                      fontFamily: 'Gilroy-Bold',
                    }}>
                    {CTX.userObj?.monetize && CTX.userObj?.private_life
                      ? 'Any video file, 10 minutes maximum.'
                      : 'Any video file, 1 minutes maximum.'}
                  </Text>
                </View>
                <Button
                  label={uploadVideo && isVideo ? 'Next' : 'Select'}
                  pressableStyle={{
                    width: 110,
                    height: 40,
                  }}
                  onPress={() =>
                    uploadVideo && isVideo
                      ? setShowComment(true)
                      : selectVideoHandler()
                  }
                />
              </>
            )}
          </>
        )}
      </View>
    </>
  );
};
// uploadVideo && isVideo ? uploadVideoToServer :
export default memo(Upload);

// ERROR  Error uploading video: [storage/object-not-found] No object exists at the desired reference.
