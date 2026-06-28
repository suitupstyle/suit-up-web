import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/** Fixed sample price: $99.00 USD */
const PRICE_IN_CENTS = 9900

export async function POST(request: Request) {
	try {
		const origin = request.headers.get('origin') ?? 'http://localhost:3001'

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

		return NextResponse.json({ clientSecret: session.client_secret })
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
