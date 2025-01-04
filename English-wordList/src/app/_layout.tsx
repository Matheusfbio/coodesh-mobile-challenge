import { initializeDatabase } from "@/utils/db/initDatabase";
import { Stack, Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, statusBarStyle: "auto" }}>
      {/* <SQLiteProvider databaseName="myDatabase.db" onInit={initializeDatabase}> */}
      <Stack.Screen name="(top-tabs)" />
      {/* </SQLiteProvider> */}
    </Stack>
  );
}
