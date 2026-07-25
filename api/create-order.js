const Razorpay = require('razorpay');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                error: 'Please enter a valid amount'
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json(order);
    } catch (error) {
        console.error('Razorpay Order Error: ', error);
        return res.status(500).json({
            error: 'Failed to create payment order'
        });
    }
};