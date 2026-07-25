document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('checkout-btn');
    const originalText = btn.innerText;

    const priceInput = document.getElementById('user-price').value;
    const userEmail = document.getElementById('user-email').value;
    const amount = parseFloat(priceInput);

    if (amount === 0) {
        triggerDownload();
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
            "description": "Album's Digital Download", //change this to album name later
            "order_id": order.id,
            "prefill": {
                "email": userEmail
            },
            "handler": function (response) {
                alert("Payment Successful! Thank you sm for the support <3");
                triggerDownload();
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
function triggerDownload() {
    const link = document.createElement('a');
    link.href = 'assets/LYA.mp3'; //change to actual file link using either github or gDrive
    link.download = "WeAreCHUSE Full Album";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function resetButton(btn, txt) {
    btn.innerText = txt;
    btn.disabled = false;
}

