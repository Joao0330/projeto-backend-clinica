import { Link } from "react-router-dom";

interface DashboardCardProps{
    title: string,
    text: string,
    url: string
}

export const DashboardCards = ({title, text, url}: DashboardCardProps) => {
	return (
		<div>
            <h3>{title}</h3>
            <p>{text}</p>
			<Link to={url}>Ver mais</Link>
		</div>
	);
};
