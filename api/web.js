var express = require('express');
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);

// Parse Body
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());

app.get('/', function(req, res) {
    res.send('Hello World!');
});

//Single Charge with Stripe Checkout
app.post('/buy_mario', function(req, res) {
    debugger;
    //*************************************
    //Step 1:
    //  npm install stripe
    //Step 2:
    //  Get your stripe secret key and require the stripe library
    var stripe = require('stripe')('sk_test_ThYzqF5Uws54i1wHRSnZjQtz');

    //Step 3:
    //  Make calls to the stripe API with the token you got
    //  from the client

    var stripeToken = req.body.stripe_token;
    var stripeData = req.body.stripe_data;

    var charge = stripe.charges.create({
        amount: 2000, // amount in cents, again
        currency: "usd",
        card: stripeToken,
        description: stripeData.email
    }).then(function(charge) {
        res.jsonp({
            message: 'You bought Mario!',
            charge: charge
        });
    }, function(err) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
            res.jsonp({
                error: err.message
            });
        }
    });
    console.log(req.body.stripe_token);
});

//Single Charge - Custom
app.post('/single_charge', function(req, res) {
    debugger;
    var stripe = require('stripe')('sk_test_ThYzqF5Uws54i1wHRSnZjQtz');

    var stripeToken = req.body.stripe_token;

    var charge = stripe.charges.create({
        amount: 1500, // amount in cents, again
        currency: "usd",
        card: stripeToken,
        description: 'A single charge'
    }).then(function(charge) {
        //Do whatever you want here with the charge object!
        res.jsonp({
            message: 'Single Charge Successful',
            object: charge
        });
    }, function(err) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
            res.jsonp({
                error: err.message
            });
        }
    });
    console.log(req.body.stripe_token);
});

//Subscription Charge
app.post('/subscription_charge', function(req, res) {
    var stripe = require('stripe')('sk_test_ThYzqF5Uws54i1wHRSnZjQtz');

    var stripeToken = req.body.stripe_token;

    stripe.customers.create({
        description: 'Customer for test@example.com',
        source: stripeToken // obtained with Stripe.js
    }, function(err, customer) {
        console.log(customer.id);
        stripe.customers.createSubscription(
            customer.id, {
                plan: "basic"
            },
            function(err, subscription) {
                console.log(subscription.id);
                res.jsonp({
                    message: 'Subscription Successful',
                    object: subscription
                });
            }
        );
    });
});

//Stripe Webhooks
app.post('/stripe_hooks', function(req, res) {
    //var stripe = require('stripe')('sk_test_ThYzqF5Uws54i1wHRSnZjQtz');
    // Retrieve the request's body and parse it as JSON
    //var event_json = JSON.parse(req.body);
    debugger
    console.log('Event Type: ' + req.body.type);
    console.log('Event Created: ' + req.body.created);
    // Do something with event_json
    // Update customer details, charge details, subscription details, etc

    //respond with 200 status
    res.sendStatus(200);
});


// Start Server
var server = app.listen(3000, function() {

    var host = server.address().address
    var port = server.address().port

    console.log('Server listening at http://%s:%s', host, port)

});
