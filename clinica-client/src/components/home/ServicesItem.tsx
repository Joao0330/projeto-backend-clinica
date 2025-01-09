import { ComponentType } from 'react';

interface ServicesItemProps {
	Icon: ComponentType;
	title: string;
	content: string;
}

export const ServicesItem = ({ Icon, title, content }: ServicesItemProps) => {
	return (
		<div className='services__content-item'>
			<span></span>

			<span>
				<Icon />
			</span>
			<h3>{title}</h3>
			<p>{content}</p>
		</div>
	);
};
