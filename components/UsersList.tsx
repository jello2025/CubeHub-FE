import { getAllUsers, IClass } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import UserItem from "./UserItem";

const UsersList = () => {
  const { data: users, isFetching } = useQuery<IClass[]>({
    queryKey: ["Users"],
    queryFn: getAllUsers,
  });

  const [searchText, setSearchText] = useState("");
  const [minAo5, setMinAo5] = useState<string>("0");
  const [maxAo5, setMaxAo5] = useState<string>("9999");

  const minVal = Number(minAo5) || 0;
  const maxVal = Number(maxAo5) || Number.POSITIVE_INFINITY;

  const filteredList = useMemo(() => {
    if (!users) return [];
    return users
      .filter((user) =>
        user.username.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((user) => {
        const ao5 = Number(user.ao5 ?? 0);
        return ao5 >= minVal && ao5 <= maxVal;
      });
  }, [users, searchText, minVal, maxVal]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Search Bar */}
      <TextInput
        placeholder="Search username"
        style={styles.searchBar}
        value={searchText}
        onChangeText={setSearchText}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* AO5 Range */}
      <View style={styles.rangeRow}>
        <View style={styles.rangeBox}>
          <Text style={styles.rangeLabel}>Min AO5</Text>
          <TextInput
            value={minAo5 === "0" ? "" : minAo5}
            onChangeText={setMinAo5}
            placeholder="Min AO5"
            keyboardType="numeric"
            style={styles.rangeInput}
          />
        </View>
        <View style={styles.rangeBox}>
          <Text style={styles.rangeLabel}>Max AO5</Text>
          <TextInput
            value={maxAo5 === "9999" ? "" : maxAo5}
            onChangeText={setMaxAo5}
            placeholder="Max AO5"
            keyboardType="numeric"
            style={styles.rangeInput}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            setMinAo5("0");
            setMaxAo5("9999");
            setSearchText("");
          }}
          style={styles.clearBtn}
        >
          <Text style={styles.clearBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      <View>
        <UserItem users={filteredList} isFetching={isFetching} />
      </View>
    </ScrollView>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#E6F0FF",
    paddingTop: 90,
  },
  searchBar: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    fontSize: 16,
    color: "#111827",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 16,
  },
  rangeBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  rangeInput: {
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: "#111827",
  },
  clearBtn: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  clearBtnText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
