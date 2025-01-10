import { Login } from "./Login";
import { Register } from "./Register";

export const Auth = ({action}: {action: string}) => {
	return (
		<>
			{action === 'Login' ? (
				<Login />
			) : (
				<Register />
			)}
		</>
	);
};
