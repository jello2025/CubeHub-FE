import { getAllUsers } from "@/api/auth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const UserItem = () => {
  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["Users"],
    queryFn: getAllUsers,
  });

  console.log(data);

  return (
    <ScrollView>
      {isSuccess &&
        data?.map((user) => (
          <TouchableOpacity key={user._id} style={styles.card}>
            <View style={styles.userInfo}>
              <Image
                source={
                  user.image
                    ? { uri: `http://localhost:8000/${user.image}` }
                    : require("@/assets/images/cubehub-logo.png")
                }
                style={styles.pfp}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.time}>{user.ao5}</Text>
              </View>
            </View>

            <FontAwesome name="arrow-right" size={20} color="#2563EB" />
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pfp: {
    height: 70,
    width: 70,
    padding: 10,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#2563EB",
  },
  username: {
    fontSize: 25,
    fontWeight: "600",
    color: "#333",
  },
  time: {
    fontSize: 20,
    fontWeight: "500",
    color: "#666",
    justifyContent: "flex-end",
  },
});
