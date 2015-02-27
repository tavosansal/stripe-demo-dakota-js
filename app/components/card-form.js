import Ember from 'ember';
var $ = Ember.$;

export default Ember.Component.extend({
    didInsertElement: function() {
        this.$('#cardForm').card({
            // a selector or DOM element for the container
            // where you want the card to appear
            container: '.card-wrapper', // *required*

            // all of the other options from above
        });
    },

    actions: {
        pay: function() {
            var self = this;
            //Sometimes card js doesnt put it in the right format if form is auto filled
            var onlyNumbersExpDate = this.get('expirationDate').replace(/\D/g, '');
            this.set('expirationDate', onlyNumbersExpDate);

            debugger;
            //Set Stripe.js with public key
            Stripe.setPublishableKey('pk_test_hts0sF6EIs7hRjCAcMxdDiRG');
            //Create token
            Stripe.card.createToken({
                name: this.get('cardName'),
                address_line1: this.get('address1'),
                address_line2: this.get('address2'),
                address_city: this.get('city'),
                address_state: this.get('cardState'),
                address_zip: this.get('zip'),
                number: this.get('cardNumber'),
                exp_month: this.get('expirationDate').substring(0, 2),
                exp_year: this.get('expirationDate').slice(2),
                cvc: this.get('cvc')
            }, function(status, response) {
                debugger;
                //Send token to our server
                //We could send other data as well
                if (response.error) {
                    alert(response.error);
                } else {
                    $.post('http://localhost:3000/' + self.get('postUrl'), {
                        stripe_token: response.id
                    }, function(result) {
                        debugger;
                        alert(result.message);
                        console.log(result.object);
                    });
                }
            });
        }
    }
});
