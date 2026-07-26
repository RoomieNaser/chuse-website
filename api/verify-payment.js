const crypto = require('crypto');

export default async function handler(req, res) {
    if (req.method !== 'POST'){
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    const {
        isFree, razorpay_order_id, razorpay_payment_id, razorpay_signature
    } = req.body;

    const freeLink = process.env.FREE_LINK;
    const premiumLink = process.env.PREMIUM_LINK;

    if (isFree) {
        return res.status(200).json({
            success: true,
            links: [freeLink]
        });
    }

    try {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            return res.status(200).json({
                success: true,
                links: [premiumLink]
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Invalid Signature'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Server error during verification sowwy'
        });
    }
}