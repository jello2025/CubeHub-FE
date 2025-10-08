import {
  createPost,
  getMyProfile,
  getUserPosts,
  getUserScrambleHistory,
  updateUserStats,
} from "@/api/auth";
import { deleteToken, getToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface JwtPayload {
  _id: string;
  userId: string;
  username: string;
}

interface IPost {
  _id: string;
  image: string;
  description: string;
  date: string;
}

const Profile = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [ao5, setAo5] = useState("");
  const [ao12, setAo12] = useState("");
  const [single, setSingle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postDescription, setPostDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"history" | "posts">("history");

  const handleSignout = async () => {
    await setIsAuthenticated(false);
    deleteToken();
    router.replace("/loginPage");
  };

  const { data: userData, isFetching: profileLoading } = useQuery({
    queryKey: ["UserProfile"],
    queryFn: getMyProfile,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["scrambleHistory"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return [];
      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.userId;
      return getUserScrambleHistory(userId);
    },
    enabled: !!userData,
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts"],
    queryFn: async () => {
      if (!userData?._id) return [];
      return getUserPosts(userData._id);
    },
    enabled: !!userData,
  });

  const mutation = useMutation({
    mutationKey: ["updateUserStats", userData?._id],
    mutationFn: (
      updatedStats: Partial<{
        ao5: number;
        ao12: number;
        single: number;
        image: string;
      }>
    ) => {
      if (!userData?._id) throw new Error("User ID not available");
      return updateUserStats(userData._id, updatedStats);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UserProfile"] });
      setModalVisible(false);
      setUploading(false);
    },
  });

  const postMutation = useMutation({
    mutationKey: ["createPost"],
    mutationFn: () => {
      if (!postImage) throw new Error("Select an image first");
      return createPost({
        image: postImage,
        description: postDescription,
        user: userData?._id as string,
      });
    },
    onSuccess: () => {
      alert("Posted successfully!");
      setPostImage(null);
      setPostDescription("");
      setPostModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (err: any) => {
      alert("Failed to post: " + err.message);
    },
  });

  const handleUpdateStats = () => {
    const updated = {
      ao5: ao5 ? Number(ao5) : undefined,
      ao12: ao12 ? Number(ao12) : undefined,
      single: single ? Number(single) : undefined,
    };
    mutation.mutate(updated);
  };

  const pickImage = async (forPost = false) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (forPost) {
        setPostImage(uri);
      } else {
        setUploading(true);
        mutation.mutate({ image: uri });
      }
    }
  };

  const formatTime = (time: number | string) => {
    let t = Number(time);
    if (t > 1000) t = t / 1000;
    const rounded = Math.round(t * 100) / 100;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  };

  if (profileLoading || historyLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 20, fontSize: 16, color: "#333" }}>
          Loading, please wait...
        </Text>
      </View>
    );
  }

  const displayData =
    activeTab === "history" ? historyData || [] : userPosts || [];

  return (
    <>
      <FlatList
        key={activeTab} // 🔹 force remount when tab changes
        style={{ backgroundColor: "#E6F0FF" }}
        data={displayData}
        keyExtractor={(item) =>
          activeTab === "history" ? item.scrambleId : item._id
        }
        contentContainerStyle={{ paddingBottom: 50 }}
        numColumns={activeTab === "posts" ? 2 : 1}
        ListHeaderComponent={
          <>
            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={{ position: "relative" }}>
                <Image
                  source={
                    userData?.image
                      ? { uri: userData.image }
                      : require("@/assets/images/cubehub-logo.png")
                  }
                  style={userData?.image ? styles.pfpDynamic : styles.pfp}
                />
                <TouchableOpacity
                  onPress={() => pickImage(false)}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#2563EB",
                    borderRadius: 20,
                    padding: 6,
                  }}
                >
                  <FontAwesome5 name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              {uploading && <Text style={{ marginTop: 8 }}>Uploading...</Text>}
              <Text style={styles.username}>@{userData?.username}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <MaterialIcons name="email" size={24} color="gray" />
                <Text style={{ color: "gray" }}>{userData?.email}</Text>
              </View>

              <TouchableOpacity
                style={[styles.signOutButton, { backgroundColor: "#4A90E2" }]}
                onPress={() => setPostModalVisible(true)}
              >
                <FontAwesome5 name="plus" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignout}
              >
                <Text style={styles.signOutButtonText}>Sign out</Text>
              </TouchableOpacity>
            </View>

            {/* Streak */}
            <LinearGradient
              colors={["#2563EB", "#7cd4faff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.streak}
            >
              <FontAwesome5 name="fire-alt" size={70} color="orange" />
              <Text style={styles.days}>{userData?.streak ?? 0} Days</Text>
            </LinearGradient>

            {/* Stats */}
            <View style={styles.stats}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.statsTitle}>3x3 Stats</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <FontAwesome5 name="edit" size={24} color="#2563EB" />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.statsBox}>
                  <Text style={styles.numberText}>{userData?.ao5 ?? 0}</Text>
                  <Text style={styles.numberTextSmall}>Ao5</Text>
                </View>
                <View style={styles.statsBox}>
                  <Text style={styles.numberText}>{userData?.ao12 ?? 0}</Text>
                  <Text style={styles.numberTextSmall}>Ao12</Text>
                </View>
                <View style={styles.statsBox}>
                  <Text style={styles.numberText}>{userData?.single ?? 0}</Text>
                  <Text style={styles.numberTextSmall}>Single</Text>
                </View>
              </View>
            </View>

            {/* Tab Switcher */}
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
                style={[
                  styles.tabButton,
                  activeTab === "posts" && styles.activeTab,
                ]}
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
          </>
        }
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
            <View style={styles.postCard}>
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: 150, borderRadius: 12 }}
              />
              <Text style={{ marginTop: 6 }}>{item.description}</Text>
            </View>
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

      {/* Modals remain unchanged */}
      {/* Stats Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Stats</Text>
            <TextInput
              placeholder="Ao5"
              keyboardType="numeric"
              style={styles.input}
              value={ao5}
              onChangeText={setAo5}
            />
            <TextInput
              placeholder="Ao12"
              keyboardType="numeric"
              style={styles.input}
              value={ao12}
              onChangeText={setAo12}
            />
            <TextInput
              placeholder="Single"
              keyboardType="numeric"
              style={styles.input}
              value={single}
              onChangeText={setSingle}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleUpdateStats}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Post Modal */}
      <Modal
        visible={postModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPostModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Post</Text>

            {postImage ? (
              <Image
                source={{ uri: postImage }}
                style={{ width: "100%", height: 200, borderRadius: 12 }}
              />
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#E5E5E5",
                  height: 200,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
                onPress={() => pickImage(true)}
              >
                <Text>Pick Image</Text>
              </TouchableOpacity>
            )}

            <TextInput
              placeholder="Description"
              style={styles.input}
              value={postDescription}
              onChangeText={setPostDescription}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => postMutation.mutate()}
              >
                <Text style={styles.modalButtonText}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setPostModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  pfpDynamic: {
    height: 130,
    width: 130,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#2563EB",
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
    marginRight: 12,
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
  signOutButton: {
    backgroundColor: "#ff6565ff",
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
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  noHistory: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
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
  postCard: {
    marginTop: 30,
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});
