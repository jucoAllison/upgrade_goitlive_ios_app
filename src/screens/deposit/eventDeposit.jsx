import {View, Text} from 'react-native';
import React, {Suspense, useState} from 'react';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';

const Deposit = React.lazy(() => import('./deposit'));
const EventDeposit = () => {
  const [amount, setAmount] = useState('');

  return (
    <>
      <DismissKeyboardWrapper>
        <Suspense fallback={null}>
          <Deposit amount={amount} setAmount={setAmount} />
        </Suspense>
      </DismissKeyboardWrapper>
    </>
  );
};

export default EventDeposit;
