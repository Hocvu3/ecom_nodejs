const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

router.post('/callback/za_lo-pay/checkout-session', bookingController.getCallbackZa_loCheckoutSession);
router.post('/query/za_lo-pay/checkout-session/:app_trans_id', bookingController.getQueryZa_loCheckoutSession);

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);
router.post('/mo-mo/checkout-session/:tourId', bookingController.getMoMoCheckoutSession);
router.post('/za_lo-pay/checkout-session/:tourId', bookingController.getZa_loCheckoutSession);

module.exports = router;
//test tinh nang template