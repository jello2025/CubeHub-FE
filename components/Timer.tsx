import { getMyProfile, getScramble, submitSolve } from "@/api/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Timer = () => {
  const queryClient = useQueryClient();

  // HOOKS
  const { data: scramble, isFetching: scrambleLoading } = useQuery({
    queryKey: ["Scramble"],
    queryFn: getScramble,
  });

  const { data: user, isFetching: userLoading } = useQuery({
    queryKey: ["User"],
    queryFn: getMyProfile,
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);

  // If already submitted, set state
  useEffect(() => {
    if (scramble?.alreadySubmitted && scramble.userAttempt) {
      setElapsedTime(Number(scramble.userAttempt.duration));
      setSubmitted(true);
    }
  }, [scramble]);

  // Timer effect
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

  const handleTap = () => {
    if (!isRunning) {
      setStartTime(Date.now());
      setIsRunning(true);
    } else {
      setElapsedTime(Date.now() - startTime);
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitSolve({
        scrambleId: scramble._id,
        duration: elapsedTime,
      });

      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["User"] });
      queryClient.invalidateQueries({ queryKey: ["Scramble"] });
    } catch (err: any) {
      console.log("Submit error:", err);
      alert(err.response?.data?.message || "Submit failed");
    }
  };

  // Format time
  const seconds = Math.floor(elapsedTime / 1000);
  const ms = Math.floor((elapsedTime % 1000) / 10);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (scrambleLoading || userLoading) {
    return (
      <View style={styles.wrapper}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.date}>{formattedDate}</Text>

      {submitted ? (
        // ✅ Victory card only
        <View style={styles.victoryCard}>
          <Text style={styles.victoryTitle}>🎉 Solve Submitted!</Text>
          <Text style={styles.victoryText}>Scramble:</Text>
          <Text style={styles.victoryScramble}>{scramble?.scramble}</Text>
          <Text style={styles.victoryText}>
            Time: {seconds}.{ms.toString().padStart(2, "0")}s
          </Text>
          <Text style={styles.victoryMessage}>Keep up the streak! 🔥</Text>
        </View>
      ) : (
        // Timer + submit if not submitted
        <>
          <View style={styles.scrambleCard}>
            <Text style={styles.scrambleText}>{scramble?.scramble}</Text>
          </View>

          <TouchableOpacity style={styles.timerCard} onPress={handleTap}>
            <Text style={styles.timerText}>
              {`${seconds}.${ms.toString().padStart(2, "0")}`}
            </Text>
            <Text style={styles.timerHint}>
              {isRunning ? "Tap to stop" : "Tap to start"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Solve</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Timer;

// 🖌 Styles unchanged
const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#E6F0FF",
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
    fontSize: 80,
    fontWeight: "600",
    color: "#455c8fff",
  },
  timerHint: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  victoryCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
  },
  victoryTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  victoryText: {
    fontSize: 18,
    marginTop: 8,
    fontWeight: "600",
  },
  victoryScramble: {
    fontSize: 22,
    color: "#2563EB",
    marginTop: 4,
    textAlign: "center",
  },
  victoryMessage: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ff8c42",
    marginTop: 16,
  },
});
