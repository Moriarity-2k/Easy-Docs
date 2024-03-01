import { Socket, io } from "socket.io-client";

import { socket_url } from "@/constants";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import toast from "react-hot-toast";

export default class GetSocket {
	private static socket: Socket<DefaultEventsMap, DefaultEventsMap>;

	static SingleSocket() {
		if (!this.socket) {
			try {
				this.socket = io(socket_url);
			} catch (err) {
				toast.error("server not responding");
				window.location.replace("/");
			}
		}
		return this.socket;
	}
}
