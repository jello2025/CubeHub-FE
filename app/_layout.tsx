import { deleteToken, getToken } from "@/api/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AuthContext from "../context/AuthContext";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleLogout = async () => {
    await deleteToken();
    setIsAuthenticated(false);
    router.replace("/loginPage");
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setIsAuthenticated(token ? true : false);
      setIsReady(true);
    };
    checkToken();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Stack>
          {/* Public Screens */}
          {!isAuthenticated && (
            <>
              <Stack.Screen name="loginPage" options={{ headerShown: false }} />
              <Stack.Screen
                name="registerPage"
                options={{ headerShown: false }}
              />
            </>
          )}
          <Stack.Screen name="loginPage" options={{ headerShown: false }} />
          <Stack.Screen name="registerPage" options={{ headerShown: false }} />
          <Stack.Screen name="statsPage" options={{ headerShown: false }} />
          {/* Protected Screens */}
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen
              name="(protected)/(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="(protected)" options={{ headerShown: false }} /> */}
          </Stack.Protected>
        </Stack>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
