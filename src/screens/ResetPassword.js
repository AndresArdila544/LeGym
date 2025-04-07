import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ForgotPassword({ navigation }) {
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [email, setEmail] = useState("");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {resetLinkSent ? (
          <View style={{ flex: 1 }}>
            <Image
              source={require("../../assets/images/mail-illustration.png")}
              style={{
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                padding: 16,
                fontSize: 16,
                fontWeight: "semibold",
                textAlign: "center",
                width: "80%",
                margin: "auto",
              }}
            >
              We have sent an email to{" "}
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {email}
              </Text>
              {" "}with instructions to reset your password.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("Welcome");
              }}
            >
              <Text style={styles.buttonText}>Back To Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={{ padding: 16, fontSize: 16, fontWeight: "semibold" }}>
              Please enter your email address and we will send you a link to
              reset your password.
            </Text>
            <TextInput
              placeholder="Enter email address."
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 16,
                margin: 16,
                marginTop: 40,
                fontSize: 16,
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#444444"
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={[
                styles.button,
                { opacity: isValidEmail(email) ? 1 : 0.6 },
              ]}
              disabled={!isValidEmail(email)}
              onPress={() => {
                if (isValidEmail(email)) {
                  setResetLinkSent(true);
                }
              }}
            >
              <Text style={styles.buttonText}>Get Reset Link</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Text style={{ textAlign: "center", width: "70%", margin: "auto" }}>
        By using Le Gym App, you agree to the{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => Linking.openURL("https://example.com/terms")}
        >
          Terms
        </Text>{" "}
        and{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => Linking.openURL("https://example.com/privacy")}
        >
          Privacy Policy
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#800000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    margin: 16,
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
