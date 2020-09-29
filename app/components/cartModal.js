import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Text, SafeAreaView, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal, { ModalContent, ModalTitle, ScaleAnimation, ModalFooter, ModalButton} from 'react-native-modals';

import CartItem from '~/components/cartItemPreview';

import Utils from '~/utils';
import {settings, color} from '~/config';

const CartModal = props => {
    const navigation = useNavigation();
 
    return <Modal
        visible={props.isShowCart}
        width={0.95}
        modalAnimation={
            new ScaleAnimation({ 
                initialValue: 0, // optional 
                useNativeDriver: true, // optional 
            })
        }
        swipeDirection={['down']} // can be string or an array
        swipeThreshold={300} // default 100
        onSwipeOut={ () => props.setisShowCart(false) }
        onTouchOutside={ () => props.setisShowCart(false) }
        modalTitle={<ModalTitle style={{fontWeight: "bold", fontSize: 18, textTransform: "uppercase"}} title="Đăt hàng thành công" />}
        // footer={null}
        
        footer={<ModalFooter style={{flexDirection: "row", marginBottom: -1 }} bordered={false}>
                <ModalButton
                    bordered={false}
                    text="Tiếp tục mua hàng"
                    style={{backgroundColor: color.dark}}
                    textStyle={{color: '#fff'}}
                    onPress={() =>  props.setisShowCart(false)}
                />
                <ModalButton
                    bordered={false}
                    text="Xem giỏ hàng"
                    style={{backgroundColor: color.primary}}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                        props.setisShowCart(false)
                        // navigation.navigate('CartScreen',{from: 'modal'})
                        navigation.navigate('CartScreen',{
                            screen: 'CartList',
                            params: { from: 'modal' }
                        })
                    }}
                />
            </ModalFooter>   
        }
    >
        <ModalContent style={{}}>
            <CartItem data={props.data} />
        </ModalContent>
    </Modal>
}

export default CartModal;
const styles = StyleSheet.create({
    tea: {
        textTransform: "uppercase"
    }
})