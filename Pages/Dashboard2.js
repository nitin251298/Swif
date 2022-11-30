import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert, ScrollView, Modal, TextInput, SafeAreaView, BackHandler, RefreshControl, DevSettings } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import CalendarStrip from 'react-native-calendar-strip';
// import { Calendar } from 'react-native-calendars';
import { Id } from '../src/ReduxFloder/action';
import Icon from 'react-native-vector-icons/Ionicons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import { Stopwatch } from 'react-native-stopwatch-timer';
import CalendarPicker from 'react-native-calendar-picker';
import AnimateNumber from 'react-native-countup'
// import PushNotification from "react-native-push-notification";
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import InternetConnectionAlert from "react-native-internet-connection-alert";
import Loading from './Loading';
import Sync from './Sync';
import NetInfo from "@react-native-community/netinfo";

const db = SQLite.openDatabase('SwifDb');


const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

let bottomtab = [
    {
        key: 1,
        iconName: 'home-outline'
    },
    // {
    //     key: 2,
    //     iconName: 'list'
    // },
    // {
    //     key: 3,
    //     iconName: 'notifications-outline'
    // },
    {
        key: 4,
        iconName: 'person-outline'
    }
]

const Dashboard2 = ({ navigation }) => {
    const dispatch = useDispatch();

    const [workdata, setWorkdata] = useState([])
    const [logindata, setLoginData] = useState([]);
    const list = useSelector(state => state.list)
    const [PendingCount, setPendingCount] = useState(0)
    const [CancelCount, setCancelCount] = useState(0)
    const [CompleteCount, setCompleteCount] = useState(0)
    const [TotalCount, setTotalCount] = useState(0)
    const [status, setStatus] = useState([1, 2, 6, 7]);
    const [loading, setloading] = useState(false)
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
        //Don't use at home
        // let yo = 0;
        // const interval = setInterval(() => {
        //     clearInterval(interval);
        //     console.log('This will run every second!');
        //     if(yo < 10){
        //         clearInterval(interval);
        //     }
        //     yo++;
        //   }, 1000);
        // DevSettings.reload();

        setloading(true)

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
                        setloading(true)
                        let workstatus = result.rows._array[i].workstatus;
                        if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {
                            setloading(true)
                            Pendingcount += 1;
                            console.log(Pendingcount);
                            setloading(false)
                        }
                        if (workstatus == 5) {
                            setloading(true)
                            Cancelcount += 1;
                            console.log(Cancelcount);
                            setloading(false)
                        }
                        if (workstatus == 3) {
                            setloading(true)
                            Completecount += 1;
                            console.log(Completecount);
                            setloading(false)
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
                    console.log("canel" + JSON.stringify(results));
                    CANCEL(results.rows._array)
                }
            );
        });
        setloading(false)

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

        // console.log("boi");
        // refreshPage();

    }, [])
    // function refreshPage() {
    //     window.location.reload(false);
    //   }

    const Request = () => {
        NetInfo.addEventListener(networkState => {
            if (networkState.isConnected) {
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
                                        // alert("booo")
                                        // Request(result.rows._array);
                                        // let query = "SELECT workorderid AS workorderId,id AS item_id,quantity, amount AS price  FROM adhocitems WHERE Modification=1"         

                                        db.transaction((txp) => {
                                            txp.executeSql(
                                                "SELECT commenter_id AS worker_id, workorder_id AS workorderId, description FROM comment WHERE Modification=1",
                                                [],
                                                (tx, result1) => {
                                                    console.warn("Comment: ", result1.rows._array);

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

                                                                            let bodyFormData = { 'workorder': JSON.stringify(result.rows._array), 'task': JSON.stringify(result2.rows._array), 'addhoc': JSON.stringify(result3.rows._array), 'comment': JSON.stringify(result1.rows._array), 'WorkorderImage': "[]", 'lastUpdatationDate': null }
                                                                            console.log(bodyFormData);
                                                                            axios({
                                                                                method: 'POST',
                                                                                url: 'https://swif.cloud/api/swif-sink',
                                                                                data: bodyFormData,
                                                                                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': token }
                                                                            }).then(({ data, status }) => {
                                                                                console.log(data);
                                                                                // alert(JOSN.stringify(data))
                                                                                db.transaction((tx) => {
                                                                                    tx.executeSql('DROP TABLE IF EXISTS cancel', [])
                                                                                    tx.executeSql('DROP TABLE IF EXISTS reschedule', [])
                                                                                    tx.executeSql('DROP TABLE IF EXISTS hell', [])
                                                                                    tx.executeSql('DROP TABLE IF EXISTS item', [])
                                                                                    tx.executeSql('DROP TABLE IF EXISTS task', [])
                                                                                    tx.executeSql('DROP TABLE IF EXISTS adhocitems', [])
                                                                                    tx.executeSql('DROP TABLE IF EXISTS comment', [])
                                                                                    tx.executeSql('DROP TABLE IF EXISTS details',
                                                                                        [], (tx, result) => {
                                                                                            DETAIL(data.details);
                                                                                            ADHOCITEM(data.details);
                                                                                            HELL(data.list);
                                                                                            USER(data.worker);
                                                                                            CNL(data.CancelReason);
                                                                                            RESch(data.resheduleReason);
                                                                                            ADHOC(data.item);
                                                                                            TASK(data.details);
                                                                                            COMMENT(data.comment);
                                                                                        });
                                                                                })

                                                                            }).catch(error => {
                                                                                // alert(JOSN.stringify(error))
                                                                                console.log("boooooooooooooooo", error.response.data);
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
        })
    }

    const USER = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS user', []);
                        txn.executeSql(
                            "CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT,userid INT(9) NOT NULL, name VARCHAR(30) NOT NULL, contact INT(15) NOT NULL,username VARCHAR(25) NOT NULL, address VARCHAR(85) NOT NULL, company_logo VARCHAR(55) NOT NULL, email VARCHAR(25) NOT NULL, gender VARCHAR(25) NOT NULL, profile_image VARCHAR(55) NOT NULL, token VARCHAR(200) NOT NULL, Modification INT(5) NOT NULL)",
                            [],
                        );
                    }
                    ("User Table created")
                    insertData(data)
                }
            );
        })
    }

    const HELL = (data) => {
        db.transaction(function (txn) {
            txn.executeSql('DROP TABLE IF EXISTS hell', []);
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='hell'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql(
                            "CREATE TABLE hell (hellid INT(9) NOT NULL, customer_contact_number VARCHAR(255) NOT NULL, block VARCHAR(85), contractNumber VARCHAR(255),country VARCHAR(25), customer_address TEXT, customer_name VARCHAR(255), option_name TEXT, option_price INT(12), service_name TEXT, street VARCHAR(50), unit VARCHAR(20), workstatus INT(5), workstatusname VARCHAR(20), zip INT(9), zone VARCHAR(50), type INT(9), reasonid INT(9), date VARCHAR(50), Modification INT(5),expected_start_date VARCHAR(50), expected_start_time VARCHAR(50), expected_end_time VARCHAR(50), actual_start_date VARCHAR(50), actual_start_time VARCHAR(50),actual_end_time VARCHAR(50), signature VARCHAR(255))",
                            [],
                        );
                    }
                    db.transaction(function (txt) {
                        txt.executeSql('DELETE FROM hell', []);
                        data.forEach(element => {
                            console.log('====================================');
                            console.log(element);
                            console.log('====================================');
                            if (element.contractNumber) {
                                console.log(element.contractNumber);
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
                            return;
                            console.log(element.actual_end_time);

                        });
                    })
                }
            );
        })
    }

    const CNL = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='cancel'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS cancel', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS cancel (id INTEGER PRIMARY KEY AUTOINCREMENT, cancelid INT(9) NOT NULL, company_id INT(9) NOT NULL,description VARCHAR(250) NOT NULL, title VARCHAR(250) NOT NULL, Modification INTEGER DEFAULT 0 NOT NULL)',
                            []
                        );
                    }
                    setTimeout(() => {
                        ("Cancel Table created")
                    }, 4000)
                    cancelData(data)
                }
            );
            txn.executeSql('DELETE FROM cancel', []);
        })
    }

    const RESch = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='reschedule'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS reschedule', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS reschedule (id INTEGER PRIMARY KEY AUTOINCREMENT, rescheduleid INT(9) NOT NULL, company_id INT(9) NOT NULL,description VARCHAR(250) NOT NULL, title VARCHAR(250) NOT NULL, Modification INTEGER DEFAULT 0 NOT NULL)',
                            []
                        );
                    }
                    setTimeout(() => {
                        ("Reschedule Table created")
                    }, 6000)
                    reschedulData(data)
                }
            );
            txn.executeSql('DELETE FROM reschedule', []);
        })
    }

    const ADHOC = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='item'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS item', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS item (id INT(9), category_id INT(12), price INT(15), name VARCHAR(255))',
                            []
                        );
                        txn.executeSql('DELETE FROM item', []);
                    }
                    data.forEach(element => {

                        db.transaction(function (tx) {
                            tx.executeSql(
                                'INSERT INTO item (id, category_id, price, name) VALUES (?, ?, ?, ?)',
                                [element.id, element.category_id, element.price, element.name],
                                (tx, results) => {
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            'SELECT * FROM item',
                                            [],
                                            (tx, result) => {
                                                console.log("adhoc", JSON.stringify(result));
                                            }
                                        );
                                    });
                                }
                            );
                        });
                    });
                }
            );
        })
    }

    const TASK = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='task'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS task', []);
                        txn.executeSql(
                            "CREATE TABLE task (id INT(9), amount INT(15),price INT(15), checked VARCHAR(50), item VARCHAR(255), name VARCHAR(255), quantity INT(15), remarks VARCHAR(255), workorderid INT(12), Modification INT(5))",
                            [],
                        );
                        txn.executeSql('DELETE FROM task', []);
                    }
                    data.forEach(element => {
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
                    });
                }
            );
        })
    }

    const ADHOCITEM = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='adhocitems'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS adhocitems', []);
                        txn.executeSql(
                            "CREATE TABLE adhocitems (id INT(9), amount INT(15), checked INT(5), item VARCHAR(255), name VARCHAR(255), quantity INT(15), remarks VARCHAR(255), workorderid INT(12), Modification INT(5), category_id INT(9))",
                            [],
                        );
                    }
                    data.forEach(element => {
                        if (element.ad_hoc_items.length > 0) {

                            element.ad_hoc_items.forEach(ele => {

                                db.transaction(function (tx) {
                                    tx.executeSql(
                                        'INSERT INTO adhocitems (id, amount, checked, item, name, quantity, remarks, workorderid, Modification, category_id) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?)',
                                        [ele.id, ele.amount, ele.checked, ele.item, ele.name, ele.quantity, ele.remarks, element.id, 0, ele.category_id],
                                        (tx, results) => {
                                            db.transaction((tx) => {
                                                tx.executeSql(
                                                    'SELECT * FROM adhocitems',
                                                    [],
                                                    (tx, result) => {
                                                        console.warn("adhocitems", JSON.stringify(result));
                                                    }
                                                );
                                            });
                                        }
                                    );
                                });
                            });
                        }
                    });
                }
            );
        })
    }

    const DETAIL = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='details'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS details', []);
                        txn.executeSql(
                            "CREATE TABLE details (id INT(15), adjustment_type VARCHAR(50), adjustment_value VARCHAR(50), block VARCHAR(50), companytax INT(15), contractNumber VARCHAR(50), customer_contact_number INT(15), customer_name VARCHAR(255), discount_type VARCHAR(50), discount_value VARCHAR(50), option_name VARCHAR(50), option_price INT(15), service_id INT(15), service_name VARCHAR(255), status INT(15),  street VARCHAR(50), unit VARCHAR(50), workstatusname VARCHAR(50), zip INT(15), zone VARCHAR(50), ad_hoc_catid VARCHAR(255), ad_hoc_items VARCHAR(255), gallery VARCHAR(255), task_list VARCHAR(255), workordercommentlist VARCHAR(255), type INT(9), reasonid INT(9), date VARCHAR(50),expected_start_time VARCHAR(50), expected_end_time VARCHAR(50), actual_start_time VARCHAR(50),actual_end_time VARCHAR(50), expected_start_date VARCHAR(50), Modification INT(9))",
                            [],
                        );
                    }
                    data.forEach(element => {
                        db.transaction(function (tx) {
                            tx.executeSql(
                                'INSERT INTO details (id, adjustment_type, adjustment_value, block, companytax, contractNumber, customer_contact_number, customer_name, discount_type, discount_value, option_name, option_price, service_id, service_name, status, street, unit, workstatusname, zip, zone, ad_hoc_catid, ad_hoc_items, gallery, task_list, workordercommentlist, type, reasonid, date, expected_start_time, expected_end_time, actual_start_time, actual_end_time,expected_start_date, Modification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                [element.id, element.adjustment_type, element.adjustment_value, element.block, element.companytax, element.contractNumber, element.customer_contact_number, element.customer_name, element.discount_type, element.discount_value, element.option_name, element.option_price, element.service_id, element.service_name, element.status, element.street, element.unit, element.workstatusname, element.zip, element.zone, JSON.stringify(element.ad_hoc_catid), JSON.stringify(element.ad_hoc_items), JSON.stringify(element.gallery), JSON.stringify(element.task_list), JSON.stringify(element.workordercommentlist), 0, 0, "null", "" + element.actual_start_time + "", "" + element.actual_end_time + "", "" + element.ground_start_time + "", "" + element.ground_end_time + "", "" + element.start_date + "", 0],
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
                }
            );
        })
    }

    const COMMENT = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='comment'",
                [],
                function (txn, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS comment', []);
                        txn.executeSql(
                            "CREATE TABLE comment (id INTEGER PRIMARY KEY AUTOINCREMENT, comment_id INT(11), commenter_type VARCHAR(25), commenter VARCHAR(25), commenter_id INT(11), description TEXT, workorder_id INT(15), created TEXT, Modification INT(9))",
                            [],
                        );
                    }
                    data.forEach(element => {
                        element.forEach(ele => {
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    "INSERT INTO comment (comment_id, commenter_type, commenter, commenter_id, description, workorder_id, created,Modification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                                    [ele.id, ele.commenter_type, ele.commenter, ele.commenter_id, ele.description, ele.workorder_id, ele.created, 0],
                                    (tx, results) => {
                                        db.transaction((tx) => {
                                            tx.executeSql(
                                                'SELECT * FROM comment',
                                                [],
                                                (tx, result) => {
                                                    console.error("comment", JSON.stringify(result));
                                                }
                                            );
                                        });
                                    }
                                )
                            })
                        });

                    });
                }
            );
        })
    }


    const insertData = (response) => {
        // console.log(response);
        if (response) {

            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO user (userid, name, contact, username, address, company_logo, email, gender, profile_image, token,Modification) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                    [response.id, response.name, response.contact, response.username, response.address, response.company_logo, response.email, response.gender, response.profile_image, response.token, 0],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                ("User Data inserted")
                            }, 10000)
                        } else {
                            alert('User Data Failed....');
                            navigation.navigate('FirstPage')
                        }
                    }
                );
            });
            viewUser();
        }
    }



    const statusData = (value) => {
        value.forEach(element => {
            // console.log(element);
            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO status (id, name) VALUES (?,?)',
                    [element.id, element.name],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                ("Status Data inserted")
                            }, 16000)
                            // alert('Work Order Staus Inserted Successfully....');
                        } else {
                            alert('Failed....');
                            navigation.navigate('FirstPage')
                        }
                    }
                );
            });
        });
        statusWO();
    }



    const cancelData = (can) => {
        can.forEach(element => {

            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO cancel (cancelid, company_id, description, title) VALUES (?,?,?,?)',
                    [element.id, element.company_id, element.description, element.title],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                ("Cancel Data inserted")
                            }, 18000)
                            // alert('Cancel Resaon Data Inserted Successfully....');
                        } else {
                            alert('Failed....');
                            navigation.navigate('FirstPage')
                        }
                    }
                );
            });
        });
        cancelView();

    }


    const reschedulData = (reschedul) => {
        reschedul.forEach(element => {
            console.log(element);

            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO reschedule (rescheduleid, company_id, description, title) VALUES (?,?,?,?)',
                    [element.id, element.company_id, element.description, element.title],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                ("Reschedule Data inserted")
                            }, 20000)
                            // alert('Reschedule Data Inserted Successfully....');
                        } else {
                            alert('Failed....');
                            navigation.navigate('FirstPage')
                        }
                    }
                );
            });
        })
        reschedulView();

    }

    const viewUser = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user',
                [],
                (tx, results) => {
                    console.warn("USER:" + JSON.stringify(results));
                }
            );
        });
    }
    const statusWO = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM status',
                [],
                (tx, results) => {
                    console.log("Status:" + JSON.stringify(results));
                }
            );
        });
    }

    const cancelView = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cancel',
                [],
                (tx, results) => {
                    console.log("canel" + JSON.stringify(results));
                }
            );
        });

    }

    const reschedulView = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM reschedule   ',
                [],
                (tx, results) => {
                    console.log("reschedule" + JSON.stringify(results));
                }
            );
        });

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
    const CANCEL = (value) => {
        setcan(value)
        console.log("can", can);
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
                            setloading(true)
                            let workstatus = result.rows._array[i].workstatus;
                            if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {
                                setloading(true)
                                Pendingcount += 1;
                                console.log(Pendingcount);
                                setloading(false)
                            }
                            if (workstatus == 5) {
                                setloading(true)
                                Cancelcount += 1;
                                console.log(Cancelcount);
                                setloading(false)
                            }
                            if (workstatus == 3) {
                                setloading(true)
                                Completecount += 1;
                                console.log(Completecount);
                                setloading(false)
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
        }
        // if (index === 1) {
        //     navigation.navigate('HistroyPage')
        // }
        // if (index === 1) {
        //     navigation.navigate('Notification')
        // }
        if (index === 1) {
            navigation.navigate('Profile')
        }
    }

    const pend = () => {
        setStatus([1, 2, 6, 7]);
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

    const Visible = (isVisible) => {
        visible(isVisible)
    }
    const csl = (cnl) => {
        setcnl(cnl)
    }

    const GoBack = () => visible(false);
    const back = () => setcnl(false);
    const repress = (id) => {
        setreid(id)
    }

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

    const toggleAlert = (visibles) => {
        setVisibles(visibles)
    }

    const alter = () => setVisibles(false)

    const reshedule = (token) => {

    }

    const orderlist = (item) => {
        console.log(item);
        dispatch(Id(item))
        navigation.navigate('Orderlist')
    }

    const Reschedule = (id) => {
        if (days === "") {
            alert('Please Select Date')
            return false
        }
        if (resion === "") {
            alert('Please Select Reason')
            return false
        }
        const redate = Moment(days, 'YYYY DD MM').format('YYYY-DD-MM');
        const type = 2 // ! = cancel ; 2 = Reschedule;
        var reasonid = resion;
        const data = [type, reasonid[0]];
        console.log(data);

        var query1 = "UPDATE hell SET type=" + type + ", reasonid=" + reasonid + ", date='" + redate + "', workstatus=" + 4 + ", workstatusname='Rescheduled', Modification=1 WHERE hellid=" + id;
        var query2 = "UPDATE details SET workstatusname='Rescheduled', Modification=1 WHERE id=" + id;

        console.log(query1, query2);

        console.log("booo", id);
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
                                Request()
                            }
                        );
                    });
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
                                    setloading(true)
                                    let workstatus = result.rows._array[i].workstatus;
                                    if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {
                                        setloading(true)
                                        Pendingcount += 1;
                                        console.log(Pendingcount);
                                        setloading(false)
                                    }
                                    if (workstatus == 5) {
                                        setloading(true)
                                        Cancelcount += 1;
                                        console.log(Cancelcount);
                                        setloading(false)
                                    }
                                    if (workstatus == 3) {
                                        setloading(true)
                                        Completecount += 1;
                                        console.log(Completecount);
                                        setloading(false)
                                    }
                                }
                                if (nextevent == false) {
                                    setPendingCount(Pendingcount);
                                    setCancelCount(Cancelcount);
                                    setCompleteCount(Completecount);
                                    setTotalCount(result.rows._array.length)
                                }
                                alter("Requested for Reschedule WorkOrder has been Sent Sucessfully To The Admin")
                                Request()
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
        if (cnlresion === "") {
            alert('Please Select Reason')
        }
        const type = 1 // ! = cancel ; 2 = Reschedule;
        var reasonid = cnlresion;
        const data = [type, reasonid[0]];
        console.log(data);

        var query1 = "UPDATE hell SET type=" + type + ", reasonid=" + reasonid + ", workstatus=" + 5 + ", workstatusname='Cancelled', Modification=1 WHERE hellid=" + id;
        var query2 = "UPDATE details SET workstatusname='Cancelled', Modification=1 WHERE id=" + id;

        console.log(query1, query2);


        console.log("booo", id);
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
                                Request()
                            }
                        );
                    });
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
                                    setloading(true)
                                    let workstatus = result.rows._array[i].workstatus;
                                    if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {
                                        setloading(true)
                                        Pendingcount += 1;
                                        console.log(Pendingcount);
                                        setloading(false)
                                    }
                                    if (workstatus == 5) {
                                        setloading(true)
                                        Cancelcount += 1;
                                        console.log(Cancelcount);
                                        setloading(false)
                                    }
                                    if (workstatus == 3) {
                                        setloading(true)
                                        Completecount += 1;
                                        console.log(Completecount);
                                        setloading(false)
                                    }
                                }
                                if (nextevent == false) {
                                    setPendingCount(Pendingcount);
                                    setCancelCount(Cancelcount);
                                    setCompleteCount(Completecount);
                                    setTotalCount(result.rows._array.length)
                                }
                                alter("Requested for Cancel WorkOrder has been Sent Sucessfully To The Admin")
                                Request()
                                setcnl(false)
                            }
                        );
                    });
                }
            );
        });
        console.log("booo", "end");

    }

    const timer = (id) => {
        var start_time = hours + ':' + min + ':' + sec
        var start_date = Moment().format('YYYY-MM-DD');


        if (!start_time) {
            alert('Try Again Please')
        }
        var data = [id, start_date, start_time]
        var query1 = "UPDATE hell SET actual_start_date='" + start_date + "', actual_start_time='" + start_time + "', workstatus=" + 2 + ", workstatusname='In Progress', Modification=1 WHERE hellid=" + id;
        var query2 = "UPDATE details SET actual_start_time='" + start_time + "', status=" + 2 + ", workstatusname='In Progress', Modification=1 WHERE id=" + id;
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
                                        'SELECT * FROM hell WHERE hellid=' + id,
                                        [],
                                        (tx, result) => {
                                            console.log("hell:" + JSON.stringify(result));
                                            setting(result.rows._array)
                                            alter("Work order Start")
                                            Request()
                                            // setcnl(false)
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
                        setloading(true)
                        let workstatus = result.rows._array[i].workstatus;
                        if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {
                            setloading(true)
                            Pendingcount += 1;
                            console.log(Pendingcount);
                            setloading(false)
                        }
                        if (workstatus == 5) {
                            setloading(true)
                            Cancelcount += 1;
                            console.log(Cancelcount);
                            setloading(false)
                        }
                        if (workstatus == 3) {
                            setloading(true)
                            Completecount += 1;
                            console.log(Completecount);
                            setloading(false)
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
                                    setloading(true)
                                    let workstatus = result.rows._array[i].workstatus;
                                    if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {
                                        setloading(true)
                                        Pendingcount += 1;
                                        console.log(Pendingcount);
                                        setloading(false)
                                    }
                                    if (workstatus == 5) {
                                        setloading(true)
                                        Cancelcount += 1;
                                        console.log(Cancelcount);
                                        setloading(false)
                                    }
                                    if (workstatus == 3) {
                                        setloading(true)
                                        Completecount += 1;
                                        console.log(Completecount);
                                        setloading(false)
                                    }
                                }
                            }
                            setPendingCount(Pendingcount);
                            setCancelCount(Cancelcount);
                            setCompleteCount(Completecount);
                            setTotalCount(result.rows._array.length)
                        } else {
                            // var b = cdate.toISOString().split('T')[0];
                            // console.log("boooooooooooo", b);
                            // var changeday = b.split('-')[2];
                            // var changemonth = b.split('-')[1];
                            // var changeyear = b.split('-')[0];
                            // // console.log(todaydate, todaymonth, todayyear);
                            // console.log(changeday, changemonth, changeyear);


                            setloading(true)
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
                                            // alert("Something went wrong.We prefer to Login again.");
                                        }
                                        setloading(false)
                                    }).catch(error => {
                                        // alert("Something went wrong.Please check your internet connection");
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
                                setloading(true)
                                let workstatus = result.rows._array[i].workstatus;
                                if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {
                                    setloading(true)
                                    Pendingcount += 1;
                                    console.log(Pendingcount);
                                    setloading(false)
                                }
                                if (workstatus == 5) {
                                    setloading(true)
                                    Cancelcount += 1;
                                    console.log(Cancelcount);
                                    setloading(false)
                                }
                                if (workstatus == 3) {
                                    setloading(true)
                                    Completecount += 1;
                                    console.log(Completecount);
                                    setloading(false)
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
    const onRefresh = React.useCallback(() => {
        310
        Request()

        setRefreshing(true);
        wait(2000).then((

        ) => setRefreshing(false)
        );

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
                        setloading(true)
                        let workstatus = result.rows._array[i].workstatus;
                        if (workstatus == 1 || workstatus == 2 || workstatus == 6 || workstatus == 7) {
                            setloading(true)
                            Pendingcount += 1;
                            console.log(Pendingcount);
                            setloading(false)
                        }
                        if (workstatus == 5) {
                            setloading(true)
                            Cancelcount += 1;
                            console.log(Cancelcount);
                            setloading(false)
                        }
                        if (workstatus == 3) {
                            setloading(true)
                            Completecount += 1;
                            console.log(Completecount);
                            setloading(false)
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
    })

    // const startdate = Moment().format('DD')





    return (
        <SafeAreaView style={{ flex: 1 }}>
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
            </View>
            <View style={{ backgroundColor: '#F0F0F0', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 10, backfaceVisibility: 'visible' }}>
                <Text style={{ textAlign: 'center', fontSize: 30, color: '#7C7C7C', fontWeight: '100', fontFamily: 'Roboto', }}>Your Work Orders For</Text>
                <View style={{
                    borderRadius: 15, backgroundColor: '#fff', shadowColor: "#000", height: 140, marginBottom: 50,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 3.5, zIndex: -99999999, position: 'relative', backfaceVisibility: 'hidden'
                }}>

                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between', padding: 15, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 3.5, borderRadius: 15, backgroundColor: '#fff'
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
                    </View>

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
            {loading ? <Loading showloading={loading} /> : null}
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                backgroundColor='#ECECEC'
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                                                    {item.workstatus == 1 &&
                                                        <TouchableOpacity onPress={() => {
                                                            // timer(item.id)
                                                            toggleAlert(!visibles)
                                                            setIsStopwatchStart(!isStopwatchStart)
                                                            // handleNotification(item)
                                                        }} style={{ backgroundColor: '#7700d4', borderRadius: 5, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Image
                                                                source={require('../src/assets/timeplay.png')}
                                                                style={{ width: 33, height: 35, alignSelf: 'center' }}
                                                            />
                                                            <Text style={{ alignSelf: 'center', paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, color: '#fff', fontWeight: 'bold' }}>{Moment(item.expected_start_time, 'hh:mm a').format('hh:mm a')}</Text>
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
                                                                        <TouchableOpacity onPress={() => { timer(item.hellid) }}
                                                                            style={{ backgroundColor: '#DEDEDE', paddingBottom: 10, paddingTop: 10, paddingLeft: 30, paddingRight: 30, borderRadius: 15 }}>
                                                                            <Text style={{ fontSize: 16, fontWeight: '400' }}>Yes</Text>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity onPress={() => alter()}
                                                                            style={{ backgroundColor: '#DEDEDE', paddingBottom: 10, paddingTop: 10, paddingLeft: 20, paddingRight: 20, borderRadius: 15 }}>
                                                                            <Text style={{ fontSize: 16, fontWeight: '400' }}>Cancel</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </FancyAlert>
                                                        </TouchableOpacity>}
                                                    {item.workstatus == 2 &&
                                                        <TouchableOpacity onPress={() => {
                                                            // setIsStopwatchStart(!isStopwatchStart);
                                                            setResetStopwatch(false);

                                                        }} style={{ backgroundColor: '#7700D4', flexDirection: 'row', paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }}>
                                                            <Image
                                                                style={{ width: 40, height: 40 }}
                                                                source={require('../src/assets/cancel-c.png')}
                                                            />
                                                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', paddingLeft: 5, fontSize: 18 }}>
                                                                {/* <Stopwatch

                                                                    start={stopwatchdate}
                                                                    //To start
                                                                    reset={resetStopwatch}
                                                                    //To reset
                                                                    options={{ container: { alignItems: 'center' }, text: { color: '#fff' } }}
                                                                //options for the styling

                                                                /> */}

                                                                {/* {countUpTimer().displayhour}:{countUpTimer().displaymin}:{countUpTimer().displaysec} */}
                                                            </Text>
                                                        </TouchableOpacity>}
                                                    {item.workstatus == 1 &&
                                                        <View>
                                                            <TouchableOpacity onPress={() => Visible(!isVisible)}
                                                                style={{ backgroundColor: '#ffbf00', borderRadius: 5, paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}>
                                                                <Image
                                                                    source={require('../src/assets/time-right.png')}
                                                                    style={{ width: 30, height: 35, alignSelf: 'center' }}
                                                                />
                                                                <Modal
                                                                    animationType={"slide"}
                                                                    transparent={false}
                                                                    onPress={repress(item.id)}
                                                                    visible={isVisible}
                                                                    onRequestClose={() => GoBack()}
                                                                >
                                                                    <SafeAreaView style={{ flex: 1, paddingTop: 25 }}>
                                                                        <View style={{ flexDirection: 'row' }}>
                                                                            <TouchableOpacity onPress={() => GoBack()} style={{ alignSelf: 'center' }}>
                                                                                <Icon name="arrow-back" size={30} color="#6F00C5" />
                                                                            </TouchableOpacity>
                                                                            <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10, maxWidth: '90%' }}>Reschedule for {item.customer_name}</Text>

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
                                                                                    uniqueKey="id"
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
                                                                            style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                                                                            <TouchableOpacity onPress={() => Reschedule(item.hellid)}
                                                                                style={{ borderWidth: .5, borderColor: '#343a40', margin: 5 }}>
                                                                                <Text style={{ color: '#343a40', fontSize: 16, padding: 10 }}>Reschedule</Text>
                                                                            </TouchableOpacity>
                                                                            <TouchableOpacity onPress={() => GoBack()} style={{ borderWidth: .5, borderColor: '#343a40', margin: 5 }}>
                                                                                <Text style={{ color: '#343a40', fontSize: 16, padding: 10 }}>Close</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </SafeAreaView>
                                                                </Modal>
                                                            </TouchableOpacity>
                                                        </View>}
                                                    {item.workstatus == 1 &&
                                                        <View>
                                                            <TouchableOpacity onPress={() => csl(!cnl)}
                                                                style={{ backgroundColor: '#ffbf00', borderRadius: 5, paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}>
                                                                <Image
                                                                    source={require('../src/assets/time-cncl.png')}
                                                                    style={{ width: 33, height: 36, alignSelf: 'center' }}
                                                                />
                                                                <Modal
                                                                    animationType={"slide"}
                                                                    transparent={false}
                                                                    onPress={repress(item.id)}
                                                                    visible={cnl}
                                                                    onRequestClose={() => back()}>
                                                                    <SafeAreaView style={{ flex: 1, padding: 15 }}>
                                                                        <View style={{ flexDirection: 'row', paddingBottom: 20, maxWidth: '90%' }}>
                                                                            <TouchableOpacity onPress={() => back()} style={{ alignSelf: 'center' }}>
                                                                                <Icon name="arrow-back" size={30} color="#6F00C5" />
                                                                            </TouchableOpacity>
                                                                            <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10 }}>Cancellations for {item.customer_name}</Text>
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
                                                                                uniqueKey="id"
                                                                                single={true}
                                                                                // subKey="children"
                                                                                selectText="Cancellations Reason"
                                                                                searchPlaceholderText='Select Reasons'

                                                                                selectedItems={cnlresion}
                                                                                onSelectedItemsChange={onCancel}
                                                                                styles={{ selectToggle: { fontSize: 16, padding: 10 }, chipsWrapper: { padding: 10 } }}
                                                                            />
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, paddingTop: 20 }}>
                                                                            <TouchableOpacity onPress={() => Cancel(item.hellid)}
                                                                                style={{ borderWidth: .5, borderColor: '#343a40', margin: 5 }}>
                                                                                <Text style={{ color: '#343a40', fontSize: 16, padding: 10 }}>Submit</Text>
                                                                            </TouchableOpacity>
                                                                            <TouchableOpacity onPress={() => back()} style={{ borderWidth: .5, borderColor: '#343a40', margin: 5 }}>
                                                                                <Text style={{ color: '#343a40', fontSize: 16, padding: 10 }}>Close</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </SafeAreaView>
                                                                </Modal>
                                                            </TouchableOpacity>
                                                        </View>}
                                                </View>
                                            </TouchableOpacity>
                                        </View>}
                                </View>
                            }
                        />}
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

export default Dashboard2;