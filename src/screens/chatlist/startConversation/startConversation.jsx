import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useContext} from 'react';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MainContext} from '../../../../App';
import styles from './startConversation.styles';
import {TruncateText} from '../../../helper/truncateText';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useNavigation} from '@react-navigation/native';

const StartConversation = ({
  loading,
  showMsg,
  getMutalConnections,
  errMsg,
  tagPersonn,
  hasMoreCaring,
  setSearchHandler,
  isSearching,
  setIsSearching,
  mainTags,
  setTagPersonn,
}) => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();

  const mappedDatas = mainTags
    ?.filter(v => v?.username !== CTX?.userObj?.username)
    ?.map((v, i) => (
      <TouchableOpacity
        activeOpacity={0.8}
        key={i}
        style={styles.mappedDatasCover}
        // onPress={() => chatTheUser(v)}
        onPress={() => navigation.navigate('MainChat', {...v, isChat: false})}>
        <View style={styles.coverStatusRound}>
          <Image
            style={styles.styleImage}
            source={{
              uri: v?.photo
                ? v?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
          />
          {v?.active && <View style={styles.isActive}></View>}
        </View>
        <View>
          <Text
            style={{
              ...styles.mappedDatasCoverFullname,
              color: CTX.isDarkMode ? '#fff' : '#000',
            }}>
            {TruncateText(v?.full_name, 24)}
          </Text>
          <Text
            style={{
              ...styles.mappedDatasCoverUsername,
              color: CTX.isDarkMode ? '#fff' : '#000',
              marginTop: 5,
            }}>
            @{TruncateText(v?.username, 24)}
          </Text>
        </View>
      </TouchableOpacity>
    ));

  const mappedLoading = Array(9)
    .fill('sad')
    .map((v, i) => (
      <TouchableOpacity
        activeOpacity={0.8}
        key={i}
        style={styles.mappedDatasCover}>
        <View
          style={{...styles.loadingImg, backgroundColor: '#aaaaaa38'}}></View>

        <View>
          <View
            style={{
              marginBottom: 3,
              backgroundColor: '#aaaaaa38',
              width: 190,
              height: 12,
            }}></View>

          <View
            style={{
              width: 190,
              height: 8,
              backgroundColor: '#aaaaaa38',
            }}></View>
        </View>
      </TouchableOpacity>
    ));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <BottomSheetScrollView
        style={{width: '100%', height: '100%'}}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}>
        <View style={styles.coverAnt}>
          <View
            style={{
              ...styles.iCoverSearchHere,
              backgroundColor: CTX.isDarkMode ? '#202d3489' : '#efefef',
            }}>
            <AntDesign
              name="search1"
              color={CTX.isDarkMode ? '#fff' : '#000'}
              size={24}
            />
            <TextInput
              style={styles.iInnerTextInput}
              placeholder="Search  .  .  ."
              placeholderTextColor={CTX.isDarkMode ? '#fff' : '#000'}
              value={tagPersonn}
              onChangeText={e => setSearchHandler(e)}
            />
            {isSearching && (
              <Text
                onPress={() => {
                  setIsSearching(false);
                  setTagPersonn('');
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

        {loading ? (
          // <View style={styles.pausedIcon}>
          //   <View style={styles.loadCover}>
          //     <ActivityIndicator size={32} color="#fff" />
          //   </View>
          // </View>
          mappedLoading
        ) : showMsg ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => getMutalConnections()}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <FontAwesome5
                size={40}
                color={CTX.isDarkMode ? '#fff' : '#000'}
                name="holly-berry"
              />
              <Text
                style={{
                  ...styles.pleaseRetry,
                  marginTop: 10,
                  color: CTX.isDarkMode ? '#fff' : '#000',
                }}>
                {errMsg || 'Error happened'}
              </Text>
              <Text
                style={{
                  ...styles.pleaseRetry,
                  marginTop: 10,
                  color: CTX.isDarkMode ? '#fff' : '#000',
                }}>
                click to retry
              </Text>
            </TouchableOpacity>
          </>
        ) : mappedDatas?.length > 0 ? (
          <>
            {mappedDatas}
            {!isSearching && (
              <>
                {!hasMoreCaring && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={getMutalConnections}>
                    <Text style={styles.learnMore}>Show more</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={Keyboard.dismiss}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <FontAwesome5 size={40} color="#fff" name="holly-berry" />
              <Text
                style={{
                  fontSize: 14,
                  color: '#fff',
                  marginVertical: 12,
                  fontFamily: 'Gilroy-Regular',
                }}>
                No user found
              </Text>
            </TouchableOpacity>
          </>
        )}
      </BottomSheetScrollView>
    </TouchableWithoutFeedback>
  );
};

export default StartConversation;
