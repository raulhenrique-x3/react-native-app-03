import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Flex = () => {
    return (
        <View style={[styles.container, {
            width: '100%',
            flexDirection: "column"
        }]}>
            <View style={styles.box_1} />
            <View style={styles.box_2} />
            <View style={styles.box_3} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    box_1: {
        width: '100%',
        height: 100,
        backgroundColor: "red"
    },
    box_2: {
        width: '100%',
        height: 100,
        backgroundColor: "darkorange"
    },
    box_3: {
        width: '100%',
        height: 100,
        backgroundColor: "green"
    }
});

export default Flex;