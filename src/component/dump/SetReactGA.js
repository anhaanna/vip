import React from 'react';
import ReactGA from 'react-ga';
import history from "../../history";

 export   const SetReactGAUrl = (url) => {
    const gtag=window.gtag;
    var  history_url = history.location.pathname
    if(url != history_url){
        url=history_url;
    }
     gtag('config', 'UA-69499837-1', {
         'page_title' : url,
         'page_path': url
     });
 };



 export   const addToCart= (transactionNumber,price_USD,route_from,route_to) => {
    const gtag=window.gtag;
     gtag('event', 'add_to_cart', {
         "items": [
             {
                 "id": transactionNumber,
                 "name": route_from+' '+route_to,
                 "category": "AlpTransfer",
                 "quantity": 1,
                 "price": price_USD
             }
         ]
     });


 };


export   const beginCheckout= (transactionNumber,price_USD,route_from,route_to) => {
    const gtag=window.gtag;
     gtag('event', 'begin_checkout', {
         "items": [
             {
                 "id": transactionNumber,
                 "name": route_from+' '+route_to,
                 "category": "AlpTransfer",
                 "quantity": 1,
                 "price": price_USD
             }
         ]
     });


 };


export   const checkoutProgress= (transactionNumber,price_USD,route_from,route_to) => {
    const gtag=window.gtag;
     gtag('event', 'checkout_progress', {
         "items": [
             {
                 "id": transactionNumber,
                 "name": route_from+' '+route_to,
                 "category": "AlpTransfer",
                 "quantity": 1,
                 "price": price_USD
             }
         ]
     });


 };



export   const GaPurchase= (data,transactionNumber,route_from,route_to) => {
    const gtag=window.gtag;
    gtag('event', 'purchase', {
        "transaction_id":  data.transaction_id,
        "affiliation": "Website",
        "value":data.value,
        "currency": "USD",
        "tax": 0,
        "shipping": 0,
        "items": [
            {
                "id": transactionNumber,
                "name": route_from+ ' ' +route_to,
                "category": "AlpTransfer",
                "quantity": 1,
                "price":data.value
            }
        ]
    });


 };







 export   const EcommerceReactGAUrl = (transactionNumber,price_USD,route_from,route_to) => {

     console.log(transactionNumber,price_USD,route_from,route_to)

     const gtag=window.gtag;
     gtag('event', 'view_item', {
     "items": [
         {
             "id": transactionNumber,
             "name": route_from+' '+route_to,
             "category": "AlpTransfer",
             "quantity": 1,
             "price": price_USD
         }
     ]
    });


 }





