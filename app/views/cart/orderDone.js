import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Platform,
    Text, SafeAreaView, Image, SectionList,
    KeyboardAvoidingView, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { Layout, Button, Avatar,  IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { KeyboardAwareScrollView, KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation, useRoute } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';

import {AuthContext} from '~/context/AuthController';
import {NavContext} from '~/context/NavController';
import {CartContext} from '~/context/CartController';
import HeaderApp, {DrawerToggleBtn} from '~/components/HeaderNav';
import {webViewRoot, webViewURLs, color, settings} from '~/config';
import { getUserData } from '~/api/instanceAPI';
import { createOrderV2 , OrderReview} from '~/api/AccountHandler';
import ProductItem from '~/components/cartItemPreview';
import AppNavigator, { navigationRef }  from "~/navigators/AppNavigator";

import utils from '~/utils'; 

const ShipingCtx = React.createContext();
const OrderDone = props => {
    const {signOut, state: authState } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();
    // const {data} = route.params;
    const [spinner, setspinner] = useState(false)
    const [isLoading, setLoading] = useState(false);
    const [refreshing, setrefreshing] = React.useState(false);
    const [sData, setSData] = React.useState([]);
    const [pricingTt, setTt] =  React.useState(0);
    const [mdata, setmData] =  React.useState('');
    // navigation.setOptions({
    //     headerRight: () => null,
    //     headerTitle : () => <Text style={{color: '#fff', fontSize: 16, fontWeight: "bold", textTransform: "uppercase"}}>Đơn hàng</Text>,
    //     headerTitleAlign: "center",
    //     gesturesEnabled: false
    // })
   
    
    useEffect(() => {
        renderScreenData();   
    }, [])


    const renderScreenData = async () =>{
        setLoading(true);
        try {
            const screenData = await getOrderReviewData();
            console.log('screenData', screenData);
            
            if(!!screenData){
                // list data
                !!screenData.ListShop && setSData(screenData.ListShop.map(item => {
                        let data = item.ListProduct;
                        delete item.ListProduct;
                        return Object.assign({}, {...item, data})
                    })
                )
                // meta data
                try {
                    setmData({
                        FullName: screenData.FullName, 
                        Phone: screenData.Phone, 
                        Email: screenData.Email, 
                        Address: screenData.Address
                    });
                    
                } catch (error) {
                    
                }
                
                // calc total
                try {
                    let tt = 0;
                    screenData.ListShop.map(shopItem => {
                        tt = tt + parseInt(shopItem.TotalPriceVND);
                    });
                    setTt(tt);
                    
                } catch (error) {
                    console.log('settt error', error);
                    
                }
                
            } else {
                console.log('renderScreenData error screenData', screenData);
            }
        } catch (error) {
            console.log('renderScreenData error', error)
        }
        setLoading(false);
    }
    
    const onRefresh = async () =>{
        setrefreshing(true);
        await renderScreenData();
        setrefreshing(false);
    }
    const _onPressOrderFinish = async () => {
        setspinner(true);
        try {
           
            
            // Alert.alert('Đặt hàng thành công', 'Đơn hàng của bạn đã được thêm vào hệ thống',[])
            
            const res = await createOrderV2( {
                ...mdata,
                ...route.params
            });
            
            if(res.Code === '102'){
                // setspinner(false);
                Alert.alert(
                    'Đặt hàng thành công',
                    'Đơn hàng của bạn đã được thêm vào hệ thống',
                    [
                        {
                            text: 'Trở về',
                            onPress: () => { 
                                setspinner(false);
                                navigation.navigate('CartScreen',{
                                    screen: 'CartList',
                                    params: { from: 'preview' }
                                })
                            },
                            style: 'cancel',
                        },
                        {
                            text: 'Xem danh sách',
                            onPress: () => { 
                                setspinner(false);
                                const {userID, userToken} = authState;
                                let searchURL = '?UID=0&Key=';
                                if(userToken){
                                    searchURL = `?UID=${ userID }&Key=${ userToken }`
                                }
                                navigationRef.current?.navigate('DashboardDetail', {targetUrl: `${ webViewRoot }/don-hang-app.aspx${searchURL}`, action: 'webview'})
                              
                            },
                        },
                   
                    ],
                    { cancelable: false },
                );
                

             } else if( res.Code === '101' ){
                if(res.Logout){
                    Alert.alert('Thông Báo','Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                    signOut(); 
                } else {
                    Alert.alert('Thông Báo', res)
                }
                 
             } else {
                Alert.alert('Thông Báo', res)
             }
            
        } catch (error) {
            console.log(error);
        }
        // setspinner(false);
    }
    const getOrderReviewData = async () =>{
        try {
            // Alert.alert('Đặt hàng thành công', 'Đơn hàng của bạn đã được thêm vào hệ thống',[])
           
           
            const res = await OrderReview(route.params);
            
            if (res.Code === '102') {
                return res.data;
            } else if (res.Code === '101') {
                if (res.Logout) {
                    Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                    signOut();
                } else {
                    Alert.alert('Thông Báo', JSON.stringify(res))
                }

            } else {
                Alert.alert('Thông Báo', JSON.stringify(res))
            }
            return '';
        } catch (error) {
            console.log(error);
            return '';
        }
    }
    const Lfooter = () => {
        return <View style={[]}>

        </View>
       
    }
    return <>
        
        <Spinner
          visible={spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={[styles.header]}>
            <View style={[styles.headerLeft]}>
            {<TouchableOpacity
                    onPress={ () => navigation.navigate('CartScreen',{from: 'modal'}) }
                >
                    <View style={styles.backbtn}>
                        <Text style={styles.btnTxt}>
                            <Icon name="angle-left" size={30}  />
                        </Text>
                        <Text style={[styles.btnTxt, { paddingTop: 3, paddingLeft: 3}]}>
                            {'Trở lại'} 
                        </Text>
                    </View>
                </TouchableOpacity>}
            </View>
        </View>
        <ShipingCtx.Provider value={{data: mdata, setData: setmData}}> 

            <KeyboardAwareSectionList
                style={[styles.container, {padding: 15, overflow: "hidden", paddingTop: 0}]}
                behavior={Platform.OS == "ios" ? "position" : "null"}
                keyboardShouldPersistTaps="handled"
                refreshControl={ 
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> 
                }
                sections={sData}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({item}) => <ProductItem data={item} styles={styles.productItem} />}
                renderSectionHeader={ ({ section }) => (<>
                    <View style={styles.shopHeading}>
                        <Text style={styles.shopTitle}>{section.OrderShopName}</Text>
                    </View>
                    <View style={{height: 1, backgroundColor: "#c1c1c1", marginTop: 15}} />
                </>)}
                renderSectionFooter ={ ({ section }) => (
                    <ShopItemFooter  data={section}/>
                )}
                ListFooterComponent={Lfooter}
                ListHeaderComponent={Lheader}
                ListEmptyComponent={()=> <ActivityIndicator size="large" />}
            />
        </ShipingCtx.Provider>
        <View>
            <TouchableOpacity
                style={[styles.btnCheckout]}
                onPress={_onPressOrderFinish}
            >
                <View style={[ {width: "100%", justifyContent: "center", flexDirection: "row"} ]}>
                    <Text style={[styles.btnCheckoutTxt, {flexGrow: 1}]}>{`${utils.addCommas(pricingTt)}`} VND {' '} </Text> 
                    <Text style={[styles.btnCheckoutTxt, {alignSelf: "flex-end"}]}>Hoàn tất <Icon name='chevron-right' size={14}/></Text>
                </View>
                <SafeAreaView />
            </TouchableOpacity>
            
        </View>
        
    </>
 
}
export default OrderDone;


const Lheader = ()=> {
    const {data: shippingData, setData} = React.useContext(ShipingCtx);
    
    const _onEditmData = name => {
        return (text) => {
            // console.log(name, text);
            // dispatchshippingData({type: name, value: text});
            setData({...shippingData, [name]: text});
            
        }
    }
    return <View style={[styles.orderMeta]}>
        <Text style={styles.orderMeta_heading}>
            Thông tin người nhận
        </Text>
        <View style={{height: 1, backgroundColor: "#c1c1c1"}} />
        <View style={styles.orderMeta_cnt}>
            <View style={styles.dl}>
                <Text style={styles.dt}>Tên:</Text>
                <View style={styles.dd}>
                    <TextInput
                        style={styles.shipingNoteInput}
                        value={shippingData.FullName}
                       
                        placeholder={'Tên'}
                        placeholderTextColor="#ccc"
                        onChangeText={_onEditmData('FullName')}
                        textAlign="right"
                    />
                </View>
            </View>
            <View style={styles.dl}>
                <Text style={styles.dt}>Email:</Text>
                <View style={styles.dd}>
                    <TextInput
                        style={styles.shipingNoteInput}
                        value={shippingData.Email}
                        placeholder={'Email'}
                        placeholderTextColor="#ccc"
                        onChangeText={_onEditmData('Email')}
                        textAlign="right"
                        keyboardType="email-address"
                    />
                </View>
            </View>
            <View style={styles.dl}>
                <Text style={styles.dt}>Phone:</Text>
                <View style={styles.dd}>
                    <TextInput
                        style={styles.shipingNoteInput}
                        value={shippingData.Phone}
                        placeholder={'Phone'}
                        placeholderTextColor="#ccc"
                        onChangeText={_onEditmData('Phone')}
                        textAlign="right"
                    />
                </View>
            </View>
            <View style={styles.dl}>
                <Text style={styles.dt}>Địa chỉ:</Text>
                <View style={styles.dd}>
                    <TextInput
                        style={styles.shipingNoteInput}
                        value={shippingData.Address}
                        placeholder={'Địa chỉ'}
                        placeholderTextColor="#ccc"
                        onChangeText={_onEditmData('Address')}
                        textAlign="right"
                    />
                </View>
            </View>
        </View> 
    </View>
}
const ShopItemFooter = props => {
   
    const {data} = props;
    const addServ = [];
    const ShopPrice = () => {
        let rs = 0;
        
        try {
            if(!!data.data){
                try {
                    data.data.map(pdItem => {
                        rs = rs + parseInt(pdItem.TotalPriceVN.replace(/,/gm,''));
                        
                    })
                } catch (error) {
                   console.log(error);
                }
            }
            rs = utils.addCommas(rs)
        } catch (error) {
            console.log("shopPrice error", error)
        }
        
        return rs;
    }
    data.IsCheckFastDelivery && addServ.push('Giao hàng');
    data.IsCheckPacked && addServ.push('Đóng gỗ');
    data.IsCheckProduct && addServ.push('Kiểm hàng');
    
    return <>
        <View style={{height: 1, backgroundColor: "#c1c1c1", }} />
        <View style={[styles.shopFtwrap]}>
            <View style={styles.dl}>
                <Text style={styles.dt}>Ghi chú của shop:</Text>
                <Text style={styles.dd}>{ data.Note ? data.Note : <Text style={{opacity: 0.4}}>không có ghi chú</Text> }</Text>
            </View>
            <View style={styles.dl}>
                <Text style={styles.dt}>Dịch vụ kèm theo:</Text>
                <Text style={styles.dd}>
                    {!!addServ.length && addServ.join(', ')}
                    {!!!addServ.length && <Text style={{opacity: 0.4}}>không có dịch vụ</Text>}
                </Text>
            </View>
            <View style={styles.dl}>
                <Text style={styles.dt}>Tổng phụ:</Text>
                <Text style={styles.dd}>{ <ShopPrice /> }</Text>
            </View>
            <View style={styles.dl}>
                <Text style={styles.dt}>Phí mua hàng:</Text>
                <Text style={styles.dd}>{utils.addCommas(data.FeeBuyPro)}</Text>
            </View>
            <View style={styles.dl}>
                <Text style={styles.dt}>Phí kiểm hàng:</Text>
                <Text style={styles.dd}>{utils.addCommas(data.FeeCheck)}</Text>
            </View>
            <View style={{height: 1, backgroundColor: "#c1c1c1", marginVertical: 5}} />
            <View style={styles.dl}>
                <Text style={[styles.dt, {fontWeight: "bold"}]}>Tổng tiền VND:</Text>
                <Text style={[styles.dd, {fontWeight: "bold"}]}>{utils.addCommas(data.TotalPriceVND)}</Text>
            </View>
        </View>
    </>
}


const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        backgroundColor: "#f2f2f2",
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
        padding: 10,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginBottom: -15,
        borderRadius: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    shopTitle: {
        fontSize: 18,
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
    productItem: {
        backgroundColor: "#fff", 
        marginTop: 0, 
        borderRadius: 0,
        borderWidth: 0,
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
    shipingNoteInput: {
        backgroundColor: "#f7f7f7",
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 4,
        padding: 5,
        minHeight: 30
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
        paddingVertical: 15,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: color.primary,
        borderRadius: 0,
    },
    btnCheckoutTxt: {
        color: "#fff",
        fontSize: 18,
        lineHeight: 25,
        fontWeight: "bold",
        textAlign: "center",
        textAlignVertical: "center",
        
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
    },
    header: {
        backgroundColor: "transparent",
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 50
    },
    backbtn: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "blue",
        paddingVertical: 10
    },
    btnTxt: {
        fontSize: 16,
        paddingHorizontal: 5,
        color: color.primary,
    },
    shopFtwrap: {
        marginBottom: 15,
        minHeight: 10,
        backgroundColor: '#fff',
        padding: 15,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5
    },
    orderMeta: {
        backgroundColor: '#fff',   
        borderRadius: 5,
        marginBottom: 30
    },
    orderMeta_heading: {
        fontSize: 16,
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 15,

    },
    orderMeta_cnt: {
        padding: 10,
    },
    dl:{
        flexDirection: "row",
        alignItems: "stretch",
        paddingVertical: 2,
    },
    dt: {
        opacity: 0.8,
        flexBasis: "40%",
        fontSize: 15
    },
    dd: {
        flexGrow: 1,
        textAlign: "right",
        flexBasis: "50%"
    }
});