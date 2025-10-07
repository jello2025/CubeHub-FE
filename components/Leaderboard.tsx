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

      // normalize time: if time is huge, assume milliseconds
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

  const top3 = sortedLeaderboard.slice(0, 3);
  const rest = sortedLeaderboard.slice(3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Today's Leaderboard</Text>

      {/* 🏆 Top 3 Podium */}
      <View style={styles.podiumContainer}>
        {top3.map((item, index) => {
          const medals = ["🥇", "🥈", "🥉"];
          return (
            <View
              key={item.userId}
              style={[styles.podiumCard, (styles as any)[`podium${index + 1}`]]}
            >
              <Text style={styles.medal}>{medals[index]}</Text>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.podiumAvatar}
                />
              )}
              <Text style={styles.podiumName}>{item.username}</Text>
              <Text style={styles.podiumTime}>{item.time.toFixed(2)}s</Text>
            </View>
          );
        })}
      </View>

      {/* ❌ No submissions */}
      {sortedLeaderboard.length === 0 && (
        <Text style={styles.noData}>No submissions yet.</Text>
      )}

      {/* 📋 Rest of leaderboard */}
      {rest.map((item, index) => (
        <View key={item.userId} style={styles.card}>
          <Text style={styles.rank}>{index + 4}</Text>
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
    backgroundColor: "#F0F7FF",
    height: "100%",
    paddingTop: 50,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    marginTop: 50,
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
    textAlign: "center",
    marginBottom: 20,
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
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  podiumCard: {
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    width: 100,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  podium1: {
    backgroundColor: "#FFD700",
    marginTop: 0,
  },
  podium2: {
    backgroundColor: "#C0C0C0",
    marginTop: 20,
  },
  podium3: {
    backgroundColor: "#CD7F32",
    marginTop: 40,
  },
  medal: {
    fontSize: 30,
    marginBottom: 5,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  podiumTime: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
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
    color: "#2563EB",
  },
});
