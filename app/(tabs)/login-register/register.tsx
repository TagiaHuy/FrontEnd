import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate inputs
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const apiUrl = "http://172.17.160.120:3000/api/auth/register"; // Verify this IP
    console.log("Sending request to:", apiUrl);
    console.log("Request body:", { email, password, fullName });

    try {
      // Make POST request with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fullName }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      console.log("Response:", { status: response.status, data });

      if (response.ok) {
        Alert.alert("Success", "Registration successful! Please log in.");
        router.push("/(tabs)/login-register/login");
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (typeof error === "object" && error !== null && "name" in error && (error as any).name === "AbortError") {
        Alert.alert("Error", "Request timed out. Check your network or server.");
      } else if (typeof error === "object" && error !== null && "message" in error) {
        Alert.alert("Error", `Network error: ${(error as any).message}`);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A1A2F", gap: 50 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 60, marginRight: 30, marginTop: -50 }}>
        <Image source={require("../../../assets/images/favicon.png")} style={{ width: 90, height: 90 }} />
        <Text style={{ fontSize: 35, color: "white" }}>Đăng ký</Text>
      </View>
      <View style={{ flexDirection: "column", width: "80%", gap: 10 }}>
        <TextInput
          style={{ backgroundColor: "#fff", height: 35, borderRadius: 5, padding: 20, marginBottom: 15 }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={{ backgroundColor: "#fff", height: 35, borderRadius: 5, padding: 20, marginBottom: 15 }}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={{ backgroundColor: "#fff", height: 35, borderRadius: 5, padding: 20, marginBottom: 15 }}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={{ backgroundColor: "#fff", height: 35, borderRadius: 5, padding: 20, marginBottom: 15 }}
          placeholder="Họ và Tên"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={{ flexDirection: "column", marginTop: -20, gap: 10, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: loading ? "#ccc" : "#fff",
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            height: 40,
            borderRadius: 5,
          }}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text>{loading ? "Đang xử lý..." : "Đăng ký"}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "#fff" }}>Đã có tài khoản: </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/login-register/login")}>
            <Text style={{ color: "#fff" }}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, marginTop: -30 }}>
        <Text style={{ color: "#fff" }}>Tiếp tục với: </Text>
        <TouchableOpacity>
          <Image source={require("../../../assets/images/favicon.png")} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../../../assets/images/favicon.png")} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Register;