// cyvestigo keylines graph: 64093b97e04b179fc89811f6
// CyGraph : 64d49cfb9a3410a1fb56b631
export const data =
{
      "nodes": [
	   {
                  "id": "4",
                  "inRange": true,
                  "visible": true,
                  "type": "node",
                  "label": "charlie10.exe",
                  "display": {
                        "labels": [
                              "Process"
                        ],
                        "score_ioc": null,
                        "tag": ""
                  },
                  "properties": [
                        {
                              "_t": [
                                    "WindowsModelBase",
                                    "Event4663Model"
                              ],
                              "eventID": 4663,
                              "computerName": "QDS8.stella.local",
                              "recordNumber": 6917336,
                              "time": "11-04-2022 16:04:29",
                              "logsourceTime": 1636099507,
                              "accesses": "WriteData (or AddFile)     AppendData (or AddSubdirectory or CreatePipeInstance)",
                              "accountName": "sumit.k",
                              "accountDomain": "STELLA",
                              "objectType": "File",
                              "originatingComputer": "10.0.5.88",
                              "objectName": "C:\\Users\\sumit.k\\Downloads\\seminar.docx.enc",
                              "processName": "C:\\Users\\sumit.k\\AppData\\Local\\Temp\\charlie10.exe",
                              "path": "C:\\Users\\sumit.k\\AppData\\Local\\Temp\\charlie10.exe",
                              "Title": "charlie10.exe",
                              "tag": ""
                        }
                  ],
                  "ioc": false
            },
            {
                  "id": "5",
                  "inRange": true,
                  "visible": true,
                  "type": "node",
                  "label": "attendance.docx.enc",
                  "display": {
                        "labels": [
                              "File"
                        ],
                        "score_ioc": null,
                        "tag": ""
                  },
                  "properties": [
                        {
                              "Object Name": "C:\\Users\\sumit.k\\Downloads\\attendance.docx.enc",
                              "Object Type": "File",
                              "Computer Name": "QDS8.stella.local",
                              "Originating Computer Name": "10.0.5.88",
                              "path": "C:\\Users\\sumit.k\\Downloads\\attendance.docx.enc",
                              "Title": "attendance.docx.enc",
                              "tag": ""
                        }
                  ],
                  "ioc": false,
                  "comboId": "combo1"
            },
            {
                  "id": "8",
                  "inRange": true,
                  "visible": true,
                  "type": "node",
                  "label": "dataset.docx.enc",
                  "display": {
                        "labels": [
                              "File"
                        ],
                        "score_ioc": null,
                        "tag": ""
                  },
                  "properties": [
                        {
                              "Object Name": "C:\\Users\\sumit.k\\Downloads\\seminar\\dataset.docx.enc",
                              "Object Type": "File",
                              "Computer Name": "QDS8.stella.local",
                              "Originating Computer Name": "10.0.5.88",
                              "path": "C:\\Users\\sumit.k\\Downloads\\seminar\\dataset.docx.enc",
                              "Title": "dataset.docx.enc",
                              "tag": ""
                        }
                  ],
                  "ioc": false,
                  "comboId": "combo1"
            },
            {
                  "id": "11",
                  "inRange": true,
                  "visible": true,
                  "type": "node",
                  "label": "prior data.docx.enc",
                  "display": {
                        "labels": [
                              "File"
                        ],
                        "score_ioc": null,
                        "tag": ""
                  },
                  "properties": [
                        {
                              "Object Name": "C:\\Users\\sumit.k\\Downloads\\seminar\\prior data.docx.enc",
                              "Object Type": "File",
                              "Computer Name": "QDS8.stella.local",
                              "Originating Computer Name": "10.0.5.88",
                              "path": "C:\\Users\\sumit.k\\Downloads\\seminar\\prior data.docx.enc",
                              "Title": "prior data.docx.enc",
                              "tag": ""
                        }
                  ],
                  "ioc": false,
                  "comboId": "combo1"
            },
            {
                  "id": "14",
                  "inRange": true,
                  "visible": true,
                  "type": "node",
                  "label": "sales research.docx.enc",
                  "display": {
                        "labels": [
                              "File"
                        ],
                        "score_ioc": null,
                        "tag": ""
                  },
                  "properties": [
                        {
                              "Object Name": "C:\\Users\\sumit.k\\Downloads\\seminar\\sales research.docx.enc",
                              "Object Type": "File",
                              "Computer Name": "QDS8.stella.local",
                              "Originating Computer Name": "10.0.5.88",
                              "path": "C:\\Users\\sumit.k\\Downloads\\seminar\\sales research.docx.enc",
                              "Title": "sales research.docx.enc",
                              "tag": ""
                        }
                  ],
                  "ioc": false,
                  "comboId": "combo1"
            },
            {
                  "id": "17",
                  "inRange": true,
                  "visible": true,
                  "type": "node",
                  "label": "seminar.docx.enc",
                  "display": {
                        "labels": [
                              "File"
                        ],
                        "score_ioc": null,
                        "tag": ""
                  },
                  "properties": [
                        {
                              "Object Name": "C:\\Users\\sumit.k\\Downloads\\seminar.docx.enc",
                              "Object Type": "File",
                              "Computer Name": "QDS8.stella.local",
                              "Originating Computer Name": "10.0.5.88",
                              "path": "C:\\Users\\sumit.k\\Downloads\\seminar.docx.enc",
                              "Title": "seminar.docx.enc",
                              "tag": ""
                        }
                  ],
                  "ioc": false,
                  "comboId": "combo1"
            }, 
   
           
      ],
      "edges": [
            {
                  "type": "timeBarInfo",
                  "dateFreq": {
                        "1667576802": 1,
                        "1667577869": 5,
                        "1667577822": 7,
                        "1667577823": 5
                  },
                  "firstDate": 1667576802,
                  "lastDate": 1667577869
            },

            {
                  "id": "4-5-Write File",
                  "type": "edge",
                  "source": "4",
                  "target": "5",
                  "date": [
                        1667577900
                  ],
                  "label": "Write File",
                  "g": null,
                  "ttp": false,
                  "inRange": true,
                  "visible": true,
                  "frequency": 1,
                  "merged_edges": {
                        "ids": [
                              "6"
                        ],
                        "score_ttp": [
                              "0"
                        ]
                  },
                  "properties": [
                        {
                              "_t": [
                                    "WindowsModelBase",
                                    "Event4663Model"
                              ],
                              "eventID": 4663,
                              "computerName": "QDS8.stella.local",
                              "recordNumber": 6917309,
                              "time": "11-04-2022 16:04:29",
                              "logsourceTime": 1636099507,
                              "accesses": "WriteData (or AddFile)     AppendData (or AddSubdirectory or CreatePipeInstance)",
                              "accountName": "sumit.k",
                              "accountDomain": "STELLA",
                              "objectType": "File",
                              "originatingComputer": "10.0.5.88",
                              "objectName": "C:\\Users\\sumit.k\\Downloads\\attendance.docx.enc",
                              "processName": "C:\\Users\\sumit.k\\AppData\\Local\\Temp\\charlie10.exe",
                              "Title": "Write File",
                              "tag": ""
                        }
                  ]
            },
            {
                  "id": "4-8-Write File",
                  "type": "edge",
                  "source": "4",
                  "target": "8",
                  "date": [
                        1667577800
                  ],
                  "label": "Write File",
                  "g": null,
                  "ttp": false,
                  "inRange": true,
                  "visible": true,
                  "frequency": 1,
                  "merged_edges": {
                        "ids": [
                              "9"
                        ],
                        "score_ttp": [
                              "0"
                        ]
                  },
                  "properties": [
                        {
                              "_t": [
                                    "WindowsModelBase",
                                    "Event4663Model"
                              ],
                              "eventID": 4663,
                              "computerName": "QDS8.stella.local",
                              "recordNumber": 6917318,
                              "time": "11-04-2022 16:04:29",
                              "logsourceTime": 1636099507,
                              "accesses": "WriteData (or AddFile)     AppendData (or AddSubdirectory or CreatePipeInstance)",
                              "accountName": "sumit.k",
                              "accountDomain": "STELLA",
                              "objectType": "File",
                              "originatingComputer": "10.0.5.88",
                              "objectName": "C:\\Users\\sumit.k\\Downloads\\seminar\\dataset.docx.enc",
                              "processName": "C:\\Users\\sumit.k\\AppData\\Local\\Temp\\charlie10.exe",
                              "Title": "Write File",
                              "tag": ""
                        }
                  ]
            },
            {
                  "id": "4-11-Write File",
                  "type": "edge",
                  "source": "4",
                  "target": "11",
                  "date": [
                        1667577700
                  ],
                  "label": "Write File",
                  "g": null,
                  "ttp": false,
                  "inRange": true,
                  "visible": true,
                  "frequency": 1,
                  "merged_edges": {
                        "ids": [
                              "12"
                        ],
                        "score_ttp": [
                              "0"
                        ]
                  },
                  "properties": [
                        {
                              "_t": [
                                    "WindowsModelBase",
                                    "Event4663Model"
                              ],
                              "eventID": 4663,
                              "computerName": "QDS8.stella.local",
                              "recordNumber": 6917324,
                              "time": "11-04-2022 16:04:29",
                              "logsourceTime": 1636099507,
                              "accesses": "WriteData (or AddFile)     AppendData (or AddSubdirectory or CreatePipeInstance)",
                              "accountName": "sumit.k",
                              "accountDomain": "STELLA",
                              "objectType": "File",
                              "originatingComputer": "10.0.5.88",
                              "objectName": "C:\\Users\\sumit.k\\Downloads\\seminar\\prior data.docx.enc",
                              "processName": "C:\\Users\\sumit.k\\AppData\\Local\\Temp\\charlie10.exe",
                              "Title": "Write File",
                              "tag": ""
                        }
                  ]
            },
            {
                  "id": "4-14-Write File",
                  "type": "edge",
                  "source": "4",
                  "target": "14",
                  "date": [
                        1667577600
                  ],
                  "label": "Write File",
                  "g": null,
                  "ttp": false,
                  "inRange": true,
                  "visible": true,
                  "frequency": 1,
                  "merged_edges": {
                        "ids": [
                              "15"
                        ],
                        "score_ttp": [
                              "0"
                        ]
                  },
                  "properties": [
                        {
                              "_t": [
                                    "WindowsModelBase",
                                    "Event4663Model"
                              ],
                              "eventID": 4663,
                              "computerName": "QDS8.stella.local",
                              "recordNumber": 6917330,
                              "time": "11-04-2022 16:04:29",
                              "logsourceTime": 1636099507,
                              "accesses": "WriteData (or AddFile)     AppendData (or AddSubdirectory or CreatePipeInstance)",
                              "accountName": "sumit.k",
                              "accountDomain": "STELLA",
                              "objectType": "File",
                              "originatingComputer": "10.0.5.88",
                              "objectName": "C:\\Users\\sumit.k\\Downloads\\seminar\\sales research.docx.enc",
                              "processName": "C:\\Users\\sumit.k\\AppData\\Local\\Temp\\charlie10.exe",
                              "Title": "Write File",
                              "tag": ""
                        }
                  ]
            },
            {
                  "id": "4-17-Write File",
                  "type": "edge",
                  "source": "4",
                  "target": "17",
                  "date": [
                        1667577500
                  ],
                  "label": "Write File",
                  "g": null,
                  "ttp": false,
                  "inRange": true,
                  "visible": true,
                  "frequency": 1,
                  "merged_edges": {
                        "ids": [
                              "18"
                        ],
                        "score_ttp": [
                              "0"
                        ]
                  },
                  "properties": [
                        {
                              "_t": [
                                    "WindowsModelBase",
                                    "Event4663Model"
                              ],
                              "eventID": 4663,
                              "computerName": "QDS8.stella.local",
                              "recordNumber": 6917336,
                              "time": "11-04-2022 16:04:29",
                              "logsourceTime": 1636099507,
                              "accesses": "WriteData (or AddFile)     AppendData (or AddSubdirectory or CreatePipeInstance)",
                              "accountName": "sumit.k",
                              "accountDomain": "STELLA",
                              "objectType": "File",
                              "originatingComputer": "10.0.5.88",
                              "objectName": "C:\\Users\\sumit.k\\Downloads\\seminar.docx.enc",
                              "processName": "C:\\Users\\sumit.k\\AppData\\Local\\Temp\\charlie10.exe",
                              "Title": "Write File",
                              "tag": ""
                        }
                  ]
            }
      ],
      "combos": [
            {
                  "id": "combo1",
                  "label": "combo1",
                  "type": "combo",
                  "inRange": true,
                  "visible": true,
                  "ioc": false,
                  "nodeCount": 5,
                  "collapsed": true,
                  "childNodeIds": [
                        "17",
                        "5",
                        "8",
                        "11",
                        "14"
                  ]
            }
      ]
}