import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image, PermissionsAndroid, CameraRoll } from 'react-native';
import {Camera} from 'expo-camera';
import {FontAwesome} from '@expo/vector-icons';

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const camRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

async function takePicture(){
  if(camRef){
    const data = await camRef.current.takePictureAsync();
    setCapturedPhoto(data.uri);
    setOpen(true);  
  }
}

/*submitPicture = async () => {
  try {
    const granted = await PermissionRequest.request(
      PermissionRequest.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        "title": "Access Storage",
        "message": "Access Storage for the pictures"
      }
    )
    if (granted === Permissions.RESULTS.GRANTED) {
      await CameraRoll.saveToCameraRoll(capturedPhoto);
    } else {
      console.log("Permissão Negada!");
    }
  } catch (error) {
    console.warn(error)
  }
  setCapturedPhoto(null);
}*/



  return (
      <Camera style={{flex: 1}} type={type} ref={camRef}>
        <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
          <TouchableOpacity style={{position: "absolute", bottom: 20, left: 20}} onPress={()=>{
            setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
          }}>
            <FontAwesome name="backward" color="blue" size={25}></FontAwesome>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <FontAwesome name="camera" size={40} color="white"></FontAwesome>
        </TouchableOpacity>      
        {capturedPhoto && 
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center", margin: 20}}>
            <Image style={{width: '100%', height: 300, borderRadius: 20}} source={{uri: capturedPhoto}}></Image>
            <TouchableOpacity style={{margin: 10, position: "absolute", left: 40, top: 510}} onPress={()=> setOpen(false)}>
              <FontAwesome name="check" size={50} color="green"></FontAwesome>
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 10, position: "absolute", left: 220, top: 510}} onPress={()=> setOpen(false)}>
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
  },

});
