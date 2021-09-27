import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, BackHandler, Keyboard } from 'react-native';
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

import EmojiContext from "./context";
import emojisData from "./data/emojis.json";
import EmojisTab from "./components/EmojisTab";

export default function App() {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      if(showEmojis) {
        setShowEmojis(false);
      }
    });

    Keyboard.addListener("keyboardWillShow", () => {
      if(showEmojis) {
        setShowEmojis(false);
      }
    })

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => {});
      Keyboard.removeListener("keyboardWillShow", () => {});
    }
  }, [])

  return (
    <EmojiContext.Provider value={{ emoji, setEmoji }}>
      <View style={styles.container}>
        <Text style={styles.message}>{message}{emoji}</Text>
        {showEmojis && <View style={styles.emojis}>
          <NavigationContainer>
          <Tab.Navigator>
            {
              Object.keys(emojisData).map(key => <Tab.Screen key={key} name={emojisData[key][0].char}>
                {() => <EmojisTab emojis={emojisData[key]} />}
              </Tab.Screen>)
            }
          </Tab.Navigator>
        </NavigationContainer>
        </View>
      }
        <View style={styles.inputToolbar}>
          <TextInput style={styles.input} onChangeText={text => setMessage(text)} placeholder="Message" />
          <TouchableOpacity onPress={() => setShowEmojis(current => !current)} style={styles.emoji}>
            <Icon name="emoticon" size={30} color={"orange"} />
          </TouchableOpacity>
        </View>
      </View>
    </EmojiContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  emojis: {
    position: 'absolute',
    height: 300,
    width: "100%",
    bottom: 60,
  },
  input: {
    flex: 0.96,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  inputToolbar: {
    position: 'absolute',
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    bottom: 10
  },
  message: {

  }
});
