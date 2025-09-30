import { getMyProfile } from "@/api/auth";
import { deleteToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useContext } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const Profile = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const handleSignout = async () => {
    await setIsAuthenticated(false);
    deleteToken();
    router.replace("/loginPage");
  };

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["User"],
    queryFn: getMyProfile,
  });
  console.log(data);
  if (isFetching) return <Text>Loading...</Text>;
  console.log(data?.image);

  return (
    <ScrollView style={{ backgroundColor: "#E6F0FF", height: "100%" }}>
      <View style={styles.userInfo}>
        <Image
          source={
            data?.image
              ? { uri: `http://localhost:8000/${data.image}` }
              : require("@/assets/images/cubehub-logo.png")
          }
          style={styles.pfp}
        />
        <Text style={styles.username}>@{data?.username}</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignout}>
          <Text style={styles.signOutButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={["#2563EB", "#7cd4faff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.streak}
      >
        <FontAwesome5 name="fire-alt" size={70} color="orange" />
        <Text style={styles.days}>15 Days</Text>
      </LinearGradient>
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>3x3 Stats</Text>
        <View style={{ flexDirection: "row" }}>
          {/* ao5 */}
          <View style={styles.statsBox}>
            <Text style={styles.numberText}>{data?.ao5}</Text>
            <Text style={styles.numberTextSmall}>Ao5</Text>
          </View>
          {/* ao12 */}
          <View style={styles.statsBox}>
            <Text style={styles.numberText}>{data?.ao12}</Text>
            <Text style={styles.numberTextSmall}>Ao12</Text>
          </View>
          {/* single */}
          <View style={styles.statsBox}>
            <Text style={styles.numberText}>{data?.single}</Text>
            <Text style={styles.numberTextSmall}>Single</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  userInfo: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginLeft: 35,
    marginRight: 35,
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

  streak: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    marginLeft: 35,
    marginRight: 35,
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
  username: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
  },
  stats: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginLeft: 35,
    marginRight: 35,
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
    // fontWeight: "700",
    color: "#616161ff",
  },
  statsBox: {
    width: 80, // small width
    height: 80, // small height
    backgroundColor: "#E5E5E5", // light gray
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
  signOutButton: {
    backgroundColor: "#ff6565ff", // a nice red
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
