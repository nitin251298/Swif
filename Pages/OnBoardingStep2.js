import React,{useState, useEffect} from "react";
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, SafeAreaView, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { usernames, Data } from '../src/ReduxFloder/action'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Icons from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const OnboardingStep2 = ({ navigation, route }) => {

    const [nea, setnea] = useState([])

    useEffect(() => {
        console.error(route.params.item)
        JSON.parse(route.params.item.certificationString).forEach(element => {
            console.log('====================================');
            console.log(element);
            console.log('====================================');
            setnea(element)
        });
    },[])

    const back = () => {
        navigation.navigate('OnboardingStep1')
    }
    const Comfirmed = () => {
        navigation.navigate('FirstPage',{id:route.params.item.id})
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginLeft: 20, marginRight: 20, marginTop: 30 }}>
                <View style={{ height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: '#8D28DD', alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => {back() }}
                        style={{ paddingTop: 7, paddingRight: 2 }}>
                        <Icons name="left" size={15} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={{ borderWidth: 0.5, borderRadius: 6, padding: 2, borderColor: '#636363' }}>
                    <Image
                        style={{ height: 20, width: 50, resizeMode: 'contain' }}
                        source={require('../src/assets/swifapp-logo.png')}
                    />
                </View>
            </View>
            <View style={{ backgroundColor: '#F0F0F0', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                <View style={{ backgroundColor: '#fff', alignSelf: 'center', margin: 20, padding: 35, borderRadius: 12 }}>
                    <Image
                        style={{ height: 100, width: 300, resizeMode: 'contain' }}
                        source={{uri:route.params.item.company_logo}}
                    />
                </View>
                <View>
                    <Text style={{ color: '#171C3A', fontSize: 22, fontFamily: 'Roboto', fontWeight: '700', paddingLeft: 20 }}>{route.params.item.name}</Text>
                    <Text style={{ color: '#4B4B4B', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', paddingLeft: 20, paddingTop: 10 }}>{route.params.item.ownerName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingTop: 10 }}>
                        <Entypo name="location-pin" size={15} color="#414754" />
                        <Text style={{ color: '#4B4B4B', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', paddingLeft: 5 }}>{route.params.item.address} {route.params.item.addressTwo} {route.params.item.city} {route.params.item.state} {route.params.item.country} {route.params.item.zip}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingTop: 10 }}>
                        <TouchableOpacity>
                            <View style={{ backgroundColor: '#8D28DD', alignItems: 'center', paddingBottom: 2, paddingTop: 2, paddingLeft: 15, paddingRight: 15, borderRadius: 5 }}>
                                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Roboto', fontWeight: '700', }}>Call</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={{ color: '#4B4B4B', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', paddingLeft: 5 }}>{route.params.item.contactNumber}</Text>
                    </View>
                    <View style={{ borderColor: '#636363', borderWidth: 0.9, marginTop: 15, marginLeft: 20, marginRight: 20 }}></View>
                </View>
            </View>
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: '#F0F0F0', }}>
                    <Text style={{ color: '#222D4A', fontSize: 22, fontFamily: 'Roboto', fontWeight: '700', paddingLeft: 20, paddingTop: 10 }}>Company Details</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', }}>Working Days</Text>
                        <View style={{flexDirection:'row'}}>
                        {route.params.item.workingDay.monday == 1 &&
                            <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', textAlign: 'right' }}>MON </Text>}
                        {route.params.item.workingDay.tuesday == 1 &&
                            <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', textAlign: 'right' }}>TUE </Text>}
                        {route.params.item.workingDay.wednesday == 1 &&
                            <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', textAlign: 'right' }}>WED </Text>}
                        {route.params.item.workingDay.thursday == 1 &&
                            <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', textAlign: 'right' }}>THR </Text>}
                        {route.params.item.workingDay.friday == 1 &&
                            <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', textAlign: 'right' }}>FRI </Text>}
                        {route.params.item.workingDay.saturday == 1 &&
                            <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', textAlign: 'right' }}>SAT </Text>}
                        {route.params.item.workingDay.sunday == 1 &&
                            <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '400', textAlign: 'right' }}>SUN </Text>}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', }}>Executive Name</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '600', textAlign: 'right' }}>{route.params.item.executiveName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', }}>Company Email</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>{route.params.item.email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', }}>{nea.name}</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>{nea.number}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', maxWidth: '50%' }}>Executive Contact
                            Number</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>{route.params.item.executiveContactNumber}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', maxWidth: '50%' }}>{route.params.item.taxName}</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>{route.params.item.tax}%</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', maxWidth: '50%' }}>Quotation`s Prefix</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>QT</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', maxWidth: '50%' }}>Contract`s Prefix</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>CT</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', maxWidth: '50%' }}>Work Order`s Prefix</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>WO</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', maxWidth: '50%' }}>Amount to collect Show</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>Yes</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', maxWidth: '50%' }}>Mobile App top Bar Week Show</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>Yes</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 15, paddingRight: 20, marginBottom: 10 }}>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', maxWidth: '50%' }}>Expected Time Required</Text>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '500', textAlign: 'right' }}>04:00:00 Hrs</Text>
                    </View>
                    <View style={{ marginLeft: 20, marginRight: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ backgroundColor: '#8D28DD', paddingBottom: 50, alignSelf: 'flex-start', paddingLeft: 5, }}></View>
                        <Text style={{ color: '#414754', fontSize: 14, fontFamily: 'Roboto', fontWeight: '600', maxWidth: '95%', paddingLeft: 10 }}>If you need a services before or after the time availabe please  contact us.</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={{ backgroundColor: '#F0F0F0', padding: 10 }}>
                <TouchableOpacity onPress={() => {Comfirmed()}}>
                    <View style={{ backgroundColor: '#8D28DD', paddingLeft: '30%', paddingRight: '30%', paddingBottom: 10, paddingTop: 10, alignSelf: 'center', borderRadius: 8, }}>
                        <Text style={{ fontSize: 24, color: '#fff', fontWeight: '700' }}>Confirmed</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default OnboardingStep2