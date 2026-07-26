document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('checkout-btn');
    const originalText = btn.innerText;

    const priceInput = document.getElementById('user-price').value;
    const userEmail = document.getElementById('user-email').value;
    const amount = parseFloat(priceInput);

    if (amount === 0) {
        triggerDownload(false);
        return;
    }

    btn.innerText = "Loading...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount
            })
        });
        
        const order = await response.json();

        if (order.error) {
            alert("Error: " + order.error);
            resetButton(btn, originalText);
            return;
        }

        const options = {
            "key": "rzp_test_THsnPQi1nssxWE",
            "amount": order.amount,
            "currency": "INR",
            "name": "WeAreCHUSÉ",
            "description": "Album's Digital Download", 
            "order_id": order.id,
            "prefill": {
                "email": userEmail
            },
            "handler": function (response) {
                alert("Payment Successful! Thank you sm for the support <3");
                triggerDownload(true); 
                resetButton(btn, originalText);
            },
            "theme": {
                "color": "#ff00dd"
            }
        };

        const rzp = new Razorpay(options);

        rzp.on('payment.failed', function (response){
            alert("Payment failed or could not be processed. Please try again.");
            resetButton(btn, originalText);
        });

        rzp.open();

    } catch (error) {
        console.error("Error setting up payment: ", error);
        alert("Something went wrong, couldn't connect to server :/");
        resetButton(btn, originalText);
    }
});

//helpers
function triggerDownload(isPremium = false) {
    if (isPremium) {
        //paid for it, thanks vro
        window.location.href = 'https://www.dropbox.com/scl/fi/yipsd4go4vxl81m9fqd7g/SpecialGift.zip?rlkey=gj87mtz0qybils09i01bov3c5&st=8yjm1up9&dl=1'; 
    } else {
        //it free :D
        window.location.href = 'https://www.dropbox.com/scl/fi/f0j6orgg3n59hk1uvoe90/AlbumPreview.zip?rlkey=ek3sdkd67z4163cdfpmkpts7m&st=awyydk33&dl=1';
    }
}

function resetButton(btn, txt) {
    btn.innerText = txt;
    btn.disabled = false;
}