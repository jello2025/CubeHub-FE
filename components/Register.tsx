import { register } from "@/api/auth";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Register = () => {
  const [isText, setIsText] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    email: "",
    image: "",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: async (data) => {
      console.log("registered successfully", data);
      // router.push("");
    },
    onError: (err) => {
      console.error("Register error:", err);
    },
  });

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0,
    });

    if (!res.canceled) {
      const pic: string = res.assets[0].uri;
      setUserInfo({ ...userInfo, image: pic });
    }

    console.log(res);
  };

  const handleRegister = async () => {
    mutate(userInfo);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View style={styles.formContainer}>
              <TouchableOpacity style={styles.circle}>
                <Ionicons name="camera-outline" size={28} color="#666" />
                <View style={styles.plusIcon}>
                  <Ionicons name="add" size={16} color="#fff" />
                </View>
              </TouchableOpacity>

              {/* username */}
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
              />

              {/* email */}
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="Enter your email" />

              {/* password */}
              <Text style={styles.label}>Password</Text>
              <TextInput
                onChangeText={(text) =>
                  text !== null ? setIsText(true) : setIsText(false)
                }
                style={styles.input}
                placeholder="Create password"
              />

              {/* confirm password */}
              {isText && (
                <View style={{ width: "100%" }}>
                  <Text style={styles.label}>Confirm password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                  />
                </View>
              )}

              {/* button */}
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#c5eaf4ff",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 25,
  },
  formContainer: {
    width: 370,
    alignSelf: "center",
    // backgroundColor: "#fff",
    // borderRadius: 16,
    padding: 20,
    marginTop: 40,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 4,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 30,
  },
  plusIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#2563EB",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
