import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CheckBox = (props) => {
    const iconName = props.isChecked ?
        "checkbox-marked" : "checkbox-blank-outline";

    return (
        <View style={styles.container}>
            <Pressable onPress={props.onPress}>
                <MaterialCommunityIcons
                    name={iconName} size={24} color="#EA6479" />
            </Pressable>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    );
};

export default CheckBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", // Pour disposer les éléments horizontalement
        alignItems: "center", // Pour aligner les éléments verticalement au centre
        marginTop: 5,
        marginHorizontal: 5,
    },
    title: {
        fontSize: 16,
        color: "#000",
        marginLeft: 5,
        fontWeight: "600",
    },
});
