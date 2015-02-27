$(function() {
    var handler = StripeCheckout.configure({
        key: 'pk_test_hts0sF6EIs7hRjCAcMxdDiRG',
        image: '/square-image.png',
        token: function(token) {
            debugger;
            var req = $.post('http://localhost:3000/buy_mario', {
                stripe_token: token.id,
                stripe_data: token
            }, function(json) {
                $('#sample-modal').modal();
                console.log(json);
            });
            // Use the token to create the charge with a server-side script.
            // You can access the token ID with `token.id`
        }
    });

    $('#mario-buy').on('click', function(e) {
        // Open Checkout with further options
        handler.open({
            name: 'Mario Amiibo',
            description: 'Mario Amiibo Figurine by Nintendo',
            amount: 2000,
            image: 'img/mario.png'
        });
        e.preventDefault();
    });

    // Close Checkout on page navigation
    $(window).on('popstate', function() {
        handler.close();
    });
});