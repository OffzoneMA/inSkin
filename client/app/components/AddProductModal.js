import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import Button from './Button';

import { useTheme, Text } from "@ui-kitten/components";

import Paragraph from "./Paragraph";

const AddProductModal = ({ isVisible, onClose, onAddProduct }) => {
    
    const theme = useTheme();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={[styles.modalContainer, {backgroundColor: theme["background-basic-color-3"]}]}>
                    <Paragraph>This product doesn't exist!</Paragraph>
                    <Paragraph>Would you like to add it?</Paragraph>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} title="Yes" onPress={() => {
                            onClose();
                            onAddProduct();
                        }}>
                            Yes
                        </Button>
                        <Button style={styles.button} title="No" onPress={onClose}>
                            No
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
    modalContainer: {
        borderRadius: 10,
        padding: 20,
        width: "80%", // Adjust the width as needed
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default AddProductModal;
