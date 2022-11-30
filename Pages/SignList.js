import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, TextInput } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import Signature from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Fontisto } from '@expo/vector-icons';
import Moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite'
import NetInfo from "@react-native-community/netinfo";
import Loading from './Loading';
import * as MediaLibrary from 'expo-media-library'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const db = SQLite.openDatabase('SwifDb');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};


const SignList = ({ navigation }) => {

    const dispatch = useDispatch();
    const [list, setlist] = useState([])
    const [logindata, setLoginData] = useState([]);
    const Id = useSelector(state => state.Id)
    const [checkboxState, setCheckboxState] = React.useState(false);
    const [value, setValue] = useState(null);
    const [shouldShow, setShouldShow] = useState(false);
    const [activeIndex, setactiveIndex] = useState(0)
    const [loading, setloading] = useState(false)
    const [ad, setad] = useState([])
    const [isVisible, visible] = useState(false)
    const [boo, setboo] = useState(false)
    const [can, setcan] = useState(false)
    const [modal, setmodal] = useState(false)
    const [adcom, setadcom] = useState(false)
    const [adtask, setadtask] = useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [getid, setid] = useState([])
    const [catid, setcatid] = useState([])
    const [Comment, setcomment] = useState([])
    const [selectedValue, setSelectedValue] = useState("");
    const [pickedImagePath, setPickedImagePath] = useState("");
    const [expectedTime, setexpectedTime] = useState('');
    const [msg, setmsg] = useState('')
    const details = useSelector(state => state.details)
    const [days, setday] = useState("")
    const [gallery, setgallary] = useState([])

    const [re, setre] = useState("")

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const Re = useSelector(state => state.Re)
    // console.error(Re);

    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [tim, settim] = useState('')
    const [fin, setfin] = useState('')
    const [reid, setreid] = useState('')
    const [selectSport, setselectSport] = useState("1")
    const [total, setTotal] = useState(0);

    const [date] = useState(new Date().getTime())
    const hours = new Date().getHours(); //To get the Current Hours
    const min = new Date().getMinutes(); //To get the Current Minutes
    const sec = new Date().getSeconds()
    const hour = new Date().getHours()
    const mint = new Date().getMinutes()
    const secs = new Date().getSeconds()
    const [image, setimage] = useState([]);
    const [filePath, setFilePath] = useState([]);
    const [subData, setSubData] = useState([]);
    const [resion, setresion] = useState("")
    const [cnlresion, setcnlresion] = useState("")
    const [actualtime, setactualtime] = useState('')
    const [startTime, setStartTime] = useState('');
    const [starttime, setstartTime] = useState('');
    const [task, settask] = useState([])
    const [aditem, setitem] = useState([])
    const [play, setplay] = useState(false)
    const [cmtmsg, setcmtcmg] = useState('')
    const [imagecount, setimagecount] = useState(0)
    const [totaltask, setTotalTask] = useState(1)
    const [fixtime, setfixtime] = useState('')
    const [ground, setground] = useState('')
    const [it, setitems] = useState([])
    const [cl, setcancel] = useState([])
    const [local, setlocal] = useState([])
    const [adhocs, setadhocs] = useState([])
    const [tasklist, settasklist] = useState([])
    const [adhoc, setadhoc] = useState([])
    const [adHocT, sethocT] = useState(0)
    const [taskT, settaskT] = useState(0)
    const [today] = useState(Moment().format('YYYY-MM-DD'));
    const [IntStatus, setintStatus] = useState(false);
    const [request1, setrequest1] = useState([]);
    const [hasCameraPermission, setHasCameraPermission] = useState('')
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState('')
    const [imagefile, setImageFiles] = useState([])
    const [option, setoption] = useState('')
    const [hoc, sethoc] = useState('')
    const [amount, setamount] = useState('')

    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM details WHERE id=' + Id,
                [],
                (tx, result) => {
                    console.error("details", result);
                    setting2(result.rows._array[0])
                    var extime = Moment(result.rows._array[0].expected_end_time, 'hh').format('hh')
                    var extimes = Moment(result.rows._array[0].expected_end_time, 'hh mm').format('mm')
                    var ground = Moment(result.rows._array[0].actual_end_time, 'hh mm a').format('hh:mm a')
                    var fixtime = Moment(result.rows._array[0].expected_start_time, 'hh mm a').add(extime, 'hours').add(extimes, 'minutes').format('hh:mm a')
                    setfixtime(fixtime)
                    setground(ground)
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
                [],
                (tx, results) => {
                    console.log(results);
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT option_name,option_price FROM hell WHERE hellid=' + Id,
                [],
                (tx, result) => {
                    console.warn("hell:" + JSON.stringify(result.rows._array[0]));
                    setoption(result.rows._array[0])
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id,
                [],
                (tx, result) => {
                    console.warn("hell:" + JSON.stringify(result.rows._array));
                    sethoc(result.rows._array)
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM task WHERE workorderid=" + Id,
                [],
                (tx, result) => {
                    console.warn("task", JSON.stringify(result.rows._array));
                    settask(result.rows._array)
                }
            );
        });

        cal()

        const unsubscribe = navigation.addListener('focus', () => {
            // onRefresh();
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM details WHERE id=' + Id,
                    [],
                    (tx, result) => {
                        console.error("details", result);
                        setting2(result.rows._array[0])
                        var extime = Moment(result.rows._array[0].expected_end_time, 'hh').format('hh')
                        var extimes = Moment(result.rows._array[0].expected_end_time, 'hh mm').format('mm')
                        var ground = Moment(result.rows._array[0].actual_end_time, 'hh mm a').format('hh:mm a')
                        var fixtime = Moment(result.rows._array[0].expected_start_time, 'hh mm a').add(extime, 'hours').add(extimes, 'minutes').format('hh:mm a')
                        setfixtime(fixtime)
                        setground(ground)
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
                    [],
                    (tx, results) => {
                        console.log(results);
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT option_name,option_price FROM hell WHERE hellid=' + Id,
                    [],
                    (tx, result) => {
                        console.warn("hell:" + JSON.stringify(result.rows._array[0]));
                        setoption(result.rows._array[0])
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id,
                    [],
                    (tx, result) => {
                        console.warn("hell:" + JSON.stringify(result.rows._array));
                        sethoc(result.rows._array)
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM task WHERE workorderid=" + Id,
                    [],
                    (tx, result) => {
                        console.warn("task", JSON.stringify(result.rows._array));
                        settask(result.rows._array)
                    }
                );
            });

            cal()

        });
        return unsubscribe;

    }, [])

    const setting2 = (value) => {
        console.log(value);
        setlocal(value)
        console.log("kasdjgfuerhfgoih", local);
    }

    const back = () => {
        navigation.navigate('Orderlist')
    }

    const Next = () => {
        navigation.navigate('FinalSing', { amount })
    }

    const cal = () => {
        10000
        var temp = [];
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM details WHERE id=' + Id,
                [],
                (tx, result1) => {
                    // console.warn("details:", JSON.stringify(result1));
                    if (result1.rows.length > 0) {
                        var option_price = result1.rows._array[0].option_price;
                        setTotal(option_price)
                        var companytax = result1.rows._array[0].companytax;

                        const task = getPrice('task')
                        var addHocPrice = getPrice('adhocitems')

                        setTimeout(() => {
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'SELECT (taskPrice + addhocPrice) as SubitemPrice FROM cal WHERE workorderid=' + Id,
                                    [],
                                    (tx, result) => {
                                        if (result.rows._array.length) {
                                            if (result.rows._array[0].SubitemPrice) {
                                                db.transaction((tx) => {
                                                    tx.executeSql(
                                                        'SELECT * FROM task WHERE checked="1" AND workorderid=' + Id,
                                                        [],
                                                        (tx, result0) => {
                                                            var SubitemPrice = result.rows._array[0].SubitemPrice;
                                                            var price = option_price + SubitemPrice;
                                                            setTotal(price)
                                                            db.transaction((tx) => {
                                                                tx.executeSql(
                                                                    'SELECT * FROM adhocitems WHERE checked="1" AND workorderid=' + Id,
                                                                    [],
                                                                    (tx, result9) => {
                                                                        123
                                                                        var task = result0.rows.length + result9.rows.length
                                                                        setTotalTask(1 + task);
                                                                        // alert(JSON.stringify(result.rows._array[0].SubitemPrice))
                                                                        var SubitemPrice = result.rows._array[0].SubitemPrice;
                                                                        // console.warn("cal1", result);
                                                                        var price = option_price + SubitemPrice;
                                                                        // alert(price)
                                                                        setTotal(price)
                                                                    }
                                                                );
                                                            });
                                                        }
                                                    );
                                                });
                                            } else {
                                                setTotal(option_price)
                                            }
                                        }
                                    }
                                );
                            });
                        }, 3000)

                        console.log('====================================');
                        console.log(total);
                        console.log('====================================');

                    } else {
                        alert("Something went wrong")
                        navigation.navigate('Dashboard');
                    }
                }
            );
        });

    }

    const getPrice = async (table) => {
        var query = "SELECT sum(amount) as total FROM " + table + " WHERE checked='1' AND workorderid=" + Id

        db.transaction((tx) => {
            tx.executeSql(
                query,
                [],
                (tx, result2) => {
                    if (result2.rows.length == 1) {
                        if (result2.rows._array[0].total) {
                            var hocPrice = result2.rows._array[0].total;
                            // alert(hocPrice)
                            if (table == 'adhocitems') {
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        'SELECT id FROM cal WHERE workorderid=' + Id,
                                        [],
                                        (tx, result) => {
                                            console.log("call:" + JSON.stringify(result));
                                            if (result.rows.length > 0) {
                                                var query = "UPDATE cal SET addhocPrice=" + hocPrice + " WHERE workorderid=" + Id
                                                var value = [];
                                            } else {
                                                var query = 'INSERT INTO cal (workorderid, addhocPrice, taskPrice) VALUES (?, ?, ?)'
                                                var value = [Id, hocPrice, 0];
                                            }
                                            db.transaction(function (tx) {
                                                tx.executeSql(
                                                    query, value
                                                    ,
                                                    (tx, results) => {
                                                        db.transaction((tx) => {
                                                            tx.executeSql(
                                                                'SELECT * FROM cal',
                                                                [],
                                                                (tx, result) => {
                                                                    console.warn("cal", result);
                                                                }
                                                            );
                                                        });
                                                    }
                                                );
                                            });
                                        }
                                    );
                                });

                            } else {
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        'SELECT id FROM cal WHERE workorderid=' + Id,
                                        [],
                                        (tx, result) => {
                                            console.log("call:" + JSON.stringify(result));
                                            if (result.rows.length > 0) {
                                                var query = "UPDATE cal SET taskPrice=" + hocPrice + " WHERE workorderid=" + Id
                                                var value = [];
                                            } else {
                                                var query = 'INSERT INTO cal (workorderid, addhocPrice, taskPrice) VALUES (?, ?, ?)'
                                                var value = [Id, 0, hocPrice];
                                            }
                                            db.transaction(function (tx) {
                                                tx.executeSql(
                                                    query, value
                                                    ,
                                                    (tx, results) => {
                                                        db.transaction((tx) => {
                                                            tx.executeSql(
                                                                'SELECT * FROM cal',
                                                                [],
                                                                (tx, result) => {
                                                                    console.warn("cal1", result);
                                                                }
                                                            );
                                                        });
                                                    }
                                                );
                                            });
                                        }
                                    );
                                });
                            }
                        } else {
                            var query = "UPDATE cal SET addhocPrice=0,taskPrice=0 WHERE workorderid=" + Id;
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    query, value
                                    ,
                                    (tx, results) => {
                                        db.transaction((tx) => {
                                            tx.executeSql(
                                                'SELECT * FROM cal',
                                                [],
                                                (tx, result) => {
                                                    console.warn("cal", result);
                                                    // alert("boo")
                                                }
                                            );
                                        });
                                    }
                                );
                            });
                        }
                    }

                }
            );
        });
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, margin: 10, marginTop: 30 }}>
                <View style={{ flex: 0.8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => back()} style={{}}>
                            <Icon name="arrow-back" size={30} color="#6F00C5" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ paddingLeft: 10, fontSize: 16, color: '#6F00C5', maxWidth:'80%' }}>Thank you <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#6F00C5' }}>{local.customer_name}. <Text style={{ fontSize: 16, color: '#6F00C5', fontWeight:'100' }}>Kindly sign off below  </Text></Text></Text>    
                        </View>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', margin: 5, }}>
                            <Text style={{ fontWeight: 'bold', width: '20%' }}>Address : </Text>
                            <Text style={{ textAlign: 'left', paddingLeft: 5, alignSelf: 'center', maxWidth: '80%', fontFamily: 'Roboto', lineHeight: 20 }}> {local.block} {local.street} {local.unit} {local.country} {local.zip}</Text>
                        </View>
                        <View style={{ margin: 5, flexDirection: 'row', }}>
                            <Text style={{ fontWeight: 'bold', }}>Team Detail :</Text>
                            {local.leader &&
                                <Text style={{ textAlign: 'left', paddingLeft: 10, fontFamily: 'Roboto', lineHeight: 15, fontSize: 12, fontWeight: 'bold',maxWidth:'80%' }}>{local.leader}(TL){local.team != "" &&
                                    <Text style={{ textAlign: 'left', fontFamily: 'Roboto', lineHeight: 15, fontSize: 12, fontWeight: '100' }}>,{local.team}</Text>}</Text>}
                            {local.team == "" &&
                                <Text style={{ textAlign: 'left', fontFamily: 'Roboto', lineHeight: 15, fontSize: 12, maxWidth: '50%' }}></Text>}

                        </View>
                    </View>
                    <View style={{ margin: 5, marginTop: 20 }}>
                        <ScrollView>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>JOB DETAIL</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 0.5, borderLeftWidth: 0.5, borderRightWidth: 0.5, padding: 5, width:'100%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', maxWidth:'45%' }}>{local.service_name} :</Text>
                                    <Text style={{ paddingLeft: 10, maxWidth:'45%' }}>{option.option_name} (x1 <Text style={{ fontSize: 10 }}>Main Package</Text>)</Text>
                                </View>
                                <Text style={{ fontWeight: 'bold',width:'10%' }}>{parseFloat(option.option_price).toFixed(2)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <FlatList
                                    data={hoc}
                                    keyExtractor={(item) => item.key}
                                    renderItem={({ item }) =>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderLeftWidth: 0.5, borderRightWidth: 0.5, padding: 5 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                                <View style={{ alignSelf: 'flex-start' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>Item :</Text>
                                                    <Text style={{ fontSize: 12 }}>(Checked)</Text>
                                                </View>
                                                <Text style={{ maxWidth: '70%', paddingLeft: 30 }}>{item.name} (x{item.quantity})</Text>
                                            </View>
                                            <Text style={{ fontWeight: 'bold' }}>{parseFloat(item.amount).toFixed(2)}</Text>
                                        </View>} />
                            </View>
                            <View style={{}}>
                                <FlatList
                                    data={task}
                                    keyExtractor={(item) => item.key}
                                    renderItem={({ item }) =>
                                        <View>
                                            {item.checked == 1 &&
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderLeftWidth: 0.5, borderRightWidth: 0.5, padding: 5 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                                        <View style={{ alignSelf: 'flex-start' }}>
                                                            <Text style={{ fontSize: 16, fontWeight: 'bold', }}>Item :</Text>
                                                            <Text style={{ fontSize: 12 }}>(Checked)</Text>
                                                        </View>
                                                        <Text style={{ maxWidth: '70%', paddingLeft: 30 }}>{item.name} (x{item.quantity})</Text>
                                                    </View>
                                                    <Text style={{ fontWeight: 'bold' }}>{parseFloat(item.amount).toFixed(2)}</Text>
                                                </View>}
                                        </View>}
                                />
                                <FlatList
                                    data={task}
                                    keyExtractor={(item) => item.key}
                                    renderItem={({ item }) =>
                                        <View>
                                            {item.checked == 0 &&
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderLeftWidth: 0.5, borderRightWidth: 0.5, borderBottomWidth: 1, padding: 5 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                                        <View style={{ alignSelf: 'flex-start' }}>
                                                            <Text style={{ fontSize: 16, fontWeight: 'bold', }}>Item :</Text>
                                                            <Text style={{ fontSize: 12 }}>(Unchecked)</Text>
                                                        </View>
                                                        <Text style={{ maxWidth: '60%', paddingLeft: 30,textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{item.name} (x{item.quantity})</Text>
                                                    </View>
                                                    <Text style={{ fontWeight: 'bold', textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{parseFloat(item.amount).toFixed(2)}</Text>
                                                </View>}
                                        </View>}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#CECECE', padding: 10 }}>
                                <Text></Text>
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 2 }}>
                                        <Text style={{ color: '#4B4B4B' }}>Sub-Total: </Text>
                                        {local.adjustment_type == null &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${parseFloat(total) + parseFloat(local.adjustment_value || 0)}</Text>}

                                        {local.adjustment_type == "" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${parseFloat(total) + parseFloat(local.adjustment_value || 0)}</Text>}

                                        {local.adjustment_type == "addition" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${parseFloat(total) + parseFloat(local.adjustment_value || 0)}</Text>}

                                        {local.adjustment_type == "substraction" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${parseFloat(total) - parseFloat(local.adjustment_value || 0)}</Text>}
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 2 }}>
                                        <Text style={{ color: '#4B4B4B' }}>TAX@ {local.companytax}%: </Text>
                                        {local.adjustment_type == null &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)).toFixed(1) * parseFloat(local.companytax)) / 100).toFixed(2))}</Text>}

                                        {local.adjustment_type == "" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)).toFixed(1) * parseFloat(local.companytax)) / 100).toFixed(2))}</Text>}

                                        {local.adjustment_type == "addition" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)).toFixed(1) * parseFloat(local.companytax)) / 100).toFixed(2))}</Text>}

                                        {local.adjustment_type == "substraction" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) - parseFloat(local.adjustment_value || 0) - (((parseFloat(total) - parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)).toFixed(1) * parseFloat(local.companytax)) / 100).toFixed(2))}</Text>}
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 2 }}>
                                        <Text style={{ color: '#4B4B4B' }}>Discount: </Text>
                                        {local.adjustment_type == null &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100).toFixed(2))}</Text>}

                                        {local.adjustment_type == "" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100).toFixed(2))}</Text>}

                                        {local.adjustment_type == "addition" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100).toFixed(2))}</Text>}

                                        {local.adjustment_type == "substraction" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) - parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100).toFixed(2))}</Text>}
                                    </View>
                                    {local.priceViewPermission == '1' &&
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 2 }}>
                                            <Text style={{ color: '#4B4B4B' }}>Amount to Collect: </Text>
                                            {local.adjustment_type == null &&
                                                <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${(((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) + (((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) * parseFloat(local.companytax)) / 100)).toFixed(2))}</Text>}

                                            {local.adjustment_type == "" &&
                                                <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${(((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) + (((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) * parseFloat(local.companytax)) / 100)).toFixed(2))}</Text>}

                                            {local.adjustment_type == "addition" &&
                                                <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${(((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) + (((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) * parseFloat(local.companytax)) / 100)).toFixed(2))}</Text>}

                                            {local.adjustment_type == "substraction" &&
                                                <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${(((parseFloat(total) - parseFloat(local.adjustment_value || 0) - (((parseFloat(total) - parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) + (((parseFloat(total) - parseFloat(local.adjustment_value || 0) - (((parseFloat(local.option_price) - parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) * parseFloat(local.companytax)) / 100)).toFixed(2))}</Text>}
                                        </View>}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
            <View style={{ width: windowWidth / 1, backgroundColor: '#fff', paddingTop: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', }}>
                    <TextInput placeholder='Enter Collected amount If COD ? '
                        style={{ width: windowWidth / 1.2, backgroundColor: '#F0F0F0', borderRadius: 30, height: 40, alignSelf: 'center', paddingLeft: 25 }}
                        placeholderTextColor={'#000'}
                        onChangeText={amount => setamount(amount)}
                        value={amount}
                        keyboardType='number-pad'
                        // value={Password}
                        autoCapitalize='none' />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 10 }}>
                    <TouchableOpacity onPress={() => { Next() }}
                        style={{ borderWidth: .5, borderColor: '#343a40', margin: 5, backgroundColor: '#7700D4', borderRadius: 50, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                        <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => back()}
                        style={{ borderWidth: .5, borderColor: '#343a40', margin: 5, backgroundColor: '#7700D4', borderRadius: 50, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                        <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignList