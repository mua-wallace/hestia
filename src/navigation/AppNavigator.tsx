import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RoomsScreen from '../screens/RoomsScreen';
import ChatScreen from '../screens/ChatScreen';
import TicketsScreen from '../screens/TicketsScreen';
import LostAndFoundScreen from '../screens/LostAndFoundScreen';
import StaffScreen from '../screens/StaffScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AllRoomsScreen from '../screens/AllRoomsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  AllRooms: { showBackButton?: boolean };
  RoomDetails: { roomId: string };
  ChatDetail: { chatId: string };
  TicketDetail: { ticketId: string };
  CreateTicket: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: undefined;
  Staff: undefined;
  Settings: undefined;
};

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
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Rooms" 
        component={AllRoomsScreen}
        options={{
          tabBarLabel: 'Rooms',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen 
        name="Tickets" 
        component={TicketsScreen}
        options={{
          tabBarLabel: 'Tickets',
        }}
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
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="AllRooms" component={AllRoomsScreen} />
    </Stack.Navigator>
  );
}

