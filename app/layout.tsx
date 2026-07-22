import '@/app/ui/global.css'
import { ReactQueryProviders } from './providers'

export const metadata = {
	title: 'SuitUp - Dress For Success',
	description: 'SuitUp is a Shanghai-based fashion-tech startup offering luxury, made-to-measure suits powered by AI body-scanning.',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body suppressHydrationWarning>
				<ReactQueryProviders>{children}</ReactQueryProviders>
			</body>
		</html>
	)
}
