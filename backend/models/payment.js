import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	stripeInvoiceId: { type: String, index: true },
	stripeCustomerId: String,
	stripeSubscriptionId: String,
	amountPaid: Number,         // cents
	currency: String,
	status: String,             // paid, open, failed, etc.
	hostedInvoiceUrl: String,
	invoicePdf: String,
	periodStart: Number,        // epoch seconds
	periodEnd: Number,          // epoch seconds
	createdAtStripe: Number,    // stripe created timestamp
	raw: Object,                // raw Stripe object (optional)
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);