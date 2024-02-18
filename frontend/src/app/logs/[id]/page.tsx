"use client"
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useState } from "react";
// npm install @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");
import ReactMarkdown from "react-markdown";




export default function Home() {

    const genAI = new GoogleGenerativeAI("AIzaSyBpgcMCZS6Ro32ObfB4E9wUCEikOX75VtE");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    //make error type
    type CustomError = {
        id: number;
        title: string;
        description: string;
    };
    //get last part of url
    const url = window.location.href;
    const containerId = url.split('/').pop();
    const [errorDetails, setErrorDetails] = useState(false);
    const [currentError, setCurrentError] = useState<CustomError>({
        id: 0,
        title: "",
        description: "",

    });
    const [loading, setLoading] = useState(false);
    const [gptResponse, setGptResponse] = useState("");

    async function useAi(error: CustomError) {
        setLoading(true);
        // Get prompt from Gemini
        const errorText = error.description;
        const errorTitle = error.title;
        const prompt = `Error Logs: ${errorText}\n What is the cause of this error and what are the suggested solutions? give me the answers considering i am an experienced developer and i have access to the source code of the application. also provide me with links that i can use to solve the error. Also give your answer in an html format, usign suitagble tags for headings, links, and code formats, etc`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        setGptResponse(text);
        setLoading(false);

        console.log(result.text);
    }

    let errorList = [

    ];

    if (localStorage.getItem("errorList") == null) {
        errorList = [
            {
                id: 1,
                title: "Internet connection error",
                description: "$ docker logs <container_id>\n    [2024-02-17T10:00:00Z] INFO: Starting container...\n    [2024-02-17T10:00:05Z] INFO: Container started successfully.\n    [2024-02-17T10:01:00Z] ERROR: Could not resolve host: example.com\n    [2024-02-17T10:01:05Z] WARNING: DNS resolution failed. Trying again...\n    [2024-02-17T10:01:10Z] ERROR: Could not resolve host: example.com\n    [2024-02-17T10:01:15Z] ERROR: Failed to connect to example.com port 80: Connection timed out\n    [2024-02-17T10:01:20Z] WARNING: Retrying connection to example.com...\n    [2024-02-17T10:01:25Z] ERROR: Failed to connect to example.com port 80: Connection timed out\n    [2024-02-17T10:01:30Z] ERROR: Internet connection not available. Exiting container.\n    [2024-02-17T10:01:30Z] INFO: Container exiting...\n    ",
            },
            {
                id: 2,
                title: "Cpu usage high",
                description: "[Container] 2023-02-18T03:15:17.12345Z WARNING High CPU usage detected  \n            [Container] 2023-02-18T03:15:22.12345Z WARNING CPU usage over 90% \n            [Host] 2023-02-18T03:15:27.12345Z WARNING Container 234a53fd exceeded CPU limit, shutting it down \n            [Container] 2023-02-18T03:15:28.12345Z ERROR Received SIGTERM, shutting down \n            [Container] 2023-02-18T03:15:30.12345Z ERROR Connection failure to database, cannot save state  \n            [Container] 2023-02-18T03:15:31.12345Z WARNING Forcibly stopping container \n            [Host] 2023-02-18T03:15:32.12345Z WARNING Stopped container 234a53fd \n",
            },
        ]

    }
    else {
        errorList = JSON.parse(localStorage.getItem("errorList") || "");
    }


    let demoLogs: string | any = "";
    if (localStorage.getItem("demoLogs") == null) {
        demoLogs = "demoLogs", "$ docker logs <container_id>\n    [2024-02-17T10:00:00Z] INFO: Starting container...\n    [2024-02-17T10:00:05Z] INFO: Container started successfully.\n    [2024-02-17T10:01:00Z] ERROR: Could not resolve host: example.com\n    [2024-02-17T10:01:05Z] WARNING: DNS resolution failed. Trying again...\n    [2024-02-17T10:01:10Z] ERROR: Could not resolve host: example.com\n    [2024-02-17T10:01:15Z] ERROR: Failed to connect to example.com port 80: Connection timed out\n    [2024-02-17T10:01:20Z] WARNING: Retrying connection to example.com...\n    [2024-02-17T10:01:25Z] ERROR: Failed to connect to example.com port 80: Connection timed out\n    [2024-02-17T10:01:30Z] ERROR: Internet connection not available. Exiting container.\n    [2024-02-17T10:01:30Z] INFO: Container exiting...\n";
        localStorage.setItem("demoLogs", demoLogs);
    }
    else {
        demoLogs = localStorage.getItem("demoLogs");
    }



    const containerName: string = "my-container";




    const showErrorDetails = (error: CustomError) => {
        // console.log("Show error details", error);
        setErrorDetails(true);
        setCurrentError(error);
        useAi(error)
    };

    return (
        <>
            <DefaultLayout>
                <div className="w-full flex flex-row">
                    {
                        errorDetails ? (
                            <>
                                <div className="w-2/3">
                                    <div className="m-5 text-white font-bold text-lg">
                                        Error details
                                    </div>
                                    <div>
                                        <pre className="my-5 text-xl text-white  text-wrap whitespace-pre-wrap p-5">
                                            {currentError.title}
                                        </pre>
                                    </div>

                                    <div>
                                        {
                                            loading ? (

                                                <div className="m-5 text-white  text-wrap whitespace-pre-wrap p-5">
                                                    Getting response from Dock Ai...
                                                </div>
                                            ) : (
                                                //ignore the error
                                                // @ts-ignore
                                                <div className="text-wrap whitespace-pre-wrap p-5">
                                                    <ReactMarkdown >{gptResponse}</ReactMarkdown>
                                                </div>
                                            )
                                        }
                                    </div>

                                </div>
                            </>
                        ) : (
                            <div className="w-2/3">
                                <div className="m-5 text-white font-bold text-lg">
                                    Logs for container {containerName}
                                </div>
                                <div>
                                    <pre className="m-5 text-white  text-wrap whitespace-pre-wrap p-5">
                                        {demoLogs}
                                    </pre>
                                </div>
                            </div>
                        )
                    }
                    <div className="w-1/3">
                        <div className="m-5 text-white font-bold text-lg">
                            Errors
                        </div>
                        <div>
                            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9">
                                <div className="flex flex-col gap-7.5">

                                    {
                                        errorList.map((error: CustomError) => (
                                            <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] p-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-3 cursor-pointer border  hover:border-red"
                                                onClick={() => {
                                                    showErrorDetails(error);
                                                }}
                                            >
                                                <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
                                                    <svg
                                                        width="13"
                                                        height="13"
                                                        viewBox="0 0 13 13"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                                                            fill="#ffffff"
                                                            stroke="#ffffff"
                                                        ></path>
                                                    </svg>
                                                </div>
                                                <div className="w-full">
                                                    <h5 className="mb-3 font-semibold text-[#B45454]">
                                                        {error.title}
                                                    </h5>



                                                </div>
                                            </div>

                                        ))
                                    }

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </DefaultLayout>
        </>
    );
}
