import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React, {memo, useContext, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {TruncateText} from '../../helper/truncateText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import Button from '../../components/button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MainContext} from '../../../App';

const AddTeam = ({
  item,
  getOthersCare,
  setTags,
  tagsOther,
  mainTags,
  hasMoreOther,
  getOthersTag,
  getAllTagDetails,
  hasMoreCaring,
  loading,
  setLoading,
  selectedTags,
  setSelectedTags,
  aloading,
  addToServer,
}) => {
  const CTX = useContext(MainContext);
  const [show, setShow] = useState(false);
  const [tagPersonn, setTagPersonn] = useState('');
  const [tagErrMsg, setTagErrMsg] = useState('');
  const [tagShowMsg, setTagShowMsg] = useState(false);
  const navigation = useNavigation();

  function isNumber(value) {
    return !isNaN(value);
  }

  const setSearchHandler = async e => {
    setTagPersonn(e);
    // if (loading) {
    //   return null;
    // }
    if (e.length < 2) {
      getOthersCare();
      return;
    }

    setTagShowMsg(false);
    setLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}user/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
        body: JSON.stringify({
          string: e.toLowerCase(),
          isNum: await isNumber(e.toLowerCase()),
        }),
      });
      const parsedJson = await fetching.json();

      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.error) {
        setTagErrMsg(parsedJson?.msg);
        setTagShowMsg(true);
        return;
      }
      setTagShowMsg(false);
      setLoading(false);
      setTags(parsedJson.data.data);
    } catch (error) {
      setLoading(false);
      console.log('error verifying create account => ', error);
      setTagErrMsg('Network request failed');
      setTagShowMsg(true);
    }
  };

  const setPressedTagHandler = v => {
    const spread = [...selectedTags];
    const check = spread.some(a => a?.username === v?.username);
    const restructured = {...v, su: false, isApproved: false};
    if (check) {
      // remove the obj from selectedTags arr
      const filterOut = spread.filter(b => b?.username !== v?.username);
      setSelectedTags(filterOut);
      return;
    }

    if (spread.length > 3) {
      return;
    }

    // add to selectedTags arr
    spread.unshift({...restructured, active: false});
    setSelectedTags(spread);
  };

  const mappedDatas = mainTags
    .filter(v => v?.username !== CTX?.userObj?.username)
    .map((v, i) => (
      <TouchableOpacity activeOpacity={0.8}
        key={i}
        style={styles.mappedDatasCover}
        onPress={() => setPressedTagHandler(v)}>
        <TouchableOpacity activeOpacity={0.8}
          onPress={() => {
            if (v?.status?.length > 0) {
              navigation.navigate('StatusMenu', {
                _id: v?._id,
              });
            }
          }}
          style={{
            ...styles.coverStatusRound,
            borderWidth: v?.status?.length > 0 ? 1 : 0,
          }}>
          <Image
            style={styles.styleImage}
            source={{
              uri: v?.photo
                ? v?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
          />
          {v?.active && <View style={styles.isActive}></View>}
        </TouchableOpacity>
        <View>
          <Text style={styles.mappedDatasCoverFullname}>
            {TruncateText(v?.full_name, 24)}
          </Text>
          <Text style={styles.mappedDatasCoverUsername}>
            @{TruncateText(v?.username, 24)}
          </Text>
        </View>

        <View
          style={{
            ...styles.clickable,
            backgroundColor: selectedTags.some(a => a?.username === v?.username)
              ? '#e20154'
              : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>
    ));

  const mappedOtherDatas = tagsOther
    .filter(v => v?.username !== CTX?.userObj?.username)
    .map((v, i) => (
      <TouchableOpacity activeOpacity={0.8}
        key={i}
        style={styles.mappedDatasCover}
        onPress={() => setPressedTagHandler(v)}>
        <TouchableOpacity activeOpacity={0.8}
          onPress={() => {
            if (v?.status?.length > 0) {
              navigation.navigate('StatusMenu', {
                _id: v?._id,
              });
            }
          }}
          style={{
            ...styles.coverStatusRound,
            borderWidth: v?.status?.length > 0 ? 1 : 0,
          }}>
          <Image
            style={styles.styleImage}
            source={{
              uri: v?.photo
                ? v?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
          />
          {v?.active && <View style={styles.isActive}></View>}
        </TouchableOpacity>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{...styles.mappedDatasCoverFullname, color: '#000'}}>
              {TruncateText(v?.full_name, 24)}
            </Text>
            {v?.verify && (
              <MaterialIcons
                style={{marginLeft: 5}}
                name="verified"
                color="#91ff91"
                size={16}
              />
            )}
          </View>
          <Text style={styles.mappedDatasCoverUsername}>
            @{TruncateText(v?.username, 24)}
          </Text>
        </View>

        <View
          style={{
            ...styles.clickable,
            backgroundColor: selectedTags.some(a => a?.username === v?.username)
              ? '#e20154'
              : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>
    ));

  const mappedLoading = Array(5)
    .fill('sad')
    .map((v, i) => (
      <TouchableOpacity activeOpacity={0.8} key={i} style={styles.mappedDatasCover}>
        <View style={styles.loadingImg}>
          <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
            <SkeletonPlaceholder.Item width={44} height={44} />
          </SkeletonPlaceholder>
        </View>

        <View>
          <View style={{marginBottom: 3}}>
            <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
              <SkeletonPlaceholder.Item width={85} height={13} />
            </SkeletonPlaceholder>
          </View>
          <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
            <SkeletonPlaceholder.Item width={65} height={11} />
          </SkeletonPlaceholder>
        </View>
      </TouchableOpacity>
    ));

  //   mapping Horizontal selectedTags arr
  const mappedHorizontal = selectedTags
    // .filter(v => v?.username !== CTX?.userObj?.username)
    .map((v, i) => (
      <View style={{...styles.mappedHorizontalCover}} key={i}>
        {v?._id !== item?.owner?._id && (
          <TouchableOpacity activeOpacity={0.8}
            onPress={() => setPressedTagHandler(v)}
            style={{
              ...styles.mappedHorizontalSemiCover,
              // display:  ? 'none' : 'flex',
            }}>
            <View
              style={{
                ...styles.mappedHorizontalSemiSemiCover,
                // borderColor: v?.isApproved ? '#086e4699' : '#e2015499',
              }}>
              <AntDesign name="closecircle" size={19} color="#222" />
            </View>
          </TouchableOpacity>
        )}
        <Image
          style={{
            ...styles.styleImage,
            borderColor: v?.isApproved ? '#086e4699' : '#e2015499',
            borderWidth: 3,
          }}
          source={{
            uri: v?.photo
              ? v?.photo
              : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
          }}
        />
        <Text
          style={{
            ...styles.mappedDatasCoverUsername,
            fontSize: 10,
            color: '#00000099',
            marginTop: 2,
          }}>
          {TruncateText(v?.full_name, 10)}
        </Text>
      </View>
    ));

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => {
          setShow(!show);
        }}>
        <Pressable style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.flexCenter}>
              <Text style={styles.headerOne}>Manage team</Text>
              <TouchableOpacity activeOpacity={0.8}>
                <Ionicons
                  onPress={() => setShow(!show)}
                  name="close"
                  size={26}
                  color="#00000085"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.coverSearchHere}>
              <AntDesign name="search1" color="#262626" size={24} />
              <TextInput
                style={styles.innerTextInput}
                placeholder="Search username . . ."
                placeholderTextColor={'#00000062'}
                value={tagPersonn}
                onChangeText={setSearchHandler}
              />

              <View style={styles.coverTag}>
                {loading ? (
                  <ActivityIndicator size={30} color="#262626" />
                ) : (
                  <MaterialIcons name="group" size={24} color="#262626" />
                )}
              </View>
            </View>

            <ScrollView style={{paddingTop: 10, width: '100%'}}>
              {tagPersonn.length > 0 ? (
                <>
                  <Text style={styles.smallFollowing}>Searched</Text>
                  {loading ? (
                    mappedLoading
                  ) : tagShowMsg ? (
                    <TouchableOpacity activeOpacity={0.8}
                      onPress={getAllTagDetails}
                      style={{marginTop: 60, ...styles.activiityCover}}>
                      <FontAwesome5
                        size={40}
                        color="#262626"
                        name="holly-berry"
                      />
                      <Text
                        style={{
                          ...styles.username,
                          marginTop: 6,
                          textAlign: 'center',
                        }}>
                        {tagErrMsg}
                      </Text>
                      <Text style={styles.dateText}>Click to retry</Text>
                    </TouchableOpacity>
                  ) : mappedDatas.length > 0 ? (
                    mappedDatas
                  ) : (
                    <Text
                      style={{fontSize: 14, color: '#000', marginVertical: 12}}>
                      No user found
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.smallFollowing}>Caring</Text>
                  {loading ? (
                    mappedLoading
                  ) : tagShowMsg ? (
                    <TouchableOpacity activeOpacity={0.8}
                      onPress={getAllTagDetails}
                      style={{marginTop: 60, ...styles.activiityCover}}>
                      <FontAwesome5
                        size={40}
                        color="#262626"
                        name="holly-berry"
                      />
                      <Text
                        style={{
                          ...styles.username,
                          marginTop: 6,
                          textAlign: 'center',
                        }}>
                        {tagErrMsg}
                      </Text>
                      <Text style={styles.dateText}>Click to retry</Text>
                    </TouchableOpacity>
                  ) : mappedDatas.length > 0 ? (
                    <>
                      {mappedDatas}

                      {!hasMoreCaring && (
                        <TouchableOpacity activeOpacity={0.8} onPress={getOthersCare}>
                          <Text style={styles.learnMore}>Show more</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <Text
                      style={{fontSize: 14, color: '#000', marginVertical: 12}}>
                      You have not cared any user yet
                    </Text>
                  )}

                  {/* {!loading && mappedDatas.length < 1 && ( */}
                  <>
                    <Text style={styles.smallFollowing}>Others</Text>
                    {mappedOtherDatas}
                    {!hasMoreOther && (
                      <TouchableOpacity activeOpacity={0.8} onPress={getOthersTag}>
                        <Text style={styles.learnMore}>Show more</Text>
                      </TouchableOpacity>
                    )}
                  </>
                  {/* )} */}
                  <View style={{height: 8}}></View>
                </>
              )}
            </ScrollView>
            {/* show when selectedTag arr is > 0 */}
            {selectedTags.length > 0 && (
              <View style={styles.bottomDone}>
                <ScrollView horizontal>{mappedHorizontal}</ScrollView>
                {selectedTags.length > 3 && (
                  <View style={styles.bottomSideCover}>
                    <Text style={styles.bottomSideCoverText}>Max: 4</Text>
                    <Text style={styles.bottomSideCoverText}>
                      Pending:{' '}
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: '#e2015499',
                        }}></View>
                    </Text>
                    <Text style={styles.bottomSideCoverText}>
                      Approved:{' '}
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: '#086e4699',
                        }}></View>
                    </Text>
                  </View>
                )}
                <Button
                  loading={aloading}
                  label={'Save ' + '(' + selectedTags.length + ')'}
                  pressableStyle={{
                    width: '100%',
                    marginTop: 'auto',
                    height: 40,
                  }}
                  onPress={() => {
                    addToServer();
                  }}
                />
              </View>
            )}
          </View>
        </Pressable>
      </Modal>

      <View
        style={{
          // height: 130,
          overflow: 'hidden',
          position: 'relative',
        }}>
        <View style={{...styles.coverNot, position: 'relative'}}>
          <View
            style={{
              ...styles.coverStatusRound,
              borderWidth: 0,
            }}>
            <Image
              style={styles.styleImage}
              source={{
                uri: item?.photo
                  ? `${item.photo}`
                  : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
              }}
            />
          </View>
          <View style={{marginLeft: 5}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.mappedDatasCoverFullname}>
                {TruncateText(item?.name, 24)}
              </Text>
              {item?.isAmassVerified && (
                <MaterialIcons
                  style={{marginLeft: 5}}
                  name="verified"
                  color="#91ff91"
                  size={17}
                />
              )}
            </View>
            <Text style={styles.mappedDatasCoverUsername}>
              {item?.isPublic ? 'Public amass' : 'Private amass'}
            </Text>
          </View>
        </View>

        <View style={{padding: 20, paddingTop: 0, paddingBottom: 7}}>
          <TouchableOpacity activeOpacity={0.8}
            onPress={() => setShow(!show)}
            style={styles.bestOfOur}>
            <MaterialIcons name="group" size={24} color="#262626" />
            <View style={{marginLeft: 10, width: '80%'}}>
              <Text style={styles.mappedDatasCoverFullname}>Teams</Text>
              <Text style={styles.mappedDatasCoverUsername}>
                Team members to help manage your amass.
              </Text>
            </View>
            <View
              style={{
                marginLeft: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <SimpleLineIcons name="arrow-right" size={15} color="#55555596" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default memo(AddTeam);
