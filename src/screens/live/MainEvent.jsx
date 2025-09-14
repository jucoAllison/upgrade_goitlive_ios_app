import { View, Text, Platform, Alert, StatusBar } from 'react-native';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/core';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SafeAreaView } from 'react-native';

import { MainContext } from '../../../App';
import Fallback from '../../components/fallback/fallback';
import { usePermissions } from '../../helper/usePermissions';
import ErrMessage from '../../components/errMessage/errMessage';
const EventLive = React.lazy(() => import('./eventLive'));
const EventListedLives = React.lazy(() =>
  import('./listedLives/eventListedLives'),
);
const MainEvent = () => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const CTX = useContext(MainContext);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasmore, setHasmore] = useState(true);
  const [data, setData] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [overRideShow, setOverRideShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const { granted, loading: loadingPermission } = usePermissions();

  const getLiveActions = async pageNum => {
    setLoading(true);
    setShowError(false);
    console.log(`${CTX.systemConfig?.ats}active/live/rtc/${pageNum}/11`);

    try {
      const fetching = await fetch(
        // `${CTX.systemConfig?.ats}get/token?channelName=myChannel&role=CLIENT_ROLE_AUDIENCE&uid=123&expireTime=86300`,
        `${CTX.systemConfig?.ats}active/live/rtc/${pageNum}/11`,
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
      if (parsedJson?.e) {
        setLoading(false);
        setShowError(true);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setLoading(false);
      setShowError(false);
      CTX.setStatusBarColor('#000');
      setData(parsedJson?.data);
      setHasmore(parsedJson?.hasMore);
    } catch (error) {
      setLoading(false);
      setShowError(true);
      console.log(
        'error fetching getTokenAndId for goingLive HERE! => ',
        error,
      );
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      // navigation.setParams({screenName: 'Live'});
      CTX.setStatusBarColor('#000');
      if (overRideShow) return;
      getLiveActions(page);
    }

    return () => {
      setData(null);
      setOverRideShow(false);
    };
  }, [isFocused, page]);

  const loadMore = () => {
    if (hasmore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  if (loadingPermission) {
    return <Fallback />; // or a spinner
  }

  if (!granted) {
    return <Fallback />;
  }

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle={CTX.isDarkMode ? 'light-content' : 'dark-content'}
      />

      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}
      {loading && !data && <Fallback />}

      {overRideShow ? (
        <Suspense fallback={<Fallback />}>
          <EventLive
            removeOverRideShow={() => setOverRideShow(false)}
            data={data}
            onRefreshOthers={() => getLiveActions(page)}
            showError={showError}
          />
        </Suspense>
      ) : data?.length > 0 ? (
        <Suspense fallback={<Fallback />}>
          <EventListedLives
            data={data}
            setData={setData}
            onRefreshOthers={() => getLiveActions(page)}
            loading={loading}
            loadMore={loadMore}
            overRideShow={() => setOverRideShow(true)}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<Fallback />}>
          <EventLive
            removeOverRideShow={() => setOverRideShow(false)}
            showError={showError}
            onRefreshOthers={() => getLiveActions(page)}
            data={data}
          />
        </Suspense>
      )}
    </>
  );
};

export default MainEvent;
