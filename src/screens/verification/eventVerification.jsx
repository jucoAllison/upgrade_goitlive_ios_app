import {View, Text} from 'react-native';
import React, {Suspense} from 'react';
import Fallback from '../../components/fallback/fallback';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';

const Verification = React.lazy(() => import('./verification'));
const EventVerification = () => {
  return (
    <>
      <DismissKeyboardWrapper>
        <Suspense fallback={<Fallback />}>
          <Verification />
        </Suspense>
      </DismissKeyboardWrapper>
    </>
  );
};

export default EventVerification;
