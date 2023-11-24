// graph/RawQuery/ percola query: 64bfa0100e40dc5b28226f41
export const data = 
{
    "nodes": [
          {
                "id": "1",
                "inRange": true,
                "visible": true,
                "type": "node",
                "label": "10.0.5.88",
                "display": {
                      "labels": [
                            "IP_Address"
                      ],
                      "tag": ""
                },
                "properties": [
                      {
                            "Title": "10.0.5.88",
                            "tag": ""
                      }
                ]
          },
          {
                "id": "2",
                "parentId": "common_ports_13.13.13.10",
                "inRange": true,
                "visible": true,
                "type": "node",
                "label": "80",
                "display": {
                      "labels": [
                            "Port"
                      ],
                      "tag": ""
                },
                "properties": [
                      {
                            "Destination_IP": "13.13.13.10",
                            "Title": "80",
                            "tag": ""
                      }
                ]
          },
          {
                "id": "4",
                "inRange": true,
                "visible": true,
                "type": "node",
                "label": "13.13.13.10",
                "display": {
                      "labels": [
                            "IP_Address"
                      ],
                      "tag": ""
                },
                "properties": [
                      {
                            "Title": "13.13.13.10",
                            "tag": ""
                      }
                ]
          }
    ],
    "edges": [
          {
                "type": "timeBarInfo",
                "dateFreq": {
                      "1667571300": 2,
                      "1667571309": 2,
                      "1667571393": 2,
                      "1667571403": 2,
                      "1667571613": 2,
                      "1667572306": 2,
                      "1667572425": 2,
                      "1667572431": 2
                },
                "firstDate": 1667571300,
                "lastDate": 1667572431
          },
          {
                "id": "1-2-Accept Connection",
                "type": "edge",
                "source": "1",
                "target": "2",
                "date": [
                      1667571300,
                      1667571309,
                      1667571393,
                      1667571403,
                      1667571613,
                      1667572306,
                      1667572425
                ],
                "label": "Accept Connection",
                "g": null,
                "ttp": false,
                "inRange": true,
                "visible": true,
                "frequency": 7,
                "merged_edges": {
                      "ids": [
                            "39",
                            "45",
                            "27",
                            "33",
                            "21",
                            "15",
                            "3"
                      ],
                      "score_ttp": [
                            "0"
                      ]
                },
                "properties": [
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 49736,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:15:00",
                            "epochTime": 1667571300000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636092942,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Accept Connection",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 49736,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:15:09",
                            "epochTime": 1667571309000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636092942,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Accept Connection",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 49817,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:16:33",
                            "epochTime": 1667571393000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093035,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Accept Connection",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 49817,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:16:43",
                            "epochTime": 1667571403000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093035,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Accept Connection",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 50106,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:20:13",
                            "epochTime": 1667571613000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093256,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Accept Connection",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 50532,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:31:46",
                            "epochTime": 1667572306000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093949,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Accept Connection",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 50532,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:33:45",
                            "epochTime": 1667572425000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093949,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Accept Connection",
                            "tag": ""
                      }
                ]
          },
          {
                "id": "1-2-Drop Connection",
                "type": "edge",
                "source": "1",
                "target": "2",
                "date": [
                      1667572431
                ],
                "label": "Drop Connection",
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
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Drop",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 50532,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:33:51",
                            "epochTime": 1667572431000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Drop"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636094071,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Drop Connection",
                            "tag": ""
                      }
                ]
          },
          {
                "id": "4-2-Listen Port",
                "type": "edge",
                "source": "4",
                "target": "2",
                "date": [
                      1667571300,
                      1667571309,
                      1667571393,
                      1667571403,
                      1667571613,
                      1667572306,
                      1667572425,
                      1667572431
                ],
                "label": "Listen Port",
                "g": null,
                "ttp": false,
                "inRange": true,
                "visible": true,
                "frequency": 8,
                "merged_edges": {
                      "ids": [
                            "42",
                            "48",
                            "30",
                            "36",
                            "24",
                            "18",
                            "6",
                            "12"
                      ],
                      "score_ttp": [
                            "0"
                      ]
                },
                "properties": [
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 49736,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:15:00",
                            "epochTime": 1667571300000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636092942,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Listen Port",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 49736,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:15:09",
                            "epochTime": 1667571309000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636092942,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Listen Port",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 49817,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:16:33",
                            "epochTime": 1667571393000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093035,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Listen Port",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 49817,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:16:43",
                            "epochTime": 1667571403000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093035,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Listen Port",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 50106,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:20:13",
                            "epochTime": 1667571613000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093256,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Listen Port",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 50532,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:31:46",
                            "epochTime": 1667572306000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093949,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Listen Port",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Accept",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 50532,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:33:45",
                            "epochTime": 1667572425000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Accept"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636093949,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Listen Port",
                            "tag": ""
                      },
                      {
                            "_t": [
                                  "CheckPointModelBase",
                                  "FireWallPermitModel"
                            ],
                            "action": "Drop",
                            "product": "VPN-1 & FireWall-1",
                            "BladeName": "FireWallPermit",
                            "sourceIP": "10.0.5.88",
                            "sourcePort": 50532,
                            "destinationIP": "13.13.13.10",
                            "destinationPort": 80,
                            "proto": 6,
                            "I/f_Dir": "inbound",
                            "time": "11-04-2022 14:33:51",
                            "epochTime": 1667572431000,
                            "header": [
                                  "LEEF:2.0",
                                  "Check Point",
                                  "VPN-1 & FireWall-1",
                                  "1.0",
                                  "Drop"
                            ],
                            "I/f_Name": "eth1",
                            "src_machine_name": "qds8@stella.local",
                            "logsourceTime": 1636094071,
                            "firewallName": "CN\\=L3-CP1,O\\=cp-mgmt..hq332w",
                            "Title": "Listen Port",
                            "tag": ""
                      }
                ]
          }
    ]
}