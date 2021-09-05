import React from "react";
import { Platform } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import TabBarIcon from "../components/TabBarIcon";
import ChatScreen from "../screens/ChatScreen";
import LinksScreen from "../screens/LinksScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Chat") {
              iconName = "chatbox";
            } else if (route.name === "Links") {
              iconName = "search";
            } else if (route.name === "Profile") {
              iconName = "person";
            }

            Platform.OS === "ios"
              ? (iconName = `ios-${iconName}`)
              : (iconName = `md-${iconName}`);

            // You can return any component that you like here!
            return <TabBarIcon focused={focused} name={iconName} />;
          },
        })}
      >
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Links" component={LinksScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/*export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  ProfileStack,
});*/
