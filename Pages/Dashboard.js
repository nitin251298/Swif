import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert, ScrollView, Modal, TextInput, SafeAreaView, BackHandler, RefreshControl, DevSettings, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Id } from '../src/ReduxFloder/action';
import Icon from 'react-native-vector-icons/Ionicons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import Loading from './Loading';
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Loader from './Loader';

const db = SQLite.openDatabase('SwifDb');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

let bottomtab = [
    {
        key: 1,
        iconName: 'home-outline'
    },
    {
        key: 2,
        iconName: 'ios-refresh-outline'
    },
    // {
    //     key: 3,
    //     iconName: 'notifications-outline'
    // },
    {
        key: 4,
        iconName: 'person-outline'
    }
]

const Dashboard = ({ navigation }) => {
    const dispatch = useDispatch();

    const [workdata, setWorkdata] = useState([])
    const [logindata, setLoginData] = useState([]);
    const list = useSelector(state => state.list)
    const [PendingCount, setPendingCount] = useState(0)
    const [CancelCount, setCancelCount] = useState(0)
    const [CompleteCount, setCompleteCount] = useState(0)
    const [TotalCount, setTotalCount] = useState(0)
    const [status, setStatus] = useState([1, 2]);
    const [loading, setloading] = useState(false)
    const [Sloading, setSloading] = useState(false)
    const [isVisible, visible] = useState(false)
    const [cnl, setcnl] = useState(false)
    const [newdate] = useState(new Date().getDate())
    const [month] = useState(new Date().getMonth() + 1)
    const [year] = useState(new Date().getFullYear())
    const [date, setdate] = useState('')
    const [oder, setoder] = useState([])
    const [nextevent, setnextevent] = useState(false)
    const [re, setre] = useState("")
    const [days, setday] = useState("")
    const [reid, setreid] = useState('')
    const [tim, settim] = useState('')
    const hours = new Date().getHours(); //To get the Current Hours
    const min = new Date().getMinutes(); //To get the Current Minutes
    const sec = new Date().getSeconds()
    const [resion, setresion] = useState("")
    const [interVal, setinterVal] = useState(null);
    const sink = useRef(0);
    const [cnlresion, setcnlresion] = useState("")
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [stopwatchdate] = useState(new Date().getTime())
    const [countup, setcountup] = useState('')
    const [color, setcolor] = useState(true)
    const [color1, setcolor1] = useState(false)
    const [color2, setcolor2] = useState(false)
    const [color3, setcolor3] = useState(false)
    const [activeIndex, setactiveIndex] = useState(0)
    const [it, setitem] = useState([])
    const [cl, setcancel] = useState([])
    const [local, setlocal] = useState([])
    const [log, setlog] = useState([])
    const [res, setres] = useState([])
    const [can, setcan] = useState([])
    const [IntStatus, setintStatus] = useState(false);
    const Db = useSelector(state => state.Db)
    const [selectDates, setselectDate] = useState([])
    const [mnth, setmnth] = useState([])
    const [fulldate, setfulldate] = useState([])
    const newmnth = new Date().getMonth() + 1
    const newyear = new Date().getFullYear()
    const [selectedDate, setSelect] = useState(Moment().format('DD'));



    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
                    [],
                    (tx, results) => {
                        console.error(results);
                    }
                );
            });


            NetInfo.addEventListener(networkState => {
                console.log("Connection type - ", networkState.type);
                console.log("Is connected? - ", networkState.isConnected);
                setintStatus(networkState.isConnected);
            });

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM reschedule',
                    [],
                    (tx, results) => {
                        console.log("res:" + JSON.stringify(results));
                        RES(results.rows._array)
                    }
                );
            });

            var date = Moment().format('YYYY-MM-DD')
            var query = "SELECT * FROM hell WHERE expected_start_date='" + date + "'"
            console.log(date, query);

            db.transaction((tx) => {
                tx.executeSql(
                    query,
                    [],
                    (tx, result) => {
                        console.log("hell:" + JSON.stringify(result));
                        setting(result.rows._array)
                        var Pendingcount = 0;
                        var Cancelcount = 0;
                        var Completecount = 0;
                        for (let i = 0; i < result.rows._array.length; i++) {

                            let workstatus = result.rows._array[i].workstatus;
                            if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {

                                Pendingcount += 1;
                                console.log(Pendingcount);

                            }
                            if (workstatus == 5) {

                                Cancelcount += 1;
                                console.log(Cancelcount);

                            }
                            if (workstatus == 3) {

                                Completecount += 1;
                                console.log(Completecount);

                            }
                        }
                        if (nextevent == false) {
                            setPendingCount(Pendingcount);
                            setCancelCount(Cancelcount);
                            setCompleteCount(Completecount);
                            setTotalCount(result.rows._array.length)
                        }

                    }
                );
            });


            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                    [],
                    (tx, results) => {
                        console.log("USER:", JSON.stringify(results));
                        setting1(results)
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM cancel',
                    [],
                    (tx, results) => {
                        console.error("canel" + JSON.stringify(results));
                        CANCEL(results.rows._array)
                    }
                );
            });


            const startdate = new Date().getDate();
            let dateS = [];
            // this.selectDate = startdate;
            dateS.push(Moment().format('DD'));
            for (let i = 1; i < 7; i++) {
                var newDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
                dateS.push(Moment(newDate).format('DD'));
            }
            setselectDate((dateS));
            console.log(selectDates);
            // alert(JSON.stringify(dateS))

            const mntho = Moment().format('ddd');
            let m = [];
            // this.selectDate = startdate;
            m.push(mntho);
            for (let i = 1; i < 7; i++) {
                var newDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
                m.push(Moment(newDate).format('ddd'));
            }
            setmnth((m));
            console.log(mnth);

            const full = Moment().format('YYYY-MM-DD');
            let fu = [];
            // this.selectDate = startdate;
            fu.push(full);
            for (let i = 1; i < 7; i++) {
                var newDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
                fu.push(Moment(newDate).format('YYYY-MM-DD'));
            }
            setfulldate(("" + fu + ""));
            console.log(fulldate);
        });
        return unsubscribe;

    }, [])


    const Request = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                [],
                (tx, results) => {
                    let token = results.rows._array[0].token;
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT hellid AS ID, workstatus AS status, expected_start_date AS start_date, actual_start_time AS start_time, actual_end_time AS end_time, signature AS Sign FROM hell WHERE Modification=1',
                            [],
                            (tx, result) => {
                                console.warn("HELL", JSON.stringify(result.rows._array));
                                db.transaction((txp) => {
                                    txp.executeSql(
                                        "SELECT commenter_id AS worker_id, workorder_id AS workorderId, description FROM comment WHERE Modification=1",
                                        [],
                                        (tx, result1) => {
                                            db.transaction((txp) => {
                                                txp.executeSql(
                                                    "SELECT id, workorderid AS workorderId, quantity, amount, checked FROM task WHERE Modification='1'",
                                                    [],
                                                    (tx, result2) => {
                                                        console.warn("task: ", result1.rows._array);
                                                        db.transaction((txp) => {
                                                            txp.executeSql(
                                                                "SELECT id AS item_id, category_id, workorderid AS workorderId, quantity, amount AS price FROM adhocitems WHERE Modification='1'",
                                                                [],
                                                                (tx, result3) => {
                                                                    db.transaction((txz) => {
                                                                        txz.executeSql(
                                                                            'SELECT hellid AS ID, workstatus AS status, reasonid AS reason, date FROM hell WHERE Modification=1 AND reasonid !=0 AND status IN (4,5)',
                                                                            [],
                                                                            (tx, result6) => {
                                                                                console.error(result6);
                                                                                let bodyFormData = { 'workorder': JSON.stringify(result.rows._array), 'task': JSON.stringify(result2.rows._array), 'addhoc': JSON.stringify(result3.rows._array), 'comment': JSON.stringify(result1.rows._array), 'WorkorderImage': "[]", 'lastUpdatationDate': null, 'requests': JSON.stringify(result6.rows._array) }
                                                                                console.log(bodyFormData);
                                                                                axios({
                                                                                    method: 'POST',
                                                                                    url: 'https://swif.cloud/api/swif-sink',
                                                                                    data: bodyFormData,
                                                                                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': token }
                                                                                }).then(({ data, status }) => {
                                                                                    if (data.completeStatus == 200) {
                                                                                        let triggerHell = hellIndex('d', data);
                                                                                    }
                                                                                }).catch(error => {
                                                                                    if (error.response.data.status == 502) {
                                                                                        Alert.alert(
                                                                                            "Alert",
                                                                                            "Your're not Authenticated User Please sign in First",
                                                                                            [
                                                                                                { text: "OK", onPress: () => logout() }
                                                                                            ]
                                                                                        );
                                                                                    } else {
                                                                                        console.log(JSON.stringify(error));
                                                                                    }
                                                                                    console.log("jooo");
                                                                                    return;
                                                                                    console.log("boooooooooooooooo", error.response.data);
                                                                                })
                                                                            })
                                                                    })
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
                        );
                    });
                }
            );
        });
    }

    const hellIndex = (index, baseData) => {
        const queryD = "DELETE FROM hell;";
        const queryI = "SELECT * FROM hell;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            hellIndex('d', baseData);
                        } else {
                            if (baseData) {
                                hellInserted(baseData);
                                console.log('hiii');
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        hellIndex('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }

    const hellInserted = async (allData) => {
        // console.log({"insert":allData.list});
        allData.list.forEach((hell, i) => {
            if (hell.contractNumber) {
                db.transaction((ct1) => {
                    ct1.executeSql(
                        'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature, executionPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [hell.id, hell.customer_contact_number, hell.block, hell.contractNumber, hell.country, hell.customer_address, hell.customer_name, hell.option_name, hell.option_price, hell.service_name, hell.street, hell.unit, hell.workstatus, hell.workstatusname, hell.zip, hell.zone, 0, 0, "null", 0, "" + hell.start_date + "", "" + hell.actual_start_time + "", "" + hell.actual_end_time + "", "null", "null", "null", "null", hell.executionPermission],
                        (tx, hellRes1) => {
                            if (hellRes1) {
                                console.log("Contract Number Workorder insered");
                            }
                        }
                    );
                })
            } else {
                db.transaction((ct2) => {
                    ct2.executeSql(
                        'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature, executionPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [hell.id, hell.customer_contact_number, hell.block, 'null', hell.country, hell.customer_address, hell.customer_name, hell.option_name, hell.option_price, hell.service_name, hell.street, hell.unit, hell.workstatus, hell.workstatusname, hell.zip, hell.zone, 0, 0, "null", 0, "" + hell.start_date + "", "" + hell.actual_start_time + "", "" + hell.actual_end_time + "", "null", "null", "null", "null", hell.executionPermission],
                        (tx, hellRes2) => {
                            if (hellRes2) {
                                console.log("None Contract Number Workorder insered");
                            }
                        }
                    );
                })
            }
            if (i == allData.list.length - 1) {
                db.transaction((ct3) => {
                    ct3.executeSql('SELECT name FROM sqlite_master;', [], (tx, hellRes3) => {
                        if (hellRes3) {
                            level2('d', allData)
                            console.log({ "HELl List:": hellRes3, "data": JSON.stringify(allData) });
                        }
                    })
                })
            }
        });

    }
    const level2 = (index, baseData) => {
        const queryD = "DELETE FROM details;";
        const queryI = "SELECT * FROM details;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level2('d', baseData);
                        } else {
                            if (baseData) {
                                level2Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level2('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }

    const level2Inserted = (allData) => {
        allData.details.forEach((detail, i) => {
            db.transaction((ct21) => {
                let addHocPermission = undefined;
                if (detail.addHocPermission) {
                    addHocPermission = true;
                } else {
                    addHocPermission = false;
                }
                if (!addHocPermission) {
                    addHocPermission = false;
                }
                ct21.executeSql(
                    'INSERT INTO details (id, adjustment_type, adjustment_value, block, companytax, contractNumber, customer_contact_number, customer_name, discount_type, discount_value, option_name, option_price, service_id, service_name, status, street, unit, workstatusname, zip, zone, ad_hoc_catid, ad_hoc_items, gallery, task_list, workordercommentlist, type, reasonid, date, expected_start_time, expected_end_time, actual_start_time, actual_end_time,expected_start_date, Modification, executionPermission, priceViewPermission, country, leader, team, addHocPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [detail.id, detail.adjustment_type, detail.adjustment_value, detail.block, detail.companytax, detail.contractNumber, detail.customer_contact_number, detail.customer_name, detail.discount_type, detail.discount_value, detail.option_name, detail.option_price, detail.service_id, detail.service_name, detail.status, detail.street, detail.unit, detail.workstatusname, detail.zip, detail.zone, JSON.stringify(detail.ad_hoc_catid), JSON.stringify(detail.ad_hoc_items), JSON.stringify(detail.gallery), JSON.stringify(detail.task_list), JSON.stringify(detail.workordercommentlist), 0, 0, "null", "" + detail.actual_start_time + "", "" + detail.actual_end_time + "", "" + detail.ground_start_time + "", "" + detail.ground_end_time + "", "" + detail.start_date + "", 0, detail.executionPermission, detail.priceViewPermission, detail.country, detail.teamDetails.leader, detail.teamDetails.team, addHocPermission],
                    (tx, results) => {
                        if (results) {
                            console.log("Detail inserted Successfully");
                        }
                    }
                );
            })
            if (i == allData.details.length - 1) {
                level3('d', allData)
            }
        })
    }
    const level3 = (index, baseData) => {
        const queryD = "DELETE FROM item;";
        const queryI = "SELECT * FROM item;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level3('d', baseData);
                        } else {
                            if (baseData) {
                                level3Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level3('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level3Inserted = (allData) => {
        if (allData.item.length) {
            allData.item.forEach((item, x) => {
                db.transaction((ct31) => {
                    ct31.executeSql(
                        'INSERT INTO item (id, category_id, price, name) VALUES (?, ?, ?, ?)',
                        [item.id, item.category_id, item.price, item.name],
                        (tx, results) => {
                            if (results) console.log("item inserted");
                        }
                    );
                })
                if (x == allData.item.length - 1) {
                    level4('d', allData);
                }
            })
        } else {
            level4('d', allData);
        }
    }

    const level4 = (index, baseData) => {
        const queryD = "DELETE FROM adhocitems;";
        const queryI = "SELECT * FROM adhocitems;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level4('d', baseData);
                        } else {
                            if (baseData) {
                                level4Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level4('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level4Inserted = (allData) => {
        allData.details.forEach((item, x) => {
            if (item.ad_hoc_items.length) {
                item.ad_hoc_items.forEach(ele => {
                    db.transaction((ct31) => {
                        ct31.executeSql(
                            'INSERT INTO adhocitems (id, amount, checked, item, name, quantity, remarks, workorderid, Modification, category_id) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?)',
                            [ele.id, ele.amount, ele.checked, ele.item, ele.name, ele.quantity, ele.remarks, item.id, 0, ele.category_id],
                            (tx, results) => {
                                console.log("Adhoc item inseted Successfully");
                            }
                        );
                    });
                })
            }
            if (x == allData.details.length - 1) {
                level5('d', allData)
            }
        })
    }
    const level5 = (index, baseData) => {
        const queryD = "DELETE FROM task;";
        const queryI = "SELECT * FROM task;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level5('d', baseData);
                        } else {
                            if (baseData) {
                                level5Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level5('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level5Inserted = (allData) => {
        allData.details.forEach((detail, x) => {
            if (detail.task_list.length) {
                detail.task_list.forEach((item, i) => {
                    db.transaction((ct51) => {
                        ct51.executeSql(
                            'INSERT INTO task (id, amount, price, checked, item, name, quantity, remarks, workorderid, Modification, custom) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?)',
                            [item.id, item.amount, item.amount, item.checked, item.item, item.name, item.quantity, item.remarks, detail.id, 0, item.custom],
                            (tx, results) => {
                                console.log('Task insterd succesfuuly');
                            }
                        );
                    });
                })
            }
            if (x == allData.details.length - 1) {
                level6('d', allData)
            }
        })
    }
    const level6 = (index, baseData) => {
        const queryD = "DELETE FROM comment;";
        const queryI = "SELECT * FROM comment;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level6('d', baseData);
                        } else {
                            if (baseData) {
                                level6Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level6('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }

    const level6Inserted = (allData) => {
        if (allData.comment.length) {
            allData.comment.forEach((item, i) => {
                if (item.length) {
                    item.forEach((comm) => {
                        db.transaction((ct61) => {
                            ct61.executeSql(
                                "INSERT INTO comment (comment_id, commenter_type, commenter, commenter_id, description, workorder_id, created,Modification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                                [comm.id, comm.commenter_type, comm.commenter, comm.commenter_id, comm.description, comm.workorder_id, comm.created, 0],
                                (tx, results) => {
                                    console.log("comment inserted successfully");
                                }
                            )
                        })
                    })
                }
                if (i == allData.comment.length - 1) {
                    level7('d', allData)
                }
            })
        }
    }
    const level7 = (index, baseData) => {
        const queryD = "DELETE FROM cancel;";
        const queryI = "SELECT * FROM cancel;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level7('d', baseData);
                        } else {
                            if (baseData) {
                                level7Inserted(baseData);
                            }
                        }
                    } else if (res1 && modeStatus == 103) {
                        level7('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level7Inserted = (allData) => {
        if (allData.CancelReason.length) {
            allData.CancelReason.forEach((item, i) => {
                db.transaction((ct71) => {
                    ct71.executeSql(
                        'INSERT INTO cancel (cancelid, company_id, description, title) VALUES (?,?,?,?)',
                        [item.id, item.company_id, item.description, item.title],
                        (tx, results) => {
                            console.log('cancel reson instrerd');
                        }
                    );
                })
                if (i == allData.CancelReason.length - 1) {
                    level8('d', allData)
                }
            })
        }
    }
    const level8 = (index, baseData) => {
        const queryD = "DELETE FROM reschedule;";
        const queryI = "SELECT * FROM reschedule;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level8('d', baseData);
                        } else {
                            if (baseData) {
                                level8Inserted(baseData);
                            }
                        }
                    } else if (res1 && modeStatus == 103) {
                        console.log("Cancel table empty");
                        level8('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level8Inserted = (allData) => {
        if (allData.resheduleReason.length) {
            allData.resheduleReason.forEach((item, i) => {
                db.transaction((ct81) => {
                    ct81.executeSql(
                        'INSERT INTO reschedule (rescheduleid, company_id, description, title) VALUES (?,?,?,?)',
                        [item.id, item.company_id, item.description, item.title],
                        (tx, results) => {
                            console.log('reshudle dsahg');
                        }
                    );
                })
                if (i == allData.resheduleReason.length - 1) {
                    level9('d', allData);
                }
            })
        }
    }
    const level9 = (index, baseData) => {
        const queryD = "DELETE FROM gallery;";
        const queryI = "SELECT * FROM gallery;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level9('d', baseData);
                        } else {
                            if (baseData) {
                                level9Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level9('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level9Inserted = (allData) => {
        allData.details.forEach((item, i) => {
            if (item.gallery.length) {
                item.gallery.forEach((img, x) => {
                    db.transaction((ct91) => {
                        ct91.executeSql(
                            'INSERT INTO gallery (file, workorderid, Modification) VALUES (?, ?, ?)',
                            [img.name, item.id, 1],
                            (tx, results) => {
                                console.log("img inserted successfully");
                            }
                        );
                    })
                });
                if (i == allData.item.length - 1) {
                    levelExit();
                }
            } else {
                levelExit();
            }
        })
    }
    const levelExit = () => {
        console.log("exit");
    }

    const logout = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS workorder', [])
            tx.executeSql('DROP TABLE IF EXISTS cancel', [])
            tx.executeSql('DROP TABLE IF EXISTS reschedule', [])
            tx.executeSql('DROP TABLE IF EXISTS status', [])
            tx.executeSql('DROP TABLE IF EXISTS hell', [])
            tx.executeSql('DROP TABLE IF EXISTS items', [])
            tx.executeSql('DROP TABLE IF EXISTS item', [])
            tx.executeSql('DROP TABLE IF EXISTS task', [])
            tx.executeSql('DROP TABLE IF EXISTS adhocitems', [])
            tx.executeSql('DROP TABLE IF EXISTS details', [])
            tx.executeSql('DROP TABLE IF EXISTS comment', [])
            tx.executeSql('DROP TABLE IF EXISTS gallery', [])
            tx.executeSql('DROP TABLE IF EXISTS cal', [])
            tx.executeSql('DROP TABLE IF EXISTS user',
                [], (tx, result) => {
                    AsyncStorage.clear();
                    navigation.navigate('FirstPage')
                });
        })
    }

    const setting = (value) => {
        setlocal(value)
        console.log("LIST:", local);
    }
    const setting1 = (value) => {
        setlog(value.rows._array[0])
        console.log("User:", log);
    }
    const settingNext = (value) => {
        setoder([]);
        setoder(value)
        console.warn("booooo", value);
        setnextevent(true);

    }
    const RES = (value) => {
        setres(value)
        console.log('Reschedule', res);
    }
    let tempCancelId = [];
    let tempCancelData = [];
    const CANCEL = (value) => {
        value.forEach(element => {
            if (!tempCancelId.includes(element.cancelid)) {
                tempCancelData.push(element);
                tempCancelId.push(element.cancelid);
            }
        });
        console.log("yufrf", tempCancelData);
        console.error({ value });
        setcan(tempCancelData)
        // console.log("can", cana);
    }

    useFocusEffect(
        // this function is used to alert message for not getting out directly
        React.useCallback(() => {
            const handleBackButton = () => {
                Alert.alert("Hold on!", "Are you sure you want to exit?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            }

            BackHandler.addEventListener('hardwareBackPress', handleBackButton);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }, [])
    );


    const SelectTab = (item, index) => {
        // this function is used for bottom tab navigation in dashboard,connection,notification and profle screen
        setactiveIndex(index)
        // console.log(Profiledata.userdetail.id)
        if (index === 0) {
            var date = Moment().format('YYYY-MM-DD')
            var query = "SELECT * FROM hell WHERE expected_start_date='" + date + "'"
            console.log(date, query);

            db.transaction((tx) => {
                tx.executeSql(
                    query,
                    [],
                    (tx, result) => {
                        console.log("hell:" + JSON.stringify(result));
                        setting(result.rows._array)
                        var Pendingcount = 0;
                        var Cancelcount = 0;
                        var Completecount = 0;
                        for (let i = 0; i < result.rows._array.length; i++) {

                            let workstatus = result.rows._array[i].workstatus;
                            if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {

                                Pendingcount += 1;
                                console.log(Pendingcount);

                            }
                            if (workstatus == 5) {

                                Cancelcount += 1;
                                console.log(Cancelcount);

                            }
                            if (workstatus == 3) {

                                Completecount += 1;
                                console.log(Completecount);

                            }
                        }
                        if (nextevent == false) {
                            setPendingCount(Pendingcount);
                            setCancelCount(Cancelcount);
                            setCompleteCount(Completecount);
                            setTotalCount(result.rows._array.length)
                        }

                    }
                );
            });
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                    [],
                    (tx, results) => {
                        console.log("USER:", JSON.stringify(results));
                        setting1(results)
                    }
                );
            });
        }
        if (index === 1) {
            onRefresh()
        }
        // if (index === 1) {
        //     navigation.navigate('Notification')
        // }
        if (index === 2) {
            navigation.navigate('Profile')
        }
    }

    const pend = () => {
        setStatus([1, 2]);
        setcolor(true)
        setcolor1(false)
        setcolor2(false)
        setcolor3(false)
    }
    const canc = () => {
        setStatus([5]);
        setcolor1(true)
        setcolor(false)
        setcolor2(false)
        setcolor3(false)
    }
    const compl = () => {
        setStatus([3]);
        setcolor(false)
        setcolor1(false)
        setcolor2(true)
        setcolor3(false)
    }
    const tot = () => {
        setStatus([1, 2, 3, 4, 5, 6, 7, 9]);
        setcolor(false)
        setcolor1(false)
        setcolor2(false)
        setcolor3(true)
    }

    const EmptyListMessage = ({ item }) => {
        return (
            // Flat List Item
            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                <Text
                    style={{ fontSize: 18, textAlign: 'center', alignSelf: 'center' }}
                    onPress={() => getItem(item)}>
                    No Data Found
                </Text>
            </View>

        );
    };

    const [names, setnames] = useState('')
    const Visible = (isVisible, id, na) => {
        setnames(null)
        console.log('reshcedule', id);
        visible(isVisible)
        setreid(id)
        setnames(na)
    }

    const [cid, setcid] = useState('')

    const csl = (cnl, id, na) => {
        setnames(null)
        console.log('cancel', id);
        setcnl(cnl)
        setcid(id)
        setnames(na)
    }

    const GoBack = () => visible(false);
    const back = () => setcnl(false);


    const onSelectedSports = (resion) => {
        console.log(resion);
        setresion(resion)
    }
    const onCancel = (cnlresion) => {
        console.log(cnlresion);
        setcnlresion(cnlresion)
    }

    const minDate = new Date()

    const [visibles, setVisibles] = useState(false);
    const [timeid, settimeid] = useState('')

    const toggleAlert = (visibles, id) => {
        console.log(id);
        setVisibles(visibles)
        settimeid(id)
    }

    const alert = () => setVisibles(false)

    const reshedule = (token) => {

    }

    const orderlist = (item) => {
        console.log(item);
        dispatch(Id(item))
        navigation.navigate('Orderlist')
    }

    const Reschedule = (id) => {
        console.log(id, reid);


        if (days === "") {
            alert('Please Select Date')
            return false
        }
        if (resion === "") {
            alert('Please Select Reason')
            return false
        }
        const redate = Moment(days, 'YYYY MM DD').format('YYYY-MM-DD');
        const type = 2 // ! = cancel ; 2 = Reschedule;
        var reasonid = resion;
        const data = [type, reasonid[0], redate];
        console.log(data);

        var query1 = "UPDATE hell SET type=" + type + ", reasonid=" + reasonid + ", date='" + redate + "', workstatus=" + 4 + ", workstatusname='Rescheduled', Modification=1 WHERE hellid=" + reid;
        var query2 = "UPDATE details SET workstatusname='Rescheduled', Modification=1 WHERE id=" + reid;

        console.log(query1, query2);

        console.log("booo", id, reid);
        db.transaction((tx) => {
            tx.executeSql(
                query1,
                [],
                (tx, result) => {
                    console.log("updation:" + JSON.stringify(result));

                    db.transaction((tx) => {
                        tx.executeSql(
                            query2,
                            [],
                            (tx, result) => {
                                console.log("updation:" + JSON.stringify(result));
                                onRefresh()
                                visible(false)
                            }
                        );
                    });
                    return
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT * FROM hell',
                            [],
                            (tx, result) => {
                                console.log("hell:" + JSON.stringify(result));
                                setting(result.rows._array)
                                var Pendingcount = 0;
                                var Cancelcount = 0;
                                var Completecount = 0;
                                for (let i = 0; i < result.rows._array.length; i++) {

                                    let workstatus = result.rows._array[i].workstatus;
                                    if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {

                                        Pendingcount += 1;
                                        console.log(Pendingcount);

                                    }
                                    if (workstatus == 5) {

                                        Cancelcount += 1;
                                        console.log(Cancelcount);

                                    }
                                    if (workstatus == 3) {

                                        Completecount += 1;
                                        console.log(Completecount);

                                    }
                                }
                                if (nextevent == false) {
                                    setPendingCount(Pendingcount);
                                    setCancelCount(Cancelcount);
                                    setCompleteCount(Completecount);
                                    setTotalCount(result.rows._array.length)
                                }

                                alert("Requested for Reschedule WorkOrder has been Sent Sucessfully To The Admin")
                                Request();
                                visible(false)
                            }
                        );
                    });
                }
            );
        });
        console.log("booo", "end");

    }

    const Cancel = (id) => {

        console.log(id, cid);

        if (cnlresion === "") {
            alert('Please Select Reason')
        }
        const type = 1 // ! = cancel ; 2 = Reschedule;
        var reasonid = cnlresion;
        const data = [type, reasonid[0]];
        console.log(data);

        var query1 = "UPDATE hell SET type=" + type + ", reasonid=" + reasonid + ", workstatus=" + 5 + ", workstatusname='Cancelled', Modification=1 WHERE hellid=" + cid;
        var query2 = "UPDATE details SET workstatusname='Cancelled', Modification=1 WHERE id=" + cid;

        console.log(query1, query2);


        console.log("booo", id, cid);
        db.transaction((tx) => {
            tx.executeSql(
                query1,
                [],
                (tx, result) => {
                    console.log("updation:" + JSON.stringify(result));
                    db.transaction((tx) => {
                        tx.executeSql(
                            query2,
                            [],
                            (tx, result) => {
                                console.log("updation1:" + JSON.stringify(result));
                                onRefresh();
                                setcnl(false)
                            }
                        );
                    });
                    return
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT * FROM hell',
                            [],
                            (tx, result) => {
                                console.log("hell:" + JSON.stringify(result));
                                setting(result.rows._array)
                                var Pendingcount = 0;
                                var Cancelcount = 0;
                                var Completecount = 0;
                                for (let i = 0; i < result.rows._array.length; i++) {

                                    let workstatus = result.rows._array[i].workstatus;
                                    if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {

                                        Pendingcount += 1;
                                        console.log(Pendingcount);

                                    }
                                    if (workstatus == 5) {

                                        Cancelcount += 1;
                                        console.log(Cancelcount);

                                    }
                                    if (workstatus == 3) {

                                        Completecount += 1;
                                        console.log(Completecount);

                                    }
                                }
                                if (nextevent == false) {
                                    setPendingCount(Pendingcount);
                                    setCancelCount(Cancelcount);
                                    setCompleteCount(Completecount);
                                    setTotalCount(result.rows._array.length)
                                }

                                alert("Requested for Cancel WorkOrder has been Sent Sucessfully To The Admin")
                                Request();
                                setcnl(false)
                            }
                        );
                    });
                }
            );
        });
        console.log("booo", "end");

    }

    const timer = () => {
        var start_time = hours + ':' + min + ':' + sec
        var start_date = Moment().format('YYYY-MM-DD');
        console.log(timeid);

        if (!start_time) {
            alert('Try Again Please')
        }
        // var data = [id, start_date, start_time]
        var query1 = "UPDATE hell SET actual_start_date='" + start_date + "', actual_start_time='" + start_time + "', workstatus=" + 2 + ", workstatusname='In Progress', Modification=1 WHERE hellid=" + timeid;
        var query2 = "UPDATE details SET actual_start_time='" + start_time + "', status=" + 2 + ", workstatusname='In Progress', Modification=1 WHERE id=" + timeid;
        console.log("Start", query1, query2);

        db.transaction((tx) => {
            tx.executeSql(
                query1,
                [],
                (tx, result) => {
                    console.log("updation:" + JSON.stringify(result));
                    db.transaction((tx) => {
                        tx.executeSql(
                            query2,
                            [],
                            (tx, result) => {
                                console.log("updation1:" + JSON.stringify(result));
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        'SELECT * FROM hell WHERE hellid=' + timeid,
                                        [],
                                        (tx, result) => {
                                            console.log("hell:" + JSON.stringify(result));
                                            db.transaction((tx) => {
                                                tx.executeSql(
                                                    'SELECT * FROM details WHERE id=' + timeid,
                                                    [],
                                                    (tx, result) => {
                                                        console.log("Details:" + JSON.stringify(result));


                                                        setting(result.rows._array)
                                                        alert("Work order Start")
                                                        // Request();
                                                        onRefresh()
                                                    }
                                                );
                                            });

                                            // setting(result.rows._array)
                                            // alert("Work order Start")
                                            // // Request();
                                            // onRefresh()
                                        }
                                    );
                                });
                            }
                        );
                    });
                }
            );
        });
        console.log("end");

    }
    const getHellFromDb = (date) => {
        var query = "SELECT * FROM hell WHERE expected_start_date='" + date + "'"
        console.log(date, query);
        db.transaction((tx) => {
            tx.executeSql(
                query,
                [],
                (tx, result) => {
                    console.log("hell:" + JSON.stringify(result));
                    settingNext(result.rows._array)
                    console.log(result.rows._array);
                    var Pendingcount = 0;
                    var Cancelcount = 0;
                    var Completecount = 0;
                    for (let i = 0; i < result.rows._array.length; i++) {

                        let workstatus = result.rows._array[i].workstatus;
                        if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {

                            Pendingcount += 1;
                            console.log(Pendingcount);

                        }
                        if (workstatus == 5) {

                            Cancelcount += 1;
                            console.log(Cancelcount);

                        }
                        if (workstatus == 3) {

                            Completecount += 1;
                            console.log(Completecount);

                        }

                    }
                    setPendingCount(Pendingcount);
                    setCancelCount(Cancelcount);
                    setCompleteCount(Completecount);
                    setTotalCount(result.rows._array.length)
                }
            );
        });
    }
    const currentdate = (cdate) => {
        setSelect(cdate);
        let month = Moment().format('MM')
        let year = Moment().format('YYYY')
        let date = year + "-" + month + "-" + cdate;
        // let date = '2022-06-03';
        console.log(date);
        421


        var today = Moment().format('YYYY-MM-DD')
        if (date != today) {
            var query = "SELECT * FROM hell WHERE expected_start_date='" + date + "'"
            console.log(date, query);
            db.transaction((tx) => {
                tx.executeSql(
                    query,
                    [],
                    (tx, result) => {
                        console.log("hell next event true:" + JSON.stringify(result));
                        // return
                        console.log(result.rows.length);
                        if (result.rows.length > 0) {
                            settingNext(result.rows._array)
                            var Pendingcount = 0;
                            var Cancelcount = 0;
                            var Completecount = 0;
                            if (result.rows._array.length > 0) {

                                for (let i = 0; i < result.rows._array.length; i++) {

                                    let workstatus = result.rows._array[i].workstatus;
                                    if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {

                                        Pendingcount += 1;
                                        console.log(Pendingcount);

                                    }
                                    if (workstatus == 5) {

                                        Cancelcount += 1;
                                        console.log(Cancelcount);

                                    }
                                    if (workstatus == 3) {

                                        Completecount += 1;
                                        console.log(Completecount);

                                    }

                                }
                            }
                            setPendingCount(Pendingcount);
                            setCancelCount(Cancelcount);
                            setCompleteCount(Completecount);
                            setTotalCount(result.rows._array.length)
                        } else {



                            let bodyFormData = { 'day': cdate, 'month': newmnth, 'year': newyear }
                            console.log(bodyFormData);
                            5000

                            NetInfo.addEventListener(networkState => {
                                setintStatus(networkState.isConnected);
                                if (networkState.isConnected) {
                                    axios({
                                        method: 'post',
                                        url: `https://swif.cloud/api/wxdetailandlist`,
                                        data: bodyFormData,
                                        headers: { 'Authorization': log.token }
                                    }).then(({ data, status }) => {
                                        if (data.error == false) {
                                            if (data.list.length > 0) {
                                                console.log(data);
                                                data.list.forEach(element => {
                                                    if (element.contractNumber) {
                                                        // console.log(element.contractNumber);
                                                        db.transaction(function (tx) {
                                                            tx.executeSql(
                                                                'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                                                [element.id, element.customer_contact_number, element.block, element.contractNumber, element.country, element.customer_address, element.customer_name, element.option_name, element.option_price, element.service_name, element.street, element.unit, element.workstatus, element.workstatusname, element.zip, element.zone, 0, 0, "null", 0, "" + element.start_date + "", "" + element.actual_start_time + "", "" + element.actual_end_time + "", "null", "null", "null", "null"],
                                                                (tx, results) => {
                                                                    console.log(results);
                                                                    // alert("boo")
                                                                    db.transaction((tx) => {
                                                                        tx.executeSql(
                                                                            'SELECT * FROM hell',
                                                                            [],
                                                                            (tx, result) => {
                                                                                console.log("hell:" + JSON.stringify(result));
                                                                            }
                                                                        );
                                                                    });
                                                                }
                                                            );
                                                        });
                                                    } else {
                                                        console.log("booo");
                                                        db.transaction(function (tx) {
                                                            tx.executeSql(
                                                                'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                                                [element.id, element.customer_contact_number, element.block, 'null', element.country, element.customer_address, element.customer_name, element.option_name, element.option_price, element.service_name, element.street, element.unit, element.workstatus, element.workstatusname, element.zip, element.zone, 0, 0, "null", 0, "" + element.start_date + "", "" + element.actual_start_time + "", "" + element.actual_end_time + "", "null", "null", "null", "null"],
                                                                (tx, results) => {
                                                                    console.log(results);
                                                                    // alert("boo")
                                                                    db.transaction((tx) => {
                                                                        tx.executeSql(
                                                                            'SELECT * FROM hell',
                                                                            [],
                                                                            (tx, result) => {
                                                                                console.log("hell:" + JSON.stringify(result));
                                                                            }
                                                                        );
                                                                    });
                                                                }
                                                            );
                                                        });
                                                    }
                                                });
                                                data.detail.forEach(element => {
                                                    if (element.task_list.length > 0) {
                                                        element.task_list.forEach(ele => {

                                                            db.transaction(function (tx) {
                                                                tx.executeSql(
                                                                    'INSERT INTO task (id, amount,price, checked, item, name, quantity, remarks, workorderid, Modification) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?)',
                                                                    [ele.id, ele.amount, ele.amount, ele.checked, ele.item, ele.name, ele.quantity, ele.remarks, element.id, 0],
                                                                    (tx, results) => {
                                                                        db.transaction((tx) => {
                                                                            tx.executeSql(
                                                                                'SELECT * FROM task',
                                                                                [],
                                                                                (tx, result) => {
                                                                                    console.warn("task", JSON.stringify(result));
                                                                                }
                                                                            );
                                                                        });
                                                                    }
                                                                );
                                                            });
                                                        });
                                                    }
                                                    db.transaction(function (tx) {
                                                        tx.executeSql(
                                                            'INSERT INTO details (id, adjustment_type, adjustment_value, block, companytax, contractNumber, customer_contact_number, customer_name, discount_type, discount_value, option_name, option_price, service_id, service_name, status, street, unit, workstatusname, zip, zone, ad_hoc_catid, gallery, task_list, workordercommentlist, type, reasonid, date, expected_start_time, expected_end_time, actual_start_time, actual_end_time,expected_start_date, Modification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                                            [element.id, element.adjustment_type, element.adjustment_value, element.block, element.companytax, element.contractNumber, element.customer_contact_number, element.customer_name, element.discount_type, element.discount_value, element.option_name, element.option_price, element.service_id, element.service_name, element.status, element.street, element.unit, element.workstatusname, element.zip, element.zone, JSON.stringify(element.ad_hoc_items), JSON.stringify(element.gallery), JSON.stringify(element.task_list), JSON.stringify(element.workordercommentlist), 0, 0, "null", "" + element.actual_start_time + "", "" + element.actual_end_time + "", "null", "null", "" + element.start_date + "", 0],
                                                            (tx, results) => {
                                                                db.transaction((tx) => {
                                                                    tx.executeSql(
                                                                        'SELECT * FROM details',
                                                                        [],
                                                                        (tx, result) => {
                                                                            console.error("details", JSON.stringify(result));
                                                                        }
                                                                    );
                                                                });
                                                            }
                                                        );
                                                    });
                                                });
                                                console.warn("success Hell");
                                                getHellFromDb(date);
                                            } else {
                                                settingNext([])
                                                setPendingCount(0);
                                                setCancelCount(0);
                                                setCompleteCount(0);
                                                setTotalCount(0)
                                            }
                                        } else {
                                        }

                                    }).catch(error => {
                                        console.log("boooooooooooooooo", error.response.data);
                                    })
                                } else {
                                    // alert("no internet")
                                }
                            });
                        }
                    }
                );
            })
        } else {
            423
            setnextevent(false);
            // alert(today)
            var query = "SELECT * FROM hell WHERE expected_start_date='" + today + "'"
            console.log(date, query);
            db.transaction((tx) => {
                tx.executeSql(
                    query,
                    [],
                    (tx, result) => {
                        console.log("hell next event false:" + JSON.stringify(result));
                        setting(result.rows._array)
                        var Pendingcount = 0;
                        var Cancelcount = 0;
                        var Completecount = 0;
                        if (result.rows._array.length > 0) {

                            for (let i = 0; i < result.rows._array.length; i++) {

                                let workstatus = result.rows._array[i].workstatus;
                                if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {

                                    Pendingcount += 1;
                                    console.log(Pendingcount);

                                }
                                if (workstatus == 5) {

                                    Cancelcount += 1;
                                    console.log(Cancelcount);

                                }
                                if (workstatus == 3) {

                                    Completecount += 1;
                                    console.log(Completecount);

                                }

                            }
                        }
                        setPendingCount(Pendingcount);
                        setCancelCount(Cancelcount);
                        setCompleteCount(Completecount);
                        setTotalCount(result.rows._array.length)
                    }
                );
            });
        }
        console.log(date);

    }

    let customDatesStyles = [];
    let startDate = Moment();
    for (let i = 0; i < 1; i++) {
        customDatesStyles.push({
            startDate: startDate.clone().add(i, 'days'), // Single date since no endDate provided
            // Random color...

            dateContainerStyle: { backgroundColor: '#DADADA', },
        });
    }

    const [refreshing, setRefreshing] = useState(false);
    const [net, setnet] = useState('')
    const onRefresh = React.useCallback(() => {
        NetInfo.addEventListener(networkState => {
            setnet('status:' + JSON.stringify(networkState.isConnected));
        });
        
        setSloading(true)
        Request();
        setTimeout(() => {
            setSloading(false)
        }, 3000);

        setRefreshing(true);
        wait(3000).then(() => {
            console.log("start refresh");
            setlocal([])
            setRefreshing(false)

            var date = Moment().format('YYYY-MM-DD')
            var query = "SELECT * FROM hell WHERE expected_start_date='" + date + "'"
            console.log(date, query);

            db.transaction((tx) => {
                tx.executeSql(
                    query,
                    [],
                    (tx, result) => {
                        console.log("hell:" + JSON.stringify(result));
                        setting(result.rows._array)
                        var Pendingcount = 0;
                        var Cancelcount = 0;
                        var Completecount = 0;
                        for (let i = 0; i < result.rows._array.length; i++) {

                            let workstatus = result.rows._array[i].workstatus;
                            if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {

                                Pendingcount += 1;
                                console.log(Pendingcount);

                            }
                            if (workstatus == 5) {

                                Cancelcount += 1;
                                console.log(Cancelcount);

                            }
                            if (workstatus == 3) {

                                Completecount += 1;
                                console.log(Completecount);

                            }

                        }
                        if (nextevent == false) {
                            setPendingCount(Pendingcount);
                            setCancelCount(Cancelcount);
                            setCompleteCount(Completecount);
                            setTotalCount(result.rows._array.length)
                        }
                    }
                );
            });
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM reschedule',
                    [],
                    (tx, results) => {
                        console.log("res:" + JSON.stringify(results));
                        RES(results.rows._array)
                    }
                );
            });
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM cancel',
                    [],
                    (tx, results) => {
                        console.error("canel" + JSON.stringify(results));
                        CANCEL(results.rows._array)
                    }
                );
            });
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                    [],
                    (tx, results) => {
                        console.log("USER:", JSON.stringify(results));
                        setting1(results)
                    }
                );
            });
        });
        setRefreshing(false)
    })

    // const startdate = Moment().format('DD')





    return (
        <SafeAreaView style={{ flex: 1 }}>
            {Sloading ? <Loading showloading={Sloading} /> : null}
            {!IntStatus &&
                <View style={{ paddingTop: 30, backgroundColor: 'red', zIndex: 22, paddingBottom: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>No Internet connection</Text>
                </View>}
            {/* {IntStatus &&
                <View style={{ paddingTop: 30, backgroundColor: 'green', zIndex: 22, paddingBottom: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>Internet connection Found</Text>
                </View>} */}
            <View style={{ paddingTop: 35, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Image
                        source={{ uri: log.profile_image }}
                        style={{ height: 50, width: 50, resizeMode: 'cover', borderRadius: 50, }}
                    />
                    <Text style={{ alignSelf: 'center', paddingLeft: 15, color: '#6F00C5', fontSize: 18, fontWeight: 'bold', fontFamily: 'Roboto' }}>{log.username}</Text>
                </View>
                <View style={{ alignContent: 'flex-end', alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                    <Image
                        source={{ uri: log.company_logo }}
                        style={{ height: 50, width: 50, resizeMode: 'cover', borderRadius: 50 }}
                    />
                </View>
                {/* <View style={{ alignContent: 'flex-end', alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => {onRefresh()}}
                style={{alignSelf:'center',alignContent:'center',alignItems:'center', paddingBottom:10}}>
                <FontAwesome name="refresh" size={24} color="black" />
                </TouchableOpacity>
                </View> */}
            </View>

            <View style={{ backgroundColor: '#F0F0F0', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 10, backfaceVisibility: 'visible' }}>
                <Text style={{ textAlign: 'center', fontSize: 30, color: '#7C7C7C', fontWeight: '100', fontFamily: 'Roboto', }}>Your Work Orders For</Text>
                <View
                    style={{
                        borderRadius: 15, backgroundColor: '#fff', shadowColor: "#000", height: 140, marginBottom: 50,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 3.5, zIndex: -99999999, position: 'relative', backfaceVisibility: 'hidden', zIndex: -22
                    }}
                >

                    {log.topBarPermission == '1' &&
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', padding: 15, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 3.5, borderRadius: 15, backgroundColor: '#fff',
                        }}>
                            {/* 123 */}
                            {selectedDate == selectDates[0] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[0])}
                                    style={{ backgroundColor: '#DEDEDE', borderRadius: 50, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[0]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[0]}</Text>
                                </TouchableOpacity>}
                            {selectedDate != selectDates[0] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[0])}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[0]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[0]}</Text>
                                </TouchableOpacity>}
                            {selectedDate == selectDates[1] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[1])}
                                    style={{ backgroundColor: '#DEDEDE', borderRadius: 50, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[1]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[1]}</Text>
                                </TouchableOpacity>}
                            {selectedDate != selectDates[1] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[1])}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[1]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[1]}</Text>
                                </TouchableOpacity>}
                            {selectedDate == selectDates[2] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[2])}
                                    style={{ backgroundColor: '#DEDEDE', borderRadius: 50, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[2]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[2]}</Text>
                                </TouchableOpacity>}
                            {selectedDate != selectDates[2] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[2])}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[2]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[2]}</Text>
                                </TouchableOpacity>}
                            {selectedDate == selectDates[3] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[3])}
                                    style={{ backgroundColor: '#DEDEDE', borderRadius: 50, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[3]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[3]}</Text>
                                </TouchableOpacity>}
                            {selectedDate != selectDates[3] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[3])}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[3]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[3]}</Text>
                                </TouchableOpacity>}
                            {selectedDate == selectDates[4] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[4])}
                                    style={{ backgroundColor: '#DEDEDE', borderRadius: 50, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[4]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[4]}</Text>
                                </TouchableOpacity>}
                            {selectedDate != selectDates[4] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[4])}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[4]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[4]}</Text>
                                </TouchableOpacity>}
                            {selectedDate == selectDates[5] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[5])}
                                    style={{ backgroundColor: '#DEDEDE', borderRadius: 50, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[5]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[5]}</Text>
                                </TouchableOpacity>}
                            {selectedDate != selectDates[5] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[5])}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[5]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[5]}</Text>
                                </TouchableOpacity>}
                            {selectedDate == selectDates[6] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[6])}
                                    style={{ backgroundColor: '#DEDEDE', borderRadius: 50, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[6]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[6]}</Text>
                                </TouchableOpacity>}
                            {selectedDate != selectDates[6] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[6])}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[6]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20 }}>{selectDates[6]}</Text>
                                </TouchableOpacity>}
                        </View>}
                    {log.topBarPermission != '1' &&
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', padding: 15, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 3.5, borderRadius: 15, backgroundColor: '#fff',
                        }}>
                            {/* 123 */}
                            {selectedDate == selectDates[0] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[0])}
                                    style={{ backgroundColor: '#DEDEDE', borderRadius: 50, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[0]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[0]}</Text>
                                </TouchableOpacity>}
                            {selectedDate != selectDates[0] &&
                                <TouchableOpacity onPress={() => currentdate(selectDates[0])}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'center' }}>{mnth[0]}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{selectDates[0]}</Text>
                                </TouchableOpacity>}
                        </View>}

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 10, zIndex: 9999999999 }}>

                        <View style={{ alignContent: 'center', alignItems: 'center', }}>
                            {color == false &&
                                <TouchableOpacity onPress={() => pend()} style={{ backgroundColor: '#fff', borderRadius: 70, height: 70, width: 70, borderColor: '#e7b510e7', borderWidth: 2, alignSelf: 'center', paddingTop: 5 }}>
                                    <Text style={{ color: '#e7b510e7', textAlign: 'center', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto' }}>{PendingCount}</Text>
                                    {/* <Text style={{ fontFamily: 'Roboto', paddingTop: 10, textAlign: 'center' }}>Pending</Text> */}
                                </TouchableOpacity>}
                            {color == true &&
                                <TouchableOpacity onPress={() => pend()} style={{ backgroundColor: '#e7b510e7', borderRadius: 70, height: 70, width: 70, borderColor: '#e7b510e7', borderWidth: 2, alignSelf: 'center', paddingTop: 5 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto' }}>{PendingCount}</Text>
                                </TouchableOpacity>}
                            <Text style={{ fontFamily: 'Roboto', textAlign: 'center' }}>Pending</Text>
                        </View>

                        <View style={{ alignContent: 'center', alignItems: 'center' }}>
                            {color1 == false &&
                                <TouchableOpacity onPress={() => canc()} style={{ backgroundColor: '#fff', borderRadius: 70, height: 70, width: 70, borderColor: '#f73e2f', borderWidth: 2, paddingTop: 5 }}>
                                    <Text style={{ color: '#f73e2f', textAlign: 'center', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto' }}>{CancelCount}</Text>
                                </TouchableOpacity>}
                            {color1 == true &&
                                <TouchableOpacity onPress={() => canc()} style={{ backgroundColor: '#f73e2f', borderRadius: 70, height: 70, width: 70, borderColor: '#f73e2f', borderWidth: 2, paddingTop: 5 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto' }}>{CancelCount}</Text>
                                </TouchableOpacity>}
                            <Text style={{ fontFamily: 'Roboto', textAlign: 'center' }}>Cancel</Text>
                        </View>

                        <View style={{ alignContent: 'center', alignItems: 'center' }}>
                            {color2 == false &&
                                <TouchableOpacity onPress={() => compl()} style={{ backgroundColor: '#fff', borderRadius: 70, height: 70, width: 70, borderColor: '#3ac30a', borderWidth: 2, paddingTop: 5 }}>
                                    <Text style={{ color: '#3ac30a', textAlign: 'center', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto' }}>{CompleteCount}</Text>
                                </TouchableOpacity>}
                            {color2 == true &&
                                <TouchableOpacity onPress={() => compl()} style={{ backgroundColor: '#3ac30a', borderRadius: 70, height: 70, width: 70, borderColor: '#3ac30a', borderWidth: 2, paddingTop: 5 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto' }}>{CompleteCount}</Text>
                                </TouchableOpacity>}
                            <Text style={{ fontFamily: 'Roboto' }}>Completed</Text>
                        </View>

                        <View style={{ alignContent: 'center', alignItems: 'center' }}>
                            {color3 == false &&
                                <TouchableOpacity onPress={() => tot()} style={{ backgroundColor: '#fff', borderRadius: 70, height: 70, width: 70, borderColor: '#1a63b5', borderWidth: 2, paddingTop: 5 }}>
                                    <Text style={{ color: '#1a63b5', textAlign: 'center', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto' }}>{TotalCount}</Text>
                                    {/* <Text style={{ fontFamily: 'Roboto', textAlign: 'center' }}>Total</Text> */}
                                </TouchableOpacity>}
                            {color3 == true &&
                                <TouchableOpacity onPress={() => tot()} style={{ backgroundColor: '#1a63b5', borderRadius: 70, height: 70, width: 70, borderColor: '#1a63b5', borderWidth: 2, paddingTop: 5 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto' }}>{TotalCount}</Text>
                                </TouchableOpacity>}
                            <Text style={{ fontFamily: 'Roboto', textAlign: 'center' }}>Total</Text>
                        </View>

                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                backgroundColor='#ECECEC'
                refreshControl={<RefreshControl onRefresh={onRefresh} />}
            >
                <View style={{ margin: 10 }}>
                    {nextevent == false &&
                        <FlatList
                            data={local}  // GET DASHBOARD DATA  FROM API
                            keyExtractor={(item) => item.key}
                            ListEmptyComponent={EmptyListMessage}
                            renderItem={({ item, index }) =>

                                <View>
                                    {status.includes(item.workstatus) &&
                                        <View style={{
                                            padding: 15, backgroundColor: '#fff', borderRadius: 15, margin: 5, shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 3.5,
                                        }}>
                                            <TouchableOpacity onPress={() => orderlist(item.hellid)} >
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.customer_name}</Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image
                                                        style={{ width: 30, height: 30 }}
                                                        source={require('../src/assets/talking.png')}
                                                    />
                                                    <Text style={{ padding: 5 }}>{item.customer_contact_number}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image
                                                        style={{ width: 30, height: 30 }}
                                                        source={require('../src/assets/House.png')}
                                                    />
                                                    <Text style={{ padding: 5, textAlign: 'left', maxWidth: '95%' }}>{item.customer_address}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image
                                                        style={{ width: 30, height: 30 }}
                                                        source={require('../src/assets/read-with-hand.png')}
                                                    />
                                                    <Text style={{ padding: 5 }}>{item.service_name}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                                                        <Image
                                                            source={require('../src/assets/timeplay02.png')}
                                                            style={{ width: 30, height: 30, alignSelf: 'center' }}
                                                        />
                                                        <Text style={{ textAlign: 'left', paddingLeft: 5 }}>{Moment(item.expected_start_time, 'hh:mm a').format('hh:mm a')}</Text>
                                                    </View>
                                                    <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 15 }}>
                                                        {item.contractNumber &&
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Icon name="document-text-outline" size={25} color="#222323" />
                                                                <Text style={{ paddingLeft: 5 }}>{item.contractNumber}</Text>
                                                            </View>}
                                                        
                                                    </View>
                                                </View>
                                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                                                    {item.workstatus == 1 &&
                                                        <TouchableOpacity onPress={() => {
                                                            // orderlist(item.hellid)
                                                            // timer(item.hellid)
                                                            toggleAlert(!visibles, item.hellid)
                                                            setIsStopwatchStart(!isStopwatchStart)
                                                            // handleNotification(item)
                                                        }} style={{ backgroundColor: '#7700d4', borderRadius: 5, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Image
                                                                source={require('../src/assets/timeplay.png')}
                                                                style={{ width: 33, height: 35, alignSelf: 'center' }}
                                                            />
                                                            {/* <Text style={{ alignSelf: 'center', paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, color: '#fff', fontWeight: 'bold' }}>{Moment(item.expected_start_time, 'hh:mm a').format('hh:mm a')}</Text> */}
                                                            <Text style={{ alignSelf: 'center', paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Start</Text>

                                                        </TouchableOpacity>}
                                                    {item.workstatus == 2 &&
                                                        <TouchableOpacity onPress={() => {
                                                            // setIsStopwatchStart(!isStopwatchStart);
                                                            orderlist(item.hellid)
                                                            setResetStopwatch(false);

                                                        }} style={{ backgroundColor: '#7700D4', flexDirection: 'row', paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }}>
                                                            {/* <Image
                                                                style={{ width: 40, height: 40 }}
                                                                source={require('../src/assets/cancel-c.png')}
                                                            /> */}
                                                            {/* <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', paddingLeft: 5, fontSize: 18 }}>
                                                                <Stopwatch

                                                                    start={stopwatchdate}
                                                                    //To start
                                                                    reset={resetStopwatch}
                                                                    //To reset
                                                                    options={{ container: { alignItems: 'center' }, text: { color: '#fff' } }}
                                                                //options for the styling

                                                                />

                                                                {countUpTimer().displayhour}:{countUpTimer().displaymin}:{countUpTimer().displaysec}
                                                        </Text>*/}
                                                            <Text style={{ alignSelf: 'center', paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Stop</Text>
                                                        </TouchableOpacity>}
                                                    {item.workstatus == 1 &&
                                                        <View>
                                                            {item.executionPermission == '1' &&
                                                                <TouchableOpacity onPress={() => Visible(!isVisible, item.hellid, item.customer_name)}
                                                                    style={{ backgroundColor: '#ffbf00', borderRadius: 5, paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}>
                                                                    <Image
                                                                        source={require('../src/assets/time-right.png')}
                                                                        style={{ width: 30, height: 35, alignSelf: 'center' }}
                                                                    />

                                                                </TouchableOpacity>}
                                                        </View>
                                                    }
                                                    {item.workstatus == 1 &&
                                                        <View>
                                                            {item.executionPermission == '1' &&
                                                                <TouchableOpacity onPress={() => csl(!cnl, item.hellid, item.customer_name)}
                                                                    style={{ backgroundColor: '#ffbf00', borderRadius: 5, paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}>
                                                                    <Image
                                                                        source={require('../src/assets/time-cncl.png')}
                                                                        style={{ width: 33, height: 36, alignSelf: 'center' }}
                                                                    />

                                                                </TouchableOpacity>}
                                                        </View>
                                                    }
                                                </View>

                                            </TouchableOpacity>
                                        </View>}
                                </View>
                            }
                        />}

                    <FancyAlert
                        visible={visibles}
                        icon={<View style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 50,
                            width: '100%',
                        }}>
                            <Image
                                source={{ uri: log.company_logo }}
                                style={{ height: 60, width: 60, resizeMode: 'cover', borderRadius: 50 }}
                            />
                        </View>}
                        style={{ backgroundColor: 'white' }}
                    ><View>
                            <Text style={{ fontSize: 16, fontWeight: '400' }}>Do You Want To Start Work Order</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 40, paddingBottom: 20, alignContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { timer() }}
                                    style={{ backgroundColor: '#DEDEDE', paddingBottom: 10, paddingTop: 10, paddingLeft: 30, paddingRight: 30, borderRadius: 15 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '400' }}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => alert()}
                                    style={{ backgroundColor: '#DEDEDE', paddingBottom: 10, paddingTop: 10, paddingLeft: 20, paddingRight: 20, borderRadius: 15 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '400' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </FancyAlert>
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        // onPress={repress(item.hellid)}
                        visible={isVisible}
                        onRequestClose={() => GoBack()}
                    >
                        <SafeAreaView style={{ flex: 1, paddingTop: 25 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => GoBack()} style={{ alignSelf: 'center' }}>
                                    <Icon name="arrow-back" size={30} color="#6F00C5" />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10, maxWidth: '90%' }}>Reschedule for {names}</Text>

                            </View>
                            {/* <Calendar
                                                                            // Initially visible month. Default = Date()
                                                                            // current={''}
                                                                            // Handler which gets executed on day press. Default = undefined
                                                                            onDayPress={days => {
                                                                                setday(days)
                                                                                console.log('===', days)
                                                                            }}
                                                                            horizontal={true}
                                                                            pagingEnabled={true}
                                                                            scrollEnabled={true}
                                                                            showScrollIndicator={true}
                                                                            enableSwipeMonths={true}
                                                                            // theme={{selectedDayBackgroundColor: '#00adf5',selectedDayTextColor: '#ffffff',textSectionTitleColor: '#b6c1cd',}}
                                                                            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                                                                            firstDay={1}
                                                                        /> */}
                            <CalendarPicker
                                onDateChange={days => {
                                    setday(days)
                                    console.log('===', days)
                                }}
                                minDate={minDate}
                            />
                            <View style={{ padding: 10 }}>
                                <View style={{ backgroundColor: '#D3D3D3', borderRadius: 30, height: 50, paddingLeft: 15, paddingTop: 5 }}>
                                    <SectionedMultiSelect                        // THIS PACKAGE FOR SELECT MULTIPLE MEMBERSHIP
                                        items={res}
                                        displayKey="description"
                                        IconRenderer={Icons}
                                        uniqueKey="rescheduleid"
                                        single={true}
                                        // subKey="children"
                                        selectText="Reshedule Reason"
                                        searchPlaceholderText='Select Reasons'

                                        selectedItems={resion}
                                        onSelectedItemsChange={onSelectedSports}
                                        styles={{ selectToggle: { fontSize: 16, padding: 10 }, chipsWrapper: { padding: 10 } }}
                                    />
                                </View>
                            </View>
                            <View
                                style={{ justifyContent: 'center', padding: 10, marginTop: '30%' }}>
                                <TouchableOpacity onPress={() => Reschedule()}
                                    style={{ borderWidth: .5, borderColor: '#343a40', margin: 5, backgroundColor: '#7700D4', borderRadius: 50, height: 50 }}>
                                    <Text style={{ color: '#fff', fontSize: 16, padding: 15, textAlign: 'center', fontWeight: 'bold' }}>Reschedule</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => GoBack()} style={{ margin: 5, marginTop: 20 }}>
                                    <Text style={{ color: '#000', fontSize: 16, padding: 10, textAlign: 'center' }}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>


                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        // onPress={repress(item.hellid)}
                        visible={cnl}
                        onRequestClose={() => back()}>
                        <SafeAreaView style={{ flex: 1, padding: 15 }}>
                            <View style={{ flexDirection: 'row', paddingBottom: 20, maxWidth: '90%' }}>
                                <TouchableOpacity onPress={() => back()} style={{ alignSelf: 'center' }}>
                                    <Icon name="arrow-back" size={30} color="#6F00C5" />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10 }}>Cancellations for {names}</Text>
                            </View>
                            {/* <TextInput
                                                            style={{ borderWidth: 1, height: 100, padding: 5 }}
                                                            placeholder='Reason for Cancellations'
                                                            multiline={true}
                                                            numberOfLines={4}
                                                            textAlignVertical="top"
                                                            maxLength={350}
                                                        /> */}
                            <View style={{ backgroundColor: '#D3D3D3', borderRadius: 30, height: 50, paddingLeft: 15, paddingTop: 5 }}>
                                <SectionedMultiSelect                        // THIS PACKAGE FOR SELECT MULTIPLE MEMBERSHIP
                                    items={can}
                                    displayKey="description"
                                    IconRenderer={Icons}
                                    uniqueKey="cancelid"
                                    single={true}
                                    // subKey="children"
                                    selectText="Cancellations Reason"
                                    searchPlaceholderText='Select Reasons'

                                    selectedItems={cnlresion}
                                    onSelectedItemsChange={onCancel}
                                    styles={{ selectToggle: { fontSize: 16, padding: 10 }, chipsWrapper: { padding: 10 } }}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', padding: 10, paddingTop: 20, height: windowHeight / 0.8 }}>
                                <TouchableOpacity onPress={() => Cancel()}
                                    style={{ borderWidth: .5, borderColor: '#343a40', margin: 5, backgroundColor: '#7700D4', borderRadius: 50, width: windowWidth / 1.2, }}>
                                    <Text style={{ color: '#fff', fontSize: 16, padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => back()} style={{ margin: 5, }}>
                                    <Text style={{ color: '#000', fontSize: 16, padding: 10, textAlign: 'center' }}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>

                    {nextevent == true &&
                        <FlatList
                            data={oder}  // GET DASHBOARD DATA  FROM API
                            keyExtractor={(item) => item.key}
                            ListEmptyComponent={EmptyListMessage}
                            renderItem={({ item, index }) =>
                                <View>
                                    {status.includes(item.workstatus) &&
                                        <View style={{
                                            padding: 15, backgroundColor: '#fff', borderRadius: 30, margin: 5, shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,
                                        }}>
                                            <TouchableOpacity onPress={() => orderlist(item.hellid)} >
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.customer_name}</Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image
                                                        style={{ width: 30, height: 30 }}
                                                        source={require('../src/assets/talking.png')}
                                                    />
                                                    <Text style={{ padding: 5 }}>{item.customer_contact_number}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image
                                                        style={{ width: 30, height: 30 }}
                                                        source={require('../src/assets/House.png')}
                                                    />
                                                    <Text style={{ padding: 5 }}>{item.customer_address}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image
                                                        style={{ width: 30, height: 30 }}
                                                        source={require('../src/assets/read-with-hand.png')}
                                                    />
                                                    <Text style={{ padding: 5 }}>{item.service_name}</Text>
                                                </View>
                                                {item.contractNumber &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                        {/* <Icon name="document-text-outline" size={28} color="#000" />
                                                        <Text style={{ padding: 5 }}>{item.contractNumber}</Text> */}
                                                    </View>}
                                                {!item.contractNumber &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Icon name="document-text-outline" size={28} color="#000" />
                                                        <Text style={{ padding: 5 }}>{item.contractNumber}</Text>
                                                    </View>
                                                }

                                                {/* <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                                            <TouchableOpacity onPress={() => timer()} style={{ backgroundColor: '#7700d4', borderRadius: 5, paddingLeft: 10, paddingRight: 10, paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                                                <Image
                                                    source={require('../assets/timeplay.png')}
                                                    style={{ width: 30, height: 30, alignSelf: 'center' }}
                                                />
                                                <Text style={{ alignSelf: 'center', paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, color: '#fff', fontWeight: 'bold' }}>{Moment(item.actual_start_time,'hh:mm a').format('hh:mm a')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => Visible(!isVisible)}
                                                style={{ backgroundColor: '#ffbf00', borderRadius: 5, paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}>
                                                <Image
                                                    source={require('../assets/time-right.png')}
                                                    style={{ width: 30, height: 35, alignSelf: 'center' }}
                                                />
                                                <Modal
                                                    animationType={"slide"}
                                                    transparent={false}
                                                    onPress={repress(item.id)}
                                                    visible={isVisible}
                                                    onRequestClose={() => GoBack()}>
                                                    <View style={{ flex: 1, paddingTop: 25 }}>
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10 }}>Reschedule for {item.customer_name}</Text>
                                                        <Calendar
                                                            // Initially visible month. Default = Date()
                                                            current={''}
                                                            // Handler which gets executed on day press. Default = undefined
                                                            onDayPress={days => {
                                                                setday(days)
                                                                console.log('===', days)
                                                            }}
                                                            horizontal={true}
                                                            pagingEnabled={true}
                                                            scrollEnabled={true}
                                                            showScrollIndicator={true}
                                                            enableSwipeMonths={true}
                                                            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                                                            firstDay={1}
                                                        />
                                                        <TextInput
                                                            style={{ borderWidth: .5, height: 150 }}
                                                            onChangeText={re => setre(re)}
                                                            placeholder='Reason for Reschedule'
                                                            multiline={true}
                                                            numberOfLines={4}
                                                            textAlignVertical="top"
                                                            maxLength={350}
                                                            value={re}
                                                        />
                                                        <View
                                                            style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                                                            <TouchableOpacity onPress={() => Reschedule()}
                                                                style={{ borderWidth: .5, borderColor: '#343a40', margin: 5 }}>
                                                                <Text style={{ color: '#343a40', fontSize: 16, padding: 10 }}>Reschedule</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{ borderWidth: .5, borderColor: '#343a40', margin: 5 }}>
                                                                <Text style={{ color: '#343a40', fontSize: 16, padding: 10 }}>Close</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </Modal>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => csl(!cnl)}
                                                style={{ backgroundColor: '#ffbf00', borderRadius: 5, paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}>
                                                <Image
                                                    source={require('../assets/time-cncl.png')}
                                                    style={{ width: 30, height: 35, alignSelf: 'center' }}
                                                />
                                                <Modal
                                                    animationType={"slide"}
                                                    transparent={false}
                                                    onPress={repress(item.id)}
                                                    visible={cnl}
                                                    onRequestClose={() => back()}>
                                                    <View style={{ flex: 1, padding: 15 }}>
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10 }}>Cancellations for {item.customer_name}</Text>
                                                        <TextInput
                                                            style={{ borderWidth: 1, height: 100, padding: 5 }}
                                                            placeholder='Reason for Cancellations'
                                                            multiline={true}
                                                            numberOfLines={4}
                                                            textAlignVertical="top"
                                                            maxLength={350}
                                                        />
                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                                                            <TouchableOpacity onPress={() => Cancel()}
                                                                style={{ borderWidth: .5, borderColor: '#343a40', margin: 5 }}>
                                                                <Text style={{ color: '#343a40', fontSize: 16, padding: 10 }}>Submit</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{ borderWidth: .5, borderColor: '#343a40', margin: 5 }}>
                                                                <Text style={{ color: '#343a40', fontSize: 16, padding: 10 }}>Close</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </Modal>
                                            </TouchableOpacity>
                                        </View> */}
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            }
                        />}
                </View>
            </ScrollView>
            <View style={{ justifyContent: 'space-between', backgroundColor: '#fff', }}>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}
                    horizontal={true}
                    data={bottomtab}    // CALL BACK FUNCTIONS FOR BOTTOM TAB
                    keyExtractor={(item) => item.key}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity
                            onPress={() => SelectTab(item, index)}     // CALL BACK FUNCTION FOR SELECT BOTTOM TAB ICONS
                            style={{ flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 50, paddingLeft: 20, paddingRight: 20, paddingBottom: 20, margin: 10 }}>
                            <Icon name={item.iconName} size={20} color={"#000"} />

                        </TouchableOpacity>
                    }
                />
            </View>

        </SafeAreaView>
    )
}

export default Dashboard;