import Following from './following/eventFollowing';
import Private from './anythingAboutPrivate/eventPrivate';
import PrivateProfile from './eachUserPrivateProfile/eventEachUserPrivateProfile';
import EventUserProfiles from '../../userProfiles/eventUserProfiles';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StatusBar } from 'react-native';
import React, { useState } from 'react';

// import {MainContext} from '../../../../App';
const Tab = createMaterialTopTabNavigator();

const OldNavigation = () => {
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  // const CTX = useContext(MainContext);

  // useEffect(() => {
  //   CTX.setStatusBarColor('#000000');
  // }, []);

  return (
    <>
      {/* <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="light-content"
      /> */}

      <Tab.Navigator
        backBehavior="history"
        keyboardDismissMode="on-drag"
        initialRouteName="otherPrivate"
        screenOptions={{
          swipeEnabled: swipeEnabled,
          tabBarActiveTintColor: '#fff',
          tabBarStyle: { backgroundColor: '#0a171e' },
          tabBarIndicatorStyle: { backgroundColor: '#fff', height: 3 },
        }}
      >
        <Tab.Screen
          options={{ tabBarStyle: { display: 'none' } }}
          name="personalPrivate"
          component={Following}
        />
        <Tab.Screen
          options={{ tabBarStyle: { display: 'none' } }}
          name="otherPrivate"
          // component={Private}
          children={() => (
            <Private
              swipeEnabled={swipeEnabled}
              setSwipeEnabled={setSwipeEnabled}
            />
          )}
        />
        <Tab.Screen
          name="privateProfiles"
          options={{ tabBarStyle: { display: 'none' } }}
          children={() => (
            <PrivateProfile
              swipeEnabled={swipeEnabled}
              setSwipeEnabled={setSwipeEnabled}
            />
          )}
          // component={EventUserProfiles}
          initialParams={{ user: { username: '' } }}
        />
      </Tab.Navigator>
    </>
  );
};

export default OldNavigation;
