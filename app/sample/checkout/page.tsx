import Stripe from 'stripe'
import { headers } from 'next/headers'
import CheckoutClient from './checkout-client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IN_CENTS = 9900 // $99.00 USD

export default async function SampleCheckoutPage() {
	const headersList = await headers()
	const host = headersList.get('host') ?? 'localhost:3001'
	const protocol = host.startsWith('localhost') ? 'http' : 'https'
	const origin = `${protocol}://${host}`

	const session = await stripe.checkout.sessions.create({
		ui_mode: 'embedded_page',
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: 'SuitUp – Custom Tailored Suit (Sample)',
						description: 'Sample checkout to validate Stripe integration',
					},
					unit_amount: PRICE_IN_CENTS,
				},
				quantity: 1,
			},
		],
		mode: 'payment',
		return_url: `${origin}/sample/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
	})

	return <CheckoutClient clientSecret={session.client_secret!} />
}
