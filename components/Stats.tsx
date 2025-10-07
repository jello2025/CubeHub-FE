import { updateUserById } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UserInfo {
  ao5: string;
  ao12: string;
  single: string;
}

const Stats = () => {
  const queryClient = useQueryClient();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    ao5: "",
    ao12: "",
    single: "",
  });
  const {
    mutate,
    error,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
  } = useMutation({
    mutationFn: updateUserById,
    mutationKey: ["user"],
    onSuccess: () => queryClient.invalidateQueries(),

    onError: (err: any) => {
      Alert.alert("Error", err.response.data.message, [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    },
  });

  <View>
    {/* Header */}
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Stats</Text>
        <Text style={styles.subtitle}>Tell us about your current times!</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Average of 5</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUserInfo({ ...userInfo, ao5: text })}
          placeholder="Ao5"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Average of 12</Text>
        <TextInput
          style={styles.input}
          placeholder="Ao12"
          onChangeText={(text) => setUserInfo({ ...userInfo, ao12: text })}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Personal Best</Text>
        <TextInput
          style={styles.input}
          placeholder="Single"
          onChangeText={(text) => setUserInfo({ ...userInfo, single: text })}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>;
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#c5eaf4ff", // your light blue bg
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    color: "#2563EB", // main blue
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
