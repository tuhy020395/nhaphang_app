import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Platform,
    Text, SafeAreaView, Image, Dimensions,
    KeyboardAvoidingView, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { Layout, Button, Avatar,  IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, getFocusedRouteNameFromRoute } from '@react-navigation/native';
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
import Shop from './shop';
const wW = Dimensions.get('window').width;
const wH = Dimensions.get('window').height;

const Cart = props => {
    const {signOut, state: authState } = React.useContext(AuthContext);
    const {state: menuState, setState: setMenuState} = React.useContext(NavContext);
    const navigation = useNavigation();
    const route = useRoute();
    const {from} = route.params;
    
    
    const [isLoading, setLoading] = useState(false);
    const [refreshing, setrefreshing] = React.useState(false);
    const [cartData, setCartData] = useState('');
    const [afterLoginData, setafterLoginData] = useState('')
    const [spinner, setspinner] = useState(false)
    useEffect(() => {
        renderScreenData();
    }, [authState]);

    useEffect(() => {
        console.log(route);
        if(route.params.from === 'modal'){
            renderScreenData();
        }
        if(route.params.from === 'preview'){
            renderScreenData();
            
        }
        
       
    }, [route.params]);
 
    onRefresh = async () =>{
        setrefreshing(true);
        await renderScreenData();
        setrefreshing(false);
    }

    renderScreenData = async () => {
        // authState.userToken
        setLoading(true);
        try {
            const userCart = !!authState.userToken ? await getAsyncAPICart() : JSON.parse(await AsyncStorage.getItem('userCart'));
            
            if(!!userCart) {
                setCartData(userCart.map(item => ({...item, isSelect: true})))
            } else {
                setCartData([])
            }

            
        } catch (error) {
            console.log("renderScreenData - getUserCart fail with error:", error)
        }
        setLoading(false)
    }

    getAsyncAPICart = async ()=>{
        
        let rs_Warehouse, rs_Cart, rs_Package;

        try {
            rs_Warehouse = await getCart_Warehouse({UID: authState.userID})
           
            if(rs_Warehouse.Code === '102'){
                console.log("rs_Warehouse", rs_Warehouse.WateHouse)
                
            } else if( rs_Warehouse.Code === '101' ){
                Alert.alert('Thông Báo','Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                signOut();
            } else {

            }
        } catch (error) {
            console.log('rs_Warehouse error:', error);
        }
        try {
            rs_Package = await getCart_Package({UID: authState.userID})
            console.log(rs_Package)
            if(rs_Package.Code === '102'){
                console.log('rs_Package_afterLoginData', afterLoginData)
                
                
            } else if( rs_Package.Code === '101' ){
                Alert.alert('Thông Báo','Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                signOut(); 
            } else {

            }
        } catch (error) {
            console.log('rs_Warehouse error:', error);
        }
        if(rs_Warehouse && rs_Package){
            setafterLoginData({
                warehouseF: rs_Warehouse.WateHouse.WareHouseFrom,
                warehouseT: rs_Warehouse.WateHouse.WareHouseTo,
                shipType:rs_Warehouse.WateHouse.ShippingType,
                package: rs_Package.ListCheck
            })
        }
        
        
        try {
            let localUserCart = JSON.parse(await AsyncStorage.getItem('userCart'))
            console.log('localUserCart', localUserCart);
            if(!!localUserCart && localUserCart.length > 0){
                
                for (const item of localUserCart) {
                    const listProduct = item.ListProduct;
                    if(listProduct.length > 0)
                        for (const pd of listProduct) {
                            const formatedData = {
                                ProductName: pd.ProductName,
                                PriceCNY: pd.PriceCNY,
                                Property: pd.Property,
                                PropertyValue: pd.PropertyValue,
                                Image: pd.Image,
                                ProviderID: item.OrderShopID,
                                ProviderName: item.OrderShopName,
                                Quantity: pd.Quantity,
                                stock: pd.stock,
                                LinkProduct: pd.LinkProduct,
                                productId: pd.productId,
                                pricestep: pd.pricestep || '',
                                Brand: pd.Brand
                            }
                      
                            await APICALL_addToCart(formatedData, authState)
                                 
                        } 
                }
                await AsyncStorage.removeItem("userCart");
                
            }
            
        } catch (error) {
            console.log('push local cart error:',  error)
        }

        try {
            rs_Cart = await getCart({UID: authState.userID});
            if(rs_Cart.Code === '102'){
               //

            } else if( rs_Cart.Code === '101' ){
               if(rs_Cart.Message == "Hiện tại không có sản phẩm nào trong giỏ hàng của bạn."){
                    
               } else {
                Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                    signOut();
               }
                
            } else {

            }
        } catch (error) {
            console.log('rs_Cart error:', error);
        }
        
        
        return rs_Cart.ListOrderShop ? rs_Cart.ListOrderShop : [];
    }
    const goReviewOrder = async shopdata => {
        console.log('shopdata', shopdata);
        navigation.navigate('OrderReview', {
            UID: authState.userID,
            ...shopdata
        })
    }
   
    _onPressCheckout = async () => {
        
        if(authState.userToken){
            const selectedOrders = cartData.filter(i=>i.isSelect)
            console.log('_onPressCheckout: selectedOrders', selectedOrders)
            
            goReviewOrder({
                wareship: (() => {
                    let rs = '';
                    try {
                        if(!!selectedOrders && selectedOrders.length > 0){
                            rs = selectedOrders.map(item =>item.wareshing).join('|');
                            rs = rs + '|';
                        }
                    } catch (error) {
                        
                    }
                    return rs
                })(),
                listshop: (() => {
                    let rs = '';
                    try {
                        if(!!selectedOrders && selectedOrders.length > 0){
                            rs = selectedOrders.map(item =>item.OrderShopID.toString()).join('|');
                            rs = rs + '|';
                        }
                    } catch (error) {
                        
                    }
                    return rs
                })(),
            })

        } else {
            navigation.navigate('AuthScreen', {});
        }
    }
    _onPdActions = (key, data) => {
        console.log("Cart_onPdActions", key, data)
        console.log(cartData);
    }
    renderTotalPrice = () => {
        let rs = 0;
        try {
            if(cartData){
                try {
                    cartData.filter(item => item.isSelect).map(item => {
                        item.ListProduct.map(pdItem => {
                            rs = rs + parseFloat(pdItem.PriceCNY) * parseFloat(pdItem.Quantity)
                        })
                    })
                } catch (error) {
                    
                }
            }
            rs = utils.addCommas(rs * settings.globalPrice)
        } catch (error) {
            console.log("renderTotalPrice error", error, cartData)
        }
        
        return rs;
    }
    renderSelectedCount = () =>{
        let rs = 0;
        if(cartData){
            rs = Array.from(cartData).filter(item => item.isSelect).length
        }
        
        return rs;
    }

    return <CartContext.Provider value={{data: cartData, setData: setCartData}}>
        <Spinner
          visible={spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <KeyboardAvoidingView
            style={[styles.container, ]}
            behavior={Platform.OS == "ios" ? "position" : "null"}
        >
            {isLoading && <ActivityIndicator size="large" style={{marginTop: 10}} />}
            {!isLoading && <ScrollView style={{height: '100%'}} contentContainerStyle={{padding: 10}}
                // snapToEnd={true}
                refreshControl={ 
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> 
                }
            >
                
                {
                    Array.isArray(cartData) && cartData.length === 0 && <Text style={{ padding: 10, fontSize: 24, textAlign: "center", color: "gray"}}>Không có sản phẩm nào</Text>
                }
                {
                    !!cartData && Array.isArray(cartData) && cartData.map( (item,index)=><Shop  key={`shop-${index}`} { ...item} pdActions={_onPdActions} pdUseState={{data: cartData, setData: setCartData}} metaShop={afterLoginData}  indexKey={index} /> )
                }
                {
                    !!cartData && Array.isArray(cartData) && cartData.length > 0 && <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}> 
                        <View>
                            <Text style={styles.totalLb}>Tổng tính:</Text>
                            <Text style={styles.totalPrice}>{ renderTotalPrice() }<Text style={styles.totalPricesub}> vnđ</Text></Text>
                        </View>
                        
                        <View >
                            <TouchableOpacity style={styles.btnCheckout} onPress={_onPressCheckout}>
                                <Text style={styles.btnCheckoutTxt} >Đặt { renderSelectedCount() } đơn đã chọn</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View> 
                } 
            </ScrollView>}
            <SafeAreaView />
        </KeyboardAvoidingView>
    </CartContext.Provider>
}
export default Cart;

const APICALL_addToCart = async (formatedData, authState) => {
  
    console.log("formatedData load:", formatedData);
    try {
        const rs = await addtoCart({
            ...{UID: authState.userID},
            ...{
                title_origin: formatedData.ProductName,
                title_translated: formatedData.ProductName,
                price_origin: formatedData.PriceCNY,
                price_promotion: formatedData.PriceCNY,
                property_translated: formatedData.Property + ';',
                property: formatedData.Property + ';',
                data_value: formatedData.PropertyValue + ';',
                image_model: formatedData.Image,
                image_origin: formatedData.Image,
                shop_id: formatedData.ProviderID,
                shop_name: formatedData.ProviderName,
                seller_id: formatedData.ProviderID,
                wangwang: formatedData.ProviderName,
                quantity: formatedData.Quantity,
                stock: formatedData.stock,
                location_sale: '',
                site: (()=>{
                    if(formatedData.LinkProduct.includes('taobao')) return 'TAOBAO'
                    if(formatedData.LinkProduct.includes('tmall')) return 'TMALL'  
                    if(formatedData.LinkProduct.includes('1688')) return '1688'  
                    return '';
                })(),
                comment: "",
                item_id: formatedData.productId,
                link_origin: formatedData.LinkProduct,
                outer_id: "",
                error: "",
                weight: "",
                step: "",
                pricestep: (()=>{
                    if(formatedData.LinkProduct.includes('1688')){
                        return formatedData.pricestep + '|';
                    }
                    return '';
                })(),
                brand: formatedData.Brand,
                category_name: 'Đang cập nhật',
                category_id: 1,
                tool: Platform.OS,
                version: '',
                is_translate: false,
            }
        });
        if(rs.Code === "102"){
            
        } else if(rs.Code === "102"){
            if(rs.Logout){
                console.log('APICALL_addToCart___ session TimeOut');
            } else {
                console.log('APICALL_addToCart___', rs.Message);
            }
            
        } else {
            // alert(rs);
        }
        
        
    } catch (error) {
        console.log("call addtocart fail:", error);

    }
}
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