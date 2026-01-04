import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import TicketsScreen from '../screens/TicketsScreen';
import LostAndFoundScreen from '../screens/LostAndFoundScreen';
import StaffScreen from '../screens/StaffScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AllRoomsScreen from '../screens/AllRoomsScreen';
import ArrivalDepartureDetailScreen from '../screens/ArrivalDepartureDetailScreen';
import CreateTicketScreen from '../screens/CreateTicketScreen';
import CreateTicketFormScreen from '../screens/CreateTicketFormScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import type { RootStackParamList, MainTabsParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5a759d',
        tabBarInactiveTintColor: '#5a759d',
        tabBarStyle: {
          display: 'none', // Hide default tab bar since HomeScreen has custom one
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
      />
      <Tab.Screen 
        name="Rooms" 
        component={AllRoomsScreen}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
      />
      <Tab.Screen 
        name="Tickets" 
        component={TicketsScreen}
      />
      {/* Hidden screens - accessible via More popup */}
      <Tab.Screen 
        name="LostAndFound" 
        component={LostAndFoundScreen}
        options={{
          tabBarButton: () => null, // Hide from tab bar
        }}
      />
      <Tab.Screen 
        name="Staff" 
        component={StaffScreen}
        options={{
          tabBarButton: () => null, // Hide from tab bar
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarButton: () => null, // Hide from tab bar
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen 
        name="AllRooms" 
        component={AllRoomsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="ArrivalDepartureDetail" 
        component={ArrivalDepartureDetailScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
      <Stack.Screen name="CreateTicketForm" component={CreateTicketFormScreen} />
    </Stack.Navigator>
  );
}

