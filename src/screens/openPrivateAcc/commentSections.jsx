import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import React, {Suspense, useCallback, useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import {MainContext} from '../../../App';
import {PostContext} from '../../../postVideoCTX';
import Fallback from '../../components/fallback/fallback';
const Tags = React.lazy(() => import('./tags'));
const CommentSections = ({ showBottomSheetHandler}) => {
  const CTX = useContext(MainContext);
  const PostCTX = useContext(PostContext);
  const [hasMoreCaring, setHasMoreCaring] = useState(true);
  const [hasMoreOther, setHasMoreOther] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tagShowMsg, setTagShowMsg] = useState(true);
  const [tagErrMsg, setTagErrMsg] = useState('');
  const [tags, setTags] = useState([]);
  const [tagsOther, setTagsOther] = useState([]);
  const [caringPage, setCaringPage] = useState(1);
  const [otherPage, setOtherPage] = useState(1);

  // const getAllTagDetails = async () => {
  // };

  // const getOthersTag = async () => {
    
  // };

  const getAllTagDetails = useCallback(async() => {
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
      //   parsedJson?.data,
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
  }, []);


  const getOthersTag = useCallback(async() => {
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
  }, []);


  useEffect(() => {
    getAllTagDetails();
    getOthersTag();
    CTX.setStatusBarColor('#fff');
  }, []);

  return (
    <View style={{width: '100%'}}>
      <View style={styles.coverAllAboutVideo}>
        <View style={styles.textAreaStyleCover}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: '#000', marginBottom: 5}}></Text>

            <Text
              style={{
                color: '#000',
                marginBottom: 5,
                fontFamily: 'Overpass-Regular',
                fontSize: 10,
              }}>
              {PostCTX.msgInput.length}/2200
            </Text>
          </View>
          <View style={styles.textAreaStyle}>
            <TextInput
              style={{
                ...styles.messageInput,
                fontSize: 13,
                textAlignVertical: 'top',
                fontFamily: 'Overpass-Regular',
              }}
              multiline={true}
              placeholder="Share your thought within 2200 characters"
              placeholderTextColor={'#00000062'}
              numberOfLines={27}
              onChangeText={e => {
                if (PostCTX.msgInput.length > 2200) {
                  return;
                }
                PostCTX.setMsgInput(e);
              }}
              value={PostCTX.msgInput}
            />
          </View>

          <Suspense
            fallback={null
              // <Fallback />
              // <View style={styles.activityCover}>
              //   <ActivityIndicator color={'#fff'} size={40} />
              // </View>
            }>
            <Tags
              mainTags={tags}
              loading={loading}
              tagShowMsg={tagShowMsg}
              tagErrMsg={tagErrMsg}
              reTryStuff={getAllTagDetails}
              hasMoreOther={hasMoreOther}
              tagsOther={tagsOther}
              getOthersTag={getOthersTag}
              setLoading={setLoading}
              setTagShowMsg={setTagShowMsg}
              setTags={setTags}
              setTagErrMsg={setTagErrMsg}
              hasMoreCaring={hasMoreCaring}
              getOthersCare={getAllTagDetails}
            />
          </Suspense>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.bestOfOur}
            onPress={showBottomSheetHandler}>
            {PostCTX.topIndex?.svg}
            <Text style={styles.bestOfOurText}>
              {PostCTX.topIndex?.name?.includes('Everyone')
                ? 'Everyone can see these post'
                : PostCTX.topIndex?.name}
            </Text>

            <SimpleLineIcons
              style={{marginLeft: 'auto'}}
              name="arrow-right"
              size={15}
              color="#55555596"
            />
          </TouchableOpacity>


          <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 14,
                alignItems: 'center',
              }}>
              <Text style={styles.bestOfOurText}>Hide comment</Text>

                
              <View style={{marginLeft: 'auto'}}>
                  <Switch
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => PostCTX.setHideComment(!PostCTX.hideComment)}
                    value={PostCTX.hideComment}
                    trackColor={{true: '#e2015496', false: '#efefef'}}
                    thumbColor={PostCTX.hideComment ? '#e20154' : '#bbb'}
                  />
              </View>
            </View>
        </View>
      </View>
    </View>
    // </>
  );
};

export default CommentSections;
