import {View, Text} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {MainContext} from '../../../../App';
import Fallback from '../../../components/fallback/fallback';

const StartConversation = React.lazy(() => import('./startConversation'));
const EventStartConversation = () => {
  const CTX = useContext(MainContext);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [caringPage, setCaringPage] = useState(1);
  const [tagPersonn, setTagPersonn] = useState('');
  const [hasMoreCaring, setHasMoreCaring] = useState(true);
  const [tags, setTags] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getAllTagDetails = async () => {
    setLoading(true);
    setShowMsg(false);
    setErrMsg('');

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
        setErrMsg(parsedJson?.msg);
        setShowMsg(true);
        return;
      }
      setShowMsg(false);
      setErrMsg('');
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
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  function isNumber(value) {
    return !isNaN(value);
  }

  const setSearchHandler = async e => {
    setTagPersonn(e);
    // if (loading) {
    //   return null;
    // }
    if (e.length < 2) {
      return;
    }

    setShowMsg(false);
    setIsSearching(true);
    setLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}account/profile/user/search`, {
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

      // if (parsedJson?.isRemoved) {
      //   return CTX.logoutUser();
      // }
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setShowMsg(false);
      setLoading(false);
      setTags(parsedJson.data);
      // console.log("parsedJson.data =>> ", parsedJson.data);
      
    } catch (error) {
      setLoading(false);
      console.log('error verifying create account => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    // getMutalConnections
    getAllTagDetails();
  }, []);

  return (
    <>
      <View
        style={{
          // backgroundColor: '#0a171e',
          backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
        }}>
        <View
          style={{
            backgroundColor: '#aaaaaa18',
            padding: 20,
            width: '100%',
            height: '100%',
          }}>
          <Suspense fallback={
            // null
            <Fallback />
            }>
            <StartConversation
              loading={loading}
              showMsg={showMsg}
              getMutalConnections={getAllTagDetails}
              errMsg={errMsg}
              tagPersonn={tagPersonn}
              hasMoreCaring={hasMoreCaring}
              setSearchHandler={setSearchHandler}
              mainTags={tags}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              setTagPersonn={setTagPersonn}
            />
          </Suspense>
        </View>
      </View>
    </>
  );
};

export default EventStartConversation;
