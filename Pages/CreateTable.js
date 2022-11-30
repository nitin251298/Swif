import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('SwifDb');

const CreateTable = ({ navigation }) => {

    const dispatch = useDispatch();
    const Db = useSelector(state => state.Db)
    const [update, setupdate] = useState(0)

    useEffect(() => {
        console.log(Db);
        DETAIL();
        HELL();
        USER();
        CNL();
        RES();
        WOSTATUS();
        ADHOC();
        TASK();
        ADHOCITEM();
        COMMENT();
        GALLERY();
        CAl();
        ALL();
        setTimeout(() => {
            setupdate("Redirecting to Dashborad");
        }, 24000)

        setTimeout(() => {
            nav();
        }, 5000)
    }, [])

    const ALL = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
                [],
                (tx, results) => {
                    console.log(results);
                    setTimeout(() => {
                        setupdate("updating complete");
                    }, 22000)
                }
            );
        });
    }

    const USER = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS user', []);
                        txn.executeSql(
                            "CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT,userid INT(9) NOT NULL, name VARCHAR(30) NOT NULL, contact INT(15) NOT NULL,username VARCHAR(25) NOT NULL, address VARCHAR(85) NOT NULL, company_logo VARCHAR(55) NOT NULL, email VARCHAR(25) NOT NULL, gender VARCHAR(25) NOT NULL, profile_image VARCHAR(55) NOT NULL, token VARCHAR(200) NOT NULL, Modification INT(5) NOT NULL, topBarPermission VARCHAR(255))",
                            [],
                        );
                    }
                    setupdate("User Table created")
                    insertData(Db.worker)
                }
            );
        })
    }

    const HELL = () => {
        db.transaction(function (txn) {
            txn.executeSql('DROP TABLE IF EXISTS hell', []);
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='hell'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql(
                            "CREATE TABLE hell (hellid INT(9) NOT NULL, customer_contact_number VARCHAR(255) NOT NULL, block VARCHAR(85), contractNumber VARCHAR(255),country VARCHAR(25), customer_address TEXT, customer_name VARCHAR(255), option_name TEXT, option_price INT(12), service_name TEXT, street VARCHAR(50), unit VARCHAR(20), workstatus INT(5), workstatusname VARCHAR(20), zip INT(9), zone VARCHAR(50), type INT(9), reasonid INT(9), date VARCHAR(50), Modification INT(5),expected_start_date VARCHAR(50), expected_start_time VARCHAR(50), expected_end_time VARCHAR(50), actual_start_date VARCHAR(50), actual_start_time VARCHAR(50),actual_end_time VARCHAR(50), signature VARCHAR(255), executionPermission VARCHAR(255))",
                            [],
                        );
                    }
                    // alert("CREATE TABLE workorder (id INTEGER PRIMARY KEY AUTOINCREMENT,workorderid INT(9) NOT NULL, actual_end_time VARCHAR(50) NOT NULL, customer_contact_number VARCHAR(255) NOT NULL,actual_start_time VARCHAR(50) NOT NULL, block VARCHAR(85) NOT NULL, contractNumber VARCHAR(255) IS NULL, country VARCHAR(25) NOT NULL, customer_address VARCHAR(255) NOT NULL, customer_name VARCHAR(255) NOT NULL, expected_start_time VARCHAR(50) NOT NULL, option_name VARCHAR(255) NOT NULL, option_price INT(12) NOT NULL, service_name VARCHAR(255) NOT NULL, start_date VARCHAR(50) NOT NULL, street VARCHAR(50) NOT NULL, unit VARCHAR(20) NOT NULL, workstatus INT(5) NOT NULL, workstatusname VARCHAR(20) NOT NULL, zip INT(9) NOT NULL, zone VARCHAR(50) NOT NULL, Modification INT(5) NOT NULL)")

                    Db.list.forEach(element => {

                        console.log('====================================');
                        console.log(element);
                        console.log('====================================');
                        if (element.contractNumber) {
                            console.log(element.contractNumber);
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature, executionPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                    [element.id, element.customer_contact_number, element.block, element.contractNumber, element.country, element.customer_address, element.customer_name, element.option_name, element.option_price, element.service_name, element.street, element.unit, element.workstatus, element.workstatusname, element.zip, element.zone, 0, 0, "null", 0,""+element.start_date+"",""+element.actual_start_time+"",""+element.actual_end_time+"","null","null","null","null", element.executionPermission],
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
                                    'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature, executionPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                    [element.id, element.customer_contact_number, element.block, 'null', element.country, element.customer_address, element.customer_name, element.option_name, element.option_price, element.service_name, element.street, element.unit, element.workstatus, element.workstatusname, element.zip, element.zone, 0, 0, "null", 0,""+element.start_date+"",""+element.actual_start_time+"",""+element.actual_end_time+"","null","null","null","null", element.executionPermission],
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
                    // setupdate("hell Table created")
                    // insertData(Db.worker)
                }
            );
        })
    }

    const WO = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='workorder'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS workorder', []);
                        txn.executeSql(
                            "CREATE TABLE workorder (workorderid INT(9))",
                            [],
                        );
                    }
                    setupdate("WorkerOrder Table created")
                    insertWO(Db.list)
                }
            );
        })
    }

    const CNL = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='cancel'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS cancel', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS cancel (id INTEGER PRIMARY KEY AUTOINCREMENT, cancelid INT(9) NOT NULL, company_id INT(9) NOT NULL,description VARCHAR(250) NOT NULL, title VARCHAR(250) NOT NULL, Modification INTEGER DEFAULT 0 NOT NULL)',
                            []
                        );
                    }
                    setTimeout(() => {
                        setupdate("Cancel Table created")
                    }, 4000)
                    cancelData(Db.CancelReason)
                }
            );
        })
    }

    const RES = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='reschedule'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS reschedule', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS reschedule (id INTEGER PRIMARY KEY AUTOINCREMENT, rescheduleid INT(9) NOT NULL, company_id INT(9) NOT NULL,description VARCHAR(250) NOT NULL, title VARCHAR(250) NOT NULL, Modification INTEGER DEFAULT 0 NOT NULL)',
                            []
                        );
                    }
                    setTimeout(() => {
                        setupdate("Reschedule Table created")
                    }, 6000)
                    reschedulData(Db.resheduleReason)
                }
            );
        })
    }

    const CAl = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='cal'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS cal', []);
                        txn.executeSql(
                            "CREATE TABLE cal (id INTEGER PRIMARY KEY AUTOINCREMENT,workorderid INT(9), addhocPrice INT(15), taskPrice INT(15))",
                            [],
                        );
                    }
                }
            );
        })
    }

    const WOSTATUS = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='status'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS status', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS status (id INTEGER PRIMARY KEY AUTOINCREMENT,statusid INT(9) NOT NULL, name VARCHAR(255) NOT NULL)',
                            []
                        );
                    }
                    setTimeout(() => {
                        setupdate("Status Table created")
                    }, 8000)
                    // console.log(Db.WOStatus);
                    statusData(Db.status)
                }
            );
        })
    }

    const ADHOC = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='item'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS item', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS item (id INT(9), category_id INT(12), price INT(15), name VARCHAR(255))',
                            []
                        );
                    }
                    Db.item.forEach(element => {

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
                    // adhocData()
                    // adhocData(Db.item)
                }
            );
        })
    }

    const TASK = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='task'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS task', []);
                        txn.executeSql(
                            "CREATE TABLE task (id INT(9), amount INT(15), price INT(15), checked VARCHAR(50), item VARCHAR(255), name VARCHAR(255), quantity INT(15), remarks VARCHAR(255), workorderid INT(12), Modification INT(9), custom INT(15))",
                            [],
                        );
                    }
                    Db.details.forEach(element => {
                        if (element.task_list.length > 0) {

                            element.task_list.forEach(ele => {
                                // alert(JSON.stringify(ele))

                                db.transaction(function (tx) {
                                    tx.executeSql(
                                        'INSERT INTO task (id, amount, price, checked, item, name, quantity, remarks, workorderid, Modification, custom) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?)',
                                        [ele.id, ele.amount, ele.amount, ele.checked, ele.item, ele.name, ele.quantity, ele.remarks, element.id, 0, ele.custom],
                                        (tx, results) => {
                                            // alert("task")
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

    const ADHOCITEM = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='adhocitems'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS adhocitems', []);
                        txn.executeSql(
                            "CREATE TABLE adhocitems (id INT(9), amount INT(15), checked INT(5), item VARCHAR(255), name VARCHAR(255), quantity INT(15), remarks VARCHAR(255), workorderid INT(12), Modification INT(9), category_id INT(9))",
                            [],
                        );
                    }
                    Db.details.forEach(element => {
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

    const DETAIL = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='details'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS details', []);
                        txn.executeSql(
                            "CREATE TABLE details (id INT(15), adjustment_type VARCHAR(50), adjustment_value VARCHAR(50), block VARCHAR(50), companytax INT(15), contractNumber VARCHAR(50), customer_contact_number INT(15), customer_name VARCHAR(255), discount_type VARCHAR(50), discount_value VARCHAR(50), option_name VARCHAR(50), option_price INT(15), service_id INT(15), service_name VARCHAR(255), status INT(15),  street VARCHAR(50), unit VARCHAR(50), workstatusname VARCHAR(50), zip INT(15), zone VARCHAR(50), ad_hoc_catid VARCHAR(255), ad_hoc_items VARCHAR(255), gallery VARCHAR(255), task_list VARCHAR(255), workordercommentlist VARCHAR(255), type INT(9), reasonid INT(9), date VARCHAR(50),expected_start_time VARCHAR(50), expected_end_time VARCHAR(50), actual_start_time VARCHAR(50),actual_end_time VARCHAR(50), expected_start_date VARCHAR(50), Modification INT(9), executionPermission VARCHAR(255), priceViewPermission VARCHAR(255), country VARCHAR(255), leader VARCHAR(255), team VARCHAR(255), addHocPermission VARCHAR(255))",
                            [],
                        );
                    }
                    Db.details.forEach(element => {
                        db.transaction(function (tx) {
                            tx.executeSql(
                                'INSERT INTO details (id, adjustment_type, adjustment_value, block, companytax, contractNumber, customer_contact_number, customer_name, discount_type, discount_value, option_name, option_price, service_id, service_name, status, street, unit, workstatusname, zip, zone, ad_hoc_catid, ad_hoc_items, gallery, task_list, workordercommentlist, type, reasonid, date, expected_start_time, expected_end_time, actual_start_time, actual_end_time,expected_start_date, Modification, executionPermission, priceViewPermission, country, leader, team, addHocPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                [element.id, element.adjustment_type, element.adjustment_value, element.block, element.companytax, element.contractNumber, element.customer_contact_number, element.customer_name, element.discount_type, element.discount_value, element.option_name, element.option_price, element.service_id, element.service_name, element.status, element.street, element.unit, element.workstatusname, element.zip, element.zone, JSON.stringify(element.ad_hoc_catid), JSON.stringify(element.ad_hoc_items), JSON.stringify(element.gallery), JSON.stringify(element.task_list), JSON.stringify(element.workordercommentlist), 0, 0, "null", ""+element.actual_start_time+"", ""+element.actual_end_time+"", ""+element.ground_start_time+"", ""+element.ground_end_time+"", ""+element.start_date+"", 0, element.executionPermission, element.priceViewPermission, element.country, element.teamDetails.leader, element.teamDetails.team, element.addHocPermission],
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

    const COMMENT = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='comment'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS comment', []);
                        txn.executeSql(
                            "CREATE TABLE comment (id INTEGER PRIMARY KEY AUTOINCREMENT, comment_id INT(11), commenter_type VARCHAR(25), commenter VARCHAR(25), commenter_id INT(11), description TEXT, workorder_id INT(15), created TEXT, Modification INT(9))",
                            [],
                        );
                    }
                    Db.comment.forEach(element => {
                        element.forEach(ele => {
                            // console.error(ele);
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

    const GALLERY = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='gallery'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS gallery', []);
                        txn.executeSql(
                            "CREATE TABLE gallery (id INTEGER PRIMARY KEY AUTOINCREMENT, file VARCHAR(255), workorderid INT(15), Modification INT(9))",
                            [],
                        );
                    }

                }
            );
        })
    }


    const insertData = (response) => {
        // console.log(response);
        if (response) {

            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO user (userid, name, contact, username, address, company_logo, email, gender, profile_image, token,Modification, topBarPermission) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                    [response.id, response.name, response.contact, response.username, response.address, response.company_logo, response.email, response.gender, response.profile_image, response.token, 0, response.topBarPermission],
                    (tx, results) => {
                        // console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                setupdate("User Data inserted")
                            }, 10000)
                            // alert('User Data Inserted Successfully....');
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

    const insertWO = (response) => {
        // console.log(response);

        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO workorder workorderid=12',
                (tx, results) => {
                    // console.log(results);
                    alert("booo 2")
                }
            );
        });

        // viewWO();

    }

    // const insertWO = (value) => {
    //     // value.forEach(element => {
    //         // console.log("wo", element);

    //         "CREATE TABLE workorder (id INTEGER PRIMARY KEY AUTOINCREMENT,workorderid INT(9) NOT NULL, actual_end_time VARCHAR(50) NOT NULL, customer_contact_number VARCHAR(255) NOT NULL,actual_start_time VARCHAR(50) NOT NULL, block VARCHAR(85) NOT NULL, contractNumber VARCHAR(255) IS NULL, country VARCHAR(25) NOT NULL, customer_address VARCHAR(255) NOT NULL, customer_name VARCHAR(255) NOT NULL, expected_start_time VARCHAR(50) NOT NULL, option_name VARCHAR(255) NOT NULL, option_price INT(12) NOT NULL, service_name VARCHAR(255) NOT NULL, start_date VARCHAR(50) NOT NULL, street VARCHAR(50) NOT NULL, unit VARCHAR(20) NOT NULL, workstatus INT(5) NOT NULL, workstatusname VARCHAR(20) NOT NULL, zip INT(9) NOT NULL, zone VARCHAR(50) NOT NULL, Modification INT(5) NOT NULL)"
    //         // [element.id, element.actual_end_time, element.actual_start_time, element.block, element.contractNumber, element.country, element.customer_address, element.customer_contact_number, element.customer_name, element.expected_start_time, element.option_name, element.option_price, element.service_name, element.start_date, element.street, element.unit, element.workstatus, element.workstatusname, element.zip, element.zone, 0]

    //         // if (element.contractNumber) {
    //             db.transaction(function (tx) {
    //                 tx.executeSql(
    //                     'INSERT INTO workorder (id,workorderid) VALUES (?,?)',[1, 456]
    //                     ,
    //                     (tx, results) => {
    //                         console.log(results);
    //                         if (results.rowsAffected > 0) {
    //                             alert('Work order Data Inserted Successfully....');
    //                             setTimeout(() => {
    //                                 setupdate("Workorder Data inserted")
    //                             }, 12000)
    //                         } else {
    //                             alert('Failed....');
    //                             navigation.navigate('FirstPage')
    //                         }
    //                     }
    //                 );
    //             });
    //     //     } else {
    //     //         db.transaction(function (tx) {
    //     //             tx.executeSql(
    //     //                 'INSERT INTO workorder (workorderid, actual_end_time, actual_start_time, block, contractNumber, country, customer_address, customer_contact_number, customer_name, expected_start_time, option_name, option_price, service_name, start_date, street, unit, workstatus, workstatusname, zip, zone,Modification) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    //     //                 [456,"04:00:00","09:00:00","ddd","IN","sector-81, dd, ddd, IN, 1234561, dd","01231231231","dost","09:00:00","Platinum",700,"Duplex Cleaning","2022-05-24","sector-81","dd","dd",1,"pending",1234567,"dd",0],
    //     //                 (tx, results) => {

    //     //                     if (results.rowsAffected > 0) {
    //     //                         alert('Work order else Data Inserted Successfully....');
    //     //                         setTimeout(() => {
    //     //                             setupdate("Work Order Data inserted")
    //     //                         }, 14000)
    //     //                     } else {
    //     //                         alert('Failed....');
    //     //                         navigation.navigate('FirstPage')
    //     //                     }
    //     //                 }
    //     //             );
    //     //         });
    //     //     }
    //     // });
    //     viewWO();
    // }

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
                                setupdate("Status Data inserted")
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
                                setupdate("Cancel Data inserted")
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
                                setupdate("Reschedule Data inserted")
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

    const adhocData = (res) => {
        // res.forEach(element => {
        // console.log(element);
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO items (id) VALUES (?)',
                [12],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        // alert('Data Inserted Successfully....');
                    } else {
                        alert('Failed....');
                        navigation.navigate('FirstPage')
                    }
                }
            );
        });
        // });
        itemsView();
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
    const viewWO = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM workorder',
                [],
                (tx, results) => {
                    console.log("Wo:", results);
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

    const itemsView = () => {


    }

    const nav = () => {
        navigation.navigate('Dashboard')
    }






    //     // db.transaction(function (txn) {
    //     //     txn.executeSql(
    //     //         "SELECT name FROM sqlite_master WHERE type='table' AND name='job'",
    //     //         [],
    //     //         function (tx, res) {
    //     //             // console.log('item:', res.rows.length);
    //     //             // console.log('res:', res);
    //     //             if (res.rows.length == 0) {
    //     //                 txn.executeSql('DROP TABLE IF EXISTS job', []);
    //     //                 txn.executeSql(
    //     //                     'CREATE TABLE IF NOT EXISTS job(worker_id INTEGER PRIMARY KEY AUTOINCREMENT,id INT(9), actual_end_time VARCHAR(30), customer_contact_number INT(11),actual_start_time VARCHAR(25), block VARCHAR(85), contractNumber VARCHAR(55), adjustment_type VARCHAR(25), adjustment_value VARCHAR(255), customer_name VARCHAR(55), expected_start_time VARCHAR(20), companytax VARCHAR(20), discount_type INT(9), service_name VARCHAR(255), start_date VARCHAR(20), street VARCHAR(50), unit VARCHAR(20), discount_value INT(55), workstatusname VARCHAR(20), zip INT(6), zone VARCHAR(20),ground_end_time VARCHAR(20),ground_start_time VARCHAR(20),option_price INT(9),option_name VARCHAR(20),service_id INT(9),status INT(9),ad_hoc_catid VARCHAR(50),ad_hoc_items VARCHAR(50),gallery VARCHAR(50),task_list VARCHAR(50),workordercommentlist VARCHAR(50), Modification INT(5))',
    //     //                     []
    //     //                 );
    //     //             }
    //     //             // jobData()
    //     //         }
    //     //     );
    //     // })





    // const jobView = () => {

    //     db.transaction((tx) => {
    //         tx.executeSql(
    //             'SELECT * FROM job',
    //             [],
    //             (tx, results) => {
    //                 console.log(JSON.stringify(results));
    //                 var temp = [];
    //                 for (let i = 0; i < results.rows.length; ++i)
    //                     temp.push(results.rows.item(i));
    //                 console.log(temp);
    //             }
    //         );
    //     });

    // }

    // const jobData = () => {


    //     db.transaction(function (tx) {
    //         tx.executeSql(
    //             'INSERT INTO job (id, actual_end_time, actual_start_time, ad_hoc_catid, ad_hoc_items, adjustment_type, adjustment_value, block, companytax, contractNumber, customer_contact_number, customer_name, discount_type, discount_value, expected_start_time, gallery, ground_end_time, ground_start_time, option_name, option_price,service_id,service_name,start_date,status,street,task_list,unit,workordercommentlist,workstatusname,zip,zone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    //             ["5000", "04:00:00", "09:00:00", JSON.stringify([1, 2, 3, 4]), JSON.stringify([]), "null", "null", "Block B", "7", "CTHO20220541-1", "8767876556", "Testdx Dhiman", "null", "null", "09:00", JSON.stringify([]), "05:30:00", , "05:30:00", "3 Hours", "1008", "54", "Home Packages", "2022-05-20", "1", "32, street", JSON.stringify([]), "main unit", JSON.stringify([]), "Pending", "777766", "Select"],
    //             (tx, results) => {
    //                 console.log(results);
    //                 console.log('Results', results.rowsAffected);
    //                 if (results.rowsAffected > 0) {
    //                     // navigation.navigate('Profile')
    //                     alert('Data Inserted Successfully....');
    //                 } else {
    //                     alert('Failed....');
    //                     navigation.navigate('FirstPage')
    //                 }
    //             }
    //         );
    //     });

    //     jobView();


    // }








    return (
        <View style={{ flex: 1, }}>
            <View style={{ alignSelf: 'center', flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
            {/* <View style={{ alignSelf: 'stretch', backgroundColor: 'red', justifyContent: 'flex-end' }}>
                <Text style={{ textAlign: 'center', color: '#fff' }}>
                    {update}
                </Text>
            </View> */}
        </View>
    )

}

export default CreateTable