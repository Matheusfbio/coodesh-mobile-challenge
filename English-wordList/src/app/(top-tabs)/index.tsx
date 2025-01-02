import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function WordList() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Word list</Text>
      {/* <ScrollView> */}

      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignContent: "space-between",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
