import { About } from './About';
import { Contact } from './Contact';
import { HeroSection } from './HeroSection';
import { Services } from './Services';

export const HomePage = () => {
	return (
		<>
			<HeroSection />
			<Services />
			<About />
			<Contact />
		</>
	);
};
