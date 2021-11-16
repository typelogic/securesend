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
import {MD5,getRandomString,isQRValid,getRandomSentence} from './Helper';
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
    this.Send = this.Send.bind(this)
    
    this.state = {
      page: 0,
      msg: "",
      checksum: "",
      params: "hello",
      color: 'gray',
      logmsg: "",
      qrButtonDisabled: false,
      scanButtonDisabled: false,
      disconButtonDisabled: true,
      sendButtonDisabled: true
    }

  } 

  componentDidMount() {
    this.nearbyEvents = BluetoothApi.handleNearbyEvents((event) => {
        console.log(event.type)
        switch (event.type) {
        case "msg":
        this.setState({
          msg: event.data,
          checksum: MD5(event.data)
        });
        break;

        case "onDisconnected":
        console.log("onDisconnected:" + event.data)
        this.setState({
          checksum: "",
          msg: "",
          params: "hello",
          qrButtonDisabled: false,
          scanButtonDisabled: false,
          disconButtonDisabled: true,
          sendButtonDisabled: true
        });
        break;

        case "transferupdate":
        console.log("transferupdate:" + event.data)
        break;

        default:
        break;
      }

    })
    
    this.LogEvents = BluetoothApi.handleLogEvents((event) => {
      var logmsg = (this.state.logmsg ? this.state.logmsg : "") + "\n" + event.log
      this.setState({
        logmsg: logmsg
      })
    })
  }

  componentWillUnmount() {
    if (this.NearbyEvents) {
      this.nearbyEvents.remove();
    }

    if (this.LogEvents) {
      this.LogEvents.remove();
    }
  }

  GetConnectionParameters() {
    var params = JSON.parse(BluetoothApi.getConnectionParameters())
    this.setState({
      qrButtonDisabled: true,
      scanButtonDisabled: true,
      color: 'black',
      params: {
        cid: params.cid,
        pk: params.pk
      }
    })

    BluetoothApi.createConnection("dual", () => {
      console.log("-- connected ---")
      this.setState({
        page: 0,
        params: "hello",
        color: 'gray',
        disconButtonDisabled: false,
        sendButtonDisabled: false
      })
    })
  }

  SetConnectionParameters() {
    this.setState({
      page: 1,
      qrButtonDisabled: true,
      scanButtonDisabled: true
    })
  }

  onScan(qr) {
    if (!isQRValid(qr)) {
      console.log("QR code is invalid");
      this.setState({
        page: 0,
        msg: "INVALID QR CODE",
        qrButtonDisabled: false,
        scanButtonDisabled: false
      })
      return
    } 

    BluetoothApi.setConnectionParameters(qr.data)
    BluetoothApi.createConnection("dual", () => {
      console.log("-- connected ---")
      this.setState({
        page: 0,
        params: "hello",
        color: 'gray',
        disconButtonDisabled: false,
        sendButtonDisabled: false
      })
    })

    this.setState({
      page: 0
    })
  }

  Disconnect() {
    console.log("*** Disconnect ***");
    BluetoothApi.destroyConnection()

    this.setState({
      qrButtonDisabled: false,
      scanButtonDisabled: false,
      disconButtonDisabled: true,
      sendButtonDisabled: true
    })
  }

  Send() {
    let msg = getRandomSentence(42);

    this.setState({
      msg: "",
      checksum: ""
    });

    BluetoothApi.send(msg, () => {
      console.log("*** sent ***")
      this.setState({
        checksum: MD5(msg),
        msg: msg
      })
    })
  }

  render() {
    switch (this.state.page) {
      case 0:
      return (
        <SafeAreaView style={{backgroundColor: Colors.white}} >
          <ScrollView>
            <View>
              <Section title="securesend 0.0.1">
              <Button title="QR" disabled={this.state.qrButtonDisabled} onPress={this.GetConnectionParameters} />
              <View style={styles.space} />
              <Button title="Scan" disabled={this.state.scanButtonDisabled} onPress={this.SetConnectionParameters} />
              <View style={styles.space} />
              <Button title="Discon" disabled={this.state.disconButtonDisabled} onPress={this.Disconnect} />
              <View style={styles.space} />
              <Button title="Send" disabled={this.state.sendButtonDisabled} onPress={this.Send} />
              </Section>
              <Section title="connection code">
              <QRCode size={200} color={this.state.color} value={JSON.stringify(this.state.params)} />
              </Section>
              <Section title="checksum">
                <Text>{this.state.checksum}</Text>
              </Section>
              <Section title="message">
                <Text>{this.state.msg}</Text>
              </Section>
              <Section title="log">
                <Text>{this.state.logmsg}</Text>
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
