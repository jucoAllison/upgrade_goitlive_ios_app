import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useNavigation, useIsFocused} from '@react-navigation/core';

import styles from './styles';
import {MainContext} from '../../../App';
import {PostContext} from '../../../postVideoCTX';
import Fallback from '../../components/fallback/fallback';
const Upload = React.lazy(() => import('./upload'));
const EventUploadPrivate = ({}) => {
  const isFocused = useIsFocused();
  const CTX = useContext(MainContext);
  const PostCTX = useContext(PostContext);

  const listCate = [
    {
      svg: <FontAwesome name="globe" size={20} color="#262626" />,
      subs: '',
      name: 'Everyone (Default)',
    },
    {
      svg: <FontAwesome name="users" size={20} color="#262626" />,
      subs: "Caring's you cared back",
      name: 'Friends',
    },
    // {
    //   svg: <FontAwesome name="lock" size={20} color="#262626" />,
    //   subs: '',
    //   name: 'Only you',
    // },
  ];
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['40%', '40%'], []);
  // const [account_type, setAccount_type] = useState('');
  const navigation = useNavigation();

  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute(true);
    bottomSheetModalRef.current?.present();
  }, []);

  const closeModalPress = useCallback(() => {
    setShowAbsolute(false);
    bottomSheetModalRef.current?.close();
    // bottomSheetModalRef.current?.dismiss();
  }, []);

  const onChangeSelected = (v, e) => {
    PostCTX.setIndex(v);
    setTimeout(() => {
      closeModalPress();
    }, 500);
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
    }
  }, [isFocused]);




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


  // <SafeAreaView style={{width: '100%', height: '100%'}}>
  return (
    <>
    <View style={{height: 40}}></View>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="dark-content"
      />
      {showAbsolute && (
        <Pressable
          onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
            // display: showAbsolute ? 'flex' : 'none',
          }}>
         <BottomSheet
            ref={bottomSheetModalRef}
            index={1}
            enablePanDownToClose={true}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{...styles.reactionText, color: '#fff'}}>
                  Who can view these post
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
                  style={{flex: 1}}
                  onPress={() => {
                    return null;
                  }}>
                  {/* <Text style={{color: 'red'}}> HELLO WORLD HERE </Text> */}
                  <View style={{padding: 20}}>
                    {/* <Text
                  style={{
                    ...styles.categoryText,
                    fontSize: 17,
                    textAlign: 'left',
                  }}>
                  Select account type
                </Text> */}

                    {/* map the account type here */}
                    <FlatList
                      style={{marginTop: 20}}
                      data={listCate}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => onChangeSelected(item)}
                          key={index}
                          style={styles.coverUserCommentSection}>
                          {item.svg}
                          <View style={{marginLeft: 6}}>
                            <Text style={styles.sortText}>{item.name}</Text>
                            {item.subs && (
                              <Text
                                style={{
                                  color: '#555555',
                                  fontSize: 12,
                                  fontFamily: 'Overpass-Regular',
                                }}>
                                {item.subs}
                              </Text>
                            )}
                          </View>
                          <View
                            style={{
                              ...styles.clickable,
                              backgroundColor:
                                PostCTX.topIndex?.name == item.name
                                  ? '#e20154'
                                  : '#fff',
                            }}>
                            <View style={styles.innerCircle}></View>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </Pressable>
              </BottomSheetScrollView>
              </BottomSheet>
        </Pressable>
      )}

      <Suspense
        fallback={
          null
          // <Fallback />
          // <View style={styles.activityCover}>
          //   <ActivityIndicator color={'#fff'} size={40} />
          // </View>
        }>
        <Upload
          uploadVideo={PostCTX.uploadVideo}
          showBottomSheetHandler={showBottomSheetHandler}
          // uploadVideoToServer={}
        />
      </Suspense>
    </>
  );
};

export default EventUploadPrivate;
