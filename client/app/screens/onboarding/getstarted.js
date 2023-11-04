import React from "react";
import { View } from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Button from '../../components/Button';
import Paragraph from "../../components/Paragraph";
import Label from "../../components/Label";

export default function Getstarted({ navigation }) {
  return (
    <Page>
      <View style={{ flex: 1}}>
        <Heading fontSize={25} style={{ marginTop: 30, marginBottom: 10 }}>
          Welcome to Nova Chic
        </Heading>
        <Paragraph style={{ marginBottom: 20 }}>
        Hello Beauty Enthusiast! With Nova Chic, scanning cosmetic barcodes is a breeze. Instantly access product details, honest user reviews, and expert recommendations. Make confident choices, post your own reviews, and connect with a vibrant beauty community.
        </Paragraph>
        <Paragraph style={{ marginBottom: 10 }}>
        🌟 Scan with Ease.
        </Paragraph>
        <Paragraph style={{ marginBottom: 10 }}>
        ✨ Informed Decisions.
        </Paragraph>
        <Paragraph style={{ marginBottom: 10 }}>
        🎉 Share Your Thoughts.
        </Paragraph>
        <Label fontSize={18} style={{ marginTop: 20, textAlign: 'center' }}>
        Make every beauty choice count with:
        </Label>
        <Label fontSize={25} style={{ marginTop: 20, textAlign: 'center' }}>
        Nova Chic! 🚀
        </Label>
      </View>
      
      <Button onPress={() => navigation.navigate('Onboarding')}>Get started</Button>
    </Page>
  );
}
