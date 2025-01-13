import { Link } from 'react-router-dom';

export const HeroSection = () => {
	return (
		<section className='hero'>
			<div className='container'>
				<div className='hero__wrapper'>
					<div className='hero__content'>
						<h2>Oferecemos os melhores cuidados de saúde</h2>

						<p>
							A nossa clinica oferece os melhores cuidados de saude para voce e sua familia, com profissionais altamente qualificados e dedicados. A nossa equipa de enfermeiros e medicos estão prontos
							a lhe prestar os melhores servicos possiveis.
						</p>

						<Link to='/register' className='heroBtn'>
							Registe-se já!
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};
