import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import UserItem from "./UserItem";
const UsersList = () => {
  const [filteredList, setFilteredList] = useState();

  return (
    <ScrollView style={styles.container}>
      <TextInput placeholder="Search username" style={styles.searchBar} />
      <View>
        <UserItem />
      </View>
    </ScrollView>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 90,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  container: {
    height: "100%",
    backgroundColor: "#E6F0FF",
  },
});
