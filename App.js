import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Main} from './src/Main'
export default function App() {
  return (
      <Main/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
