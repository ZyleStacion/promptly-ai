import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
	stripeInvoiceId: { type: String, index: true },
	stripeCustomerId: String,
	stripeSubscriptionId: String,
	amountPaid: Number,         // cents
	currency: String,
	status: String,             // paid, open, failed, etc.
	hostedInvoiceUrl: String,
	invoicePdf: String,
	periodStart: Date,        // JS Date (from Stripe epoch seconds)
	periodEnd: Date,          // JS Date (from Stripe epoch seconds)
	createdAtStripe: Date,    // JS Date (stripe created timestamp)
	raw: mongoose.Schema.Types.Mixed,                // raw Stripe object (optional)
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);