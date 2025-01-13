import { FaLocationDot, FaPhoneVolume } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';

export const Contact = () => {
	return (
		<section className='contact' id="contact">
			<div className='container'>
				<div className='contact__wrapper'>
					<div className='contact__title'>
						<h2>Contacte-nos</h2>
						<p>Estamos sempre prontos para lhe ajudar, se precisar de ajuda, por favor, contacte-nos.</p>
					</div>

					<div className='contact__content'>
						<div className='contact__content-address'>
							<FaLocationDot />
							<h3>A nossa morada</h3>
							<strong>A108 Adam Street, New York, NY 535022</strong>
						</div>

						<div className='contact__content-email'>
							<MdOutlineEmail />
							<h3>Email</h3>
							<strong>admin@clinica.com</strong>
						</div>

						<div className='contact__content-phone'>
							<FaPhoneVolume />
							<h3>Telefone</h3>
							<strong>+1 5589 55488 55</strong>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
