"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "../CardDataStats";
import LineChart from "../Charts/NewLineChart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memoryUsage } from "process";

const ECommerce: React.FC = () => {
  const currentPage = usePathname();
  const url = currentPage;
  const containerId = url.split("/").pop();
  // console.log(containerId);
  const [dynamicData, setDynamicData] = useState<any>({
    timeStamp: [],
    cpu_usage: [],
    memory_usage: [],
    network_usage:[],
    localfileio:[]
  });
  const [subData, setSubData] = useState<any>({
    average_cpu: 0,
    average_memory: 0,
    cpu_cores: 0,
    memory_usage_bytes: 0,
    memory_limit_bytes: 0,
  });

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/getContainerStatsOneShot?containerId=${containerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok || !response.body) {
          throw new Error(response.statusText);
        }
  
        const data = await response.json();
  
  
        const {
          timeStamp,
          cpu_usage,
          memory_usage,
          memory_usage_bytes,
          memory_limit_bytes,
          cpu_cores,
          average_cpu,
          average_memory,
        } = data;
  

        //clean data
        let date = new Date(timeStamp);
        let readableDate = date.toLocaleTimeString();
        let temp = (memory_usage_bytes/ 1000000).toFixed(2)
        let network_usage = memory_usage;
        // console.log(memory_usage)
        let localfileio = 0
        // let readableDate = date.toLocaleString();
        setDynamicData((prev: any) => {
          return {
            timeStamp: [...prev?.timeStamp, readableDate.toLocaleString()],
            cpu_usage: [...prev?.cpu_usage, cpu_usage],
            memory_usage: [...prev?.memory_usage, temp],
            network_usage:[...prev?.network_usage, network_usage],
            localfileio:[...prev?.localfileio, localfileio]

          };
        });
        setSubData({
          average_cpu,
          average_memory,
          cpu_cores,
          memory_usage_bytes,
          memory_limit_bytes,
        });
// console.log("mem, ",dynamicData.memory_usage)
        localStorage.setItem(
          "latestTime",
          JSON.stringify(dynamicData.timeStamp.slice(-10)),
        );
        localStorage.setItem(
          "latestCpu",
          JSON.stringify(dynamicData.cpu_usage.slice(-10)),
        );
        localStorage.setItem(
          "latestMemory",
          JSON.stringify(dynamicData.memory_usage.slice(-10)),
        );
        localStorage.setItem(
          "latestnetwork",
          JSON.stringify(dynamicData.network_usage.slice(-10)),
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const interval = setInterval(fetchData, 1000);
  
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // const [timeArr, setTimeArr] = useState<string[]>([
  //   '17:10:31',
  //   '17:10:32',
  //   '17:10:34',
  //   '17:10:35',
  //   '17:10:36',
  //   '17:10:37',
  //   '17:10:38',
  //   '17:10:39',
  //   '17:10:40',
  //   '17:10:41',
  //   '17:10:42',
  //   '17:10:43',
  //   '17:10:44',
  //   '17:10:45',
  //   '17:10:46',
  //   '17:10:47',
  //   '17:10:48',
  //   '17:10:49',
  //   '17:10:50',
  //   '17:10:51',
  //   '17:10:52',
  //   '17:10:53',
  //   '17:10:54',
  //   '17:10:55',
  //   '17:10:56',
  //   '17:10:57',
  //   '17:10:58',
  //   '17:10:59',
  //   '17:11:00',
  //   '17:11:01',
  //   '17:11:02',
  //   '17:11:03',
  //   '17:11:04',
  //   '17:11:05',
  //   '17:11:06',
  //   '17:11:07',
  //   '17:11:08',
  //   '17:11:09',
  //   '17:11:10',
  //   '17:11:11',
  //   '17:11:12',
  //   '17:11:13',
  //   '17:11:14',
  //   '17:11:15',
  //   '17:11:16',
  //   '17:11:17',
  //   '17:11:18',
  //   '17:11:19',
  //   '17:11:20',
  //   '17:11:21',
  //   '17:11:22',
  //   '17:11:23',
  //   '17:11:24',
  //   '17:11:25',
  //   '17:11:26',
  //   '17:11:27',
  //   '17:11:28',
  //   '17:11:29',
  //   '17:11:30',
  //   '17:11:31',
  //   '17:11:32',
  //   '17:11:33',
  //   '17:11:34',
  //   '17:11:35',
  //   '17:11:36',
  //   '17:11:37',
  //   '17:11:38',
  //   '17:11:39',
  //   '17:11:40',
  //   '17:11:41',
  //   '17:11:42',
  //   '17:11:43',
  //   '17:11:44',
  //   '17:11:45',
  //   '17:11:46',
  //   '17:11:47',
  //   '17:11:48',
  //   '17:11:49',
  //   '17:11:50',
  //   '17:11:51',
  //   '17:11:52',
  //   '17:11:53',
  //   '17:11:54',
  //   '17:11:55',
  //   '17:11:56',
  //   '17:11:57',
  //   '17:11:58',
  //   '17:11:59',
  //   '17:12:00',
  //   '17:12:01',
  //   '17:12:02',
  //   '17:12:03',
  //   '17:12:04',
  //   '17:12:05',
  //   '17:12:06',
  //   '17:12:07',
  //   '17:12:08',
  //   '17:12:09',
  //   '17:12:10',
  //   '17:12:11',
  // ])

  // const [dataArr, setDataArr] = useState<number[]>([
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 20, 30, 25, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0
  // ])

  return (
    <>
      <div className="relative mt-4 flex flex-col">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">Container Stats</h1>
        </div>
        <Link
          href={`/logs/${containerId}`}
          className="absolute -top-5 right-10 rounded bg-graydark px-5 py-2"
        >
          Logs
        </Link>
        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {/* CPU Used */}
          <CardDataStats
            title="Avg. CPU Usage"
            total={subData.average_cpu}
            rate="0.43%"
            levelUp
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
              />
            </svg>
          </CardDataStats>
          {/* Memory Used */}
          <CardDataStats
            title="Network usage"
            total={subData.average_memory}
            rate="4.35%"
            levelUp
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path
                d="M160-160v-120h160v120H160Zm0-160v-160h160v160H160Zm0-200v-280h160v280H160Zm240 360v-280h160v280H400Zm0-320v-160h160v160H400Zm0-200v-120h160v120H400Zm240 520v-80h160v80H640Zm0-120v-160h160v160H640Zm0-200v-320h160v320H640Z"
                fill="currentColor"
              />
            </svg>
          </CardDataStats>
          {/* Total Uptime */}
          <CardDataStats
            title="Total Container Uptime"
            total="2 mins"
            rate="2.59%"
            levelUp
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path
                d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"
                fill="currentColor"
              />
            </svg>
          </CardDataStats>
          {/* Memory Used/Total */}
          <CardDataStats
            title="Total Memory in consumption"
            total={
              (subData.memory_usage_bytes / 1000000).toFixed(2) +
              // "/" +
              // (subData.memory_limit_bytes / 1000000).toFixed(1) +
              " MB"
            }
            rate="4.35%"
            levelUp
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path
                d="M160-160v-120h160v120H160Zm0-160v-160h160v160H160Zm0-200v-280h160v280H160Zm240 360v-280h160v280H400Zm0-320v-160h160v160H400Zm0-200v-120h160v120H400Zm240 520v-80h160v80H640Zm0-120v-160h160v160H640Zm0-200v-320h160v320H640Z"
                fill="currentColor"
              />
            </svg>
          </CardDataStats>
        </div>
        <div className="mt-5 flex flex-wrap justify-between gap-y-3">
          <LineChart
            label="CPU Usage"
            timeArr={dynamicData.timeStamp}
            dataArr={dynamicData.cpu_usage}
          />
          <LineChart
            label="Memory Usage"
            timeArr={dynamicData.timeStamp}
            dataArr={dynamicData.memory_usage}
          />
          <LineChart
            label="Network I/O"
            timeArr={dynamicData.timeStamp}
            dataArr={dynamicData.network_usage}
          />
          <LineChart
            label="Filesystem I/O"
            timeArr={dynamicData.timeStamp}
            dataArr={dynamicData.localfileio}
          />
          {/* <ChartOne timeArr={timeArr} dataArr={dataArr} /> */}
        </div>
      </div>
    </>
  );
};

export default ECommerce;
