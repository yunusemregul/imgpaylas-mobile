import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import colors from "../../styles/colors";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// TODO: Date yi okunabilir hale formatlamak şuan sadece toString yapıyorum
// TODO: İsim yüklenirken alt kısmın tümü yükleniyor şeklinde gösterilebilir

export default function ImageDetails({ route, navigation }) {
  const [data, setData] = useState(route.params.data); // Muhtemelen kötü bir yöntem
  const [creatorName, setCreatorName] = useState("...");

  useEffect(() => {
    const subscriber = firestore()
      .collection("images")
      .doc(route.params.id)
      .onSnapshot((querySnapshot) => {
        setData(querySnapshot.data());
      });

    if (route.params.data.creator == auth().currentUser.uid) {
      return auth().currentUser.displayName;
    } else {
      firestore()
        .collection("users")
        .doc(route.params.data.creator)
        .get()
        .then((documentSnapshot) => {
          setCreatorName(documentSnapshot.data().displayName);
        });
    }

    return subscriber;
  }, []);

  return (
    <View>
      <View
        style={{
          width: "100%",
          height: 480,
        }}
      >
        <Image
          source={{ uri: data.url }}
          style={{ flex: 1, width: undefined, height: undefined }}
        />
      </View>
      <Text
        style={{
          color: colors.primary,
          fontSize: 27,
          fontWeight: "bold",
          marginLeft: 12,
          marginTop: 8,
        }}
      >
        {creatorName}
      </Text>
      <Text style={{ color: colors.primary, fontSize: 19, marginLeft: 12 }}>
        {new Date(data.timestamp).toString()}
      </Text>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 480 + 6,
          right: 8,
          flexDirection: "row",
        }}
        onPress={() => {
          if (!data.likes.includes(auth().currentUser.uid)) {
            firestore()
              .collection("images")
              .doc(route.params.id)
              .update({
                likes: [...data.likes, auth().currentUser.uid],
              });
          } else {
            firestore()
              .collection("images")
              .doc(route.params.id)
              .update({
                likes: data.likes.filter((val) => {
                  return val != auth().currentUser.uid;
                }),
              });
          }
        }}
      >
        <Text
          style={{
            color: data.likes.includes(auth().currentUser.uid)
              ? colors.important
              : colors.primary,
            marginLeft: 2,
            marginRight: 2,
            fontSize: 27,
            fontWeight: "bold",
          }}
        >
          {data.likes.length}
        </Text>
        <Image
          source={
            data.likes.includes(auth().currentUser.uid)
              ? require("../../assets/images/icon_likes_focused.png")
              : require("../../assets/images/icon_likes.png")
          }
          style={{
            marginRight: 2,
            top: 1,
            width: 27,
            height: 27,
            alignSelf: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
