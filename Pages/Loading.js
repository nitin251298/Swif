import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, ImageBackground } from 'react-native';

const Loading = ({ navigation }) => {

    // useEffect(() => {

    // },[])


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center', position: 'absolute', height: '100%', width: '100%', backgroundColor: '#FFFFFFa1', zIndex: 1111 }}>
            <View style={{ justifyContent: 'center', alignSelf: 'center', zIndex: 1111 }}>
                <ImageBackground source={require('../assets/830-unscreen.gif')} style={{ width: 140, height:140, justifyContent:'center',zIndex:9999 }}>
                <Image
                    style={{ width: 80, height: 80, alignSelf:'center', marginTop:10 }}
                    source={require('../assets/Swiff-bird-unscreen.gif')} />
                </ImageBackground>
            </View>
        </View>
    )
}

export default Loading