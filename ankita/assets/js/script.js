// Make sure jQuery and jQuery Validate are included in your HTML document
$(document).ready(function() {
    $('.php-email-form').validate({
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            subject: {
                required: true,
                // Add specific rules for the subject field, e.g., number: true
            },
            category: "required"
        },
        errorElement: "span",
        messages: {
            name: "",
            email: "",
            subject: "",
            message: ""
        },
        submitHandler: function(form) {
            var formData = $(form).serialize();

            $.ajax({
                type: 'POST',
                url: 'assets/php/send.php',
                data: formData,
                dataType: 'json',
                cache: false,
                beforeSend: function() {
                    $('#loader').show();
                },
                success: function(response) {
                    if (response.status === 'success') {
                        // Update the message and styling for success
                        $('#response-message').html(response.message).attr('color', 'green');
                        } else {
                        // Update the message and styling for error
                        $('#response-message').html(response.message).css('color', 'red');
                    }
                
              
                },
                complete: function() {
                    // Reload the page after 2 seconds
                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                
                }
            });
        }
    });
});
