export function GetBearerToken() {
	const local_token = localStorage.getItem("AuthToken");
	if (local_token != null) {
		const token = JSON.parse(local_token);
		return `Bearer ${token}`;
	}
	return `Bearer  `;
}

export function SetBearerToken(token: string) {
	localStorage.setItem("AuthToken", JSON.stringify(token));
}
