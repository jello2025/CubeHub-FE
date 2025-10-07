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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  const enrichedLeaderboard: LeaderboardEntry[] =
    leaderboardData.leaderboard.map((item) => {
      const user = users.find((u) => u._id === item.user);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Today's Leaderboard</Text>

      {/* 🏆 Top 3 Podiums */}
      <View style={styles.podiumWrapper}>
        {top3.map((item, index) => {
          const heights = [120, 100, 80]; // first is tallest
          const crown = index === 0 ? "👑" : null;
          const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
          return (
            <View key={item.userId} style={styles.podiumColumn}>
              <View
                style={[
                  styles.podiumCircle,
                  {
                    height: heights[index],
                    width: heights[index],
                    backgroundColor: colors[index],
                  },
                ]}
              >
                {crown && <Text style={styles.crown}>{crown}</Text>}
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.podiumAvatar}
                  />
                )}
              </View>
              <Text style={styles.podiumName}>{item.username}</Text>
              <Text style={styles.podiumTime}>{item.time.toFixed(2)}s</Text>
            </View>
          );
        })}
      </View>

      {/* Rest of leaderboard */}
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
    backgroundColor: "#E0F2FF",
    height: "100%",
    paddingTop: 50,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    marginTop: 50,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563EB",
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { fontSize: 16, color: "#333" },
  podiumWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 40,
  },
  podiumColumn: {
    alignItems: "center",
  },
  podiumCircle: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  podiumAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  crown: {
    position: "absolute",
    top: -20,
    fontSize: 28,
    zIndex: 10,
  },
  podiumName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  podiumTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563EB",
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
