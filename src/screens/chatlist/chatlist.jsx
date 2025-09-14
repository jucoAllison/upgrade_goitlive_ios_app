import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState, useContext, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

import ListChat from './listChat';
import {MainContext} from '../../../App';

const Chat = ({
  isFoundDetails,
  searched,
  setSearched,
  isSearching,
  setIsSearching,
  regetChatList,
  setErrMsg,
  setShowMsg,
  loading,
  setLoading,
  handleBottomShow,
  isBlockVisible,
  selectedArr,
  setSelectedArr,
  setIsBlockVisible,
  pinChatHandler,
  loading_pin,
  deleteLoading,
  cancelOnPressHandler,
  text,
  setText,
}) => {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const CTX = useContext(MainContext);
  const subs = ['Pinned', 'Others'];

  function isNumber(value) {
    return !isNaN(value);
  }
  // search for usernames to tag
  const setSearchHandler = async e => {
    setSearch(e);

    // setShowMsg(false);
    // setLoading(true);
    // try {
    //   const fetching = await fetch(`${CTX.url}user/search`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `bearer ${CTX.sessionToken}`,
    //     },
    //     body: JSON.stringify({
    //       string: e.toLowerCase(),
    //       isNum: await isNumber(e.toLowerCase()),
    //     }),
    //   });
    //   const parsedJson = await fetching.json();

    //   if (parsedJson?.isRemoved) {
    //     return CTX.logoutUser();
    //   }
    //   if (parsedJson?.error) {
    //     setErrMsg(parsedJson?.msg);
    //     setShowMsg(true);
    //     return;
    //   }
    //   setErrMsg('');
    //   setShowMsg(false);
    //   setLoading(false);
    //   setSearched(parsedJson.data.data);
    // } catch (error) {
    //   setLoading(false);
    //   console.log('error verifying create account => ', error);
    //   setErrMsg('Network request failed');
    //   setShowMsg(true);
    // }
  };

  useEffect(() => {
    if (search.length > 1 && !isSearching) {
      setIsSearching(true);
      console.log('spinal loose! omooh wile lie');
    }
  }, [search]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    regetChatList();
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  }, []);

  const mappedHeaders = subs.map((item, i) => (
    <View
      style={{
        alignSelf: 'flex-start',
      }}
      key={i}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (loading_pin) return;
          if (deleteLoading) {
            return;
          }
          setText(item);
          cancelOnPressHandler();
          // setIsSearching(false);
          // setSearch('');
        }}>
        <View
          style={{
            ...styles.eachBtnCover,
            backgroundColor:
              text == item
                ? '#e20154'
                : CTX.isDarkMode
                ? '#202d3489'
                : '#efefef',
          }}>
          <Text
            style={{
              ...styles.eachBtnText,
              color:
                text == item ? '#fff' : CTX.isDarkMode ? '#fff' : '#262626',
              fontFamily: 'Gilroy-Bold',
            }}>
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  ));

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle={CTX.isDarkMode ? 'light-content' : 'dark-content'}
      />

      <ScrollView
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        // style={{flex: 1, backgroundColor: '#0a171e'}}>
        style={{
          backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
          padding: 20,
          position: 'relative',
          // height: Dimensions.get('window').height,
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            paddingBottom: 20,
            alignItems: 'center',
          }}>
          {mappedHeaders}

          {!isBlockVisible ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowSearch(!showSearch);
              }}
              style={{marginLeft: 'auto'}}>
              <View>
                {showSearch ? (
                  <AntDesign
                    name="close"
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                    size={24}
                  />
                ) : (
                  <AntDesign
                    name="search1"
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                    size={24}
                  />
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pinChatHandler}
              style={{marginLeft: 'auto'}}>
              <View>
                {/* {showSearch ? (
                  <AntDesign
                    name="close"
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                    size={24}
                  />
                ) : ( */}
                {loading_pin ? (
                  <ActivityIndicator
                    size={24}
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                  />
                ) : text?.toLowerCase() == 'others' ? (
                  <Octicons
                    name="pin"
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                    style={{transform: [{rotate: '90deg'}]}}
                    size={24}
                  />
                ) : (
                  <Octicons
                    name="diff-removed"
                    color={CTX.isDarkMode ? '#fff' : '#000'}
                    size={24}
                  />
                )}
                {/* )} */}
              </View>
            </TouchableOpacity>
          )}
        </View>

        {showSearch && (
          <View style={styles.coverAnt}>
            <View
              style={{
                ...styles.coverSearchHere,
                backgroundColor: CTX.isDarkMode ? '#202d3489' : '#efefef',
              }}>
              <AntDesign
                name="search1"
                // color="#abb1b8"
                color={CTX.isDarkMode ? '#fff' : '#000'}
                size={24}
              />
              <TextInput
                autoFocus
                style={{
                  ...styles.innerTextInput,
                  color: CTX.isDarkMode ? '#fff' : '#000',
                }}
                placeholder="Search your chat"
                placeholderTextColor={CTX.isDarkMode ? '#fff' : '#000'}
                value={search}
                onChangeText={e => setSearchHandler(e)}
              />
              {isSearching && (
                <Text
                  onPress={() => {
                    setIsSearching(false);
                    setSearch('');
                  }}
                  style={{
                    ...styles.clearAll,
                    color: CTX.isDarkMode ? '#fff' : '#000',
                  }}>
                  Clear all
                </Text>
              )}
            </View>
          </View>
        )}

        <ListChat
          searched={searched}
          isSearching={isSearching}
          search={search}
          handleBottomShow={handleBottomShow}
          isBlockVisible={isBlockVisible}
          selectedArr={selectedArr}
          setSelectedArr={setSelectedArr}
          setIsBlockVisible={setIsBlockVisible}
          loading={loading}
          setErrMsg={setErrMsg}
          setShowMsg={setShowMsg}
          isFoundDetails={isFoundDetails}
          text={text}
          setText={setText}
        />
        <View style={{height: 40}}></View>
      </ScrollView>
      {/* start new chat */}
      {!isBlockVisible && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBottomShow}
          style={styles.startNewChat}>
          <Ionicons name="add-sharp" color={'#fff'} size={24} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  containerCover: {
    width: '100%',
    height: '100%',
    flex: 1,
    padding: 20,
    position: 'relative',
    backgroundColor: '#f00',
  },
  coverSearchHere: {
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 53,
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerTextInput: {
    fontFamily: 'Gilroy-Regular',
    marginLeft: 10,
    width: '80%',
  },

  clearAll: {
    position: 'absolute',
    fontFamily: 'Gilroy-Bold',
    top: 15,
    right: 17,
  },
  coverListChat: {
    width: '100%',
    // height: "100%"
  },
  coverAnt: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7c90b0',
    marginBottom: 20,
    flexDirection: 'row',
  },
  activiityCover: {
    marginTop: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pleaseRetry: {
    marginTop: 20,
    fontFamily: 'Gilroy-Regular',
    textAlign: 'center',
  },
  startNewChat: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#e20154',
    position: 'absolute',
    bottom: 32,
    right: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eachBtnCover: {
    backgroundColor: '#efefef',
    paddingHorizontal: 25,
    borderRadius: 50,
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

export default Chat;
