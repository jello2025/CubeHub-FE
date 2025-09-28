import { Redirect, Stack } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import AuthContext from "../../context/AuthContext";

const ProtectedLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Redirect href="/loginPage" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)/profilePage" />
    </Stack>
  );
};

export default ProtectedLayout;

const styles = StyleSheet.create({});
