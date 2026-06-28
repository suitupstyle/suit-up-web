import Stripe from 'stripe'
import CheckoutV2Client from './checkout-client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/** Fixed sample price: $99.00 USD */
const PRICE_IN_CENTS = 9900

export default async function SampleCheckoutV2Page() {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: PRICE_IN_CENTS,
		currency: 'usd',
		// omit payment_method_types to enable dynamic payment methods
		automatic_payment_methods: { enabled: true },
	})

	return <CheckoutV2Client clientSecret={paymentIntent.client_secret!} />
}
