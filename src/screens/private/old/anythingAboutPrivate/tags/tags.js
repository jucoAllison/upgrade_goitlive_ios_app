import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

const Tags = ({mappedOtherDatas}) => {
  return (
    <BottomSheetScrollView
      style={{
        padding: 20,
      }}>
      {mappedOtherDatas}
    </BottomSheetScrollView>
  );
};

export default Tags;
