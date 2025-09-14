import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
  } from 'react-native';
  import React, {
    Suspense,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
  } from 'react';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import Octicons from 'react-native-vector-icons/Octicons';
  import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import {useNavigation} from '@react-navigation/core';
  
  import DoyouKnow from '../../assets/doYouKnow.png';
  import AbbrNum from '../../helper/abbrev';
  import styles from './manage.styles';
  import SortBy from './sortBy';
  import Unsupported from '../../assets/unsupported.png';
  import {MainContext} from '../../../App';
  const Funds = React.lazy(() => import('../profile/funds'));
  const ManageFunds = ({
    loading,
    history,
    setSelected,
    showDeposit,
    setShowDeposit,
  }) => {
    const CTX = useContext(MainContext);
    const [showAbsolute, setShowAbsolute] = useState(false);
    const bottomSheetModalRef = useRef(null);
    // const snapPoints = useMemo(() => ['45%', '45%'], []);
    const snapPoints = useMemo(() => [350, 350], []);
    const navigator = useNavigation();
  
    const showBottomSheetHandler = useCallback(() => {
      setShowAbsolute(true);
      bottomSheetModalRef.current?.present();
    }, []);
  
    const closeModalPress = useCallback(() => {
      setShowAbsolute(false);
      bottomSheetModalRef.current?.dismiss();
    }, []);
  
    function fun(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  
    const mapHistory = history.map((v, i) => (
      <View
        key={i}
        style={{
          borderBottomColor: '#bbb',
          borderBottomWidth: 1,
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'space-between',
          paddingBottom: 10,
          alignItems: 'center',
        }}>
        <Text style={{color: '#3b3b3b', fontSize: 14, fontWeight: 'bold'}}>
          ID-
          {v._id
            .toString()
            .split('')
            .splice(v._id.toString().split('').length - 7, 7)
            .join('')}
        </Text>
        <View style={{marginLeft: 'auto'}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#3b3b3b',
                fontSize: 17,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'capitalize',
              }}>
              {v.type} :
            </Text>
            <Text
              style={{
                ...styles.upperText,
                color: '#3b3b3b',
                fontSize: 17,
                marginLeft: 12,
                fontFamily: 'Satoshi',
                fontWeight: 'bold',
              }}>
              {/* {AbbrNum(v.amount, 0)} */}₦{fun(v.amount)}
            </Text>
          </View>
          <Text style={{...styles.upperText, textAlign: 'right'}}>{v.date}</Text>
        </View>
        {/* <View style={{marginLeft: 'auto'}}> */}
  
        {/* </View> */}
      </View>
    ));
  
    // console.log("CTX.userObj.total_earning ==>> ", CTX.userObj.total_earning);
  
    return (
      <>
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
                    Transaction History
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
                <SortBy
                  closeModalPress={closeModalPress}
                  setSelected={setSelected}
                />
              </Pressable>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </Pressable>
  
        <ScrollView style={styles.containerCover}>
          {/* <View style={{padding: 20}}> */}
          <Text style={{color: '#3b3b3b', fontSize: 27, 
            fontFamily: 'Gilroy-Bold'
          }}>
            Hi {CTX.userObj.full_name},
          </Text>
          <Text style={styles.upperText}>
            Manage your funds, view the progress of your income made so far and
            keep going live
          </Text>
          {/* </View> */}
  
          <Suspense fallback={null}>
            <Funds onPress={() => console.log('abcd')} />
          </Suspense>
  
          <View style={styles.topCoverHere}>
            <Image
              source={{
                uri: CTX.userObj.photo
                  ? `${CTX.userObj.photo}`
                  : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
              }}
              style={styles.topImage}
            />
  
            <View style={styles.coverCommentHere}>
              <Text style={styles.commentOwner}>
                ₦
                {AbbrNum(
                  CTX.userObj.fund
                    ? parseInt(CTX.userObj.fund)?.toLocaleString()
                    : 0,
                  0,
                )}
                {/* ₦{CTX.userObj.fund ? CTX.userObj.fund : 0} */}
              </Text>
              <Text style={styles.comment}>Account fund</Text>
            </View>
  
            <Pressable style={styles.coverCommentHere}>
              <Text style={styles.commentOwner}>
                ₦
                {AbbrNum(
                  CTX.userObj.total_earning
                    ? parseInt(CTX.userObj.total_earning)?.toLocaleString()
                    : 0,
                  0,
                )}
              </Text>
              <Text style={styles.comment}>Total cash out</Text>
            </Pressable>
          </View>
  
          <View style={{...styles.coverFollowingMessage, marginTop: 30}}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.eachBtnCover}
              onPress={() => navigator.navigate('DepositScreen')}>
              <Text style={styles.eachBtnText}>Recharge</Text>
              <AntDesign
                name="plussquareo"
                size={19}
                color="#262626"
                style={{marginLeft: 8}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => showBottomSheetHandler()}
              style={{...styles.eachBtnCover}}>
              <Octicons
                name="history"
                size={23}
                color="#262626"
                style={{marginLeft: 3}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigator.navigate('WithdrawalScreen')}
              style={styles.eachBtnCover}>
              <Text style={styles.eachBtnText}>Withdraw</Text>
              <AntDesign
                name="minussquareo"
                size={19}
                color="#262626"
                style={{marginLeft: 8}}
              />
            </TouchableOpacity>
          </View>
  
          {loading ? (
            <ActivityIndicator
              size={60}
              style={{marginTop: 200}}
              color="#262626"
            />
          ) : (
            <>
              {showDeposit && (
                <>
                  <Text
                    style={{
                      ...styles.eachBtnText,
                      textAlign: 'left',
                      fontSize: 20,
                      marginTop: 30,
                    }}>
                    Transactions History
                  </Text>
  
                  {mapHistory.length > 0 ? (
                    mapHistory
                  ) : (
                    <>
                      <View style={styles.centerImage}>
                        <Image
                          source={Unsupported}
                          resizeMode={'contain'}
                          style={{...styles.DoyouKnow, width: '100%'}}
                        />
                      </View>
                      <Text style={{...styles.eachBtnText, marginTop: 40}}>
                        No record found
                      </Text>
                    </>
                  )}
                </>
              )}
  
              {!showDeposit && (
                <>
                  <View style={styles.centerImage}>
                    <Image
                      source={DoyouKnow}
                      resizeMode={'contain'}
                      style={styles.DoyouKnow}
                    />
                  </View>
                  <Text
                    style={{
                      ...styles.eachBtnText,
                      marginTop: 40,
                      textAlign: 'left',
                    }}>
                    Do you know?
                  </Text>
                  <Text style={{...styles.upperText, marginTop: 10}}>
                    Much incomes made from interesting videos upload by you on
                    Private Live. can actually get your account monetize.
                  </Text>
                  <Text style={{...styles.upperText, marginTop: 10}}>
                    They more you Go Live and Retail More Audience online. can
                    actually get your account verified.
                  </Text>
                  <Text
                    style={{
                      color: 'blue',
                      fontSize: 15,
                      fontWeight: 'bold',
                      fontFamily: 'Satoshi',
                      marginTop: 10,
                    }} onPress={() =>
                      navigator.navigate('AppEventFeatures', {scrollTo: 2020})
                    }>
                    Learn more
                  </Text>
                </>
              )}
            </>
          )}
  
          <View style={{height: 60}}></View>
        </ScrollView>
      </>
    );
  };
  
  export default ManageFunds;
  