import { IClass } from "@/api/auth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserItemProps {
  users?: IClass[];
  isFetching?: boolean;
}

const UserItem: React.FC<UserItemProps> = ({ users, isFetching }) => {
  const router = useRouter();

  if (isFetching) return <Text style={styles.centerText}>Loading...</Text>;
  if (!users || users.length === 0)
    return <Text style={styles.centerText}>No users found.</Text>;

  return (
    <ScrollView>
      {users.map((user) => (
        <TouchableOpacity
          key={user._id}
          style={styles.card}
          onPress={() => router.push(`/${user._id}`)}
        >
          <View style={styles.userInfo}>
            <Image
              source={
                user.image
                  ? { uri: `http://localhost:8000/${user.image}` }
                  : require("@/assets/images/cubehub-logo.png")
              }
              style={styles.pfp}
            />
            <View>
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
  },
  centerText: {
    textAlign: "center",
    marginTop: 20,
  },
});
