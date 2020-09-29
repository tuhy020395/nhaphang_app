import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Text, SafeAreaView, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal, { ModalContent, ModalTitle, ScaleAnimation, ModalFooter, ModalButton} from 'react-native-modals';

import Utils from '~/utils';
import {settings} from '~/config';

// const dataServerSample = {
//     "OrderTempID": 85562,
//     "ProductName": "【设计师合作款】女装 圆领T恤(短袖) 424873 优衣库UNIQLO",
//     "Image": "//img.alicdn.com/imgextra/i2/196993935/O1CN01M5C3B41ewH6LfDHTR_!!196993935.jpg_320x320q75.jpg",
//     "LinkProduct": "https://m.intl.taobao.com/detail/detail.html?spm=a2141.8971817.50000671.1&id=606675435996&scm=1007.15522.117270.cat:50000671_industry:_cattype:cat_id:606675435996&pvid=54b8bb94-d968-4ad2-a34d-1f186413a3bf&scene=5522#modal=sku&timeStamp=1584520079738",
//     "Property": "155/80A/S;08 深灰色;",
//     "Brand": "",
//     "PriceVN": "268,600",
//     "PriceCNY": "79",
//     "TotalPriceVN": "268,600",
//     "TotalPriceCNY": "79",
//     "Quantity": 1
// }
const CartItem = props => {
    const { data } = props; 
    // console.log("CartItem - global settings", settings);
    // console.log("Cart preview Item - props data", data);
    const {ProductName, Image: img, 
        LinkProduct, Property, 
        Brand: note, Quantity, 
        PriceCNY,

    } = data;
    const PriceVN = parseFloat(PriceCNY) * settings.globalPrice;
    return <View style={[styles.wrap, {...props.styles}]}>
        <View style={styles.leftIMG}>
            <Image source={{uri: img}} 
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
            />
        </View>
        <View style={styles.rightInfo}>
            <View style={styles.productHeader}>
                <Text style={styles.title}>{ ProductName }</Text>
            </View>
            
            <View style={styles.pdSKUdl}>
                <View style={styles.dl}>
                    <Text style={styles.dt}>Thuộc tính:</Text>
                    <Text style={styles.dd}>{ Property }</Text>
                </View>
                <View style={styles.dl}>
                    <Text style={styles.dt}>Số lượng:</Text>
                    <Text style={styles.dd}>{ Quantity }</Text>
                </View>
                <View style={styles.dl}>
                    <Text style={styles.dt}>Đơn giá:</Text>
                    <Text style={styles.dd}>{ `¥ ${PriceCNY} - ${Utils.addCommas(PriceVN)} vnđ` }</Text>
                </View>
                <View style={styles.dl}>
                
                    <Text style={styles.dt}>Thành tiền:</Text>
                    <Text style={styles.dd}>{  `¥ ${ parseFloat(PriceCNY * Quantity).toFixed(2) } - ${Utils.addCommas(PriceVN * Quantity)} vnđ`  }</Text>
                </View>
                <View style={styles.dl}>
                    <Text style={styles.dt}>Ghi chú:</Text>
                    <Text style={styles.dd}>{ note ? note : <Text style={{opacity: 0.4}}>không có ghi chú</Text> }</Text>
                </View>
            </View>
        </View>
    </View>
}
export default CartItem;

const styles = StyleSheet.create({
    wrap: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "stretch",
        backgroundColor: "#f7f7f7",
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 8,
        padding: 10,
    },
    leftIMG: {
        width: 70,
        height: 70,
        overflow: 'hidden',
        borderRadius: 8,
       
    },
    rightInfo:{
        paddingLeft: 15,
        flexGrow: 1,
        flexBasis: '60%'
    },
    productHeader: {
        borderBottomColor: "#c1c1c1",
        borderBottomWidth: 1,
        paddingBottom: 10,
        marginBottom: 10
        
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 26
    },
    pdSKUdl: {

    },
    dl:{
        flexDirection: "row",
        alignItems: "stretch",
        paddingVertical: 2,
    },
    dt: {
        width: 80,
        opacity: 0.8,
        fontSize: 15
    },
    dd: {
        flexGrow: 1,
        textAlign: "right",
        flexBasis: "50%"
    }

})