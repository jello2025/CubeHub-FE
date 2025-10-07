import { login } from "@/api/auth";
import AuthContext from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useContext } from "react";
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
import * as Yup from "yup";

// Yup validation schema
const SignupSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      setIsAuthenticated(true); // ✅ set auth state
      router.replace("/(protected)/(tabs)/profilePage"); // ✅ navigate after login
    },
    onError: (err: any) => {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    },
  });

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        mutate(values); // send login request
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
                    style={{ height: 200, width: 200, marginBottom: 100 }}
                  />

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

                  {/* Password */}
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry
                    autoCapitalize="none"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[styles.button, isPending && styles.buttonDisabled]}
                    onPress={() => handleSubmit()}
                    disabled={isPending}
                  >
                    <Text style={styles.buttonText}>
                      {isPending ? "Logging in..." : "Log in"}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: "row", gap: 5, marginTop: 15 }}>
                    <Text style={{ fontSize: 16 }}>Don't have an account?</Text>
                    <TouchableOpacity
                      onPress={() => router.push("/registerPage")}
                    >
                      <Text style={{ fontSize: 16, color: "#2563EB" }}>
                        Register
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

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#E6F0FF",
  },
  formContainer: {
    width: 370,
    alignSelf: "center",
    padding: 20,
    marginTop: 40,
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
    marginBottom: 25,
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
  buttonDisabled: { backgroundColor: "#A5B4FC" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  errorText: { color: "red", marginBottom: 10, alignSelf: "flex-start" },
});
