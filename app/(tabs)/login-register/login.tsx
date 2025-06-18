import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

function Login(){
    const router = useRouter();
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A1A2F", gap: 50}}>
            <View style={{flexDirection: "row", alignItems: "center", gap: 60, marginRight: 30, marginTop: -50}}>
                <Image 
                source={require("../../../assets/images/favicon.png")}
                style={{width: 90, height: 90}}/>
                <Text style={{fontSize: 35, color: "white"}}>Đăng nhập</Text>
            </View>
            <View style={{flexDirection: "column", width: "80%", gap: 10}}>
                <TextInput style={{backgroundColor: "#fff", height: 35, borderRadius: 5, padding: 20, marginBottom: 15}} placeholder="Email/Số điện thoai"></TextInput>
                <TextInput style={{backgroundColor: "#fff", height: 35, borderRadius: 5, padding: 20, marginBottom: 15}} placeholder="Mật khẩu"></TextInput>
            </View>
            <View style={{flexDirection: "column", marginTop: -20, gap: 10, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity style={{backgroundColor: "#fff", justifyContent: "center", alignItems: "center", width: 100, height: 40, borderRadius: 5}}><Text>Đăng nhập</Text></TouchableOpacity>
                <View style={{flexDirection: "row"}}>
                    <Text style={{color: "#fff"}}>Chưa có tài khoản: </Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/login-register/register')}><Text style={{color: "#fff"}}>Đăng ký</Text></TouchableOpacity>
                </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, marginTop: -30}}>
                <Text style={{color: "#fff"}}>Đăng nhập bằng: </Text>
                <TouchableOpacity><Image 
                source={require("../../../assets/images/favicon.png")}
                style={{width: 50, height: 50}}/></TouchableOpacity>
                <TouchableOpacity><Image 
                source={require("../../../assets/images/favicon.png")}
                style={{width: 50, height: 50}}/></TouchableOpacity>
            </View>
        </View>
    )
}

export default Login;