import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { FontAwesome, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const camRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashOn, setFlashOn] = useState(Camera.Constants.FlashMode.off);
  const [isPreview, setIsPreview] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [videoSource, setVideoSource] = useState(null);
  const [isVideoRecording, setIsVideoRecording] = useState(null);
  const [haspermission, setHaspermission] = useState(null);

  const toogleFlash = () => {
    setFlashOn(flashOn === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
  };

  const toogleChangeCamera = () => {
    setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
  };

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

  async function recordVideo() {
    if (camRef.current) {
      try {
        const videoRecordPromisse = camRef.current.recordAsync();

        if (videoRecordPromisse) {
          setIsVideoRecording(true);
          const data = await videoRecordPromisse;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  async function stopRecording() {
    if (camRef.current) {
      setIsPreview(false);
      setIsVideoRecording(false);
      camRef.current.stopRecording();
      setOpen(true);
    }
  };

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

  async function saveVideo() {
    const asset = await MediaLibrary.createAssetAsync(videoSource)
      .then(() => {
        setTimeout(() => {
          alert('Video Salvado na Galeria!');
        }, 1000);
        setOpen(false);
      }).catch(error => {
        console.log('err: ', error);
      });
  }

  function deleteImage() {
    setCapturedPhoto(null);
    setOpen(false);  
  }

  function deleteVideo() {
    setVideoSource(null);
    setOpen(false);
  }


  return (
    <>
      <Camera style={{ flex: 1 }} type={type} ref={camRef} >
        <Text style={{ marginTop: 70, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#fff' }}>App de Fotos</Text>
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <TouchableOpacity style={{ position: "absolute", bottom: 20, left: 20 }} onPress={() => toogleChangeCamera()}>
            <MaterialCommunityIcons name="camera-switch" color="#fff" size={35} />
          </TouchableOpacity>
          <TouchableOpacity style={{ position: "absolute", bottom: 100, left: 20 }}  onPress={() => toogleFlash()}>
            <Entypo name="flash" color="#fff" size={35} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPressOut={stopRecording} onLongPress={recordVideo} onPress={takePicture}>
          <FontAwesome name="camera" size={40} color="white"></FontAwesome>
        </TouchableOpacity>
        {capturedPhoto &&
          <Modal animationType="slide" transparent={false} visible={open}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Image style={{ width: '100%', height: '100%', borderRadius: 20 }} source={{ uri: capturedPhoto }}></Image>
              <TouchableOpacity style={{ position: 'absolute', left: 70, top: 750 }} onPress={savePicture}>
                <FontAwesome name="check" size={50} color="green"></FontAwesome>
              </TouchableOpacity>
              <TouchableOpacity style={{ position: 'absolute', left: 300, top: 750 }} onPress={() => deleteImage()}>
                <FontAwesome name="close" size={50} color="red"></FontAwesome>
              </TouchableOpacity>
            </View>
          </Modal>
        }
      </Camera>
      <>
        {videoSource &&
          <Modal animationType="slide" transparent={false} visible={open}>
            <Video shouldPlay={true} style={{ width: 500, height: 900, borderRadius: 20 }} source={{ uri: videoSource }}>
              <TouchableOpacity style={{ position: 'absolute', left: 70, top: 750, zIndex: 1 }} onPress={saveVideo}>
                <FontAwesome name="check" size={50} color="green"></FontAwesome>
              </TouchableOpacity>
              <TouchableOpacity style={{ position: 'absolute', left: 300, top: 750, zIndex: 1 }} onPress={() => deleteVideo()}>
                <FontAwesome name="close" size={50} color="red"></FontAwesome>
              </TouchableOpacity>
            </Video>
          </Modal>
        }
      </>
    </>
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
