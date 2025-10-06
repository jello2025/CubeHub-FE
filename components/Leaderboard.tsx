import {
  getAllUsers,
  getLeaderboard,
  IClass,
  ILeaderboardResponse,
} from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface LeaderboardEntry {
  username: string;
  image?: string;
  time: number;
  userId: string;
}

const Leaderboard = () => {
  const { data: users } = useQuery<IClass[]>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { data: leaderboardData } = useQuery<ILeaderboardResponse>({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    enabled: !!users,
  });

  if (!users || !leaderboardData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  const enrichedLeaderboard: LeaderboardEntry[] =
    leaderboardData.leaderboard.map((item) => {
      const user = users.find((u) => u._id === item.user);

      // 🔹 normalize time: if time is huge, assume milliseconds
      let timeNum = Number(item.time ?? 0);
      if (timeNum > 100) timeNum = timeNum / 1000;

      return {
        username: user?.username ?? "Unknown",
        image: user?.image,
        time: timeNum,
        userId: item.user,
      };
    });

  const sortedLeaderboard = enrichedLeaderboard.sort((a, b) => a.time - b.time);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Today's Leaderboard</Text>
      {sortedLeaderboard.length === 0 && (
        <Text style={styles.noData}>No submissions yet.</Text>
      )}
      {sortedLeaderboard.map((item, index) => (
        <View key={item.userId} style={styles.card}>
          <Text style={styles.rank}>{index + 1}</Text>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.avatar} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.time}>{item.time.toFixed(2)}s</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F7FA",
    paddingTop: 50,
    height: "100%",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    marginTop: 70,
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    width: 30,
    textAlign: "center",
    color: "#333",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  time: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4A90E2",
  },
});
