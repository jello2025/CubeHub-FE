import { register } from "@/api/auth";
import AuthContext from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  ao5: Yup.number().required("Required"),
  ao12: Yup.number().required("Required"),
  single: Yup.number().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});
interface UserInfo {
  ao5: number;
  ao12: number;
  single: number;
}
const Register = () => {
  // const [userInfo, setUserInfo] = useState<UserInfo>({
  //   ao5: 0,
  //   ao12: 0,
  //   single: 0,
  // });
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [userImage, setUserImage] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: (data) => {
      console.log("Registered successfully", data);
      setIsAuthenticated(true);
      router.push("/(protected)/(tabs)/profilePage");
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
        ao12: 0,
        ao5: 0,
        single: 0,
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
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              {/* 👇 Single Parent Wrapper */}
              <View style={{ flex: 1 }}>
                {/* Top section */}
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <View style={styles.formContainer}>
                    {/* <Image
                      source={require("@/assets/images/cubehub-logo.png")}
                      style={{ height: 170, width: 170, marginTop: 40 }}
                    /> */}
                    {/* Profile image / picker */}
                    {userImage ? (
                      <TouchableOpacity onPress={pickImage}>
                        <Image
                          source={{ uri: userImage }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={pickImage}
                        style={styles.circle}
                      >
                        <Ionicons
                          name="camera-outline"
                          size={28}
                          color="#666"
                        />
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
                  </View>
                </View>

                {/* Stats Section */}
                <View>
                  <View style={styles.container2}>
                    <View style={styles.header}>
                      <Text style={styles.title}>Your Stats</Text>
                      <Text style={styles.subtitle}>
                        Tell us about your current times!
                      </Text>
                    </View>

                    <View style={styles.card}>
                      <Text style={styles.label}>Average of 5</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ao5"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        onChangeText={handleChange("ao5")}
                        onBlur={handleBlur("ao5")}
                      />

                      <Text style={styles.label}>Average of 12</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ao12"
                        autoCapitalize="none"
                        onChangeText={handleChange("ao12")}
                        onBlur={handleBlur("ao12")}
                        keyboardType="numeric"
                      />

                      <Text style={styles.label}>Personal Best</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Single"
                        autoCapitalize="none"
                        onChangeText={handleChange("single")}
                        onBlur={handleBlur("single")}
                        keyboardType="numeric"
                      />

                      <TouchableOpacity
                        style={[
                          styles.button,
                          isPending && styles.buttonDisabled,
                        ]}
                        onPress={() => {
                          handleSubmit();
                        }}
                        disabled={isPending}
                      >
                        <Text style={styles.buttonText}>Create Account</Text>
                      </TouchableOpacity>

                      <View
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          marginTop: 15,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 16, textAlign: "center" }}>
                          Already have an account?
                        </Text>
                        <TouchableOpacity
                          onPress={() => router.push("/loginPage")}
                        >
                          <Text style={{ fontSize: 16, color: "#2563EB" }}>
                            Log in
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    // alignItems: "center",
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
    marginTop: 30,
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
    marginTop: 70,
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
  container2: {
    // height: "100%",
    backgroundColor: "#c5eaf4ff", // your light blue bg
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 50,
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
});
