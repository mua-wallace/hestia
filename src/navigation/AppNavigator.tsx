import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RoomsScreen from '../screens/RoomsScreen';
import ChatScreen from '../screens/ChatScreen';
import TicketsScreen from '../screens/TicketsScreen';
import MoreScreen from '../screens/MoreScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  RoomDetails: { roomId: string };
  ChatDetail: { chatId: string };
  TicketDetail: { ticketId: string };
  CreateTicket: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5a759d',
        tabBarInactiveTintColor: '#5a759d',
        tabBarStyle: {
          height: 152,
          borderTopWidth: 1,
          borderTopColor: '#e6e6e6',
          shadowColor: 'rgba(100, 131, 176, 0.4)',
          shadowOffset: { width: 0, height: -35 },
          shadowOpacity: 1,
          shadowRadius: 105.1,
          elevation: 10,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Rooms" 
        component={RoomsScreen}
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
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
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
    </Stack.Navigator>
  );
}

