import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ScrollToHash } from '../../lib/home/ScrollToHash';

export const AppLayout = () => {
	return (
		<>
			<ScrollToHash/>
			<Header />

			<main>
				<Outlet />
			</main>

			<Footer />
		</>
	);
};
