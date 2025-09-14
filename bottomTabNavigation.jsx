import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PostContext } from './postVideoCTX';
import EventLive from './src/screens/live/MainEvent';
import ChatList from './src/screens/chatlist/eventChatlist';
import AmassComingSoon from './src/screens/amass_coming_soon/amass_coming_soon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { MainContext } from './App';
import Fontisto from 'react-native-vector-icons/Fontisto';
import OpenPrivateAcc from './src/screens/openPrivateAcc/eventOpenPrivateAcc';
import ProfileScreen from './src/screens/profile/eventProfile';
import PrivateScreen from './src/screens/private/eventPrivate';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useWebSocket } from './WebSocketContext';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  const CTX = useContext(MainContext);
  const PostCTX = useContext(PostContext);
  const { sendMessage } = useWebSocket();

  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: { height: 50 },
        tabBarActiveTintColor: '#e20154',
        tabBarInactiveTintColor: CTX.isDarkMode ? '#fff' : '#000',
      }}
    >
      <Tab.Screen
        listeners={({ navigation, route }) => ({
          focus: () => {
            // sendMessage({
            //   action: 'rebringuserdetails',
            //   token: CTX.sessionToken,
            // });

            console.log('Chats tab is focused');
          },
          // blur: () => {
          //   console.log('Chats tab is blurred');
          // },
        })}
        name="Chats"
        component={ChatList}
        options={{
          unmountOnBlur: true,
          tabBarStyle: {
            backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
            display: 'flex',
          },

          tabBarLabelStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <FontAwesome6 name="list" color={color} size={20} />;
            } else {
              return (
                <MaterialCommunityIcons
                  name="notification-clear-all"
                  color={color}
                  size={size}
                />
              );
            }
          },
        }}
      />

      <Tab.Screen
        listeners={({ navigation, route }) => ({
          focus: () => {
            sendMessage({
              action: 'rebringuserdetails',
              token: CTX.sessionToken,
            });

            console.log('Private tab is focused');
          },
          // blur: () => {
          //   console.log('Private tab is blurred');
          // },
        })}
        name="Private"
        component={
          PostCTX?.isUploadingNew
            ? OpenPrivateAcc
            : // : PostCTX?.minimize
            // ? EventPersonalPrivate
            !CTX?.userObj?.private_life
            ? OpenPrivateAcc
            : PrivateScreen
        }
        // component={EventUploadPrivate}
        options={{
          tabBarActiveTintColor: CTX.userObj?.private_life ? '#fff' : '#e20154',
          tabBarInactiveTintColor: CTX.userObj?.private_life ? '#888' : '#000',
          tabBarStyle: {
            backgroundColor: CTX.userObj?.private_life
              ? '#000'
              : CTX.isDarkMode
              ? '#0f0f0f'
              : '#fff',

            borderTopWidth: 0,
            display: 'flex',
            // height: 60,
          },

          tabBarLabelStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="shield-key"
                  color={color}
                  size={size}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="shield-key-outline"
                  color={color}
                  size={size}
                />
              );
            }
          },
        }}
      />
      <Tab.Screen
        listeners={({ navigation, route }) => ({
          focus: () => {
            sendMessage({
              action: 'rebringuserdetails',
              token: CTX.sessionToken,
            });

            console.log('Live tab is focused');
          },
          // blur: () => {
          //   console.log('Live tab is blurred');
          // },
        })}
        name="Live"
        component={EventLive}
        options={{
          tabBarStyle: {
            backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
            display: 'none',
          },
          tabBarLabelStyle: {
            display: 'none',
          },
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="livestream" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        listeners={({ navigation, route }) => ({
          focus: () => {
            sendMessage({
              action: 'rebringuserdetails',
              token: CTX.sessionToken,
            });
            console.log('AmassComingSoon tab is focused');
          },
          // blur: () => {
          //   console.log('AmassComingSoon tab is blurred');
          // },
        })}
        options={{
          tabBarStyle: {
            backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
            display: 'flex',
          },
          tabBarLabelStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return (
                <Ionicons name="stop-circle-sharp" color={color} size={29} />
              );
            } else {
              return (
                <Ionicons name="stop-circle-outline" color={color} size={29} />
              );
            }
          },
        }}
        name="Amass"
        component={AmassComingSoon}
      />

      <Tab.Screen
        listeners={({ navigation, route }) => ({
          focus: () => {
            sendMessage({
              action: 'rebringuserdetails',
              token: CTX.sessionToken,
            });

            console.log('ProfileScreen tab is focused');
          },
          // blur: () => {
          //   console.log('ProfileScreen tab is blurred');
          // },
        })}
        name="Profile"
        component={ProfileScreen}
        // component={Fallback}
        options={({ route }) => ({
          tabBarStyle: {
            backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
            display: 'flex',
          },

          tabBarLabelStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return (
                <FontAwesome name="user-circle-o" color={color} size={size} />
              );
            } else {
              return (
                <FontAwesome name="user-circle" color={color} size={size} />
              );
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

const getTabVisibility = route => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
  if (routeName == 'ChatList' || routeName == 'MainChat') {
    return 'none';
  } else {
    return 'flex';
  }
};
export default BottomTabNavigation;
