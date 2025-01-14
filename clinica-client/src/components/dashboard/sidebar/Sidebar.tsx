import { useAuth } from '../../../context/AuthContext';
import { FaUserCircle, FaNotesMedical, FaPills } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { MdSick } from 'react-icons/md';
import { BsFileMedicalFill } from 'react-icons/bs';
import { SidebarItem } from './SidebarItem';
import sidebarItems from '../../../data/dashboard/sidebar-item.json';

const iconsMap: Record<string, React.ComponentType> = {
	FaUserDoctor: FaUserDoctor,
	FaNotesMedical: FaNotesMedical,
	FaPills: FaPills,
	MdSick: MdSick,
	BsFileMedicalFill: BsFileMedicalFill,
};

export const Sidebar = () => {
	const { user } = useAuth();

	const role = user?.role;
	const items = role !== undefined ? sidebarItems[role] : [];

	return (
		<aside className='dashboard__sidebar'>
			<div className='dashboard__sidebar-profile'>
				<FaUserCircle />
				<strong>{user?.nome}</strong>
				<strong>{user?.role}</strong>
			</div>

			<div className='dashboard__sidebar-content'>
				<nav>
					<ul>
						{items.map(item => {
							const icon = iconsMap[item.Icon];

							return <SidebarItem key={item.url} url={item.url} content={item.content} Icon={icon} />;
						})}
					</ul>
				</nav>
			</div>
		</aside>
	);
};
