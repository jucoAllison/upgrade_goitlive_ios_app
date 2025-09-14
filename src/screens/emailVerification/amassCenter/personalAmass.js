import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React, {useContext, useEffect, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {TruncateText} from '../../helper/truncateText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import Button from '../../components/button';
import AddTeam from './addTeam';
import {MainContext} from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';

const PersonalAmass = ({
  loading,
  item,
  userAmass,
  navigation,
  regetAllStuff,
}) => {
  const CTX = useContext(MainContext);
  const [hasMoreCaring, setHasMoreCaring] = useState(true);
  const [hasMoreOther, setHasMoreOther] = useState(true);
  const [isloading, setLoading] = useState(false);
  const [tagShowMsg, setTagShowMsg] = useState(true);
  const [tagErrMsg, setTagErrMsg] = useState('');
  const [tags, setTags] = useState([]);
  const [tagsOther, setTagsOther] = useState([]);
  const [caringPage, setCaringPage] = useState(1);
  const [otherPage, setOtherPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [aloading, setAloading] = useState(false);

  useEffect(() => {
    if (item) {
      const spreading = [...item?.admin];
      const remapped = spreading.map(v => {
        return {...v._id, su: v?.su, isApproved: v?.isApproved};
      });

      setSelectedTags(remapped);
      selectedTags;
    }
  }, [item]);
  // console.log('selectedTags HERE!! ==>> ', selectedTags);

  const getAllTagDetails = async () => {
    setLoading(true);
    setTagShowMsg(false);
    setTagErrMsg('');

    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}user/profile/get/cared/${CTX.userObj?._id}/${caringPage}/90`,
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
        setLoading(false);
        setTagErrMsg(parsedJson?.msg);
        setTagShowMsg(true);
        return;
      }
      setTagShowMsg(false);
      setTagErrMsg('');
      setCaringPage(prevPage => prevPage + 1);
      setHasMoreCaring(parsedJson?.data?.data.length < 1);
      // console.log(
      //   'parsedJson?.data?.data.length < 1 ==>> ',
      //   parsedJson?.data?.data.length < 1,
      //   parsedJson?.data?.data,
      // );
      const mappingStuffHere = parsedJson?.data?.data?.map((v, i) => {
        return {
          username: v?.caring.username,
          photo: v?.caring?.photo,
          active: v?.caring?.active,
          full_name: v?.caring?.full_name,
          monetize: v?.caring?.monetize,
          verify: v?.caring?.verify,
          _id: v?.caring?._id,
        };
      });
      let spreading = [...tags, ...mappingStuffHere];

      setTags(spreading);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for getAllTagDetails! => ', error);
      setTagErrMsg('Network request failed');
      setTagShowMsg(true);
    }
  };

  const getOthersTag = async () => {
    setLoading(true);
    // setTagShowMsg(false);
    // setTagErrMsg('');

    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}user/account/caring/tag/${otherPage}/90`,
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
      setLoading(false);
      // setTagShowMsg(false);
      // setTagErrMsg('');
      // if (parsedJson?.error) {
      //   setTagErrMsg(parsedJson?.msg);
      //   setTagShowMsg(true);
      //   return;
      // }
      setOtherPage(prevPage => prevPage + 1);
      setHasMoreOther(parsedJson?.data?.data.length < 1);
      // console.log('parsedJson?.data?.data ==>> ');
      // console.log('parsedJson?.data?.data ==>> ');
      // console.log('parsedJson?.data?.data ==>> ');
      // console.log('parsedJson?.data?.data ==>> ', parsedJson?.data);
      // console.log('parsedJson?.data?.data ==>> ');
      // console.log('parsedJson?.data?.data ==>> ');
      // console.log('parsedJson?.data?.data ==>> ');
      let spreading = [...tagsOther, ...parsedJson?.data?.data];

      setTagsOther(spreading);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for getOthersTag! => ', error);
      // setTagErrMsg('Network request failed');skyblue
      // setTagShowMsg(true);
    }
  };

  useEffect(() => {
    getAllTagDetails();
    getOthersTag();
    CTX.setStatusBarColor('#fff');
  }, []);

  // send to server the new Teams here!!!
  const addToServer = async () => {
    if (aloading) return;
    setAloading(true);

    const restruct = await selectedTags.map(v => {
      return {su: v.su, isApproved: v.isApproved, _id: v._id};
    });

    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.am}user/push/administrators/amass/account/${item?._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({
            newAdmin: restruct,
          }),
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.error) {
        setAloading(false);
        setTagErrMsg(parsedJson?.msg);
        setTagShowMsg(true);
        return;
      }
      regetAllStuff();
      setAloading(false);
    } catch (error) {
      setAloading(false);
      console.log('error fetching data for getOthersTag! => ', error);
      setTagErrMsg('Network request failed');
      setTagShowMsg(true);
    }
  };

  return (
    <>
      {tagShowMsg && (
        <ErrMessage
          msg={tagErrMsg}
          closeErr={() => setTagShowMsg(!tagShowMsg)}
        />
      )}
      <View style={styles.smallBgColor}>
        {loading ? (
          <View style={{height: 130, overflow: 'hidden', position: 'relative'}}>
            <View style={styles.coverNot}>
              <View style={styles.loadingImg}>
                <SkeletonPlaceholder backgroundColor="#dddddd99" speed={1500}>
                  <SkeletonPlaceholder.Item width={42} height={42} />
                </SkeletonPlaceholder>
              </View>

              <View>
                <SkeletonPlaceholder backgroundColor="#dddddd99" speed={1500}>
                  <SkeletonPlaceholder.Item width={90} height={10} />
                </SkeletonPlaceholder>
                <View style={{marginTop: 3}}>
                  <SkeletonPlaceholder backgroundColor="#dddddd99" speed={1500}>
                    <SkeletonPlaceholder.Item width={90} height={7} />
                  </SkeletonPlaceholder>
                </View>
              </View>
            </View>

            <View
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                zIndex: 10,
              }}>
              <SkeletonPlaceholder backgroundColor="#dddddd99" speed={1500}>
                <SkeletonPlaceholder.Item width={290} height={17} />
              </SkeletonPlaceholder>
            </View>
            <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
              <SkeletonPlaceholder.Item width={660} height={197} />
            </SkeletonPlaceholder>
          </View>
        ) : !userAmass ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
            <FontAwesome5 size={40} color="#000" name="holly-berry" />
            <Text style={{...styles.pleaseRetry, marginVertical: 10}}>
              You don't have any amass yet
            </Text>

            <Button
              label={'Create one'}
              onPress={() => navigation.navigate('CreateAmass')}
            />
          </View>
        ) : (
          <AddTeam
            item={item}
            setTags={setTags}
            tagsOther={tagsOther}
            mainTags={tags}
            hasMoreOther={hasMoreOther}
            getOthersTag={getOthersTag}
            getAllTagDetails={getAllTagDetails}
            hasMoreCaring={hasMoreCaring}
            loading={isloading}
            setLoading={setLoading}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            addToServer={addToServer}
            aloading={aloading}
          />
        )}
      </View>
    </>
  );
};

export default PersonalAmass;
