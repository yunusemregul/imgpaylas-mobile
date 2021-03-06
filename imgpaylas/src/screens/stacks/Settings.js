import auth from "@react-native-firebase/auth";
import React from "react";
import { View } from "react-native";
import CustomButton from "../../components/CustomButton";
import TabTitle from "../../components/TabTitle";
import colors from "../../styles/colors";

// Settings screen
export default function Settings({ navigation }) {
  function logOff() {
    auth()
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      });
  }

  return (
    <View>
      <TabTitle title="Ayarlar" />

      <CustomButton
        buttonStyle={{
          width: 312,
          backgroundColor: colors.negative,
          alignSelf: "center",
        }}
        onPress={logOff}
      >
        ÇIKIŞ YAP
      </CustomButton>
    </View>
  );
}
