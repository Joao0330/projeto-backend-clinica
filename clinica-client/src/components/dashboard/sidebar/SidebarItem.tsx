import { ComponentType } from 'react';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
	url: string;
	content: string;
	Icon: ComponentType;
}

export const SidebarItem = ({ url, content, Icon }: SidebarItemProps) => {
	return (
		<li>
			<Link to={url}>
				<span>{content}</span>
				<Icon />
			</Link>
		</li>
	);
};
