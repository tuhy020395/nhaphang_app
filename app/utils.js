import Moment from 'moment';
import 'moment/min/locales';
Moment.locale("vi");
import {settings} from './config';
export default Utils = {
    formatDateToString: (s, formatString = 'DD/MM/YYYY') => Moment(s).format(formatString),
    formatStringToDate: (s, formatString = 'DD/MM/YYYY') =>  new Date(Moment(s, formatString)),
    addCommas: (nStr) =>{
        nStr = parseFloat(nStr).toFixed(0);
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    getURLParameters: (url) => [...new URL(url).searchParams].reduce(
		(obj, [key, value]) => (
			(obj[key] = key in obj ? [].concat(obj[key], value) : value), obj
		),
		Object.create(null)
    ),
    removeUrlParameter: (key, sourceURL) => {
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
    },
    formatProductData: data => { 
        // after format it like this
        // "OrderTempID": 85562,
        // "ProductName": "【设计师合作款】女装 圆领T恤(短袖) 424873 优衣库UNIQLO",
        // "Image": "//img.alicdn.com/imgextra/i2/196993935/O1CN01M5C3B41ewH6LfDHTR_!!196993935.jpg_320x320q75.jpg",
        // "LinkProduct": "https://m.intl.taobao.com/detail/detail.html?spm=a2141.8971817.50000671.1&id=606675435996&scm=1007.15522.117270.cat:50000671_industry:_cattype:cat_id:606675435996&pvid=54b8bb94-d968-4ad2-a34d-1f186413a3bf&scene=5522#modal=sku&timeStamp=1584520079738",
        // "Property": "155/80A/S;08 深灰色;",
        // "Brand": "",
        // "PriceVN": "268,600",
        // "PriceCNY": "79",
        // "TotalPriceVN": "268,600",
        // "TotalPriceCNY": "79",
        // "Quantity": 1
        let result = '';
        const {productMeta, productSKU} = data;
        
            const Property = () => {
                try {
                    return productSKU.selectedSKU.map(item => {
                        return item.props.title
                    }).join('; ');
                } catch (error) { }
    
                return '';
            }
            const PropertyValue = () => {
                try {
                    return productSKU.selectedSKU.map(item => {
                        return item.props.value
                    }).join(';');
                } catch (error) { }
    
                return '';
            }
            const stock = () => {
                return !!productSKU.stock.match(/\d+/g)[0] ? productSKU.stock.match(/\d+/g)[0] : 0;
            }
            result = {
                "OrderTempID": '',
                productId: productMeta.productId || '',
                "ProductName": productMeta.productName || '',
                "Image": productSKU.img || '',
                "LinkProduct": productMeta.linkOrigin,
                "Property": Property(),
                "Brand": productMeta.note || '',
                "Quantity": productMeta.quantity,
                "ProviderID": productMeta.provider.id,
                "ProviderName": productMeta.provider.name,
                "PriceCNY": productSKU.price,
                "PropertyValue": PropertyValue(),
                "stock": stock(),
                "pricestep": productMeta.priceStep || '',
                // "PriceVN": "268,600",
                // "TotalPriceVN": "268,600",
                // "TotalPriceCNY": "79",
            }
        
        
        return result;
    }
}