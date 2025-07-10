import '@/app/ui/global.css'
import { ReactQueryProviders } from './providers'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<ReactQueryProviders>{children}</ReactQueryProviders>
			</body>
		</html>
	)
}
