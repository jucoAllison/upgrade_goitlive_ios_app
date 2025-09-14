import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {MainContext} from '../../../App';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import countries from '../../data/countries';
import phoneCode from '../../data/phoneCode';
import Button from '../../components/button';
const Number = ({
  phone,
  loading,
  setPhone,
  submitPhoneHere,
  accType,
  setAccType,
}) => {
  const CTX = useContext(MainContext);
  const data = useMemo(() => phoneCode, []);

  const [countryImg, setCountryImg] = useState({
    flags: {
      png: 'https://flagcdn.com/w320/ng.png',
      svg: 'https://flagcdn.com/ng.svg',
    },
  });
  const [search, setSearch] = useState('');
  // const navigator = useNavigation();
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  // const snapPoints = useMemo(() => ['30%', '70%'], []);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute(true);
    bottomSheetModalRef.current?.snapToIndex(0);
  }, []);

  const closeModalPress = useCallback(() => {
    setShowAbsolute(false);
    bottomSheetModalRef.current?.close();
  }, []);

  const onChangeSelected = useCallback((index, e) => {
    setSearch('');
    setAccType(index);
    closeModalPress();
    // setTimeout(() => {
    // }, 500);
  }, []);

  useEffect(() => {
    if (accType) {
      setCountryImg(
        countries.filter(v => v?.name?.common == accType.country_en)[0],
      );
    }
  }, [accType]);

  // renders
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  // console.log(
  //   'CTX.systemConfig?.loginBackgroundImageUrl =>> ',
  //   CTX.systemConfig?.loginBackgroundImageUrl,
  // );

  // render
  const renderItem = useCallback(
    (item, index) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChangeSelected(item)}
        key={index}
        style={{...styles.coverUserCommentSection, paddingHorizontal: 20}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.sortText}>{item?.country_en}</Text>
          <Text
            style={{
              ...styles.sortText,
              fontWeight: 'bold',
              marginLeft: 4,
            }}>
            ({item?.phone_code})
          </Text>
        </View>
        <View
          style={{
            ...styles.clickable,
            backgroundColor:
              accType?.country_en == item?.country_en ? 'blue' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );







  return (
    <>
      {showAbsolute && (
        <Pressable
          // onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
            // display: showAbsolute ? 'flex' : 'none',
          }}>
          <BottomSheet
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            // onChange={handleSheetChange}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{...styles.reactionText, color: '#fff'}}>
                  Select country
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
              onPress={() => {
                return null;
              }}>
              <View style={{padding: 20}}>
                <View style={styles.coverSearchHere}>
                  <AntDesign name="search1" color="#262626" size={24} />
                  <TextInput
                    style={styles.innerTextInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search"
                    placeholderTextColor={'#262626'}
                  />
                </View>
              </View>
            </Pressable>

            <BottomSheetScrollView
              contentContainerStyle={styles.contentContainer}>
              <Pressable
                onPress={() => {
                  return null;
                }}>
                {data
                  .filter(v =>
                    v?.country_en
                      ?.toLowerCase()
                      ?.includes(search?.toLowerCase()),
                  )
                  .map(renderItem)}
              </Pressable>
            </BottomSheetScrollView>
          </BottomSheet>
        </Pressable>
      )}
      <ImageBackground
        source={{
          uri:
            CTX.systemConfig?.loginBackgroundImageUrl ||
            'https://ik.imagekit.io/7p9j0gn28d3j/purple-blue-textured-background-wallpaper-app-background-layout-dark-gradient-colors-vintage-distressed-elegant-78118630_7FIHD2N2q.webp?updatedAt=1722595697261',
        }}
        style={styles.styleLandingLogo}>

{/* Alert.alert(
    'Alert Title',
    'My Alert Message',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress:   
 () => console.log('OK Pressed') },
    ],
    { cancelable: false   
 }
  ); */}


        <View style={styles.coverHere}></View>
        <View style={styles.positionAbsoluteView}>
          <Text style={styles.whatsYourNumber}>Number</Text>

          <View style={styles.textInputLinkCover}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => showBottomSheetHandler()}
              style={{
                width: 120,
                paddingLeft: 20,
                height: '100%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={{uri: countryImg?.flags?.png}}
                style={{width: 30, height: 22}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#3b3b3b',
                  marginLeft: 'auto',
                  marginRight: 3,
                }}>
                {accType?.phone_code}
              </Text>
              <Ionicons
                size={20}
                color="#3b3b3b"
                style={{marginRight: 3}}
                name="caret-down-outline"
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTextInput}
              placeholder="Phone number"
              keyboardType="numeric"
              value={phone}
              onChangeText={e => {
                const newValue = e.replace(/\D/g, '');
                setPhone(newValue);
              }}
              placeholderTextColor={'#262626'}
            />
          </View>

          <Button
          
            onPress={() => submitPhoneHere()}
            // onPress={() => createThreeButtonAlert()}
            label={
              loading ? <ActivityIndicator color="#fff" size={30} /> : 'Submit'
            }
            disable={!phone}
            style={{width: '100%', marginTop: 30, height: 50}}
          />
        </View>
      </ImageBackground>
    </>
  );
};

export default Number;

const styles = StyleSheet.create({
  styleLandingLogo: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  backTouchableOpacity: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#0a171e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    top: 20,
  },
  coverHere: {
    width: '100%',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  positionAbsoluteView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: 20,
  },
  whatsYourNumber: {
    fontWeight: 'bold',
    marginBottom: 30,
    fontSize: 30,
    color: '#fff',
  },
  handleComponentStyle: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
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

  showAbsolute: {
    position: 'absolute',
    // backgroundColor: '#d00',
    backgroundColor: '#00003330',
    width: '100%',
    height: '100%',
    zIndex: 2222,
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
  positionAbsolute: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  textInputLinkCover: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',

    overflow: 'hidden',
    backgroundColor: '#fff',
    zIndex: 2000,
  },
  inputTextInput: {
    paddingLeft: 20,
    // marginLeft: 40,
    height: 50,
    color: '#3b3b3b',
    width: '100%',
    // backgroundColor: 'red',
    paddingRight: 15,
  },
  eachBtnCover: {
    backgroundColor: '#e20154',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 55,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  coverUserCommentSection: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    marginBottom: 10,
    // paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortText: {
    color: '#111',
    fontSize: 16,
  },
  coverSearchHere: {
    backgroundColor: '#efefef',
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 45,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },

  innerTextInput: {
    width: '100%',
    color: '#262626',
    marginLeft: 10,
  },
  clickable: {
    width: 30,
    height: 30,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#9f9f9f',
    borderWidth: 2,
  },
  innerCircle: {
    width: 13,
    marginLeft: 1,
    height: 13,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});
