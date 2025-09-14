import {View, Text, StatusBar, Alert} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {MainContext} from '../../../App';
import {useIsFocused} from '@react-navigation/native';
import Fallback from '../../components/fallback/fallback';

const Privacy = React.lazy(() => import('./privacy'));
const EventPrivacy = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [toogles, setToogles] = useState({
    // block_tag: true,
    // block_comment: true,
    // block_like: true,
    // block_posts: true,
  });
  const [selected, setSelected] = useState(null);

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const toggleHandler = async toggling => {
    try {
      if (selected) return;
      setSelected(toggling);

      const fetchUser = await fetch(
        `${CTX.systemConfig?.am}account/user/toggle/privacy/blocks/${toggling}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CTX.sessionToken}`,
          },
        },
      );
      const jsoned = await fetchUser?.json();

      if(jsoned?.e){
      createThreeButtonAlert(jsoned?.m);
      setSelected(null);
      return 
      }

      const spread = {...toogles};
      spread[toggling] = !spread[toggling];
      setToogles(spread);
      setSelected(null);
    } catch (error) {
      console.log('error verifying create account => ', error);
      createThreeButtonAlert('Network request failed');
    }
  };

  useEffect(() => {
    if (isFocused) {
      setToogles({
        block_tag: CTX?.userObj?.block_tag,
        block_comment: CTX?.userObj?.block_comment,
        block_like: CTX?.userObj?.block_like,
        block_posts: CTX?.userObj?.block_posts,
      });
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
        <Privacy
          toogles={toogles}
          setToogles={setToogles}
          toggleHandler={toggleHandler}
          createThreeButtonAlert={createThreeButtonAlert}
          selected={selected}
        />
      </Suspense>
    </>
  );
};

export default EventPrivacy;
