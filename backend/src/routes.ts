import { Application, Request, Response } from "express";
import {
	createContainerHandler,
	listContainersHandler,
	getContainerStatsHandler,
	getContainerLogsTwo,
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
	app.get("/inspectContainer", listContainersHandler);
	app.get("/getContainerStats", getContainerStatsHandler);
	app.get("/getContainerLogs", getContainerLogsTwo);
}
