import {View, Text, StatusBar} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {MainContext} from '../../../App';
import Fallback from '../../components/fallback/fallback';

const AmassCenter = React.lazy(() => import('./showHint'));
const EventActivityStatus = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
    }
  }, [isFocused]);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        translucent={false}
        barStyle={'dark-content'}
      />

      <Suspense fallback={<Fallback />}>
        <AmassCenter />
      </Suspense>
    </>
  );
};

export default EventActivityStatus;
