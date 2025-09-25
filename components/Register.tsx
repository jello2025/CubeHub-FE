import { register } from "@/api/auth";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

import { router } from "expo-router";
import {
  Alert,
  Image,
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

// Yup validation schema
const SignupSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const Register = () => {
  const [userImage, setUserImage] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: (data) => {
      console.log("Registered successfully", data);
    },
    onError: (err: any) => {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    },
  });

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!res.canceled) {
      const pic: string = res.assets[0].uri;
      setUserImage(pic);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        const payload = { ...values, image: userImage };
        mutate(payload);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <View style={styles.formContainer}>
                  <Image
                    source={require("@/assets/images/cubehub-logo.png")}
                    style={{ height: 170, width: 170 }}
                  />
                  {/* Profile image / picker */}
                  {userImage ? (
                    <TouchableOpacity onPress={pickImage}>
                      <Image source={{ uri: userImage }} style={styles.image} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={pickImage} style={styles.circle}>
                      <Ionicons name="camera-outline" size={28} color="#666" />
                      <View style={styles.plusIcon}>
                        <Ionicons name="add" size={16} color="#fff" />
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Username */}
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    autoCapitalize="none"
                    value={values.username}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                  />
                  {errors.username && touched.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}

                  {/* Email */}
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  {/* Password */}
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Create password"
                    secureTextEntry
                    autoCapitalize="none"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  {/* Confirm Password */}
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    secureTextEntry
                    autoCapitalize="none"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[styles.button, isPending && styles.buttonDisabled]}
                    onPress={() => {
                      handleSubmit(), router.push("/profilePage");
                    }}
                    disabled={isPending}
                  >
                    <Text style={styles.buttonText}>
                      {isPending ? "Creating account..." : "Create Account"}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row", gap: 5, marginTop: 15 }}>
                    <Text style={{ fontSize: 16 }}>
                      Already have an account?
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/loginPage")}>
                      <Text style={{ fontSize: 16, color: "#2563EB" }}>
                        Log in
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#c5eaf4ff",
  },
  formContainer: {
    width: 370,
    alignSelf: "center",
    padding: 20,
    marginTop: 20,
    alignItems: "center",
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
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 10,
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
  buttonDisabled: {
    backgroundColor: "#A5B4FC",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});
