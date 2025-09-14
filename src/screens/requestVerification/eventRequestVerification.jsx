import {
    View,
    Text,
    Pressable,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    StatusBar,
  } from 'react-native';
  import React, {
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from 'react';
  import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import * as ImagePicker from 'react-native-image-picker';
  // import {Image} from 'react-native-compressor';
  // import {GetUserDetails} from '../../helper/getUserHelper';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import ImageKit from 'imagekit-javascript';
  
  import Document from './document';
  import {MainContext} from '../../../App';
  import ErrMessage from '../../components/errMessage/errMessage';
  import RequestVerification from './requestVerification';
  // const RequestVerification = React.lazy(() => import('./requestVerification'));
  const EventRequestVerification = () => {
    const CTX = useContext(MainContext);
    const [full_name, setFull_name] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('');
    const [youtube, setYoutube] = useState('');
    const [aka, setAka] = useState('');
    const [link, setLink] = useState('');
    const [linkk, setLinkk] = useState('');
    const [linkkk, setLinkkk] = useState('');
    const [linkkkk, setLinkkkk] = useState('');
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => [410, 410], []);
    const [showAbsolute, setShowAbsolute] = useState(false);
    const [details, setDetails] = useState('');
    const [documentFileHere, setDocumentFileHere] = useState(null);
    const [isFoundDetails, setIsFoundDetails] = useState(null);
    const [showMsg, setShowMsg] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
  
    const {urlEndpoint, publicKey, authenticationEndpoint} = CTX?.systemConfig;
  
    var imagekitConfigOptions = {urlEndpoint};
    if (publicKey) imagekitConfigOptions.publicKey = publicKey;
    if (authenticationEndpoint)
      imagekitConfigOptions.authenticationEndpoint = authenticationEndpoint;
  
    const imagekit = new ImageKit(imagekitConfigOptions);
  
    const checkVerificaction = async () => {
      try {
        const fetching = await fetch(`${CTX.url}user/verification`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        });
        const parsedJson = await fetching.json();
        if (parsedJson?.isRemoved) {
          return CTX.logoutUser();
        }
        if (parsedJson?.error) {
          setErrMsg(parsedJson?.msg);
          setShowMsg(true);
          return;
        }
        // console.log("parsedJson.data => ");
        // console.log("parsedJson.data => ");
        // console.log("parsedJson.data => ");
        // console.log("parsedJson.data => ");
        // console.log("parsedJson.data => ");
        // console.log("parsedJson.data => ", parsedJson.data);
        // console.log("parsedJson.data => ");
        setIsFoundDetails(parsedJson.data);
      } catch (error) {
        console.log('error fetching data for session! => ', error);
        setErrMsg('Network request failed');
        setShowMsg(true);
      }
    };
  
    useEffect(() => {
      checkVerificaction();
      CTX.setStatusBarColor('#fff');
    }, []);
  
    const setMessageHereToImageKit = async () => {
      setLoading(true);
      mainImageKit(documentFileHere);
    };
  
    const mainImageKit = async file => {
      try {
        const result = await new Promise((resolve, reject) => {
          imagekit.upload(
            {
              // path: file.uri,
              // urlEndpoint: file.uri,
              useUniqueFileName: true,
              file,
              fileName: file.name, // you can change this and generate your own name if required
              folder: file.folder, // change this or remove it if you want
            },
            function (err, result) {
              if (err) reject(err);
              resolve(result);
            },
          );
        });
  
        submitForVerificaction(result);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // rethrow the error to propagate it further if needed
      }
    };
  
    const submitForVerificaction = async obj => {
      if (loading) {
        return;
      }
      if (!documentFileHere) {
        // Image;
        setErrMsg('Choose file and continue');
        setShowMsg(true);
        return;
      }
  
      if (!full_name || !country || !category) {
        setErrMsg('Fill all required input');
        setShowMsg(true);
        return;
      }
  
      setLoading(true);
      try {
        const fetching = await fetch(`${CTX.url}user/verification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({
            avatar: obj,
            document_type: details,
            link: link,
            linkk: linkk,
            linkkk: linkkk,
            linkkkk: linkkkk,
            full_name: full_name,
            country: country,
            aka: aka,
            category: category,
            username: CTX.userObj?.username,
          }),
        });
        const parsedJson = await fetching.json();
        setLoading(false);
        if (parsedJson?.isRemoved) {
          return CTX.logoutUser();
        }
        if (parsedJson?.error) {
          setErrMsg(parsedJson?.msg);
          setShowMsg(true);
          return;
        }
  
        Alert.alert(
          'Please note',
          "If you apply for verification our review team will carefully look over your application. We'll send you a discussion within a month to let you know when the process is complete ( in most cases two months ). You can also check the status of your verification above to let you know our discussion been pending, declined or verified.",
          [
            // {
            //   text: 'Cancel',
            //   onPress: () => console.log('Cancel Pressed'),
            //   style: 'cancel',
            // },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
        );
  
        // const userDetails = await GetUserDetails(CTX.url, CTX.sessionToken);
        const anofetching = await fetch(`${CTX.url}user/auth`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        });
        const anoParsedJson = await anofetching.json();
        // CTX.setToken(parsedJson?.data?.data);
        // console.log('USER DETAILS HERE!!!');
        // console.log('USER DETAILS HERE!!!'); 
        // console.log('parsedJson', parsedJson.data);
        // console.log('USER DETAILS HERE!!!');
        // console.log('USER DETAILS HERE!!!');
  
      //   CTX.setToken(parsedJson.data.token);
      // //   // await AsyncStorage.setItem('@sessionToken', userDetails.token);
      //   CTX.setUserObj(parsedJson.data.user);


        checkVerificaction();
        if (anoParsedJson.data.user) {
          CTX.setToken(anoParsedJson.data.token);
          CTX.setUserObj(anoParsedJson.data.user);
        }
  
        setErrMsg(parsedJson?.msg);
        setShowMsg(true);
  
        setIsFoundDetails(parsedJson.data.data);
      } catch (error) {
        setLoading(false);
        console.log('error fetching data for session! => ', error);
        setErrMsg('Network request failed');
        setShowMsg(true);
      }
    };
  
    // pressing doc type btn
    const showBottomSheetHandler = useCallback(() => {
      setShowAbsolute(true);
      bottomSheetModalRef.current?.present();
    }, []);
    // closing doc type
    const closeModalPress = useCallback(() => {
      setShowAbsolute(false);
      bottomSheetModalRef.current?.dismiss();
    }, []);
  
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
              compressImageHere({...response.assets[0]});
              return;
            }
            return;
          }
        },
      );
    };
  
    const compressImageHere = async uploadVideo => {
      // const source = uploadVideo?.uri;
      // const result = await Image.compress(source, {
      //   compressionMethod: 'auto',
      // });
  
      setDocumentFileHere({
        ...uploadVideo,
        // name: result.split('/').pop(),
        // uri: result,
        folder: 'verification',
      });
      // uploadFileToImagekit(result, uploadVideo);
    };
  
    return (
      <>
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          // hidden={true}
          barStyle="dark-content"
        />
        {showMsg && (
          <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
        )}
        <Pressable
          onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
            display: showAbsolute ? 'flex' : 'none',
          }}>
          <BottomSheetModalProvider
          // onChange={handleSheetChanges}
          >
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              enablePanDownToClose={true}
              snapPoints={snapPoints}
              handleComponent={() => (
                <View style={styles.handleComponentStyle}>
                  <Text style={{...styles.reactionText, color: '#fff'}}>
                    Document type
                  </Text>
  
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={closeModalPress}
                    style={styles.closeLine}>
                    <Ionicons color={'#838289'} name="close" size={23} />
                  </TouchableOpacity>
                </View>
              )}>
              <Pressable
                style={{flex: 1}}
                onPress={() => {
                  return null;
                }}>
                <Document
                  setDetails={setDetails}
                  closeModalPress={closeModalPress}
                />
              </Pressable>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </Pressable>
        {/* <Suspense
          fallback={
            <View style={styles.activityCover}>
              <ActivityIndicator color={'#fff'} size={40} />
            </View>
          }> */}
          <RequestVerification
            full_name={full_name}
            setFull_name={setFull_name}
            youtube={youtube}
            details={details}
            setYoutube={setYoutube}
            showBottomSheetHandler={showBottomSheetHandler}
            documentFileHere={documentFileHere}
            selectImageHandler={selectImageHandler}
            country={country}
            setCountry={setCountry}
            category={category}
            setCategory={setCategory}
            aka={aka}
            link={link}
            linkk={linkk}
            linkkk={linkkk}
            linkkkk={linkkkk}
            setAka={setAka}
            setLink={setLink}
            setLinkk={setLinkk}
            setLinkkk={setLinkkk}
            setLinkkkk={setLinkkkk}
            isFoundDetails={isFoundDetails}
            loading={loading}
            submitForVerificaction={setMessageHereToImageKit}
            checkVerificaction={checkVerificaction}
          />
        {/* </Suspense> */}
      </>
    );
  };
  
  const styles = StyleSheet.create({
    showAbsolute: {
      position: 'absolute',
      backgroundColor: '#00003330',
      width: '100%',
      height: '100%',
      zIndex: 22,
    },
    handleComponentStyle: {
      width: '100%',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      flexDirection: 'row',
      // backgroundColor: '#9e005d',
      backgroundColor: '#e20154',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: '#d1d1d1',
      borderBottomWidth: 2,
    },
    reactionText: {
      color: '#000',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    closeLine: {
      position: 'absolute',
      right: 15,
      backgroundColor: '#e1e1e1',
      width: 30,
      height: 30,
      borderRadius: 20,
      alignItems: 'center',
      marginLeft: 'auto',
      justifyContent: 'center',
    },
    coverMain: {
      flex: 1,
      width: '100%',
      heigth: '100%',
      backgroundColor: '#000',
    },
    activityCover: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: '#0a171e53',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
  });
  
  export default EventRequestVerification;