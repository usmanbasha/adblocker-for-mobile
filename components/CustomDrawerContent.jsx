import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

const CustomDrawerContent = (props) => {

  const handleEditProfile = () => {
    props.navigation.navigate("EditProfileDoctor"); 
  };

  return (
    <DrawerContentScrollView {...props}>
      <View className="mx-auto mt-2 mb-4">
      <TouchableOpacity onPress={handleEditProfile}>
        <Image
          source={require("../assets/dashboard/download.jpeg")}
          className="w-20 h-20"
          onPress={handleEditProfile}
        />
        </TouchableOpacity>
        <Text className="font-bold text-xl">John Doe</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "coloumn",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomDrawerContent;
