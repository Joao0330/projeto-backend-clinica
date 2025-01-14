import { LiaNotesMedicalSolid, LiaBriefcaseMedicalSolid } from 'react-icons/lia';
import { GiMedicines } from 'react-icons/gi';
import { MdOutlineSupportAgent } from 'react-icons/md';
import services from '../../data/home/services-item.json';
import { ServicesItem } from '../../components/home/ServicesItem';

const iconsMap: Record<string, React.ComponentType> = {
	LiaNotesMedicalSolid: LiaNotesMedicalSolid,
	LiaBriefcaseMedicalSolid: LiaBriefcaseMedicalSolid,
	GiMedicines: GiMedicines,
	MdOutlineSupportAgent: MdOutlineSupportAgent,
};

export const Services = () => {
	return (
		<section className='services'>
			<div className='container'>
				<div className='services__wrapper'>
					<div className='services__title'>
						<h2>Os nossos serviços</h2>
						<p>Na nossa clínica encontrará vários tipos de serviços de que poderá usufruir.</p>
					</div>

					<div className='services__content'>
                        {services.map(item => {
                            const icon = iconsMap[item.icon];

                            return <ServicesItem key={item.id} Icon={icon} title={item.title} content={item.content} />;
						})}
					</div>
				</div>
			</div>
		</section>
	);
};
