import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const Profile = () => {
  return (
    <ScrollView>
      <View style={styles.userInfo}>
        <Image
          source={require("@/assets/images/cubehub-logo.png")}
          style={{ height: 200, width: 200 }}
        />
        <Text>@CubeMaster99</Text>
      </View>
    </ScrollView>
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
    margin: 35,
    marginTop: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: 10,
  },
});
