import React from "react";
import { StyleSheet, View } from "react-native";
import UserItem from "./UserItem";

const UsersList = () => {
  return (
    <View style={styles.list}>
      <UserItem />
    </View>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  list: {
    marginTop: 80,
  },
});
