import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Text, SafeAreaView, Image, 
    Platform, Alert, BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
// import translate from 'translation-google';
import translate from '~/translatetion'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal, { ModalContent, ModalTitle, ScaleAnimation, ModalFooter, ModalButton} from 'react-native-modals';

import RefreshWebView from '~/components/refreshWv';
import CartModal from '~/components/cartModal';
import {addtoCart, createOrder} from '~/api/AccountHandler';

import {AuthContext} from '~/context/AuthController';
import { NavContext } from '~/context/NavController';


import Utils from '~/utils'
import {settings, webViewRoot, color, detailJS} from '~/config'


const WebdetailScreen = props =>{
    const {signOut, state: authState } = React.useContext(AuthContext);
    const {state: menuState, setState: setMenuState} = React.useContext(NavContext);

    const navigation = useNavigation();
    const route = useRoute();
    const webview = useRef(null);
    
    const {targetUrl, searchUrl, detailUrl} = route.params;

    const [wvUrl, setUrl] = useState(targetUrl);
    const [isRefresh, setRefresh] = useState(false);
    
    const [wvProcess, setwvProcess] = useState(0);
    const [isDetail, setDetail] = useState(false);
    const [isOpenInfo, setOpenInfo] = useState(false);
    const [isShowCart, setisShowCart] = useState(false);
    const [atc_Loading, setatc_Loading] = useState(false);
    const urlInputState = useInputState(wvUrl);
    const searchInputState = useInputState("");
    const noteInputState = useInputState("");
    const cartState = useCartState('');

    useEffect(() => {
        if(cartState.data){
            // console.log("useEffect cartState",cartState)
            setisShowCart(true);
        }   
        
    }, [cartState.data]);
    
    //
    // urlInputState.onChangeText = value => {    
    // }
    //
    const _onRef = () => {
        setRefresh(true);
        webview.current.reload();
        setRefresh(false);
    }

    const SENDMESS_getCurrentProductProps = () => {
        // console.log(require('./tb'));

        const injectJs = (() => {
            if(wvUrl.includes('taobao')){
                return detailJS.TAOBAO
            }
            if(wvUrl.includes('tmall')){
                return detailJS.TAOBAO
            }
            if(wvUrl.includes('1688')){
                return detailJS['1688']
            }
            return '';
        })();
        
        webview.current.injectJavaScript(injectJs);

    }
 

    _onSubmitEditingUrlInput = () =>{
        setUrl(urlInputState.value.replace('modal=sku', ''));
    }
    _onPressSearchURL = async () => {
        let translateValue = '';
        try {
            translateValue =  await translate(searchInputState.value, {to: 'zh-cn'});
        } catch (error) {
            
        }
        let searchText = searchInputState.value;
        try {
            searchText =  translateValue[0][0][0];
        } catch (error) {
            
        }
        setUrl(searchUrl + searchText );
        
    }
    
    _onPressOrderProps  = () => {
        console.log(wvUrl);
        if(isDetail){
            if(webview.current){
                let jsToggleViewinfo = ``;
                wvUrl.includes('taobao') && (jsToggleViewinfo = `if(document.querySelectorAll(".split > .card.sku .modal-mask-enter").length > 0){
                    document.querySelectorAll(".split > .card.sku .modal-mask-enter")[0].click();
                } else {
                    document.querySelectorAll(".split > .card.sku")[0].click();
                }`);
                wvUrl.includes('1688') && (jsToggleViewinfo = `
                    if(!!document.querySelector('.takla-wap-b2b-skuselector-component')){
                        if(getComputedStyle(document.querySelector('.takla-wap-b2b-skuselector-component')).display === "block"){
                            document.querySelector('.takla-wap-b2b-skuselector-component .component-sku-selector-mask').click()
                        } else {
                            
                            document.querySelector('#widget-wap-detail-common-sku .J_SkuBtn').click()
                        }
                    } else {
                        document.querySelector('#widget-wap-detail-common-sku .J_SkuBtn').click()
                    }
                    
                    
                    
                    
                `);
                webview.current.injectJavaScript(jsToggleViewinfo);
                
            }
        }
        
    }
    _onPressOrderAddToCart = () => {
        if(isDetail){
            if(webview.current){
                
                if(cartState.data.isLoading){
                    
                } else {
                    wvUrl.includes('taobao') && webview.current.injectJavaScript(`if(document.querySelectorAll(".split > .card.sku .modal-mask-enter").length > 0){
                    } else {
                        document.querySelectorAll(".split > .card.sku")[0].click();
                    }`);

                    wvUrl.includes('1688') && webview.current.injectJavaScript(`if(!!document.querySelector('.takla-wap-b2b-skuselector-component')){
                        if(getComputedStyle(document.querySelector('.takla-wap-b2b-skuselector-component')).display === "block"){
                          
                        } else {
                            document.querySelector('#widget-wap-detail-common-sku .J_SkuBtn').click()
                        }
                    } else {
                        document.querySelector('#widget-wap-detail-common-sku .J_SkuBtn').click()
                    }`)

                    SENDMESS_getCurrentProductProps();
                }
                    
                
            }
        }
    }
    ///
    _onNavigationStateChange = newNavState => {
        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }
        console.log("webviewDetail state:", newNavState);
        const { url, canGoBack, navigationType } = newNavState;
        const { userToken, userID } = authState;
        if (!url) return;

        urlInputState.onChangeText(url)
        let checkDt = detailUrl.toString().trim().split('|').some(s => url.includes(s))
        setDetail(checkDt);
        if(checkDt){
            setUrl(url);
            url.includes('taobao') && webview.current.injectJavaScript(`
                if(document.querySelectorAll(".bar").length > 0){
                    document.querySelectorAll(".bar")[0].style.display = 'none';   
                }
                if(document.querySelectorAll(".sku.card .modal-btn-wrapper").length > 0){
                    document.querySelectorAll(".sku.card .modal-btn-wrapper")[0].style.display = 'none'
                }
            `);
            url.includes('tmall') && webview.current.injectJavaScript(`
                
            `);
            url.includes('1688') && webview.current.injectJavaScript(`
                if(document.querySelectorAll(".detail-footer-container").length > 0){
                    document.querySelectorAll(".detail-footer-container")[0].style.display = 'none'
                }
            `);
        }
    }
    const APICALL_addToCart = async formatedData => {
        setatc_Loading(true);
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
                cartState.setData(formatedData)
            } else if(rs.Code === "102"){
                if(rs.Logout){
                    Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                } else {
                    Alert.alert('Thông Báo', rs.Message);
                }
                
            } else {
                Alert.alert('Thông Báo', rs);
            }
            
            
        } catch (error) {
            console.log("call addtocart fail:", error);

        }
        setatc_Loading(false)
    }
    _onMessage = async e =>{
         //listen post message form webview
        if(isDetail){
            //detail page
            console.log("_onMessage", JSON.parse(e.nativeEvent.data));
            const res = JSON.parse(e.nativeEvent.data);
            switch (res.action) {
                case 'GET_PRODUCT_PROPS_TB':
                    console.log("res.data", res.data);
                    if(!res.data) return;
                    const metaData = res.data.productMeta;
                    const productData = res.data.productSKU;
                    console.log("productData", productData)
                    
                    //mua lẻ
                    if(productData.stock.match(/\d+/g)[0] === "0"){
                        Alert.alert('Thông Báo', 'Sản phẩm này đã hết hàng.');
                        break;
                    }
                     
                    const isSelectedAll = productData.list.map(item => {
                        
                        const tmp = item.props.some(item => item.isSelected);

                        return tmp;
                    }).every(Boolean);

                    if(isSelectedAll){
                        //run add to cart
                        console.log( 'cart note:', noteInputState.value)
                        console.log('meta data:', metaData)
                        const selectedSKU = productData.list.map(item => {
                            const tmp = item.props.filter(item => item.isSelected);
                            return {
                                title: item.title,
                                props: tmp[0]
                            };
                        })
                        productData.selectedSKU = selectedSKU
                        metaData.note = noteInputState.value
                        // console.log('product data', productData)
                        let formatedData = Utils.formatProductData(res.data);
                        
                        if(!!authState.userToken){
                            APICALL_addToCart(formatedData);
                        } else {
                            setatc_Loading(true)
                            await addProductAsync(formatedData);
                            cartState.setData(formatedData)
                            setatc_Loading(false)
                        }

                    } else {
                        Alert.alert('Thông Báo', 'Vui lòng chọn đủ các thuộc tính sản phẩm(mẫu mã, kích cỡ, màu sắc, số lượng,...)');
                    }
                        
                    break;
                case 'GET_PRODUCT_PROPS_1688':
                    console.log("res.data", res.data);
                    if(!res.data) return;
                    const metaData1688 = res.data.productMeta;
                    const productData1688 = Array.from(res.data.productSKU_list);
                    if(productData1688.length === 0) {
                        Alert.alert('Thông Báo', 'Bạn chưa chọn sản phẩm');
                        break;
                    }
                    if(metaData1688.priceStep){
                        if(parseInt(metaData1688.priceStep.split('-')[0]) > parseInt(metaData1688.quantity)){
                            Alert.alert('Thông Báo', `Số lượng sản phẩm chưa đủ. Bạn phải chọn ít nhất ${ metaData1688.priceStep.split('-')[0] } sản phầm`);
                            break;
                        }
                    }
                
                    if(!!authState.userToken){
                        let tmpPrices = metaData1688.priceStep.split('|').filter(item => {
                            let a = item.split(':')[0];
                            let b = item.split(':')[1];
                            
                            return parseInt(metaData1688.quantity) >= parseInt(a.split('-')[0]) && parseInt(metaData1688.quantity)<= parseInt(a.split('-')[1]); 
                            
                        });
                        if(tmpPrices.length > 0){
                            tmpPrices = tmpPrices[0].split(':')[1];
                        }
                        
                     
                        productData1688.map(item => {
                            APICALL_addToCart({
                                "OrderTempID": '',
                                productId: metaData1688.productId || '',
                                "ProductName": metaData1688.productName || '',
                                "Image": item.img || '',
                                "LinkProduct": metaData1688.linkOrigin,
                                "Property": item.Property,
                                "Brand": noteInputState.value || '',
                                "Quantity": item.Quantity,
                                "ProviderID": metaData1688.provider.id,
                                "ProviderName": metaData1688.provider.name,
                                "PriceCNY": item.price || tmpPrices,
                                "PropertyValue": item.PropertyValue,
                                "stock": item.stock || '',
                                "pricestep": metaData1688.priceStep || '',
                            });
                        })

                    } else {
                        setatc_Loading(true)
                        for (const item of productData1688){
                            let formatedData = {
                                Brand: noteInputState.value,
                                Image: item.img,
                                LinkProduct: metaData1688.linkOrigin,
                                OrderTempID: "",
                                PriceCNY: item.price,
                                ProductName: metaData1688.productName,
                                Property: item.Property,
                                PropertyValue: item.PropertyValue,
                                ProviderID: metaData1688.provider.id,
                                ProviderName: metaData1688.provider.name,
                                Quantity: item.Quantity,
                                pricestep: metaData1688.priceStep,
                                productId: metaData1688.productId,
                                stock: item.stock
                            }
                            await addProductAsync(formatedData);
                            cartState.setData(formatedData)
                        }
                        setatc_Loading(false)
                       

                    }

                    break;
                default:
                    console.log('_onMessage res: chưa handle action hoặc thiếu key action');
                    break;
            }
        }
    }
    
    _onLoadProgress = ({ nativeEvent }) => {
        setwvProcess(nativeEvent.progress * 100);
    }


    return <Layout style={styles.container}>
            <ProcessBar percent={wvProcess} />
            <View style={[styles.wvHeader, styles.rowContainer]}>
                <UrlInput
                    style={[styles.input, {flexGrow: 20, width: 40}]}
                    // editable={!isLoading}
                    selectTextOnFocus={true}
                    isSelectionOnTouch={true}
                    onSubmitEditing={_onSubmitEditingUrlInput}
                    keyboardType={settings.deviceOS === 'ios' ? 'default' : 'default' }
                    {...urlInputState}
                    
                />
                <UrlInput 
                    style={[styles.input, {flexGrow: 2, width: 40, marginLeft: 5}]}
                    placeholderTextColor="#ccc" 
                    placeholder="Nhập từ khoá tìm kiếm"
                    // editable={!isLoading}
                    autoCapitalize="none"
                    // keyboardType="url"
                    {...searchInputState}
                    // onFocus={_onFocus}
                />
                <TouchableOpacity 
                    style={[styles.wvArrowBtn, {marginLeft: 5}]}
                    onPress={_onPressSearchURL}
                >
                    <Text style={[styles.text, {color: "#fff"}]}><Icon name="arrow-right" size={18} /></Text>
                </TouchableOpacity>
            </View>
            <View style={styles.pageContent}>
                {/* <WebView
                    ref={webview}
                    style={{ marginTop: 0 }}
                    source={{ uri: wvUrl }}
                    onNavigationStateChange={_onNavigationStateChange}
                    onMessage={_onMessage}
                    onLoadProgress={_onLoadProgress}
                    
                /> */}
                <RefreshWebView
                    isRefresh={isRefresh} 
                    onRefresh={_onRef}
                    ref={webview}
                    style={{ marginTop: 0 }}
                    source={{ uri: wvUrl }}
                    onNavigationStateChange={_onNavigationStateChange}
                    onMessage={_onMessage}
                    onLoadProgress={_onLoadProgress}
                />
               
            </View>
            {isDetail && wvProcess >= 70 && <><View style={[styles.BottomBtnGroup, styles.rowContainer]}>
                <View style={styles.btnWrap}>
                    <TouchableOpacity 
                        style={[styles.btn, {backgroundColor: "green"}]}
                        onPress={_onPressOrderProps}
                    >
                        <Text style={styles.btnTxt}>Xem thuộc tính</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.btnWrap}>
                    <NoteModal input={noteInputState} />
                </View>
                <View style={styles.btnWrap} >
                        <TouchableOpacity 
                            style={[styles.btn, {}]}
                            onPress={atc_Loading ?  ()=>{} : _onPressOrderAddToCart}
                        >
                            <Text style={styles.btnTxt}>{atc_Loading ? 'Đang xử lý' : 'Đặt hàng'}</Text>
                        </TouchableOpacity>
                </View>
                
            </View>
            <CartModal {...cartState} { ...{isShowCart, setisShowCart}} />
            <SafeAreaView /></>}
    </Layout>
}
export default WebdetailScreen;
const useInputState = (initialValue = '') => {
    const [value, setValue] = React.useState(initialValue);
    return { value, onChangeText: setValue };
};

const addProductAsync = async (data) => {
      
    console.log("addProductAsync - data:", data)
    
    console.log('push data to local')
    let userCart;
    try {
        userCart = await AsyncStorage.getItem('userCart')
        userCart = JSON.parse(userCart)
        // await AsyncStorage.removeItem('userCart')
    } catch (error) {
        //get cart data fail
    }
    
    if(userCart){
        console.log('has current userCart', userCart);
        if(userCart.some(item => item.OrderShopID === data.ProviderID)){
            console.log('merge shop data to userCart...');
            //merge shop data
            for (const item of userCart) {
                if(item.OrderShopID === data.ProviderID){
                    const listProduct = item.ListProduct;
                    if(listProduct.some(item => item.PropertyValue === data.PropertyValue)){
                        console.log('merge quantity data to userCart - Products...', data);
                        for (const pd of listProduct) {
                            if(pd.PropertyValue === data.PropertyValue){
                                pd.Quantity = parseInt(pd.Quantity) + parseInt(data.Quantity);
                                await AsyncStorage.setItem('userCart', JSON.stringify(userCart));
                                return;
                            } 
                        }
                        
                    } else {
                        console.log('push new data to userCart - Products...', data);
                        listProduct.push({
                            OrderTempID: "",
                            ProductName: data.ProductName,
                            productId: data.productId,
                            Image: data.Image,
                            LinkProduct: data.LinkProduct,
                            Property: data.Property,
                            PropertyValue: data.PropertyValue,
                            Brand: data.Brand,
                            // PriceVN: "268,600",
                            PriceCNY: data.PriceCNY,
                            pricestep: data.pricestep,
                            // TotalPriceVN: "268,600",
                            // TotalPriceCNY: "79",
                            Quantity: data.Quantity,
                            stock: data.stock
                        });
                        await AsyncStorage.setItem('userCart', JSON.stringify(userCart));
                    }
                    
                    return;
                }
            }
            

        } else {
            const ListNewProduct = () => {
                let rs = '';
                rs = [{
                    OrderTempID: "",
                    productId: data.productId,
                    ProductName: data.ProductName,
                    Image: data.Image,
                    LinkProduct: data.LinkProduct,
                    Property: data.Property,
                    PropertyValue: data.PropertyValue,
                    Brand: data.Brand,
                    // PriceVN: "268,600",
                    PriceCNY: data.PriceCNY,
                    pricestep: data.pricestep,
                    // TotalPriceVN: "268,600",
                    // TotalPriceCNY: "79",
                    Quantity: data.Quantity,
                    stock: data.stock
                }]
                return rs;
            }
            userCart.push({
                OrderShopID: data.ProviderID,
                OrderShopName: data.ProviderName,
                IsCheckProduct: false,
                IsCheckPacked: false,
                IsCheckFastDelivery: false,
                Note: "",
                ListProduct: ListNewProduct()
            });
            await AsyncStorage.setItem('userCart', JSON.stringify(userCart));
        }


    } else {
        console.log("userCart null - make new userCart");
        await AsyncStorage.setItem('userCart', JSON.stringify([{
            OrderShopID: data.ProviderID,
            OrderShopName: data.ProviderName,
            IsCheckProduct: false,
            IsCheckPacked: false,
            IsCheckFastDelivery: false,
            Note: '',
            "ListProduct": [
                {
                    OrderTempID: '',
                    ProductName: data.ProductName,
                    Image: data.Image,
                    LinkProduct: data.LinkProduct,
                    Property: data.Property,
                    PropertyValue: data.PropertyValue,
                    Brand: data.Brand,
                    PriceCNY: data.PriceCNY,
                    Quantity: data.Quantity,
                    pricestep: data.pricestep,
                    stock: data.stock,
                    productId: data.productId,
                }
            ]
        }]));
    }

}

const useCartState  = (initialValue = '') => {
    const [data, setData] = React.useState(initialValue);
    const [loading, setLoading] =  React.useState(false);
    const {signOut, state: authState } = React.useContext(AuthContext);
    
    // useEffect(() => {
    //     !!data && addProductAsync();
    // }, [data]);
    


    return { data, setData: setData, isLoading: loading, setLoading: setLoading};
};
const UrlInput = props =>{
    const [isFocus, setFocus] = useState(false);
    const ref = useRef(null);
    _onFocus = ({nativeEvent}) => {
        setFocus(true);
        if(Platform.OS === 'ios' && props.isSelectionOnTouch){
            console.log(nativeEvent);
            setTimeout(function(){
                ref.current.setNativeProps({ selection:{ start:0, end: nativeEvent.text.length } })
            }, 100);
        }
    }
    _onBlur = ({nativeEvent}) => {
        // console.log(nativeEvent);
        setFocus(false);
    }
    // alert(JSON.stringify(props.style));
    return <TextInput
        ref={ref}
        placeholderTextColor="#000" 
        placeholder=""
        // editable={!isLoading}
        autoCapitalize="none"
        onFocus={_onFocus}
        onBlur={_onBlur}
        {...props}
        style={[...props.style, isFocus && styles.focus]} 
    />
}
const ProcessBar = props =>{
    return <View style={{height: 3, width: '100%', backgroundColor: color.headerBackgroundColor,}} >
        <View style={{ backgroundColor: color.primary, height: '100%', width: `${props.percent}%`}} />
    </View>
}

const NoteModal = props =>{
    const [show, setshow] = useState(props.isShow || false);

    return <>
    <TouchableOpacity 
        style={[styles.btn, {backgroundColor: color.dark}]}
        onPress={()=>setshow(true)}
    >
        <Text style={styles.btnTxt}>Ghi chú</Text>
    </TouchableOpacity>
    <Modal
            visible={show}
            width={0.8}
            modalAnimation={
                new ScaleAnimation({ 
                    initialValue: 0, // optional 
                    useNativeDriver: true, // optional 
                })
            }
            swipeDirection={['down']} // can be string or an array
            swipeThreshold={300} // default 100
            onSwipeOut={ () => setshow(false) }
            onTouchOutside={ () => setshow(false) }
            modalTitle={<ModalTitle style={{fontWeight: "bold", fontSize: 16}} title="Thêm ghi chú" />}
            footer={null}
            // footer={<ModalFooter>
            //         <ModalButton
            //             text="Thêm"
            //             onPress={() => { 
                            
            //                 }
            //             }
            //         />
            //     </ModalFooter>   
            // }
        >
        <ModalContent style={{paddingTop: 0}}>
            <TextInput   
                placeholderTextColor="#222" 
                placeholder="Ghi chú...."
                multiline={true}
                {...props.input}
                autoCapitalize="none"
            />
        </ModalContent>
    </Modal>
    </>
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
    wvHeader: {
        backgroundColor: color.headerBackgroundColor,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    BottomBtnGroup: {
        padding: 5,
    },
    input: {
        backgroundColor: '#fff',
        color: '#000',
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 8,
        lineHeight: 20,
        borderRadius: 4,
        // height: 40
    },
    focus: {
        width: "60%",
        flexGrow: 20
    },
    wvArrowBtn: {
        backgroundColor: color.primary,
        borderRadius: 4,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        lineHeight: 20,
        minWidth: 40,
        minHeight: 40,
    },
    btnWrap:{
        flexGrow: 1,
        margin: 2.5
    },
    btn: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: color.primary,
    },
    btnTxt: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        lineHeight: 20,
        textAlign: "center",
        color: '#fff',
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    pageContent: {
        flex: 1,
    },
})