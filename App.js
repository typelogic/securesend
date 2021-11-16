import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import QRCode from 'react-native-qrcode-svg';
import {MD5,getRandomString} from './Helper';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

class App extends React.Component {

  constructor(props) {
    super(props)
    this.GetConnectionParameters = this.GetConnectionParameters.bind(this)
    
    var params = {
      cid: getRandomString(5),
      pk: getRandomString(32)
    }
    this.state = {
      params: {
        cid: params.cid,
        pk: params.pk
      }
    }
  } 

  GetConnectionParameters() {
    var params = {
      cid: getRandomString(5),
      pk: getRandomString(32)
    }
    this.setState({
      params: {
        cid: params.cid,
        pk: params.pk
      }
    })
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            <Section title="securesend 0.0.1">
            <Button title="QR" onPress={this.GetConnectionParameters} />
            <View style={styles.space} />
            <Button title="Scan" />
            <View style={styles.space} />
            <Button title="Discon" />
            <View style={styles.space} />
            <Button title="Send" />
            </Section>
            <Section title="connection code">
            <QRCode value={JSON.stringify(this.state.params)} />
            </Section>
            <Section title="checksum">
            </Section>
            <Section title="message">
            </Section>
            <Section title="log">
            </Section>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  space: {
    width: 20,
    height: 20
  },
  centerplace: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#FFFFFF'
  }
});

export default App;
