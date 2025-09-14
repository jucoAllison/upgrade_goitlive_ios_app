import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // ScrollView,
  FlatList,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {MainContext} from '../../../App';
import {TruncateText} from '../../helper/truncateText';
// import AbbrNum from '../../helper/abbrev';
// import Button from '../../components/button';
// const windowWidth = Dimensions.get('window').width;

const Suggested = ({navigation, shouldRefresh, showButtons}) => {
  const CTX = useContext(MainContext);
  const [mainData, setMainData] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(true);

  const getDetailsHere = async () => {
    setShowMsg(false);
    setLoading(true);

    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.am}get/amass/suggestions/trim`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.error) {
        setErrMsg(parsedJson?.msg);
        setShowMsg(true);
        return;
      }
      setLoading(false);
      setMainData(parsedJson.data);
      // console.log("parsedJson.data from suggestions com =>>> ");
      // console.log("parsedJson.data from suggestions com =>>> ");
      // console.log("parsedJson.data from suggestions com =>>> ");
      // console.log("parsedJson.data from suggestions com =>>> ", parsedJson.data);
      // console.log("parsedJson.data from suggestions com =>>> ");
      // console.log("parsedJson.data from suggestions com =>>> ");
      // console.log("parsedJson.data from suggestions com =>>> ");
      // console.log("parsedJson.data from suggestions com =>>> ");
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    getDetailsHere();
  }, [shouldRefresh]);

  // console.log("blocked =>> ", CTX.userObj?.blocked);

  return (
    <View style={{width: '100%', position: 'relative', marginBottom: 20}}>
      <Text style={styles.commentOwner}>Amass suggestions</Text>
      <Text style={styles.comment}>
        Stay updated on topics that matter to you. Find Amass to join below
      </Text>
      {CTX.userObj?.hasAmass ? (
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => setToggle(!toggle)}
          onPress={() => navigation.navigate('AllAmass')}
          style={styles.closeLine}>
          <MaterialCommunityIcons
            name="file-find-outline"
            size={19}
            color="#262626"
            style={{marginLeft: 6}}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreateAmass')}
          style={styles.closeLine}>
          <Ionicons color={'#262626'} name={'add'} size={23} />
        </TouchableOpacity>
      )}

      <View style={{height: 7}}></View>
      {toggle && (
        <View>
          {loading ? (
            <FlatList
              style={{width: '100%'}}
              keyExtractor={item => Math.random()}
              horizontal
              data={Array(3).fill('sfss')}
              renderItem={({item, index}) => (
                <View style={styles.itemVideoHere}>
                  <View style={styles.coverNot}>
                    {/* <View style={{paddingHorizontal: 20, flexDirection: 'column'}}> */}
                    <View style={styles.loadingImg}>
                      <SkeletonPlaceholder
                        backgroundColor="#dddddd99"
                        speed={1500}>
                        <SkeletonPlaceholder.Item width={42} height={42} />
                      </SkeletonPlaceholder>
                    </View>

                    <View>
                      <SkeletonPlaceholder
                        backgroundColor="#dddddd99"
                        speed={1500}>
                        <SkeletonPlaceholder.Item width={90} height={10} />
                      </SkeletonPlaceholder>
                      <View style={{marginTop: 3}}>
                        <SkeletonPlaceholder
                          backgroundColor="#dddddd99"
                          speed={1500}>
                          <SkeletonPlaceholder.Item width={90} height={7} />
                        </SkeletonPlaceholder>
                      </View>
                    </View>
                  </View>

                  <View style={{height: 200}}>
                    <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                      <SkeletonPlaceholder.Item width={390} height={197} />
                    </SkeletonPlaceholder>
                  </View>

                  <View style={styles.lazyLoad}>
                    <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                      <SkeletonPlaceholder.Item width={1000} height={20} />
                    </SkeletonPlaceholder>
                  </View>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <>
              <FlatList
                style={{width: '100%'}}
                keyExtractor={item => item._id}
                horizontal
                data={mainData?.filter(
                  item =>
                    !CTX.userObj?.blocked?.includes(item.owner._id) &&
                    !item.owner?.is_reported_by_user,
                )}
                renderItem={({item, index}) => (
                  <View style={styles.itemVideoHere}>
                    <View style={styles.coverNot}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          if (item?.owner?.status?.length > 0) {
                            navigation.navigate('StatusMenu', {
                              _id: item?.owner?._id,
                            });
                          }
                        }}
                        style={{
                          ...styles.coverStatusRound,
                          borderWidth: item?.owner?.status?.length > 0 ? 1 : 0,
                        }}>
                        <Image
                          style={styles.styleImage}
                          source={{
                            uri: item?.owner?.photo
                              ? `${item.owner.photo}`
                              : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
                          }}
                        />
                        {item?.owner?.active && (
                          <View style={styles.isActive}></View>
                        )}
                      </TouchableOpacity>
                      <View style={{marginLeft: 5}}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.mappedDatasCoverFullname}>
                            {TruncateText(item?.owner?.full_name, 24)}
                          </Text>
                          {item?.owner?.verify && (
                            <MaterialIcons
                              style={{marginLeft: 5}}
                              name="verified"
                              color="#91ff91"
                              size={17}
                            />
                          )}
                        </View>
                        <Text style={styles.mappedDatasCoverUsername}>
                          @{TruncateText(item.owner?.username, 24)}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() =>
                        navigation.navigate('EachAmass', {
                          ...item,
                        })
                      }
                      style={{height: 200}}>
                      <Image
                        style={{width: '100%', height: '100%'}}
                        resizeMode="cover"
                        source={{uri: item.photo}}
                      />

                      {/* <View style={{position: 'absolute', bottom: 8, left: 10}}>
                        <Button label="View" style={{height: 40}} />
                      </View> */}
                    </Pressable>

                    <Text
                      style={{
                        ...styles.mappedDatasCoverUsername,
                        marginTop: 7,
                        color: '#000',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}>
                      {TruncateText(item?.name, 30)}
                    </Text>
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
              {/* <Button
                  label={'Show more'}
                  style={{height: 40, marginLeft: 20, marginTop: 20}}
                  onPress={() => navigation.navigate('AllAmass')}
                /> */}
            </>
          )}
          {!showButtons && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigator.navigate('EditProfile')}
                style={{paddingHorizontal: 20}}>
                <View style={styles.eachBtnCover}>
                  <Text style={styles.eachBtnText}>Edit Profile</Text>
                  <MaterialIcons
                    name="edit-road"
                    size={19}
                    color="#262626"
                    style={{marginLeft: 3}}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                // onPress={() => navigator.navigate('MainChatCover')}
                onPress={() => navigator.navigate('MainChatCover')}
                style={{paddingHorizontal: 20}}>
                <View style={{...styles.eachBtnCover, width: 140}}>
                  <Text style={styles.eachBtnText}>Chats</Text>
                  <MaterialCommunityIcons
                    name="message-reply-text-outline"
                    size={19}
                    color="#262626"
                    style={{marginLeft: 6}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* {!loading && ( */}

          {/* )} */}

          {/* <View style={styles.coverFollowingMessage}>
                        {loading ? (
                          <View style={styles.lazyLoad}>
                            <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                              <SkeletonPlaceholder.Item width={111} height={40} />
                            </SkeletonPlaceholder>
                          </View>
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.eachBtnCover}>
                            <Text style={styles.eachBtnText}>Message?</Text>
                          </TouchableOpacity>
                        )}
                      </View>
   */}
        </View>
      )}
    </View>
  );
};

export default Suggested;

const styles = StyleSheet.create({
  closeLine: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#efefef',
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    zIndex: 20,
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  itemVideoHere: {
    flex: 1,
    width: 200,
    // minWidth: windowWidth / 1.51, // 100% devided by the number of rows you want
    // maxWidth: windowWidth / 1.51, // 100% devided by the number of rows you want
    // alignItems: 'center',
    // height: 240,
    // backgroundColor: 'rgba(249, 180, 45, 0.25)',
    // backgroundColor: '#443344',
    borderWidth: 1.5,
    borderColor: '#fff',
    overflow: 'hidden',
    marginLeft: 20,
    position: 'relative',
  },
  lazyLoad: {
    borderRadius: 5,
    marginTop: 7,
    width: '85%',
    overflow: 'hidden',
  },
  app: {
    backgroundColor: 'red',
    width: '100%',
  },
  coverNot: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    position: 'absolute',
    top: 4,
    left: 0,
    width: '100%',
    marginTop: 6,
    zIndex: 20,
    paddingLeft: 10,
  },
  loadingImg: {
    width: 42,
    height: 42,
    overflow: 'hidden',
    borderRadius: 50,
    borderBottomEndRadius: 20,
    marginRight: 10,
  },
  commentOwner: {
    fontWeight: 'bold',
    color: '#3b3b3b',
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 20,
  },
  comment: {
    fontSize: 14,
    width: '80%',
    textAlign: 'left',
    color: '#26262688',
    marginTop: 2,
    fontFamily: 'Overpass-Regular',
    paddingLeft: 20,
  },
  styleImage: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  mappedDatasCoverFullname: {
    fontWeight: 'bold',
    fontSize: 11,
    fontFamily: 'Overpass-Regular',
    textTransform: 'capitalize',
    color: '#fff',
  },
  mappedDatasCoverUsername: {
    fontSize: 13,
    textTransform: 'lowercase',
    fontFamily: 'Overpass-Regular',
    color: '#ccc',
  },
  coverStatusRound: {
    marginRight: 3,
    padding: 2,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#9e005d98',
    borderBottomEndRadius: 30,
    // botop
    borderRightColor: '#9e005d',
  },
  isActive: {
    width: 13,
    height: 13,
    backgroundColor: '#3cca0b',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    position: 'absolute',
    top: 7,
    left: -4,
  },
  eachBtnCover: {
    backgroundColor: '#efefef',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  eachBtnText: {
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
