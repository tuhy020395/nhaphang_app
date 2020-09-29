import instance, {getAccessToken, getUserData} from './instanceAPI';
import {settings} from '~/config';
import utils from '~/utils';


const InstancePath = '';

export const getLogin = async params  =>{
    let data = '';
   
    try {
        let res  = await instance.get(InstancePath + '/Login', {
            //setting
            params: {...params,
                Type: settings.deviceOSType,
                DeviceToken: settings.userId || '' ,
                TypeName: settings.deviceOS,
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const getRegister = async params  =>{
    let data = '';
   
    try {
        let res  = await instance.get(InstancePath + '/Register', {
            //setting
            params: {...params,
                // Type: settings.deviceOSType,
                // DeviceToken: settings.deviceToken || '' ,
                // TypeName:settings.deviceOS,
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const getAppConfigs = async params  =>{
    let data = '';
   
    try {
        let res  = await instance.get(InstancePath + '/GetAppConfigs', {
            //setting
            params: {...params,
                // Type: settings.deviceOSType,
                // DeviceToken: settings.deviceToken || '' ,
                // TypeName:settings.deviceOS,
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}


// export const getNotificationsByUser = async params  =>{
//     let data = '';
    
//     try {
//         let accessToken = await getAccessToken();
//         let res  = await instance.get(InstancePath + '/getnotification', {
//             //setting
//             params: {
//                 TokenApp: accessToken
//             }
//         });
    
//         data = res.data;
        
//     } catch (error) {
//         data = error;
//     }
//     return data;
// }
// export const updateUserInfo = async params => {
//     let data = '';
//     try {
//         let accessToken = await getAccessToken();
//         let res  = await instance.get(InstancePath + '/updatecustomer', {
//             //setting
//             params: {
//                 TokenApp: accessToken,
//                 ...params
//             }
//         });
    
//         data = res.data;
//     } catch (error) {
//         data = error;
//     }
//     return data;
// }
export const getMenu = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/GetAllMenu', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const getAppMeta = async params  =>{
    let data = '';
   
    try {
        const dataString = await getUserData();
        if(dataString === '') {
            let res  = await instance.get(InstancePath + '/getCurrency', {
                //setting
                params: {
                }
            });
            
            data = res.data;
            settings.globalPrice = data.Currency;
        } else {
            const jsonData = JSON.parse(dataString);
            let res  = await instance.get(InstancePath + '/Get_Info', {
                //setting
                params: {
                    Key: jsonData.Key,
                    UID: jsonData.ID
                }
            });
        
            data = res.data;
            if(data.Info){
                settings.globalPrice = data.Info.Currency;
            }
            
        }
       
    } catch (error) {
        data = error;
    }
    
    return data;
}

export const getNoti = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/GetAllNoti', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const UpdateNoti = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/UpdateNoti', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}

//cart api
export const getCart = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/GetAllCart', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const getCart_Warehouse = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/GetWareHouse', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const getCart_Package = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/GetListCheck', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const createOrder= async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/CreateOrderCustom', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const createOrderV2 = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/CreateOrderCustomV2', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const OrderReview = async params =>{
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/ReviewOrder', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        console.log('OrderReview error:', error);
        data = error;
    }
    return data;
}

export const addtoCart = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        // try {
        //     params.link_origin = utils.removeUrlParameter("utparam", params.link_origin);
        //     params.link_origin = utils.removeUrlParameter("rmdChannelCode", params.link_origin);
        //     params.link_origin = utils.removeUrlParameter("locate", params.link_origin);
            
        // } catch (error) {
            
        // }
        var urlencoded = new URLSearchParams();
        if(!!params){
            
            for (const key in params) {
                urlencoded.append(key, params[key])
            }
            urlencoded.append('Key', accessToken);
            
        }
       

        const res  = await instance.post(InstancePath + '/AddToCart', urlencoded, {
            //setting
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            // params: {
            //     // Key: '',
            //     // UID: 0,
            //     Key: accessToken,
            //     ...params
            // }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}

export const updateCart_Quantity = async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/UpdateQuantity', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const updateCart_PdNote= async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/UpdateNote', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const updateCart_ShopNote= async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/UpdateShopNote', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const updateCart_DeletePdItem= async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/deleteOrderTemp', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const updateCart_feePacked= async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/UpdateFeePacked', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const updateCart_UpdateFastDelivery= async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/UpdateFastDelivery', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const updateCart_UpdateFeeCheck= async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/UpdateFeeCheck', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const ChangePassword= async params => {
    let data = '';
    try {
        const accessToken = await getAccessToken();
        const res  = await instance.get(InstancePath + '/ChangePassword', {
            //setting
            params: {
                // Key: '',
                // UID: 0,
                Key: accessToken,
                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}
export const ForgotPassword= async params => {
    let data = '';
    try {

        const res  = await instance.get(InstancePath + '/ForgotPassword', {
            //setting
            params: {
                // Key: '',
                // UID: 0,

                ...params
            }
        });
    
        data = res.data;
    } catch (error) {
        data = error;
    }
    return data;
}

