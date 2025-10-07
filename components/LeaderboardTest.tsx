import {
  getAllUsers,
  getLeaderboard,
  IClass,
  ILeaderboardResponse,
} from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface LeaderboardEntry {
  username: string;
  image?: string;
  time: number;
  userId: string;
}

const Leaderboard = () => {
  // 1️⃣ Fetch all users
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorObj,
  } = useQuery<IClass[], Error>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // 2️⃣ Fetch leaderboard AFTER users are loaded
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    isError: leaderboardError,
    error: leaderboardErrorObj,
  } = useQuery<ILeaderboardResponse, Error>({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    enabled: !!users, // only fetch after users loaded
  });

  // 3️⃣ Loading state
  if (usersLoading || leaderboardLoading || !users || !leaderboardData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  // 4️⃣ Error state
  if (usersError || leaderboardError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {usersErrorObj?.message ||
            leaderboardErrorObj?.message ||
            "Failed to load leaderboard."}
        </Text>
      </View>
    );
  }

  // 5️⃣ Map leaderboard ObjectIds to usernames and images, convert times to numbers
  const enrichedLeaderboard: LeaderboardEntry[] =
    leaderboardData.leaderboard.map((item) => {
      const user = users.find((u) => u._id === item.user);
      return {
        username: user?.username ?? "Unknown",
        image: user?.image,
        time: Number(item.time ?? 0),
        userId: item.user,
      };
    });

  // 6️⃣ Sort by fastest time
  const sortedLeaderboard = enrichedLeaderboard.sort((a, b) => a.time - b.time);

  // 7️⃣ Render each item
  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.rank}>{index + 1}.</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.avatar} />
      )}
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.time}>{item.time.toFixed(2)}s</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Leaderboard</Text>
      <FlatList
        data={sortedLeaderboard}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No submissions yet.
          </Text>
        }
      />
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    backgroundColor: "#F5F7FA",
    paddingTop: 50,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4A90E2",
  },
  listContainer: {
    paddingHorizontal: 20,
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    width: 30,
  },
  username: {
    fontSize: 16,
    // flex: 1,
    marginLeft: 10,
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
