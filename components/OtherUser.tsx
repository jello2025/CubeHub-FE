import { getUserPosts, getUserScrambleHistory } from "@/api/auth";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface OtherUserProps {
  user: any;
}

interface ScrambleHistoryItem {
  scrambleId: string;
  date: string;
  time: number;
  rank: number;
}

interface PostItem {
  _id: string;
  image: string;
  description: string;
  date: string;
}
interface IPost {
  _id: string;
  image: string;
  description: string;
  date: string;
}

const { width } = Dimensions.get("window");
const PADDING = 35; // left + right padding from container
const GAP = 10; // spacing between images
const NUM_COLUMNS = 3;

const IMAGE_SIZE = (width - 40 - 10) / 2;

const OtherUser: React.FC<OtherUserProps> = ({ user }) => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"history" | "posts">("history");
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const historyRef = useRef<FlatList>(null);
  const postsRef = useRef<FlatList>(null);

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["scrambleHistory", userId],
    queryFn: () => getUserScrambleHistory(userId),
    enabled: !!userId,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });

  const formatTime = (time: number | string) => {
    let t = Number(time);
    if (t > 1000) t = t / 1000;
    const rounded = Math.round(t * 100) / 100;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  };

  if (!user || historyLoading || postsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const displayData =
    activeTab === "history" ? historyData || [] : postsData || [];
  const scrollRef = activeTab === "history" ? historyRef : postsRef;

  const ListHeader = () => (
    <>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/(protected)/(tabs)/usersPage")}
      >
        <FontAwesome name="arrow-left" size={28} color="#2563EB" />
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <Image
          source={
            user?.image
              ? { uri: user.image }
              : require("@/assets/images/cubehub-logo.png")
          }
          style={user?.image ? styles.pfpDynamic : styles.pfp}
        />
        <Text style={styles.username}>@{user.username}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <MaterialIcons name="email" size={24} color="gray" />
          <Text style={{ color: "gray" }}>{user.email}</Text>
        </View>
      </View>

      <LinearGradient
        colors={["#2563EB", "#7cd4faff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.streak}
      >
        <FontAwesome5 name="fire-alt" size={70} color="orange" />
        <Text style={styles.days}>{user.streak} Days</Text>
      </LinearGradient>

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

      {/* Tabbar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "history" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            Scramble History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "posts" && styles.activeTabText,
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={!!selectedPost}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { width: "90%" }]}>
            {/* Close X */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedPost(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: selectedPost?.image }}
              style={{ width: "100%", height: 300, borderRadius: 12 }}
            />
            <Text style={{ marginTop: 10, fontSize: 16 }}>
              {selectedPost?.description}
            </Text>
            <Text style={{ color: "#666", marginTop: 4 }}>
              {selectedPost ? new Date(selectedPost.date).toLocaleString() : ""}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <FlatList
      ref={scrollRef}
      key={activeTab}
      data={displayData}
      keyExtractor={(item) =>
        activeTab === "history" ? item.scrambleId : item._id
      }
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{ paddingBottom: 50 }}
      numColumns={activeTab === "posts" ? 2 : 1}
      renderItem={({ item }) =>
        activeTab === "history" ? (
          <View
            style={[
              styles.historyCard,
              { marginHorizontal: 35, marginBottom: 10, marginTop: 30 },
            ]}
          >
            <Text style={styles.historyDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text style={styles.historyTime}>
              Time: {formatTime(item.time)}s
            </Text>
            <Text style={styles.historyRank}>Rank: #{item.rank}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setSelectedPost(item)}
            style={styles.postCard}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: 12,
              }}
            />
            {/* <Text style={{ marginTop: 6 }}>{item.description}</Text>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
              {new Date(item.date).toLocaleDateString()}
            </Text> */}
          </TouchableOpacity>
        )
      }
      ListEmptyComponent={
        <Text
          style={[styles.noHistory, { marginTop: 20, marginHorizontal: 35 }]}
        >
          {activeTab === "history"
            ? "No scramble history yet."
            : "No posts yet."}
        </Text>
      }
    />
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
    borderRadius: 70,
    borderWidth: 4,
    padding: 20,
    borderColor: "#2563EB",
  },
  pfpDynamic: {
    height: 130,
    width: 130,
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
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2563EB",
    marginBottom: 10,
    marginLeft: 30,
  },
  historyCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  historyTime: {
    fontSize: 14,
    color: "#2563EB",
    marginTop: 4,
  },
  historyRank: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  noHistory: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 35,
    backgroundColor: "#E5E5E5",
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    color: "#555",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  postCard: {
    marginTop: 30,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  modalButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "#ccc",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
});
