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
import {MD5,getRandomString,isQRValid} from './Helper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import BluetoothApi from "react-native-bluetooth-secure";

const Section = ({children, title}): Node => {
  const isDarkMode = false;
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
    this.SetConnectionParameters = this.SetConnectionParameters.bind(this)
    this.Disconnect = this.Disconnect.bind(this)
    this.onScan = this.onScan.bind(this)
    
    var params = {
      cid: getRandomString(5),
      pk: getRandomString(32)
    }

    this.state = {
      page: 0,
      params: "hello"
    }
  } 

  GetConnectionParameters() {
    var params = JSON.parse(BluetoothApi.getConnectionParameters())
    this.setState({
      params: {
        cid: params.cid,
        pk: params.pk
      }
    })

    BluetoothApi.createConnection("dual", () => {
      console.log("-- connected ---")
      this.setState({
        page: 0
      })
    })
  }

  SetConnectionParameters() {
    this.setState({
      page: 1
    })
  }

  onScan(qr) {
    if (!isQRValid(qr)) {
      console.log("QR code is invalid");
      return
    } 

    BluetoothApi.setConnectionParameters(qr.data)
    BluetoothApi.createConnection("dual", () => {
      console.log("-- connected ---")
    })

    this.setState({
      page: 0
    })
  }

  Disconnect() {
    console.log("*** Disconnect ***");
    BluetoothApi.destroyConnection()
  }

  render() {
    switch (this.state.page) {
      case 0:
      return (
        <SafeAreaView style={{backgroundColor: Colors.white}} >
          <ScrollView>
            <View>
              <Section title="securesend 0.0.1">
              <Button title="QR" onPress={this.GetConnectionParameters} />
              <View style={styles.space} />
              <Button title="Scan" onPress={this.SetConnectionParameters} />
              <View style={styles.space} />
              <Button title="Discon"  onPress={this.Disconnect} />
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
      break;

      case 1:
      return(
      <QRCodeScanner
        onRead={this.onScan}
        bottomContent={
          <Text style={{fontWeight: "bold"}}>Scan the receiver QR code</Text>
        }
      />
      );
      break;

    } // switch
  } // render
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
  whitebg: {
    backgroundColor: '#FFFFFF'
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
