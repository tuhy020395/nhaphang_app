import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Text, SafeAreaView, Image , ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputSpinner from "react-native-input-spinner"; 

import Utils from '~/utils';
import {settings, webViewURLs, color} from '~/config';
import {AuthContext} from '~/context/AuthController';
import {CartContext} from '~/context/CartController';
import { 
    updateCart_Quantity, updateCart_PdNote, updateCart_DeletePdItem
} from '~/api/AccountHandler';

const CartItem = props => {

    
    const {signOut, state: authState } = React.useContext(AuthContext);
    const navigation = useNavigation();

    const { data: propsData , pdUseState} = props; 
    // const { data: cartData, setData: setCartData } = pdUseState;
    const { data: cartData, setData: setCartData } = React.useContext(CartContext);
    const { onEditNote, onPressEditQuatity, onPressDelete } = props; 
    // console.log("CartItem - global settings", settings);
    // console.log("CartItem - props data", data);
    const [data, setData] = useState(propsData);
    const [hide, setHide] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false); 
    const {ProductName, Image: img, 
        LinkProduct, Property, 
        Brand: note, Quantity, 
        PriceCNY
    } = data;
    let imgLink = (()=>{
        let rs = '';
        if(!!!img.split('//')[0]){
            rs  = 'https:'+ img
        } else {
            rs = img;
        }
        return rs;
    })();
   
    const cartState = props.pdUseState
    const PriceVN = parseFloat(PriceCNY) * settings.globalPrice;
    

    _onPressEditQuatity =  async value =>{

        setIsLoading(true);
        if(authState.userToken){
            try {
                const rs = await updateCart_Quantity({ UID: authState.userID, 
                    OrderTemp:  data.OrderTempID,
                    Quantity: value
                });
                if(rs.Code === "102"){
                    setData({
                        ...data,
                        ...{Quantity: value}
                    });
                    let newData = cartData; 
                    newData[props.shopIndexKey].ListProduct[props.indexKey].Quantity = value
                    setCartData('');
                    setCartData(newData)
                        
                } else if(rs.Code === "101"){
                    Alert.alert('Thông báo','Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                    signOut();
                }
            } catch (error) {
                console.log("_onPressEditQuatity error: ", error)
            }
        }  else {
            setData({
                ...data,
                ...{Quantity: value}
            });
            let newData = cartData; 
            newData[props.shopIndexKey].ListProduct[props.indexKey].Quantity = value
            console.log(newData);
            await AsyncStorage.setItem('userCart', JSON.stringify(newData));
            setCartData('');
            setCartData(newData)  
        }
        
        // onPressEditQuatity({
        //     ...data,
        //     ...{Quantity: value}
        // });
        
        setIsLoading(false);
        
        
        
    }
    _onEditNote = value =>{
        setData({
            ...data,
            ...{Brand: value}
        });
        return onEditNote({
            ...data,
            ...{Brand: value}
        });
    }
    _onEndEditNote = async event =>{
        setIsLoading(true);
        try {
            const rs = await updateCart_PdNote({ UID: authState.userID, 
                OrderTemp:  data.OrderTempID,
                Note: data.Brand
            });
            if(rs.Code === "102"){
                let newData = cartData; 
                newData[props.shopIndexKey].ListProduct[props.indexKey].Brand = value
                setCartData('');
                setCartData(newData)
            } else if(rs.Code === "101"){
                
                Alert.alert('Thông báo','Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                signOut();
            }
        } catch (error) {
            console.log("_onEndEditNote error: ", error)
        }
        setIsLoading(false);
    }
    _onPressDelete =  () => {
        console.log(cartState);
        Alert.alert(
            'Xác nhận',
            'Bạn muốn xoá sản phẩm khỏi giỏ hàng',
            [
                {
                    text: 'Không',
                    onPress: () => {},
                    style: 'cancel',
                },
                { text: 'Xác nhận', onPress: async () => {
                    setIsLoading(true);
                    if(authState.userToken){
                        try {
                            const rs = await updateCart_DeletePdItem({ UID: authState.userID, 
                                OrderTempID:  data.OrderTempID,
                                OrderShopID: data.OrderShopID
                            });
                            if(rs.Code === "102"){
                                let newData = Array.from(cartData); 
                                newData[props.shopIndexKey].ListProduct.splice(props.indexKey, 1)
                                
                                if(!newData[props.shopIndexKey].ListProduct.length > 0){
                                    newData.splice(props.shopIndexKey, 1)
                                }
                                setHide(true);
                                setCartData('');
                                setCartData(newData)
                                
                                onPressDelete(data);
                            } else if(rs.Code === "101"){
                                
                                Alert.alert('Thông báo','Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                                signOut();
                            }
                        } catch (error) {
                            console.log("_onEndEditNote error: ", error)
                        }
                    } else {
                        let newData = Array.from(cartData); 
                        newData[props.shopIndexKey].ListProduct.splice(props.indexKey, 1)
                        
                        if(!newData[props.shopIndexKey].ListProduct.length > 0){
                            newData.splice(props.shopIndexKey, 1)
                        }
                        setHide(true);
                        setCartData('');
                        setCartData(newData)
                        await AsyncStorage.setItem('userCart', JSON.stringify(newData));
                        onPressDelete(data);
                    }
                        
                    setIsLoading(false);

                }  },
            ],
            { cancelable: false },
        );
        
        
    }
    
    _onPressDetailLink = () => {
        let keyURL = '';
        switch (true) {
            case data.LinkProduct.includes('taobao'):
                keyURL = 'taobao'
                break;
            case data.LinkProduct.includes('tmall'):
                keyURL = 'tmall'
                break;
            case data.LinkProduct.includes('1688'):
                keyURL = '1688'
                break;
            default:
                break;
        }
        !!keyURL && navigation.navigate('WebviewDetail', {
            ...webViewURLs[keyURL],
            ...{targetUrl: data.LinkProduct}
        });
        // data.LinkProduct
    }


    return <>{!hide ? <View style={styles.wrap}>
        <View style={styles.leftIMG}>
            <Image source={{uri: imgLink}} 
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
            />
        </View>
        <View style={styles.rightInfo}>
            <View style={styles.productHeader}>
                <View  style={{flex: 1}} >
                    <TouchableOpacity onPress={_onPressDetailLink} >
                        <Text style={styles.title}>{ ProductName }</Text>
                    </TouchableOpacity>
                </View> 
                <TouchableOpacity onPress={_onPressDelete}>
                    <View style={styles.removeIndicator}><Text style={{color: '#fff'}}><Icon name="times" size={12}  /></Text></View>
                </TouchableOpacity>
            </View>
            <View style={styles.pdSKUdl}>
                <View style={styles.dl}>
                    <Text style={styles.dt}>Thuộc tính:</Text>
                    <Text style={styles.dd}>{ Property }</Text>
                </View>
                <View style={styles.dl}>
                    <Text style={styles.dt}>Số lượng:</Text>
                    <View style={styles.dd}>
                        <View style={styles.ddTouchAlign}>
                            <InputSpinner
                                height={30}
                                width={125}
                                rounded={false}
                                showBorder={true}
                                inputStyle={styles.inputEditQuatity}
                                buttonStyle={styles.btnEditQuatity}
                                min={1}
                                step={1}
                                value={Quantity}
                                onChange={_onPressEditQuatity}
                            />
                        </View>
                    </View>
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
                    <View style={styles.dd}>
                        <TextInput
                            style={styles.shopNoteInput}
                            value={note}
                            placeholder={'không có ghi chú'}
                            placeholderTextColor="#ccc"
                            onChangeText={_onEditNote}
                            onEndEditing={_onEndEditNote}
                            textAlign="right"
                        />
                        {/* <TouchableOpacity style={styles.ddTouchAlign} onPress={_onEditNote}><Text style={{}} >{ note ? note : <Text style={{opacity: 0.4}}>không có ghi chú</Text> }</Text></TouchableOpacity> */}
                    </View>
                </View>
            </View>
        </View>
        {isLoading &&  <View style={[StyleSheet.absoluteFill, {justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,.5)", borderRadius: 5}]}>
            <ActivityIndicator size="large" />
        </View>}
    </View> : <View></View>}</>
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
        borderRadius: 4,
        padding: 10,
        position: "relative"
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
        marginBottom: 10,
        flexDirection: "row"
        
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 26,
    
    },
    pdSKUdl: {

    },
    dl:{
        flexDirection: "row",
        alignItems: "stretch",
        
    },
    dt: {
        width: 80,
        opacity: 0.8,
        fontSize: 15,
        paddingVertical: 5,
    },
    dd: {
        flexGrow: 1,
        textAlign: "right",
        flexBasis: "50%",
        fontSize: 15,
        lineHeight: 20,
        paddingVertical: 5
    },
    btnEditQuatity: {
        width: 30,
        height: 30,
        paddingVertical: 0,
        justifyContent: "center"
    },
    inputEditQuatity: {
        height: 30,
        fontSize: 14,
        paddingVertical: 5,
        
    },
    ddTouchAlign: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingVertical: 5,
        marginVertical: -5,
    },
    quantityIndicator: {
        textAlign: "right",
        backgroundColor: '#fff',
        flexBasis: 70,
        padding: 2,
        borderRadius: 5,
        display: "flex",
        borderWidth: 1,
        borderColor: "#e1e1e1",
        fontSize: 15,
        paddingRight: 8
    },
    removeIndicator: {
        width: 25,
        aspectRatio: 1,
        borderRadius: 25,
        backgroundColor: '#ff0103',
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    }
})