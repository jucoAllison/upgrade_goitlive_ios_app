import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/core';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import countries from '../../data/countries';
import phoneCode from '../../data/phoneCode';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';

import styles from './createAccount.styles';
import {MainContext} from '../../../App';
// import MyCheckbox from '../../components/checkbox';

const CreateAccount = ({
  full_name,
  email,
  account_type,
  username,
  setFull_name,
  setUsernameHandler,
  setEmailHandler,
  setAccount_type,
  phone,
  setPhone,
  createAccountHandler,
  loading,
  clearAllUsername,
  usernameErr,
  usernameLoading,
  showMsgHere,
  emailErr,
  emailLoading,
  country,
  setCountry,
}) => {
  const [topIndex, setIndex] = useState(null);
  const listCate = [{name: 'Personal'}, {name: 'Business'}];
  const [showAbsolute, setShowAbsolute] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapping =
    // showAbsolute == 'type' ? ['40%', '40%'] : ['25%', '40%', '70%'];
    ['40%', '50%'];
  const snapPoints = useMemo(() => [...snapping], []);
  const navigation = useNavigation();
  const CTX = useContext(MainContext);
  const [userNameError, showUserNameError] = useState(false);

  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute('type');
    // bottomSheetModalRef.current?.present();
  }, []);

  const closeModalPress = useCallback(() => {
    setShowAbsolute(null);
    bottomSheetModalRef.current?.close();
  }, []);

  const onChangeSelected = (index, e) => {
    setIndex(index);
    setAccount_type(listCate[index].name);
    setTimeout(() => {
      closeModalPress();
    }, 500);
  };

  const contactHandler = () => {
    try {
      // const url = 'mailto:help@goitlive.com';
      const url = 'https://goitlive.com/terms-and-conditions/index.html';
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            Alert.alert('Error', 'Unable to open mail app.');
          }
        })
        .catch(err => console.error('An error occurred', err));
    } catch (error) {
      console.log('error from contactHandler =>> ', error);
    }
  };

  const policyHandler = () => {
    try {
      // const url = 'mailto:help@goitlive.com';
      const url = 'https://goitlive.com/privacy-policy/index.html';
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            Alert.alert('Error', 'Unable to open mail app.');
          }
        })
        .catch(err => console.error('An error occurred', err));
    } catch (error) {
      console.log('error from contactHandler =>> ', error);
    }
  };

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

  const renderItem = useCallback(
    (item, index) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setTimeout(() => {
            closeModalPress();
          }, 500);

          setCountry(item);
        }}
        key={index}
        style={{...styles.coverUserCommentSection, marginBottom: 0}}>
        <Text style={styles.sortText}>
          {item.country_en + ' ' + `(+${item.phone_code})`}
        </Text>
        <View
          style={{
            ...styles.clickable,
            backgroundColor:
              country?.phone_code == item?.phone_code ? '#e20154' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>
    ),
    [country],
  );

  //

  const renderType = useCallback(
    (item, index) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChangeSelected(index)}
        key={index}
        style={styles.coverUserCommentSection}>
        <Text style={styles.sortText}>{item.name}</Text>
        <View
          style={{
            ...styles.clickable,
            backgroundColor: index == topIndex ? '#e20154' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>
    ),
    [topIndex],
  );

  return (
    <>
      {showAbsolute && (
        <Pressable
          onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
          }}>
          <BottomSheet
            ref={bottomSheetModalRef}
            index={1}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{...styles.reactionText, color: '#fff'}}>
                  {showAbsolute == 'type' ? 'Account type' : 'Country'}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={closeModalPress}
                  style={styles.closeLine}>
                  <Ionicons color={'#838289'} name="close" size={23} />
                </TouchableOpacity>
              </View>
            )}>
            <BottomSheetScrollView style={{width: '100%', height: '100%'}}>
              <Pressable
                style={{flex: 1, backgroundColor: '#fff'}}
                onPress={() => {
                  return null;
                }}>
                {/* <Text style={{color: 'red'}}> HELLO WORLD HERE </Text> */}
                <View style={{padding: 20}}>
                  <Text
                    style={{
                      ...styles.categoryText,
                      fontSize: 17,
                      textAlign: 'left',
                    }}>
                    {showAbsolute == 'type'
                      ? 'Select account type'
                      : 'Select country code'}
                  </Text>

                  {/* map the account type here */}
                  {
                    showAbsolute == 'type'
                      ? // <FlatList
                        //   style={{marginTop: 20}}
                        //   data={listCate}
                        //   showsVerticalScrollIndicator={false}
                        //   renderItem={({item, index}) => (
                        //     <TouchableOpacity
                        //       activeOpacity={0.8}
                        //       onPress={() => onChangeSelected(index)}
                        //       key={index}
                        //       style={styles.coverUserCommentSection}>
                        //       <Text style={styles.sortText}>{item.name}</Text>
                        //       <View
                        //         style={{
                        //           ...styles.clickable,
                        //           backgroundColor:
                        //             index == topIndex ? '#e20154' : '#fff',
                        //         }}>
                        //         <View style={styles.innerCircle}></View>
                        //       </View>
                        //     </TouchableOpacity>
                        //   )}
                        // />

                        listCate?.map(renderType)
                      : phoneCode
                          ?.sort((a, b) =>
                            a.country_en.localeCompare(b.country_en),
                          )
                          ?.map(renderItem)

                    //                   <BottomSheetFlatList
                    //                     data={phoneCode}
                    //                     keyExtractor={(item, index) => index.toString()}
                    //                     renderItem={renderItem}
                    //                     // contentContainerStyle={styles.contentContainer}
                    //                     style={{
                    //                       width: '100%',
                    //   height: '100%',
                    //   flexDirection: 'row',
                    //   marginBottom: 10,
                    //   // paddingBottom: 10,
                    //   // alignItems: 'center',
                    //   // justifyContent: 'space-between',
                    // }}
                    //                     contentContainerStyle={{alignItems: 'center',
                    //   justifyContent: 'space-between'}}
                    //                   />
                  }
                </View>
              </Pressable>
            </BottomSheetScrollView>
          </BottomSheet>
        </Pressable>
      )}
      <ImageBackground
        source={{uri: CTX.systemConfig?.loginBackgroundImageUrl}}
        style={styles.styleLandingLogo}>
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          hidden={true}
        />
        <View style={styles.coverHere}></View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{
            backgroundColor: '#00000088',
            width: '100%',
            height: '100%',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backTouchableOpacity}
            onPress={() => navigation.navigate('Number')}>
            <MaterialIcons
              size={27}
              name="arrow-back-ios"
              style={{marginLeft: 10}}
              color={'#fff'}
            />
          </TouchableOpacity>
          <View style={styles.positionAbsoluteView}>
            <Text style={styles.whatsYourNumber}>Create Account</Text>

            <View style={styles.textInputLinkCover}>
              <Entypo name="user" size={22} color="#3b3b3b" />
              <TextInput
                style={styles.inputTextInput}
                value={full_name}
                onChangeText={setFull_name}
                placeholder="Display name"
                placeholderTextColor={'#262626'}
              />
            </View>

            {/* <View
            style={{
              ...styles.textInputLinkCover,
              borderColor: emailErr ? '#e20154' : '#fff',
            }}>
            <MaterialCommunityIcons name="email" size={22} color="#3b3b3b" />
            <TextInput
              style={{
                ...styles.inputTextInput,
                color: emailErr ? '#e20154' : '#3b3b3b',
              }}
              placeholder="Email"
              placeholderTextColor={'#262626'}
              keyboardType="email-address"
              value={email}
              autoCapitalize="none"
              onChangeText={setEmailHandler}
            />
            {emailLoading && (
              <ActivityIndicator
                color="#e20154"
                size={20}
                style={{marginLeft: 'auto', marginRight: 20}}
              />
            )}
          </View> */}

            <View
              style={{
                ...styles.textInputLinkCover,
                backgroundColor: '#bbb',
                borderColor: '#bbb',
                height: 50,
              }}>
              <MaterialCommunityIcons name="email" size={22} color="#3b3b3b" />
              <Text style={styles.inputTextInput}>{email}</Text>
            </View>

            {/* <View
            style={{
              ...styles.textInputLinkCover,
              backgroundColor: '#bbb',
              borderColor: '#bbb',
              height: 50,
            }}>
            <FontAwesome5 name="phone-alt" size={22} color="#3b3b3b" />
            <Text style={styles.inputTextInput}>{phone}</Text>
          </View> */}

            <View
              style={{
                width: '100%',
                borderRadius: 5,
                borderWidth: 2,
                backgroundColor: '#fff',
                flexDirection: 'row',
                overflow: 'hidden',
                height: 50,
                marginVertical: 10,
                alignItems: 'center',
                borderColor: '#fff',
                position: 'relative',
                paddingLeft: 20,
                borderColor: usernameErr ? '#e20154' : '#fff',
              }}>
              <FontAwesome name="user" size={25} color="#3b3b3b" />
              <TextInput
                style={{
                  ...styles.inputTextInput,
                  color: usernameErr ? '#e20154' : '#3b3b3b',
                  paddingLeft: 24,
                }}
                // onFocus={() => showUserNameError(true)}
                // onBlur={() => showUserNameError(false)}
                autoCapitalize="none"
                placeholder="Username"
                placeholderTextColor={'#262626'}
                value={username}
                onChangeText={e => setUsernameHandler(e)}
              />
              {usernameLoading && (
                <ActivityIndicator
                  color="#e20154"
                  size={20}
                  style={{marginLeft: 'auto', marginRight: 20}}
                />
              )}
              {username?.length > 2 && (
                <Pressable
                  onPress={clearAllUsername}
                  style={{
                    color: '#e20154',
                    fontWeight: 'bold',
                    marginLeft: 'auto',
                    marginRight: 8,
                    position: 'absolute',
                    top: 14,
                    right: 0,
                  }}>
                  <Fontisto name="close" size={18} color="#000" />
                </Pressable>
              )}
            </View>
            {usernameErr && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  marginBottom: 5,
                }}>
                <Ionicons
                  name="warning"
                  color="#e20154"
                  size={17}
                  style={{marginRight: 7}}
                />

                <Text style={{color: '#e20154', fontSize: 11}}>
                  {usernameErr}
                </Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={showBottomSheetHandler}
              style={{...styles.textInputLinkCover, height: 46}}>
              <MaterialCommunityIcons
                name="typewriter"
                size={22}
                color="#3b3b3b"
              />
              <Text style={{...styles.inputTextInput}}>{account_type}</Text>
            </TouchableOpacity>

            <View
              style={{
                ...styles.textInputLinkCover,
                borderColor: emailErr ? '#e20154' : '#fff',
                // paddingLeft: 10
              }}>
              <Pressable
                onPress={() => {
                  setShowAbsolute('phone');
                  // bottomSheetModalRef.current?.present();
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <Image
                  source={{
                    uri: countries?.filter(
                      v =>
                        v?.name?.common?.toLowerCase() ==
                        country?.country_en?.toLowerCase(),
                    )[0]?.flags?.png,
                  }}
                  style={styles.roundImage}
                /> */}

                <Text style={{color: '#000'}}>+{country?.phone_code}</Text>

                <MaterialIcons
                  name="arrow-drop-down"
                  size={18}
                  color="#3b3b3b"
                  style={{marginLeft: 3}}
                />
              </Pressable>
              <TextInput
                style={{
                  ...styles.inputTextInput,
                  paddingLeft: 8,
                }}
                placeholder="Phone number"
                placeholderTextColor={'#262626'}
                value={phone}
                autoCapitalize="none"
                onChangeText={e => {
                  const inputValue = e;
                  const newValue = inputValue.replace(/\D/g, ''); // Replace non-numeric characters with an empty string
                  setPhone(newValue);
                }}
              />
            </View>

            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginRight: 'auto',
                marginBottom: 26,
                marginTop: 17,
              }}>
              <MyCheckbox
                checked={isChecked}
                onChange={newValue => setIsChecked(newValue)}
              />
              <View style={{flexDirection: 'column', marginLeft: 8}}>
                <Text style={{fontSize: 14, color: '#fff'}}>
                  By using this app, you agree to the{' '}
                </Text>
                <Text
                  onPress={contactHandler}
                  style={{
                    fontSize: 14,
                    textDecorationColor: '#fff',
                    color: '#fff',
                    textDecorationLine: 'underline',
                  }}>
                  Terms and Condition (EULA) &
                  <Text
                    onPress={policyHandler}
                    style={{
                      textDecorationColor: '#fff',
                      textDecorationLine: 'underline',
                    }}>
                    {' '}
                    Privacy Policy.
                  </Text>
                </Text>
              </View>
            </View> */}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                if (emailRegex.test(email)) {
                  createAccountHandler();
                }
                return;
                // const fullNumber = parsePhoneNumber(
                //   phone,
                //   country?.country_code,
                // );

                // console.log('fullNumber.isValid() =>> ', fullNumber.isValid());
              }}
              style={{paddingTop: 10, width: '100%'}}>
              <View style={styles.eachBtnCover}>
                {loading ? (
                  <ActivityIndicator color="#fff" size={30} />
                ) : (
                  <Text style={styles.eachBtnText}>Create account</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default CreateAccount;

// import {
//   View,
//   Text,
//   ImageBackground,
//   StatusBar,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
// import Entypo from 'react-native-vector-icons/Entypo';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useNavigation} from '@react-navigation/core';
// // import BottomSheet, {BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
// // import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
// import BottomSheet from '@gorhom/bottom-sheet';

// //   import BottomSheet, {
// //   BottomSheetBackdrop,
// //   BottomSheetScrollView,
// // } from '@gorhom/bottom-sheet';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import styles from './createAccount.styles';
// import {MainContext} from '../../../App';

// const CreateAccount = ({
//   full_name,
//   email,
//   account_type,
//   username,
//   setFull_name,
//   setUsernameHandler,
//   setEmailHandler,
//   setAccount_type,
//   phone,
//   createAccountHandler,
//   loading,
//   clearAllUsername,
//   usernameErr,
//   usernameLoading,
//   showMsgHere,
//   emailErr,
//   setPhone,
//   emailLoading,
// }) => {
//   const [topIndex, setIndex] = useState(null);
//   const listCate = [{name: 'Student'}, {name: 'Business'}];
//   const [showAbsolute, setShowAbsolute] = useState(false);
//   const bottomSheetModalRef = useRef(null);
//   const snapPoints = useMemo(() => ['40%', '40%'], []);
//   const navigation = useNavigation();
//   const CTX = useContext(MainContext);

//   // const showBottomSheetHandler = useCallback(() => {
//   //   setShowAbsolute(true);
//   //   bottomSheetModalRef.current?.present();
//   // }, []);

//   // const closeModalPress = useCallback(() => {
//   //   setShowAbsolute(false);
//   //   bottomSheetModalRef.current?.dismiss();
//   // }, []);

//   const showBottomSheetHandler = useCallback(() => {
//     setShowAbsolute(true);
//   }, []);
//   const closeModalPress = useCallback(() => {
//     setShowAbsolute(false);
//     bottomSheetModalRef.current?.close();
//   }, []);

//   const onChangeSelected = (index, e) => {
//     setIndex(index);
//     setAccount_type(listCate[index].name);
//     setTimeout(() => {
//       closeModalPress();
//     }, 500);
//   };
//   // renders
//   const renderBackdrop = useCallback(
//     props => (
//       <BottomSheetBackdrop
//         {...props}
//         disappearsOnIndex={1}
//         appearsOnIndex={2}
//       />
//     ),
//     [],
//   );

//   // callbacks
//   const handleSheetChanges = useCallback((index) => {
//     console.log('handleSheetChanges', index);
//   }, []);

//   return (
//     <>
//       {/* <Pressable
//         onPress={closeModalPress}
//         style={{
//           ...styles.showAbsolute,
//           // display: showAbsolute ? 'flex' : 'none',
//         }}>
//         <BottomSheetModalProvider>
//           <BottomSheetModal
//             ref={bottomSheetModalRef}
//             index={1}
//             enablePanDownToClose={true}
//             snapPoints={snapPoints}
//             handleComponent={() => (
//               <View style={styles.handleComponentStyle}>
//                 <Text style={{...styles.reactionText, color: '#fff'}}>
//                   Account type
//                 </Text>

//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   onPress={closeModalPress}
//                   style={styles.closeLine}>
//                   <Ionicons color={'#838289'} name="close" size={23} />
//                 </TouchableOpacity>
//               </View>
//             )}>
//             <Pressable
//               style={{flex: 1}}
//               onPress={() => {
//                 return null;
//               }}>
//               <Text style={{color: 'red'}}> HELLO WORLD HERE </Text>
//               <View style={{padding: 20}}>
//                 <Text
//                   style={{
//                     ...styles.categoryText,
//                     fontSize: 17,
//                     textAlign: 'left',
//                   }}>
//                   Select account type
//                 </Text>
//  // map the account type here
//                 <FlatList
//                   style={{marginTop: 20}}
//                   data={listCate}
//                   showsVerticalScrollIndicator={false}
//                   renderItem={({item, index}) => (
//                     <TouchableOpacity
//                       activeOpacity={0.8}
//                       onPress={() => onChangeSelected(index)}
//                       key={index}
//                       style={styles.coverUserCommentSection}>
//                       <Text style={styles.sortText}>{item.name}</Text>
//                       <View
//                         style={{
//                           ...styles.clickable,
//                           backgroundColor:
//                             index == topIndex ? '#e20154' : '#fff',
//                         }}>
//                         <View style={styles.innerCircle}></View>
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>
//             </Pressable>
//           </BottomSheetModal>
//         </BottomSheetModalProvider>
//       </Pressable> */}

//       {/* {showAbsolute && ( */}
//         {/* <Pressable
//           onPress={closeModalPress}
//           style={{
//             ...styles.showAbsolute,
//           }}>
//           <BottomSheet
//             ref={bottomSheetModalRef}
//             index={1}
//             snapPoints={snapPoints}
//             backdropComponent={renderBackdrop}
//             handleComponent={() => (
//               <View style={styles.handleComponentStyle}>
//                 <Text style={{...styles.reactionText, color: '#fff'}}>
//                   Account type
//                 </Text>

//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   onPress={closeModalPress}
//                   style={styles.closeLine}>
//                   <Ionicons color={'#838289'} name="close" size={23} />
//                 </TouchableOpacity>
//               </View>
//             )}>
//             <Pressable
//               style={{flex: 1}}
//               onPress={() => {
//                 return null;
//               }}>

//               <View style={{padding: 20}}>
//                 <Text
//                   style={{
//                     ...styles.categoryText,
//                     fontSize: 17,
//                     textAlign: 'left',
//                   }}>
//                   Select account type
//                 </Text>

//                 <FlatList
//                   style={{marginTop: 20}}
//                   data={listCate}
//                   showsVerticalScrollIndicator={false}
//                   renderItem={({item, index}) => (
//                     <TouchableOpacity
//                       activeOpacity={0.8}
//                       onPress={() => onChangeSelected(index)}
//                       key={index}
//                       style={styles.coverUserCommentSection}>
//                       <Text style={styles.sortText}>{item.name}</Text>
//                       <View
//                         style={{
//                           ...styles.clickable,
//                           backgroundColor:
//                             index == topIndex ? '#e20154' : '#fff',
//                         }}>
//                         <View style={styles.innerCircle}></View>
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>

//             </Pressable>
//           </BottomSheet>
//         </Pressable> */}
//       {/* )} */}

//       <BottomSheet
//         ref={bottomSheetModalRef}
//         onChange={handleSheetChanges}
//       >
//         <BottomSheetView style={styles.contentContainer}>
//           <Text>Awesome 🎉</Text>
//         </BottomSheetView>
//       </BottomSheet>

//       <ImageBackground
//         source={{uri: CTX.systemConfig?.loginBackgroundImageUrl}}
//         style={styles.styleLandingLogo}>
//         <StatusBar
//           animated={true}
//           backgroundColor={CTX.statusBarColor}
//           hidden={true}
//         />
//         <View style={styles.coverHere}></View>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           style={styles.backTouchableOpacity}
//           onPress={() => navigation.navigate('Number')}>
//           <MaterialIcons
//             size={27}
//             name="arrow-back-ios"
//             style={{marginLeft: 10}}
//             color={'#fff'}
//           />
//         </TouchableOpacity>
//         <View style={styles.positionAbsoluteView}>
//           <Text style={styles.whatsYourNumber}>Create Account</Text>

//           <View style={styles.textInputLinkCover}>
//             <Entypo name="user" size={22} color="#3b3b3b" />
//             <TextInput
//               style={styles.inputTextInput}
//               value={full_name}
//               onChangeText={setFull_name}
//               placeholder="Display name"
//               placeholderTextColor={'#262626'}
//             />
//           </View>

//           <View
//             style={{
//               ...styles.textInputLinkCover,
//               backgroundColor: '#bbb',
//               borderColor: '#bbb',
//               // borderColor: emailErr ? '#e20154' : '#fff',
//             }}>
//             <MaterialCommunityIcons name="email" size={22} color="#3b3b3b" />
//             {/* <TextInput
//               style={{
//                 ...styles.inputTextInput,
//                 color: emailErr ? '#e20154' : '#3b3b3b',
//               }}
//               placeholder="Email"
//               placeholderTextColor={'#262626'}
//               keyboardType="email-address"
//               value={email}
//               autoCapitalize="none"
//               onChangeText={setEmailHandler}
//             /> */}
//             {emailLoading && (
//               <ActivityIndicator
//                 color="#e20154"
//                 size={20}
//                 style={{marginLeft: 'auto', marginRight: 20}}
//               />
//             )}
//             <Text style={styles.inputTextInput}>{email}</Text>
//           </View>

//           <View
//             style={{
//               ...styles.textInputLinkCover,
//               // backgroundColor: '#bbb',
//               // borderColor: '#bbb',
//               height: 50,
//             }}>
//             <FontAwesome5 name="phone-alt" size={22} color="#3b3b3b" />
//             <TextInput
//               style={{
//                 ...styles.inputTextInput,
//                 color: emailErr ? '#e20154' : '#3b3b3b',
//               }}
//               placeholder="Phone"
//               placeholderTextColor={'#262626'}
//               keyboardType="phone-number"
//               value={phone}
//               autoCapitalize="none"
//               onChangeText={setPhone}
//             />
//             {emailLoading && (
//               <ActivityIndicator
//                 color="#e20154"
//                 size={20}
//                 style={{marginLeft: 'auto', marginRight: 20}}
//               />
//             )}
//             {/* <Text style={styles.inputTextInput}>{phone}</Text> */}
//           </View>

//           <Pressable
//             onPress={() => showMsgHere()}
//             style={{
//               ...styles.textInputLinkCover,
//               borderColor: usernameErr ? '#e20154' : '#fff',
//               position: 'relative',
//             }}>
//             <FontAwesome name="user" size={22} color="#3b3b3b" />
//             <TextInput
//               style={{
//                 ...styles.inputTextInput,
//                 color: usernameErr ? '#e20154' : '#3b3b3b',
//               }}
//               autoCapitalize="none"
//               placeholder="Username"
//               placeholderTextColor={'#262626'}
//               value={username}
//               onChangeText={e => setUsernameHandler(e)}
//             />
//             <View style={{position: 'absolute', top: 12, right: 16}}>
//               {usernameLoading && (
//                 <ActivityIndicator
//                   color="#e20154"
//                   size={20}
//                   // style={{marginLeft: 'auto', marginRight: 20}}
//                 />
//               )}
//               {username.length == 1 && (
//                 <Text
//                   onPress={clearAllUsername}
//                   style={{
//                     color: '#e20154',
//                     fontWeight: 'bold',
//                     // marginLeft: 'auto',
//                     // marginRight: 20,
//                   }}>
//                   Clear all
//                 </Text>
//               )}
//             </View>
//           </Pressable>

//           <TouchableOpacity
//             activeOpacity={0.8}
//             onPress={showBottomSheetHandler}
//             style={{...styles.textInputLinkCover, height: 46}}>
//             <MaterialCommunityIcons
//               name="typewriter"
//               size={22}
//               color="#3b3b3b"
//             />
//             <Text style={{...styles.inputTextInput}}>{account_type}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             activeOpacity={0.8}
//             onPress={() => {
//               const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//               if (emailRegex.test(email)) {
//                 createAccountHandler();
//               }
//               return;
//             }}
//             style={{paddingTop: 10, width: '100%'}}>
//             <View style={styles.eachBtnCover}>
//               {loading ? (
//                 <ActivityIndicator color="#fff" size={30} />
//               ) : (
//                 <Text style={styles.eachBtnText}>Create account</Text>
//               )}
//             </View>
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>
//     </>
//   );
// };

// export default CreateAccount;
