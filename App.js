import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const camRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [haspermission, setHaspermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHaspermission(status === 'granted');
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHaspermission(status === 'granted');
    })();
  }, []);

  if (haspermission === null) {
    return <View />
  }

  if (haspermission === false) {
    return <Text>Acesso Negado!</Text>
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        setTimeout(() => {
          alert('Foto Salvada na Galeria!');
        }, 1000);
        setOpen(false);
      }).catch(error => {
        console.log('err: ', error);
      });
  }



  return (
    <Camera style={{ flex: 1 }} type={type} ref={camRef}>
      <Text style={{ marginTop: 70, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#fff' }}>App de Fotos</Text>
      <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
        <TouchableOpacity style={{ position: "absolute", bottom: 20, left: 20 }} onPress={() => {
          setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
        }}>
          <MaterialCommunityIcons name="camera-switch" color="#fff" size={35} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={40} color="white"></FontAwesome>
      </TouchableOpacity>
      {capturedPhoto &&
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image style={{ width: '100%', height: '100%', borderRadius: 20 }} source={{ uri: capturedPhoto }}></Image>
            <TouchableOpacity style={{ position: 'absolute', left: 70, top: 750 }} onPress={savePicture}>
              <FontAwesome name="check" size={50} color="green"></FontAwesome>
            </TouchableOpacity>
            <TouchableOpacity style={{ position: 'absolute', left: 300, top: 750 }} onPress={() => setOpen(false)}>
              <FontAwesome name="close" size={50} color="red"></FontAwesome>
            </TouchableOpacity>
          </View>
        </Modal>
      }
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .9)',
    justifyContent: 'center',
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
});
