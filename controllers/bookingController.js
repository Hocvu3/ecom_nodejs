const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const qs = require('qs')
const { v1: uuidv1 } = require('uuid');
const { param } = require('../routes/bookingRoutes');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);
    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
                    },
                    unit_amount: tour.price * 100
                    },
                    quantity: 1
                }
        ]
    });
    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

//Za_loPay checkout session
// const config = {
//     appid: "554",
//     key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
//     key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
//     endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
//   };

const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
  };

exports.getZa_loCheckoutSession = catchAsync(async (req, res, next) => {
    //   
    const embed_data = {
        redirecturl: 'https://www.youtube.com',
      };
    
      const items = [];
      const transID = Math.floor(Math.random() * 1000000);
    
      const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: 'user123',
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        //public url localhost sử dụng ngrok free: https://7334-117-1-164-254.ngrok-free.app
        callback_url: 'https://7334-117-1-164-254.ngrok-free.app/api/v1/bookings/callback/za_lo-pay/checkout-session',
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: '',
      };
      const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
      order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    
      try {
        const result = await axios.post(config.endpoint, null, { params: order });
        console.log(result.data);
        return res.status(200).json({
          status: 'success',
          data: result.data,
          trans_id: order.app_trans_id
        });
      } catch (error) {
        console.log(error);
      }
});

exports.getCallbackZa_loCheckoutSession = catchAsync(async (req, res, next) => {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;
  
      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("mac =", mac);
  
  
      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      }
      else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
        // Cap nhat database cho nay
        // this.createBookingCheckout(req, res, next);
        // thống báo cho ZaloPay server
        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }
  
    // thông báo kết quả cho ZaloPay server
    res.json(result);
});

exports.getQueryZa_loCheckoutSession = catchAsync(async (req, res, next) => {
    // console.log(req.params.app_trans_id);
    const { app_trans_id } = req.params;
    console.log(app_trans_id);
  let postData = {
    app_id: config.app_id,
    app_trans_id, // Input your app_trans_id
  };

  let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: 'post',
    url: 'https://sb-openapi.zalopay.vn/v2/query',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log('lỗi');
    console.log(error);
  }
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    //temporary
    const {tour, user, price} = req.query;
    if(!tour || !user || !price) return next();
    await Booking.create({tour, user, price});
    res.redirect(req.originalUrl.split('?')[0]);
})

//Mo-Mo checkout session
exports.getMoMoCheckoutSession = catchAsync(async (req, res, next) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var requestType = "payWithMethod";
    var amount = '10000';
    // var amount = '10000';
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData ='';
    var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });
    //Create the HTTPS objects
    const option = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }
    let result;
    try{
        result = await axios(option);
        return res.status(200).json(result.data)
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error
        })
    }
});

//get all bookings
exports.getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find();
    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
});

//get specific booking
exports.getBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            booking
        }
    });
});

//delete specific booking
exports.deleteBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});