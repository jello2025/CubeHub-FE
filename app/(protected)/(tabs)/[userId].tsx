import { getUserById } from "@/api/auth"; // make sure this exists
import OtherUser from "@/components/OtherUser";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const OtherUserPage = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId as string),
    enabled: Boolean(userId), // only fetch if userId exists
  });
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Loading user...</Text>
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error?.message || "Failed to load user."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OtherUser user={user} />
    </View>
  );
};

export default OtherUserPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
