import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface OtherUserProps {
  user: any; // replace with proper type if you have it
}

const OtherUser: React.FC<OtherUserProps> = ({ user }) => {
  const router = useRouter();

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "#E6F0FF", height: "100%" }}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/(protected)/(tabs)/usersPage")}
      >
        <FontAwesome name="arrow-left" size={28} color="#2563EB" />
      </TouchableOpacity>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={
            user.image
              ? {
                  uri: user.image.startsWith("http")
                    ? user.image
                    : `http://localhost:8000/${user.image}`,
                }
              : require("@/assets/images/cubehub-logo.png")
          }
          style={styles.pfp}
        />
        <Text style={styles.username}>@{user.username}</Text>
      </View>

      {/* Streak / Optional */}
      {user.streak && (
        <LinearGradient
          colors={["#2563EB", "#7cd4faff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streak}
        >
          <FontAwesome5 name="fire-alt" size={70} color="orange" />
          <Text style={styles.days}>{user.streak} Days</Text>
        </LinearGradient>
      )}

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>3x3 Stats</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.statsBox}>
            <Text style={styles.numberText}>{user.ao5}</Text>
            <Text style={styles.numberTextSmall}>Ao5</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.numberText}>{user.ao12}</Text>
            <Text style={styles.numberTextSmall}>Ao12</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.numberText}>{user.single}</Text>
            <Text style={styles.numberTextSmall}>Single</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OtherUser;

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  userInfo: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 35,
    marginTop: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: 10,
    gap: 14,
  },
  pfp: {
    height: 130,
    width: 130,
    padding: 20,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#2563EB",
  },
  username: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
  },
  streak: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: 10,
    gap: 14,
  },
  days: {
    fontSize: 35,
    fontWeight: "600",
    color: "#fff",
  },
  stats: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: 10,
    gap: 14,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    alignSelf: "flex-start",
  },
  numberText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  numberTextSmall: {
    fontSize: 15,
    color: "#616161ff",
  },
  statsBox: {
    width: 80,
    height: 80,
    backgroundColor: "#E5E5E5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
