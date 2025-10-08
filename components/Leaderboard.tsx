import {
  getAllUsers,
  getLeaderboard,
  IClass,
  ILeaderboardResponse,
} from "@/api/auth";
import { FontAwesome5 } from "@expo/vector-icons"; // make sure expo/vector-icons is installed
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

  // Podium order: Left (2nd), Middle (1st), Right (3rd)
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = [100, 140, 100]; // smaller
  const podiumBorders = ["#C0C0C0", "#FFD700", "#CD7F32"];
  const podiumOffset = [10, 0, 10]; // float effect

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Today's Leaderboard</Text>

      {/* 🏆 Top 3 Podiums */}
      <View style={[styles.podiumWrapper, { justifyContent: "center" }]}>
        {podiumOrder.map((item, index) => {
          const isFirst = index === 1; // middle podium is 1st
          return (
            <View
              key={item.userId}
              style={[
                styles.podiumColumn,
                { marginTop: podiumOffset[index], marginHorizontal: 10 },
              ]}
            >
              <View
                style={[
                  styles.podiumCircle,
                  {
                    height: podiumHeights[index],
                    width: podiumHeights[index],
                    borderColor: podiumBorders[index],
                    borderWidth: 4,
                  },
                ]}
              >
                {isFirst && (
                  <FontAwesome5
                    name="crown"
                    size={40}
                    color="#FFD700"
                    style={styles.crownIcon}
                  />
                )}
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
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: item.image }} style={styles.avatar} />
            </View>
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
    marginBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { fontSize: 16, color: "#333" },
  podiumWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 40,
  },
  podiumColumn: {
    alignItems: "center",
    position: "relative",
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
    backgroundColor: "#fff",
    position: "relative",
  },
  podiumAvatar: {
    width: "90%",
    height: "90%",
    borderRadius: 100,
  },
  crownIcon: {
    position: "absolute",
    top: -40,
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
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
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
