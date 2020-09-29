import {Platform, StyleSheet} from 'react-native';
export const webViewRoot = 'https://nhaphangtaobao.com';
export const webViewURLs ={
    'taobao':{
        targetUrl: "https://m.intl.taobao.com/",
        searchUrl: "https://m.intl.taobao.com/search/search.html?q=",
        detailUrl: "m.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb"
    },
    'tmall':{
        targetUrl: "https://www.tmall.com/",
        searchUrl: "https://list.tmall.com/search_product.htm?q=",
        detailUrl: "m.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb"
    },
    '1688':{
        targetUrl: "https://m.1688.com/",
        searchUrl: "https://m.1688.com/offer_search/-6D7033.html?keywords=",
        detailUrl: "m.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb"
    },
}

export const color = {
    primary: "#dc3545",
    second: '#ed1c24',
    dark: "#404041",
    headerBackgroundColor: "#333"
}
export const settings = {
    oneSignalKey: "4ca05422-bcc2-470a-9167-a99467a453b1",
    deviceOS: Platform.OS,
    deviceOSType: ['', 'ios', 'android'].indexOf(Platform.OS).toString(),
    webViewHomeURL: `${webViewRoot}/home-app.aspx`,
}
export const detailJS = {
    'TAOBAO': `(() => {
        function getProductPropsData(){
            const getUrlParameter =  (name, url)  => {
                name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
                var results = regex.exec(url);
                if(results){
                    return decodeURIComponent(results[1]);
                } else {
                    return '';
                }
              
            };
            const removeUrlParameter = (key, sourceURL) => {
                var rtn = sourceURL.split("?")[0],
                    param,
                    params_arr = [],
                    queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
                if (queryString !== "") {
                    params_arr = queryString.split("&");
                    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                        param = params_arr[i].split("=")[0];
                        if (param === key) {
                            params_arr.splice(i, 1);
                        }
                    }
                    rtn = rtn + "?" + params_arr.join("&");
                }
                return rtn;
            }
            
            let arraySKuCont = (()=>{
                let result = [];
                if(document.querySelectorAll(".split > .card.sku .modal-sku-content")){
                    result = Array.from(document.querySelectorAll(".split > .card.sku .modal-sku-content"));
                }
                return result;
                
            })();
            let currentSKUArray = arraySKuCont.map(element => {
                let result = '';

                let arrayProps = Array.from(element.querySelectorAll('.modal-sku-content-item')).map(item=>{
                    let propValue = (()=>{
                        
                        return item.dataset.vid;;
                    })()
                    return {
                        title: item.textContent,
                        isSelected: item.className.includes('active'),
                        value: propValue
                    };
                });

                result = {
                    title: element.querySelector('.modal-sku-content-title').textContent,
                    props: arrayProps
                };
                return result;

            });

            let skuImg = () =>{
                let el = document.querySelector('.modal-sku-image img');
                if (!el) el = document.querySelector('.sku-wrap .header .img-wrap img');
                if (!el) el = document.querySelector('.carousel img');
                return !!el ? el.src : "";
            }
            let skuPrice = () =>{
                let els = document.querySelector('.modal-sku-title-price');
                if (!!els) return els.textContent.trim();
                els = document.querySelector('.price-wrap .price');
                if (!!els) return els.textContent.trim();
                return "";
            };
            
            
            let pdName = () =>{
                let el = document.querySelector('.title-wrapper .title');
                if (!!el) return el.textContent.trim();
                el = document.querySelector('.main.cell');
                return !!el ? el.textContent.trim() : "";
            };
            let providerId = () => {
                let el = document.querySelector('.shop-link-item');
                if(el) return getUrlParameter('user_id',el.href);
                el = document.querySelector('.mui-shopactivity-item a');
                return !!el ? getUrlParameter('sellerId',el.href) : "";
            }
            let providerName = () => {
                if (document.querySelector('.shop-title-text')) return document.querySelector('.shop-title-text').textContent.trim();
                if(document.querySelector('.shop-name')) return document.querySelector('.shop-name').textContent.trim();
                return "";
            }
            let quantity = () => {
                if(document.querySelector('.sku-number-edit')) return document.querySelector('.sku-number-edit').value;
                
                if(document.querySelector('#number')) return document.querySelector('#number').value;

                return '1';
            }
            let itemId = () => {
                return getUrlParameter('id', location.href);
            }
            let stock = () => {
                let returnValue = '';
                if(document.querySelector('.stock')){
                    returnValue = document.querySelector('.stock').textContent.trim();
                }

                if(document.querySelector('.modal-sku-title-quantity')){
                    returnValue = document.querySelector('.modal-sku-title-quantity').textContent.trim();
                }
                //returnValue = returnValue.match(/\d+/g)[0];

                return returnValue;
            }
            let linkOrigin = () => {
                let result = '';
                result = location.href;
                if(result.includes('#modal=sku')){
                    result = result.split('#')[0];
                }
                return result;
            }
            let priceStep = () => {
                return '';
            }
        
            //sender data
            let inwebData = "";
            try{
                inwebData = {
                    productMeta: {
                        productName: pdName(),
                        provider: {
                            id: providerId(),
                            name: providerName()
                        },
                        quantity: quantity(),
                        productId: itemId(),
                        linkOrigin: linkOrigin(),
                    },
                    productSKU: {
                        list: currentSKUArray,
                        img: skuImg(),
                        price: skuPrice(),
                        priceStep: priceStep(),
                        stock: stock()
                    }
                }
            } catch(error){
                // inwebData = error;
            }
            
            let data = {action: 'GET_PRODUCT_PROPS_TB', data: inwebData};
            return data;
        }
        
        if(typeof getProductPropsData !== 'undefined'){
            window.ReactNativeWebView.postMessage(JSON.stringify(getProductPropsData()));
        } else {
            window.ReactNativeWebView.postMessage(JSON.stringify({action: 'GET_PRODUCT_PROPS_TB', data: ""}));
        }
    })()`,
    '1688': `(() => {
        function getProductPropsData(){
            const getUrlParameter =  (name, url)  => {
                name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
                var results = regex.exec(url);
                if(results){
                    return decodeURIComponent(results[1]);
                } else {
                    return '';
                }
              
            };
            const removeUrlParameter = (key, sourceURL) => {
                var rtn = sourceURL.split("?")[0],
                    param,
                    params_arr = [],
                    queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
                if (queryString !== "") {
                    params_arr = queryString.split("&");
                    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                        param = params_arr[i].split("=")[0];
                        if (param === key) {
                            params_arr.splice(i, 1);
                        }
                    }
                    rtn = rtn + "?" + params_arr.join("&");
                }
                return rtn;
            }
            
            
            
            
            let pdName = () =>{
                let el = document.querySelector('.d-title span');
                if (!!el) return el.textContent.trim();
                el = document.querySelector('.title-content .title-text');
                if (!!el) return el.textContent.trim();
                
                el = document.querySelector('.title');
                return !!el ? el.textContent.trim() : "";
            };
            let providerId = () => {
                try {
                    return _iDetailDataConfig.sellerUserId;
                } catch(err) {}
                return '';
            }
            let providerName = () => {
                if (document.querySelector('.company')) return document.querySelector('.company').textContent.trim();
                if(document.querySelector('.shop-name-text')) return document.querySelector('.shop-name-text').textContent.trim();
                return "";
            }
            
            let itemId = () => {
                try {
                    return _iDetailDataConfig.offerId;
                } catch(err) {}
        
                try {
                    return Wing.config.query.offerId;
                } catch(err) {}

                return getUrlParameter('id', location.href);
            }
            
            let linkOrigin = () => {
                let result = '';
                result = location.href;
                if(result.includes('#modal=sku')){
                    result = result.split('#')[0];
                }
                return result;
            }
            let priceStep = () => {
                let rangeEls = document.querySelectorAll('.d-price-rangecount dd');
                let priceEls = document.querySelectorAll('.d-price-discount dd');
                rangeEls = Array.from(rangeEls).map(el => { return el.textContent.trim(); });
                priceEls = Array.from(priceEls).map(el => { return el.textContent.trim(); });
                if (rangeEls.length > 0 && priceEls.length > 0) {
                    return rangeEls.toArray().toString() + "|" + priceEls.toArray().toString();
                }
                if (rangeEls.length == 0 && priceEls.length == 0) {
                    let infoEls = document.querySelectorAll('.J_SkuPriceItem');
                    infoEls = Array.from(infoEls).map( (el, i) => { 
                        if(!!el.querySelector('.price-num') && !! !!el.querySelector('.price-beigin-amount')){
                            let beginamountString = el.querySelector('.price-beigin-amount').textContent.trim();
                            beginamountString = beginamountString.replace(/[^\x20-\x7E]/g, "")
                            if(i === Array.from(infoEls).length - 1) beginamountString = beginamountString + '-999999';
                            return beginamountString + ':' + el.querySelector('.price-num').textContent.trim()
                        }
                        return '';
                    });
                    return infoEls.join('|')
                } 
                
                return '';
            }
            let skuImg = () =>{

                let el = document.querySelector('.img-preview');
                if (!el) el = document.querySelector('.J_SkuPreviewImage');
                if (!el) el = document.querySelector('.swipe-image');
                return !!el ? el.src : "";
            }
            let currentSKUArray = () => {
                let result = [];
                
                try {
                    let els = document.querySelector('.m-detail-purchasing-list .obj-sku-selector .operator-btn-active');
                    if (!!!els) els = document.querySelector('.active-sku-item a');

                    let PRE_PROPS =  !!els ? els.textContent.trim() : "";

                    const hasQuantityInputs = Array.from(document.querySelectorAll('input.amount-input')).filter(i => i.value > 0);
                    if(hasQuantityInputs.length === 0) return hasQuantityInputs;
                    const selectedItems = hasQuantityInputs.map(item => {
                        return item.closest('.sku-2nd-prop-item')
                    });
                    result = selectedItems.map(item => {
                        let _stock = '';
                        try{
                            _stock = item.querySelector('.J_SkuItem_CanBookCount').textContent.trim();
                        } catch(err) {}
                        
                        let _propName = '';
                        try{
                            _propName = item.querySelector('.main-text').textContent.trim();
                            _propName = PRE_PROPS + '; ' + _propName;
                        } catch(err) {}

                        let _propValue = '';
                        try{
                            _propValue = item.querySelector('.J_SkuItem_AmountController').getAttribute('data-sku-specid')
                            _propValue = PRE_PROPS + ';' + _propValue
                        } catch(err) {}

                        let _quantity= '';
                        try{
                            _quantity = item.querySelector('input.amount-input').value;
                        } catch(err) {}
                        
                        let _img = '';
                        try{
                            _img = item.querySelector('.J_SkuItem_AmountController').getAttribute('data-sku-display-image')
                            if(!_img) _img = skuImg();
                        } catch(err) {}
                        let _price = '';
                        try{
                            _price =  item.querySelector('.price-text').textContent.trim().replace(/[^\x20-\x7E]/g, "")
                        } catch(err) {}
                        return {
                            stock: _stock,
                            Property: _propName,
                            PropertyValue: _propValue,
                            Quantity: _quantity,
                            img: _img,
                            price: _price
                        }
                    });


                } catch(err) {}

                return result;

            };
            let getAllQuantity = () => {
                let quantityArray = Array.from(document.querySelectorAll('input.amount-input')).map(i => parseInt(i.value));
                if(quantityArray.length > 0) return quantityArray.reduce((x, y) => x + y);
                return '';
            }
            //sender data
            let inwebData = "";
            try{
                inwebData = {
                    productMeta: {
                        productName: pdName(),
                        provider: {
                            id: providerId(),
                            name: providerName()
                        },
                        quantity: getAllQuantity(),
                        productId: itemId(),
                        linkOrigin: linkOrigin(),
                        priceStep: priceStep(),
                        img: skuImg()
                    },
                    productSKU: {
                        list: [],
                        price: '',
                    },
                    productSKU_list: currentSKUArray()
                    
                }
            } catch(error){
                // inwebData = error;
            }
            
            let data = {action: 'GET_PRODUCT_PROPS_1688', data: inwebData};
            return data;
        }
        
        if(typeof getProductPropsData !== 'undefined'){
            window.ReactNativeWebView.postMessage(JSON.stringify(getProductPropsData()));
        } else {
            window.ReactNativeWebView.postMessage(JSON.stringify({action: 'GET_PRODUCT_PROPS_1688', data: ""}));
        }
    })()`,
    'TMALL': ``,
}
