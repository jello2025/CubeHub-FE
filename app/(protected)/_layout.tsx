import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import AuthContext from "../../context/AuthContext";
const ProtectedLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Redirect href="/loginPage" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#89b8eaff",
        tabBarStyle: {
          backgroundColor: "#2563EB",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(tabs)/index"
        options={{
          title: "profile",
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="(tabs)/statsPage"
        options={{
          title: "profile",
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="(tabs)/profilePage"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/usersPage"
        options={{
          title: "Cubers",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default ProtectedLayout;

const styles = StyleSheet.create({});
