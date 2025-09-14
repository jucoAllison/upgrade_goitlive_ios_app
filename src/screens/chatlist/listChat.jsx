import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { MainContext } from '../../../App';
import moment from 'moment';
import Contact from './contact';
import CheckFcm from './checkfcm';
const ListChat = ({
  searched,
  isSearching,
  handleBottomShow,
  isBlockVisible,
  selectedArr,
  setSelectedArr,
  setIsBlockVisible,
  loading,
  setErrMsg,
  setShowMsg,
  search,
  text,
  setText,
}) => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  var maxLength = 15;

  const mapSearchEachChat = searched.map((v, i) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MainChat', { ...v, isChat: false })}
        style={styles.coverNot}
        key={i}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (v?.status?.length > 0) {
              navigation.navigate('StatusMenu', {
                _id: v._id,
              });
            }
          }}
          style={{
            ...styles.coverStatusRound,
            borderWidth: v?.status?.length > 0 ? 1 : 0,
          }}
        >
          <Image
            source={{
              uri: v?.photo
                ? v?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={styles.eachImg}
          />
          {v?.active && <View style={styles.isActive}></View>}
        </TouchableOpacity>

        <View style={{ width: '100%' }}>
          <Text
            style={{
              ...styles.username,
              color: CTX.isDarkMode ? '#fff' : '#000',
            }}
          >
            {v?.username}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                ...styles.username,
                fontFamily: 'Gilroy-Regular',
                fontSize: 12,
                color: CTX.isDarkMode ? '#fff' : '#000',
              }}
            >
              {v?.full_name}
            </Text>
          </View>
        </View>
        <Text
          style={{
            ...styles.dateText,
            fontFamily: 'Gilroy-Regular',
            color: CTX.isDarkMode ? '#fff' : '#000',
          }}
        >
          {v?.date}
        </Text>
      </TouchableOpacity>
    );
  });

  const onLongPressHandler = (e, filtered) => {
    if (isBlockVisible) return null;

    const spread = [...selectedArr];
    spread.push(e);
    [];
    setSelectedArr(spread);
    setIsBlockVisible(true);
  };

  const onPressHandler = (data, filtered) => {
    if (isBlockVisible) {
      const spread = [...selectedArr];
      const check = spread.some(
        a => a?._id?.toString() === data?._id?.toString(),
      );
      if (check) {
        // remove the obj from selectedTags arr
        const filterOut = spread.filter(
          b => b?._id?.toString() !== data?._id?.toString(),
        );
        setSelectedArr(filterOut);
        return;
      }
      spread.push(data);
      setSelectedArr(spread);
      return;
    }

    // console.log('filtered =>>> ');

    navigation.navigate('MainChat', {
      ...filtered,
      isChat: true,
      lastMessage: data?.lastMessage?.content,
      // chatId: v?._id
    });
  };

  useEffect(() => {
    if (selectedArr.length < 1) {
      setIsBlockVisible(false);
    }
  }, [selectedArr]);

  const filteredChats = CTX.chat_list?.filter(chat => {
    if (!search) return true; // keep all chats if no search text

    return chat?.userDetails?.some(user => {
      const searchTerm = search.toLowerCase();
      const usernameMatch = user?.username?.toLowerCase().includes(searchTerm);
      const fullNameMatch = user?.full_name?.toLowerCase().includes(searchTerm);

      // console.log('usernameMatch || fullNameMatch =>>>>> ', usernameMatch, fullNameMatch);

      return usernameMatch || fullNameMatch;
    });
  });

  // console.log('Filtered chats => ', filteredChats);

  const mapChatList = filteredChats
    // .filter(chat =>
    //  !search ||  chat?.userDetails.some(
    //     user =>
    //       user?.username?.toLowerCase()?.includes(search?.toLowerCase())
    //     // ||
    //       // user?.full_name?.toLowerCase()?.includes(search?.toLowerCase()),
    //   ),
    // )
    //    .filter(chat => {
    //   // If search is empty, include all chats
    //   if (!search) return true;

    //   // Check if any user in userDetails matches the search
    //   return chat?.userDetails?.filter(user => {
    //     const searchTerm = search.toLowerCase();
    //     const usernameMatch = user?.username?.toLowerCase()?.includes(searchTerm);
    //     const fullNameMatch = user?.full_name?.toLowerCase()?.includes(searchTerm);
    // console.log('usernameMatch || fullNameMatch =>>>>> ', usernameMatch, fullNameMatch);

    //     return usernameMatch || fullNameMatch;
    //   });
    // })
    ?.filter(v => v.category == text.toLowerCase())
    ?.map((v, i) => {
      const abbb = v?.userDetails?.filter(
        b => b?.username != CTX?.userObj?.username,
      );

      const filtered = abbb?.length > 0 ? abbb[0] : [];
      var result = v?.lastMessage?.content?.substring(0, maxLength) + '. . .';

      // console.log("v?._id => ", v?._id);

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() => onLongPressHandler(v, filtered)}
          onPress={() => onPressHandler(v, filtered)}
          style={{
            ...styles.coverNot,
            display:
              filtered?.username == CTX.userObj?.username || !filtered?.username
                ? 'none'
                : 'flex',
          }}
          key={v?._id || i}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (filtered?.status?.length > 0) {
                navigation.navigate('StatusMenu', {
                  _id: filtered._id,
                });
              }
            }}
            style={{
              ...styles.coverStatusRound,
              // borderWidth: filtered?.status?.length > 0 ? 1 : 0,
              borderWidth: 1,
            }}
          >
            <Image
              source={{
                uri: filtered?.photo
                  ? filtered?.photo
                  : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
              }}
              style={styles.eachImg}
            />
            {filtered?.active && <View style={styles.isActive}></View>}
          </TouchableOpacity>

          <View style={{ width: '100%' }}>
            <Text
              style={{
                ...styles.username,
                color: CTX.isDarkMode ? '#fff' : '#000',
              }}
            >
              @{filtered?.username}
            </Text>
            {CTX.typing?.some(w => w.chat_id == v._id) ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 3,
                }}
              >
                <Text
                  style={{
                    ...styles.username,
                    fontSize: 12,
                    fontFamily: 'Gilroy-Medium',
                    color: CTX.isDarkMode ? '#cbd0d5' : '#8a8a8a',
                  }}
                >
                  Typing . . .
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 3,
                }}
              >
                {v?.messages?.base64 && (
                  <MaterialCommunityIcons
                    color={CTX.isDarkMode ? '#cbd0d5' : '#0a0a0a'}
                    style={{ marginRight: 3 }}
                    size={15}
                    name="circle-double"
                  />
                )}
                <Text
                  style={{
                    ...styles.username,
                    fontSize: 12,
                    fontFamily: 'Gilroy-Medium',
                    color: CTX.isDarkMode ? '#cbd0d5' : '#8a8a8a',
                  }}
                >
                  {v?.lastMessage?.content?.length > 14
                    ? result
                    : v?.lastMessage?.content}
                </Text>
              </View>
            )}
          </View>
          {/* <Text style={styles.dateText}>{v?.messages[0].createdAt}</Text> */}
          {/* <Text style={styles.dateText}>
          {moment(v?.messages[0]?.createdAt).format('LT')}
        </Text> */}

          {!isBlockVisible ? (
            <>
              {v?.unreadCount > 0 ? (
                <View
                  style={{
                    ...styles.dateText,
                    backgroundColor: '#e20154',
                    borderRadius: 190,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 17,
                    height: 17,
                  }}
                >
                  <Text
                    style={{
                      paddingTop: 2,
                      fontFamily: 'Gilroy-Black',
                      color: '#fff',
                      fontSize: 10,
                    }}
                  >
                    {v?.unreadCount}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    ...styles.dateText,
                    fontSize: 12,
                    color: CTX.isDarkMode ? '#fff' : '#000',
                  }}
                >
                  {moment(v?.messages?.createdAt).format('LT')}
                </Text>
              )}
            </>
          ) : (
            <View style={styles.rightFeatherHere}>
              {selectedArr.some(f => f._id?.toString() == v._id?.toString()) ? (
                <Ionicons color="#fff" name="checkbox" size={18} />
              ) : (
                <Feather color="#fff" name="square" size={18} />
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    });

  const mapLoading = Array(8)
    .fill('sds')
    .map((v, i) => (
      <View style={styles.coverNot} key={i}>
        <View
          style={{ ...styles.loadingImg, backgroundColor: '#aaaaaa38' }}
        ></View>

        <View>
          <View
            style={{
              backgroundColor: '#aaaaaa38',
              width: 190,
              height: 12,
            }}
          ></View>

          <View
            style={{
              marginTop: 3,
              width: 190,
              height: 8,
              backgroundColor: '#aaaaaa38',
            }}
          ></View>
        </View>
      </View>
    ));

  return (
    <View>
      <>
        {!CTX.chat_list ? (
          mapLoading
        ) : (
          <>
            {mapChatList?.length > 0 ? (
              <>
                {mapChatList}

                <CheckFcm />
              </>
            ) : text.toLowerCase() == 'pinned' ? (
              <View style={{ ...styles.activiityCover, marginTop: 100 }}>
                <MaterialCommunityIcons
                  name="terraform"
                  color={CTX?.isDarkMode ? '#fff' : '#000'}
                  size={40}
                />
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      ...styles.pleaseRetry,
                      color: CTX.isDarkMode ? '#fff' : '#000',
                    }}
                  >
                    You haven’t pinned any chats yet. Pin a chat from the{' '}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setText('Others')}
                  >
                    <Text style={{ ...styles.pleaseRetry, color: 'skyblue' }}>
                      Others category.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ ...styles.activiityCover, marginTop: 100 }}>
                <MaterialCommunityIcons
                  name="terraform"
                  color={CTX?.isDarkMode ? '#fff' : '#000'}
                  size={40}
                />
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      ...styles.pleaseRetry,
                      color: CTX.isDarkMode ? '#fff' : '#000',
                    }}
                  >
                    Your chat is empty,{' '}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleBottomShow}
                  >
                    <Text style={{ ...styles.pleaseRetry, color: 'skyblue' }}>
                      start conversation.
                    </Text>
                  </TouchableOpacity>

                  <Contact setErrMsg={setErrMsg} setShowMsg={setShowMsg} />
                </View>
              </View>
            )}
          </>
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  coverNot: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 4,
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  eachImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  username: {
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
  },

  dateText: {
    position: 'absolute',
    top: 8,
    fontFamily: 'Gilroy-Regular',
    right: 6,
    color: '#9f9f9f',
  },

  coverStatusRound: {
    marginRight: 13,
    padding: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#e20154',
    borderBottomEndRadius: 30,
    // botop
    borderRightColor: '#e20154',
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
  activiityCover: {
    width: '100%',
    height: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  pleaseRetry: {
    color: '#fff',
    textAlign: 'center',
  },
  rightFeatherHere: {
    position: 'absolute',
    right: 4,
    top: 9,
  },
  // coverNot: {
  //   flexDirection: 'row',
  //   marginBottom: 10,
  //   alignItems: 'center',
  //   position: 'relative',
  //   width: '100%',
  //   marginTop: 6,
  // },
  loadingImg: {
    width: 42,
    height: 42,
    overflow: 'hidden',
    borderRadius: 50,
    borderBottomEndRadius: 20,
    marginRight: 10,
  },
});

export default ListChat;
