import React,{useEffect} from 'react';
import {View, Text, ActivityIndicator, Image} from 'react-native';

const Loader = ({navigation}) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Loading')
        },3000)
    },[])

    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center', position: 'absolute', height: '100%', width: '100%', backgroundColor: '#FFFFFFa1', zIndex: 1111 }}>
            <View style={{ justifyContent: 'center', alignSelf: 'center', zIndex: 1111 }}>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={require('../assets/SWIFAPPX_LOGO-Home.png')} />
            </View>
        </View>
    )
}

export default Loader