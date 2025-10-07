import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

interface OtherUserProps {
  user: any; // replace with your proper user type if you have it
}

const OtherUser: React.FC<OtherUserProps> = ({ user }) => {
  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          user.image
            ? { uri: user.image }
            : require("@/assets/images/cubehub-logo.png")
        }
        style={styles.avatar}
      />
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.ao5}>AO5: {user.ao5}</Text>
      {/* Add more user info here */}
    </View>
  );
};

export default OtherUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#E6F0FF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  username: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  ao5: {
    fontSize: 20,
    fontWeight: "500",
    color: "#666",
    marginTop: 8,
  },
});
