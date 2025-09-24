import React, { Suspense, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { MainContext } from '../../../../../App';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import ErrMessage from '../../../../components/errMessage/errMessage';
import { usePermissions } from '../../../../helper/usePermissions';
import Fallback from '../../../../components/fallback/fallback';

const PrivateProfile = React.lazy(() => import('./privateProfile'));
const EventEachUserPrivateProfile = ({
  swipeEnabled,
  setSwipeEnabled,
  route,
}) => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const { granted, loading: loadingPermission } = usePermissions();

  if (loadingPermission) {
    return <Fallback />; // or a spinner
  }

  if (!granted) {
    return <Fallback />;
  }

  return (
    <>
      {showMsg && (
        <ErrMessage closeErr={() => setShowMsg(!showMsg)} msg={errMsg} />
      )}
      <View style={{ backgroundColor: '#fff' }}>
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          barStyle={'light-content'}
        />

        <Suspense
          fallback={
            // <View style={styles.activityCover}>
            //   <ActivityIndicator color={'#0a171e53'} size={40} />
            // </View>
            <Fallback />
          }
        >
          <PrivateProfile
          setSwipeEnabled={setSwipeEnabled} />
        </Suspense>
      </View>
    </>
  );
};

export default EventEachUserPrivateProfile;

const styles = StyleSheet.create({
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  activiityCover: {
    width: '80%',
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // justifyContent: 'center',
    alignItems: 'center',
  },

  pleaseRetry: {
    color: '#0a171e',
    textAlign: 'center',
  },
});
