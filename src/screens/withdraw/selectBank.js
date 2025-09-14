import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  FlatList,
  ActivityIndicator,
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
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import styles from '../private/new/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import bankJson from '../../data/banks';
import {MainContext} from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';

const SelectBank = ({
  inputs,
  setInputs,
  setGottenData,
  selectedText,
  setSelectedText,
}) => {
  const CTX = useContext(MainContext);
  const [isModal, setIsModal] = useState(false);
  const [tagPersonn, setTagPersonn] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  const [mainLoading, setMainLoading] = useState(false);

  const [loadUntilIndex, setLoadUntilIndex] = useState(23); // Load videos up to the first index initially

  // const handleScroll = event => {
  //   try {
  //     const offsetY = event.nativeEvent.contentOffset.y;
  //     const currentIndex = Math.floor
  //       offsetY / Dimensions.get('window').height,
  //     );

  //     // Determine the number of videos you want to load ahead
  //     const loadAheadCount = 40;

  //     // Calculate the index up to which you want to load videos
  //     const newIndex = currentIndex + loadAheadCount;

  //     // Update loadUntilIndex if it has changed
  //     if (newIndex !== loadUntilIndex) {
  //       setLoadUntilIndex(newIndex);
  //     }
  //   } catch (error) {
  //     console.log('error liking a from handleScroll => ', error);
  //   }
  // };

  // const loadMoreItem = () => {
  //   console.log('hasMore from loadMoreItem ==>> ', hasMore);
  //   checkIfUserHasPrivateAccount();
  // };

  const getBankDetails = async () => {
    console.log(
      'return; inputs?.number =>> ',
      `${CTX.url}account/profile/get/user/account/name`,
    );
    if (!inputs?.number) {
      setErrMsg('Account number cannot be left empty');
      setShowMsg(true);
      return;
    }
    setMainLoading(true);
    setShowMsg(false);
    setErrMsg('');
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/get/user/account/name`, // we get three fetching here as
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CTX?.sessionToken}`,
          },
          body: JSON.stringify({
            account_number: inputs?.number?.trim(),
            bank_code: selectedText.code,
          }),
        },
      );
      const response = await fetching.json();

      if (response.error) {
        setMainLoading(false);
        setErrMsg(response?.msg);
        setShowMsg(true);
        setGottenData(null);
        setInputs({...inputs, name: ''});
        return;
      }
      setInputs({...inputs, name: response?.data?.account_name});
      setGottenData(response?.data);
      setMainLoading(false);
      setShowMsg(false);
      setErrMsg('');
    } catch (error) {
      setMainLoading(false);
      console.log('error from uploadVideoToServer ==>> ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (selectedText.code !== '001') {
      getBankDetails();
    }
  }, [selectedText]);
  // console.log(CTX.systemConfig?.svps);

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModal}
        onRequestClose={() => setIsModal(!isModal)}>
        <Pressable style={anoStyles.centeredView}>
          <View style={{...anoStyles.modalView}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                position: 'relative',
              }}>
              <Text
                style={{
                  color: '#555',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                Select bank
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsModal(false)}
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 27,
                  width: 34,
                  height: 34,
                }}>
                <AntDesign
                  name="close"
                  size={20}
                  style={{marginLeft: 'auto'}}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
            <View style={{...styles.coverAnt, padding: 20}}>
              <View style={styles.iCoverSearchHere}>
                <AntDesign name="search1" color="#abb1b8" size={24} />
                <TextInput
                  style={styles.iInnerTextInput}
                  placeholder="Search . . ."
                  placeholderTextColor={'#abb1b8'}
                  value={tagPersonn}
                  onChangeText={setTagPersonn}
                />
              </View>
            </View>

            <ScrollView>
              {bankJson
                .filter(v =>
                  v?.name?.toLowerCase().includes(tagPersonn?.toLowerCase()),
                )
                .map((item, index) => (
                  <Suspense key={index} fallback={null}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedText(item);
                        setIsModal(false);
                      }}
                      style={{
                        // backgroundColor: "red",
                        ...anoStyles.coverUserCommentSection,
                        paddingHorizontal: 20,
                      }}>
                      <Text
                        onPress={() => {
                          setSelectedText(item);
                          setIsModal(false);
                        }}
                        style={styles.sortText}>
                        {item?.name}
                      </Text>
                      <View
                        style={{
                          ...anoStyles.clickable,
                          backgroundColor:
                            item?.name == selectedText ? 'blue' : '#fff',
                        }}>
                        <View style={anoStyles.innerCircle}></View>
                      </View>
                    </TouchableOpacity>
                  </Suspense>
                ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
      <View style={{paddingHorizontal: 20}}>
        <Text style={anoStyles.upperText}>Bank name</Text>
        <View style={anoStyles.coveLoag}>
          <TouchableOpacity
            onPress={() => setIsModal(true)}
            // activeOpacity={0.8}
            style={styles.coverSearchHere}>
            <MaterialCommunityIcons name="bank" color="#262626" size={24} />
            <View activeOpacity={0.8} style={anoStyles.innerTextInput}>
              <Text
                style={{
                  color: '#262626',
                }}>
                {selectedText?.name}
              </Text>
            </View>
          </TouchableOpacity>
          {mainLoading ? (
            <View style={anoStyles.loag}>
              <ActivityIndicator size={24} color={'#202d34'} />
            </View>
          ) : showMsg ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => getBankDetails()}
              style={{
                ...anoStyles.loag,
              }}>
              <Feather name="refresh-cw" size={24} color={'#202d34'} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default SelectBank;

// am on my lane ft phyno and aguro banks
// onye agoziriagozi aguro banks
// see finish

const anoStyles = StyleSheet.create({
  coveLoag: {
    flexDirection: 'row',
    position: 'relative',
  },
  loag: {
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 50,
  },
  coverSearchHere: {
    backgroundColor: '#efefef',
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 45,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  innerTextInput: {
    paddingRight: 40,
    width: '100%',
    height: 48,
    // backgroundColor: 'red',
    marginLeft: 10,
    justifyContent: 'center',
  },
  upperText: {
    color: '#9f9f9f',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10,
  },
  sortText: {
    color: '#111',
    fontSize: 16,
  },
  coverUserCommentSection: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    marginBottom: 0,
    // paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    // marginTop: 22,
    backgroundColor: '#00000066',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    // borderRadius: 7,
    height: '100%',
    // padding: 15,
    width: '100%',
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  pausedIcon: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
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
});

// <FlatList
// data={bankJson} // Only render videos up to loadUntilIndex
// renderItem={({item, index}) => (
//   <Suspense fallback={null}>
//     <TouchableOpacity
//       activeOpacity={0.8}
//       onPress={() => {
//         setSelectedText(item?.name);
//         setIsModal(false);
//       }}
//       style={{
//         // backgroundColor: "red",
//         ...anoStyles.coverUserCommentSection,
//         paddingHorizontal: 20,
//       }}>
//       <Text
//         onPress={() => {
//           setSelectedText(item?.name);
//           setIsModal(false);
//         }}
//         style={styles.sortText}>
//         {item?.name}
//       </Text>
//       <View
//         style={{
//           ...anoStyles.clickable,
//           backgroundColor:
//             item?.name == selectedText ? 'blue' : '#fff',
//         }}>
//         <View style={anoStyles.innerCircle}></View>
//       </View>
//     </TouchableOpacity>
//   </Suspense>
// )}
// keyExtractor={item => `${item} + ${Math.random()}`}
// scrollEnabled={true}
// showsVerticalScrollIndicator={false}
// />

//  {/* {showAbsolute && (
//         <Pressable
//           onPress={closeModalPress}
//           style={{
//             ...styles.showAbsolute,
//             // display: showAbsolute ? 'flex' : 'none',
//           }}>
//           <BottomSheet
//             ref={bottomSheetModalRef}
//             index={1}
//             snapPoints={snapPoints}
//             backdropComponent={renderBackdrop}
//             // onChange={handleSheetChange}
//             handleComponent={() => (
//               <View style={styles.handleComponentStyle}>
//                 <Text style={{...styles.reactionText, color: '#fff'}}>
//                   Select bank
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
//               style={{width: '100%', heigth: '100%'}}
//               onPress={() => {
//                 return;
//               }}>

//               {/* <View
//                 style={{
//                   // width: '100%',
//                   // height: '100%',
//                   height: 600,

//                   backgroundColor: 'red',
//                 }}></View> */}
//                 <BottomSheetScrollView
//                 // style={{
//                 //   // width: '100%',
//                 //   // height: '100%',
//                 //   // height: 600,

//                 //   backgroundColor: 'orange',
//                 // }}
//                 >
//                 <Pressable
//                   onPress={() => {
//                     return null;
//                   }}
//                   style={{width: '100%', height: 600}}>

//                 </Pressable>
//               </BottomSheetScrollView>
//             </Pressable>
//           </BottomSheet>
//         </Pressable>
//       )} */}
