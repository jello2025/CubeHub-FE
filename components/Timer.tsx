import { getScramble } from "@/api/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Timer = () => {
  const queryClient = useQueryClient();

  const {
    data: scramble,
    refetch,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["Scramble"],
    queryFn: getScramble,
  });

  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" } as const;
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleTap = async () => {
    if (!isRunning) {
      setStartTime(Date.now());
      setIsRunning(true);
    } else {
      setElapsedTime(Date.now() - startTime);
      setIsRunning(false);

      // Fetch new scramble after each solve
      await refetch();
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const seconds = Math.floor(elapsedTime / 1000);
  const ms = Math.floor((elapsedTime % 1000) / 10); // two digits for ms

  return (
    <View style={styles.wrapper}>
      <Text style={styles.date}>{formattedDate}</Text>

      <View style={styles.scrambleCard}>
        <Text style={styles.scrambleText}>
          {isSuccess ? scramble : "Loading..."}
        </Text>
      </View>

      <TouchableOpacity style={styles.timerCard} onPress={handleTap}>
        <Text style={styles.timerText}>{`${seconds}.${ms
          .toString()
          .padStart(2, "0")}`}</Text>
        <Text style={styles.timerHint}>
          {isRunning ? "Tap to stop" : "Tap to start"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#E6F0FF", // soft background
  },
  date: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
  },
  scrambleCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
    marginBottom: 32,
  },
  scrambleText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  timerCard: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
    width: "100%",
    height: "40%",
  },
  timerText: {
    fontSize: 100,
    fontWeight: "600",
    color: "#455c8fff",
  },
  timerHint: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
});
