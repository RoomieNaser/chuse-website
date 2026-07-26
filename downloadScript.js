document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('checkout-btn');
    const originalText = btn.innerText;

    const priceInput = document.getElementById('user-price').value;
    const userEmail = document.getElementById('user-email').value;
    const amount = parseFloat(priceInput);

    //BROKE AHH
    if (amount === 0) {
        btn.innerText = "Getting your album...";
        btn.disabled = true;
        await triggerDownload({ isFree: true });
        resetButton(btn, originalText);
        return;
    }

    //RICH KIDDOS
    btn.innerText = "Loading...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount })
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
            "prefill": { "email": userEmail },
            "handler": async function (response) {
                btn.innerText = "Verifying...";
                //pass the proof, needed ai for this
                await triggerDownload({
                    isFree: false,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });
                alert("Payment Successful! Thank you sm for the support <3");
                resetButton(btn, originalText);
            },
            "theme": { "color": "#ff00dd" }
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

//my servants muahahahahha
async function triggerDownload(paymentData) {
    try {
        //ask the server for the links
        const res = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        
        const data = await res.json();

        if (data.success && data.links) {
            data.links.forEach((link, index) => {
                setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = link;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }, index * 500);
            });
        } else {
            alert("Security check failed! Could not verify payment.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to retrieve the download links.");
    }
}

function resetButton(btn, txt) {
    btn.innerText = txt;
    btn.disabled = false;
}