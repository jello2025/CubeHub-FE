import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Register = () => {
  const [isText, setIsText] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    email: "",
  });
  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
        />
        <Text>CubeHub</Text>
        <Text>Join the speedcubing community!</Text>
      </View> */}
      <View style={styles.formContainer}>
        {/* <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
        />
        <Text>Add profile picture (optional)</Text> */}
        {/* username */}
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} placeholder="Enter your username" />
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
    paddingHorizontal: 20,
    height: "100%",
    backgroundColor: "#D9D9D9",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  label: {
    fontSize: 21,
    color: "#333",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 25,
  },
  formContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
