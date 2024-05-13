// import axios from "axios";
import { Request, Response } from "express";
import {Kafka} from "kafkajs"


const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'], // Add all Kafka broker addresses here
});

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })


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

		const formattedData = {
			containers: data.Containers,
			containersRunning: data.ContainersRunning,
			images: data.Images,
			driver: data.Driver,
			memory: data.MemTotal,
			operatingSystem: data.OperatingSystem,
			architecture: data.Architecture,
			serverVersion: data.ServerVersion,
		};

		//Format Data
		res.json(formattedData);
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
		// console.log("data", containerData)
		

		//Format Data
		res.json(containerData);
	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};

export const listenConsumer = async (req: Request, res: Response) => {

	//need the full id of the container
	const containerId = req.query.containerId as string;

	try {
		await consumer.connect()
		await consumer.subscribe({ topic: containerId.toString(), fromBeginning: true })

		await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log({
			consumer_value: message!.value!.toString(),
			})
		},
		})
		res.json("done");

	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};


 const produceCpuUsage =async  (containerId:any, cpu_usage:any) => {

	try {
		
		await producer.connect()
		await producer.send({
		  topic: containerId.toString(),
		  messages: [
			{ value: cpu_usage.toString() },
		  ],
		})
		
		await producer.disconnect()

	} catch (error: any) {
		console.error("Error:", error);
	}
};


export const inspectContainer = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	// containerId = ""de3308938a1b7b225a3665ba1d19faf17c184b73b320c2058eaacedd5e751c16"";
	console.log(containerId)

	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/json`;
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		//Format Data
		const output = {
			id: data.Id,
			name: data.Name,
			image: data.Config.Image,
			status: data.State.Status,
			created: data.Created,
			ports: data.NetworkSettings.Ports,
			labels: data.Config.Labels,
			environment: data.Config.Env,
		};

		// console.log(data);

		//Format Data
		res.json(output);
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


export const getContainerStatsOneShot = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/stats?stream=false`;
		const response = await fetch(dockerApiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const timeArr = [];
		const cpuArr = [];
		const memArr = [];

		const data = await response.json();
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

	produceCpuUsage(containerId,cpu_usage);


		const jsonData = {
			timeStamp: data.read,
			cpu_usage,
			memory_usage,
			memory_usage_bytes,
			memory_limit_bytes,
			cpu_cores,
			average_cpu: (cpuArr.reduce((a, b) => a + b, 0) / cpuArr.length).toFixed(2),
			average_memory: (memArr.reduce((a, b) => a + b, 0) / memArr.length).toFixed(2),
		}
		res.json(jsonData);
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

			produceCpuUsage(containerId,cpu_usage);


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
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/logs?stdout=true&stderr=true&follow=true&tail=10&since=0`;

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
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/logs?stderr=true&stdout=true&follow=true&tail=10&since=0`;
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


export const stopContainer = async (req: Request, res: Response) => {
	const containerId = req.query.containerId as string;
	console.log("stoping container",containerId)
	// containerId = "957960d65b3571d08fb3c5648fcb197fc70f8e7a6b1445fa7ae0f60c2c46fc29";
	try {
		const dockerApiUrl = `http://localhost:8099/containers/${containerId}/stop`;
		const response = await fetch(dockerApiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
			//return success message
			const message = "Container stopped successfully";
			res.json({ message });

	} catch (error: any) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
}