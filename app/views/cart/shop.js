import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Platform,
    Text, SafeAreaView, Image, Dimensions,
    KeyboardAvoidingView, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { Layout, Button, Avatar,  IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '~/context/AuthController';
import { NavContext } from '~/context/NavController';

import HeaderApp, {DrawerToggleBtn} from '~/components/HeaderNav';
import {webViewRoot, webViewURLs, color, settings} from '~/config';
import { getUserData } from '~/api/instanceAPI';
import { getCart_Package, getCart_Warehouse, getCart,
    updateCart_ShopNote, updateCart_UpdateFastDelivery, updateCart_feePacked, updateCart_UpdateFeeCheck, addtoCart, createOrder, OrderReview
} from '~/api/AccountHandler';
import ProductItem from '~/components/carItemEditable';
import {CartContext} from '~/context/CartController';

import utils from '~/utils';
import AppNavigator, { navigationRef }  from "~/navigators/AppNavigator";

const wW = Dimensions.get('window').width;
const wH = Dimensions.get('window').height;

const Shop = props =>{
    const {signOut, state: authState } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const { OrderShopID, OrderShopName, ListProduct, Note, pdActions, metaShop, pdUseState, IsCheckFastDelivery , IsCheckPacked, IsCheckProduct, indexKey } = props;
    const [lcNote, setlcNote] = React.useState(Note || '');
    const [selectedPackage0, setSelectedPackage0] = React.useState(IsCheckProduct || false);
    const [selectedPackage1, setSelectedPackage1] = React.useState(IsCheckPacked || false);
    const [selectedPackage2, setSelectedPackage2] = React.useState(IsCheckFastDelivery || false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSelect, setSelect] = React.useState(props.isSelect);
    // const { data: cartData, setData: setCartData } = pdUseState;
    const { data: cartData, setData: setCartData } = React.useContext(CartContext);
    

    useEffect(() => {
       
        if(Array.isArray(metaShop.warehouseT) && metaShop.warehouseT.length > 0){
            console.log("useEffect metaShop", metaShop)
        }
    }, [metaShop]);
    // useEffect(() => {
        
    //     let newData = cartData; 
    //     console.log(newData[props.indexKey]);
    //     newData[props.indexKey].isSelect = isSelect;
    //     setCartData('');
    //     setCartData(newData);
        
    // }, [isSelect]);
    const mapdatatoTExtObj = (arr, key)=>{
       
        if(arr){
            return arr.map(item => {return {text: item[key], id: item['ID']} })
        } else {
            return []
        }
         
    }

    const wareHouseStateF = useSelectedOption(mapdatatoTExtObj(metaShop.warehouseF, "WareHouseName"));
    const wareHouseStateT = useSelectedOption(mapdatatoTExtObj(metaShop.warehouseT, "WareHouseName"));
    const transportState = useSelectedOption(mapdatatoTExtObj(metaShop.shipType, "ShippingName"));

    useEffect(() => {
        console.log(wareHouseStateF.selectedOption, wareHouseStateT.selectedOption, transportState.selectedOption);
        let string_wareshing = '';
        try {
            string_wareshing =  `${ OrderShopID }-${wareHouseStateF.selectedOption ? wareHouseStateF.selectedOption.id : 1}-${transportState.selectedOption ? transportState.selectedOption.id : 1}-${wareHouseStateT.selectedOption ? wareHouseStateT.selectedOption.id : 1}`
        } catch (error) {
            
        }
        console.log('string_wareshing', string_wareshing);
        
        let newData = cartData
        newData[props.indexKey].wareshing = string_wareshing
        
        // setCartData('');
        setCartData(newData);
        

    }, [wareHouseStateF.selectedOption, wareHouseStateT.selectedOption, transportState.selectedOption]);
    

    _onPressEditQuatity = pddata => {
        return pdActions('EDIT_QUATITY', {...{OrderShopID: OrderShopID}, ...pddata});
    }
    _onEditPdNote = pddata => {
        return pdActions('EDIT_PD_NOTE', pddata);
    }
    _onPressDelete = pddata => {

        return pdActions('DELETE', pddata);
    }
    _onEditNote = (value) => {
        setlcNote(value);
        console.log('_onEditNote', cartData , indexKey);
       
        let newData = cartData; 
        newData[indexKey].Note = value
        // setCartData('');
        setCartData(newData)
        pdActions('EDIT_SHOP_NOTE', {OrderShopID, Note: value})
    }
    _onEndEditNote = async event => {

        setIsLoading(true);
        try {
            const rs = await updateCart_ShopNote({ UID: authState.userID, 
                OrderShopID:  OrderShopID,
                Note: lcNote
            });
            if(rs.Code === "102"){
                
            } else if(rs.Code === "101"){
                Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                signOut();
            }
        } catch (error) {
            console.log("_onEndEditNote error: ", error)
        }     
        
        setIsLoading(false);

    }

  
    _radioOnChange0 = async () => {
        const ischeck = !selectedPackage0;
        // updateCart_UpdateFeeCheck
        setIsLoading(true);
        try {
            const rs = await updateCart_UpdateFeeCheck({ UID: authState.userID, 
                OrderShopID:  OrderShopID,
                chk: ischeck
            });
            if(rs.Code === "102"){
                setSelectedPackage0(ischeck)
            } else if(rs.Code === "101"){
                alert('Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                signOut();
            }
        } catch (error) {
            console.log("_radioOnChange0 error: ", error)
        }     
        
        setIsLoading(false);

        
    }
    _radioOnChange1 = async () => {
        const ischeck = !selectedPackage1;
        
        // updateCart_feePacked
        setIsLoading(true);
        try {
            const rs = await updateCart_feePacked({ UID: authState.userID, 
                OrderShopID:  OrderShopID,
                chk: ischeck
            });
            if(rs.Code === "102"){
                setSelectedPackage1(ischeck)
            } else if(rs.Code === "101"){
                Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                signOut();
            }
        } catch (error) {
            console.log("_radioOnChange0 error: ", error)
        }     
        
        setIsLoading(false);
    }
    _radioOnChange2 = async () => {
        const ischeck = !selectedPackage2;
        
        // updateCart_UpdateFastDelivery
        setIsLoading(true);
        try {
            const rs = await updateCart_UpdateFastDelivery({ UID: authState.userID, 
                OrderShopID:  OrderShopID,
                chk: ischeck
            });
            if(rs.Code === "102"){
                setSelectedPackage2(ischeck)
            } else if(rs.Code === "101"){
                Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                signOut();
            }
        } catch (error) {
            console.log("_radioOnChange0 error: ", error)
        }     
        
        setIsLoading(false);
    }

    _selectWHFChange = value => {
       
        wareHouseStateF.setSelectedOption(value);
        
    }
    _selectWHTChange = value => {
        wareHouseStateT.setSelectedOption(value)
        console.log(value);
    }
    _selectshipTypeChange = value => {
        transportState.setSelectedOption(value)
    }
    _onShopHeadingPress = async () => {
        setSelect(!isSelect)
        let newData = cartData; 
        newData[props.indexKey].isSelect = !isSelect;
        await setCartData('');
        setCartData(newData);
    }

    return <View style={[styles.shopContainer, !isSelect && { backgroundColor: "#444" }]}>
        
        <TouchableOpacity
            style={styles.shopHeading}
            onPress={_onShopHeadingPress}
        >
            <View style={styles.shopIcon}><Image style={styles.shopIconImg} source={require('~/assets/ic_shop.png')} /></View>
            <Text style={[styles.shopTitle,{color: '#fff'}]}> {OrderShopName}</Text>
        </TouchableOpacity>
        
        {!!authState.userToken &&<View style={styles.shopPackage}>
            <TouchableOpacity style={styles.radiolb} onPress={_radioOnChange0}>
                <View style={styles.radio}>{selectedPackage0 && <View style={styles.radioCheck} />}</View><Text style={styles.radioTxt}>Kiểm hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radiolb} onPress={_radioOnChange1}>
                <View style={styles.radio}>{selectedPackage1 && <View style={styles.radioCheck} />}</View><Text style={styles.radioTxt}>Đóng gỗ</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.radiolb} onPress={_radioOnChange2}>
                <View style={styles.radio}>{selectedPackage2 && <View style={styles.radioCheck} />}</View><Text style={styles.radioTxt}>Giao hàng</Text>
            </TouchableOpacity>
        </View>}
        <View style={styles.shopInner}>
            <View style={styles.shopProductList}>
                {
                    ListProduct.map( (item, index) => <ProductItem key={`pd-${index}`} data={ 
                        {
                            ...item, 
                            ...{OrderShopID: OrderShopID}
                        } 
                    }
                    indexKey={index}
                    shopIndexKey={props.indexKey}
                    pdUseState={pdUseState}
                    onPressEditQuatity={_onPressEditQuatity} 
                    onEditNote={_onEditPdNote} 
                    onPressDelete={_onPressDelete}
                    /> )
                }
            </View>
            <View style={styles.shopNote}>
                <Text style={styles.noteTitle}>Thông tin đơn hàng</Text>
                <TextInput
                        style={styles.shopNoteInput}
                        value={lcNote}
                        placeholder={'Ghi chú....'}
                        placeholderTextColor="#ccc"
                        multiline={true}
                        onChangeText={_onEditNote}
                        onEndEditing={_onEndEditNote}
                    />
            </View>
            {!!authState.userToken && <View style={styles.shopAfterLoginOptions}>
                {
                    metaShop.warehouseF.length  > 0  && <View style={styles.optionRow}>
                        <Text style={styles.optSelectLb}>Kho Trung Quốc</Text>
                        <Select
                            style={styles.optSelect}
                            data={wareHouseStateF.data}
                            selectedOption={wareHouseStateF.selectedOption}
                            onSelect={ _selectWHFChange}
                        />
                        
                    </View>
                }
                {
                    metaShop.warehouseT.length  > 0  && <View style={styles.optionRow}>
                        <Text style={styles.optSelectLb}>Kho Nhận</Text>
                        <Select
                            style={styles.optSelect}
                            data={wareHouseStateT.data}
                            selectedOption={wareHouseStateT.selectedOption}
                            onSelect={ _selectWHTChange }
                        />
                        
                    </View>
                }
                {
                    metaShop.shipType.length  > 0  && <View style={styles.optionRow}>
                        <Text style={styles.optSelectLb}>Vận chuyển</Text>
                        <Select
                            style={styles.optSelect}
                            data={transportState.data}
                            selectedOption={transportState.selectedOption}
                            onSelect={ _selectshipTypeChange }
                        />
                    </View>
                }
                
            </View>}
        </View>
        {isLoading &&  <View style={[StyleSheet.absoluteFill, {justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,.5)", borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,}]}>
            <ActivityIndicator size="large" />
        </View>}
    </View>
}
const useSelectedOption = (initData = []) => {
    const [selectedOption, setSelectedOption] = React.useState(initData[0]);
    return { selectedOption, setSelectedOption , data: initData}
}
export default Shop;
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    text: {

    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shopContainer: {
        padding: 4,
        backgroundColor: color.primary,
        marginBottom: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        position: "relative",
    },
    shopHeading: {
        padding: 5,
        flexDirection: "row",
        alignItems: "center"

    },
    shopTitle: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1
    },
    shopIcon: {
        aspectRatio: 1,
        width: 35,
        borderRadius: 18,
        backgroundColor: '#fff',
        padding: 8,
        marginRight: 5
    },
    shopIconImg: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    },
    shopPackage: {
        backgroundColor: '#d4d4d4',
        padding: 5,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",

    },
    radiolb: {
        alignItems: "center",
        flexDirection: "row"
    },
    radio: {
        width: 20,
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 5,
        marginRight: 5
    },
    radioCheck: {
        flex: 1,
        backgroundColor: color.primary,
        borderRadius: 15
    },
    radioTxt: {
        fontSize: 16
    },
    shopInner: {
        backgroundColor: '#fff',
        padding: 10,
        paddingTop: 0,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
    },
    noteTitle: {
        textTransform: "uppercase",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 10
    },
    shopNote: {

    },
    shopNoteInput: {
        backgroundColor: "#f7f7f7",
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 4,
        padding: 10,
        minHeight: 64
    },
    shopAfterLoginOptions: {
        paddingTop: 10
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderTopColor: '#c1c1c1c1',
        borderTopWidth: 1
    },
    optSelectLb: {
        fontSize: 15,
    },
    optSelect:{
        flexBasis: '50%'
    },
    btnCheckout: {

        padding: 15,
        paddingHorizontal: 20,
        backgroundColor: color.primary,
        borderRadius: 4,
        
    },
    btnCheckoutTxt: {
        color: "#fff",
        fontSize: 18,
        lineHeight: 25,
        fontWeight: "bold",
    },
    totalLb: {
        fontSize: 15,
        marginBottom: 2
    },
    totalPrice:{
        fontSize: 20,
        fontWeight: "bold"
    },
    totalPricesub:{
        fontWeight: "normal"
    },
    spinnerTextStyle: {
    color: '#FFF'
    }
});