import { Application, Request, Response } from "express";
import {
	createContainerHandler,
	listContainersHandler,
	getContainerStatsHandler,
	getContainerLogsTwo,
	inspectContainer,
	getSystemInfo,
	listenConsumer,
	getContainerStatsOneShot
} from "./controllers/docker";

export default async function routes(app: Application) {
	app.get("/", (req: Request, res: Response) => {
		res.send("GET Successful");
	});
	app.post("/", (req: Request, res: Response) => {
		console.log(req.body);
		res.send("POST Successful");
	});
	// app.get("/createContainer", createContainerHandler);
	app.get("/listContainers", listContainersHandler);
	app.get("/listenConsumer", listenConsumer);

	app.get("/inspectContainer", inspectContainer);

	app.get("/getContainerStatsOneShot", getContainerStatsOneShot);
	app.get("/getContainerStats", getContainerStatsHandler);
	app.get("/getContainerLogs", getContainerLogsTwo);
	app.get("/getSystemInfo", getSystemInfo);
}
