let initPromise: Promise<unknown> | null = null

export function getAirwallexEnv(): 'demo' | 'prod' {
	return process.env.NEXT_PUBLIC_AIRWALLEX_ENV === 'prod' ? 'prod' : 'demo'
}

export async function initAirwallex() {
	if (!initPromise) {
		initPromise = import('@airwallex/components-sdk').then(({ init }) =>
			init({
				env: getAirwallexEnv(),
				enabledElements: ['payments'],
				locale: 'en',
			}),
		)
	}

	return initPromise
}
