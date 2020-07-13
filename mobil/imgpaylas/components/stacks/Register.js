import auth from "@react-native-firebase/auth";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../styles/style";
import firestore from "@react-native-firebase/firestore";

export default function Register({ navigation, screenName }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  let emailInput, passwordInput, passwordAgainInput;

  function register() {
    auth()
      .createUserWithEmailAndPassword(email, pass)
      .then((userCredentials) => {
        if (userCredentials.user) {
          userCredentials.user
            .updateProfile({
              displayName: name,
            })
            .then((s) => {
              firestore()
                .collection("users")
                .doc(auth().currentUser.uid)
                .update({ displayName: name });
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
            });
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 25,
          color: "#39375B",
        }}
      >
        Üye Kaydı
      </Text>
      <TextInput
        style={styles.textinput}
        placeholder="Ad"
        placeholderTextColor="#39375B"
        onChangeText={(text) => setName(text)}
        onSubmitEditing={() => {
          emailInput.focus();
        }}
      />
      <TextInput
        ref={(input) => {
          emailInput = input;
        }}
        onChangeText={(text) => setEmail(text)}
        autoCompleteType="email"
        style={styles.textinput}
        placeholder="E-posta"
        placeholderTextColor="#39375B"
        onSubmitEditing={() => {
          passwordInput.focus();
        }}
      />
      <TextInput
        ref={(input) => {
          passwordInput = input;
        }}
        onChangeText={(text) => setPass(text)}
        autoCompleteType="password"
        secureTextEntry={true}
        style={styles.textinput}
        placeholder="Şifre"
        placeholderTextColor="#39375B"
        onSubmitEditing={() => {
          passwordAgainInput.focus();
        }}
      />
      <TextInput
        ref={(input) => {
          passwordAgainInput = input;
        }}
        autoCompleteType="password"
        secureTextEntry={true}
        style={styles.textinput}
        placeholder="Şifre Tekrarı"
        placeholderTextColor="#39375B"
        onSubmitEditing={() => {
          register();
        }}
      />
      <TouchableOpacity
        title="Kayıt Ol"
        style={styles.registerbutton}
        activeOpacity={1}
        onPress={() => {
          register();
        }}
      >
        <Text style={{ color: "#fff", fontSize: 17 }}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}
