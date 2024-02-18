// import axios from "axios";
import { Request, Response } from "express";

export const createContainerHandler = async (req: Request, res: Response) => {
	try {
		// Replace 'http://localhost:2375' with your Docker Engine API URL
		// Adjust '/containers/create' and the payload as needed
		const dockerApiUrl = "http://localhost:8099/containers/create";
		// const response = await axios.post(dockerApiUrl, {
		// 	Image: "hello-world", // Specify the Docker image to use
		// 	// Include other options as required
		// });
		const response = await fetch(dockerApiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Image: "hello-world",
			}),
		});

		const data = await response.json();

		res.json({ message: "Container started successfully", data });
	} catch (error: any) {
		console.error("Error starting container:", error);
		res.status(500).json({ message: "Failed to start container", error: error.message });
	}
};

export const getSystemInfo = async (req: Request, res: Response) => {
	try {
		const dockerApiUrl = `http://localhost:8099/info`;
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		//Format Data
		res.json(data);
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const listContainersHandler = async (req: Request, res: Response) => {
	try {
		const dockerApiUrl = "http://localhost:8099/containers/json";
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		const containerData = data.map((container: any) => {
			return {
				id: container.Id,
				names: container.Names,
				image: container.Image,
				status: container.State,
				created: container.Created,
			};
		});

		//Format Data
		res.json(containerData);
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const inspectContainer = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	// containerId = "957960d65b3571d08fb3c5648fcb197fc70f8e7a6b1445fa7ae0f60c2c46fc29";
	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/json`;
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		console.log(data);

		//Format Data
		res.json(data);
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const inspectImage = async (req: Request, res: Response) => {
	const imageId = req.query.imageId as string;
	// imageId = "957960d65b3571d08fb3c5648fcb197fc70f8e7a6b1445fa7ae0f60c2c46fc29";
	try {
		const dockerApiUrl = `http://localhost:8099/images/${imageId}/json`;
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		//Format Data
		res.json(data);
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const getContainerStatsHandler = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	// const containerId = "957960d65b3571d08fb3c5648fcb197fc70f8e7a6b1445fa7ae0f60c2c46fc29";
	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/stats`;

		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok || !response.body) {
			throw response.statusText;
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		const timeArr = [];
		const cpuArr = [];
		const memArr = [];

		while (true) {
			const { value, done } = await reader.read();
			if (done) {
				break;
			}

			let decodedChunk = decoder.decode(value, { stream: true });
			// console.log(decodedChunk);
			const data = JSON.parse(decodedChunk);
			// console.log(data);
			const cpu_delta =
				data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
			const temp = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
			const cpu_system_delta = !Number.isNaN(temp) ? temp : 0;
			// console.log(cpu_delta, !Number.isNaN(temp));
			let cpu_usage = (cpu_delta / cpu_system_delta) * data.cpu_stats.online_cpus * 100;

			cpu_usage == Infinity ? (cpu_usage = 0) : cpu_usage;

			const memory_usage = parseInt(
				((data.memory_stats.usage / data.memory_stats.limit) * 100).toFixed(0)
			);

			const memory_usage_bytes = data.memory_stats.usage;
			const memory_limit_bytes = data.memory_stats.limit;

			const cpu_cores = data.cpu_stats.online_cpus;

			memArr.push(memory_usage);
			cpuArr.push(cpu_usage);
			timeArr.push(data.read);

			res.write(
				JSON.stringify({
					timeStamp: data.read,
					cpu_usage,
					memory_usage,
					memory_usage_bytes,
					memory_limit_bytes,
					cpu_cores,
					average_cpu: (cpuArr.reduce((a, b) => a + b, 0) / cpuArr.length).toFixed(2),
					average_memory: (memArr.reduce((a, b) => a + b, 0) / memArr.length).toFixed(2),
				})
			);
		}

		res.end();
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const getContainerLogsTwo = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	// const containerId = "957960d65b3571d08fb3c5648fcb197fc70f8e7a6b1445fa7ae0f60c2c46fc29";
	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/logs?stdout=true&follow=true`;

		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok || !response.body) {
			throw response.statusText;
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		while (true) {
			const { value, done } = await reader.read();
			if (done) {
				break;
			}

			let decodedChunk = decoder.decode(value, { stream: true });
			// console.log(decodedChunk);
			console.log(decodedChunk);

			res.write(
				JSON.stringify({
					logs: decodedChunk,
				})
			);
		}

		res.end();
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const getContainerLogs = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	// containerId = "957960d65b3571d08fb3c5648fcb197fc70f8e7a6b1445fa7ae0f60c2c46fc29";
	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/logs`;
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		//Format Data
		res.json(data);
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const getContainerChanges = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	// containerId = "957960d65b3571d08fb3c5648fcb197fc70f8e7a6b1445fa7ae0f60c2c46fc29";
	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/changes`;
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		//Format Data
		res.json(data);
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const getContainerAsTar = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	// containerId = "957960d65b3571d08fb3c5648fcb197fc70f8e7a6b1445fa7ae0f60c2c46fc29";
	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/changes`;
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/octet-stream",
			},
		});

		//how to process application/octet-stream

		const data = await response.json();

		//Format Data
		res.json(data);
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};
