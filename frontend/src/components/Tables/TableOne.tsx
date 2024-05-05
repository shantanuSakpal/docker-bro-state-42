"use client";
import { BRAND } from "@/types/brand";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const brandData: BRAND[] = [
  {
    logo: "/images/brand/brand-01.svg",
    name: "Google",
    visitors: 3.5,
    revenues: "5,768",
    sales: 590,
    conversion: 4.8,
  },
  {
    logo: "/images/brand/brand-02.svg",
    name: "Twitter",
    visitors: 2.2,
    revenues: "4,635",
    sales: 467,
    conversion: 4.3,
  },
  {
    logo: "/images/brand/brand-03.svg",
    name: "Github",
    visitors: 2.1,
    revenues: "4,290",
    sales: 420,
    conversion: 3.7,
  },
  {
    logo: "/images/brand/brand-04.svg",
    name: "Vimeo",
    visitors: 1.5,
    revenues: "3,580",
    sales: 389,
    conversion: 2.5,
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Facebook",
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },
];

const TableOne = () => {
  const router = useRouter();
  const [runningContainers, setRunningContainers] = useState<any>();
  const [systemData, setSystemData] = useState<any>();

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:1337/getSystemInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setSystemData(data);
    })();
  },[]);

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:1337/listContainers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("listContainers", response.body);
      setRunningContainers(data);
    })();
  }, []);

  // const formattedData = {
  //   containers: data.Containers,
  //   containersRunning: data.ContainersRunning,
  //   images: data.Images,
  //   memory: data.MemTotal,
  //   operatingSystem: data.OperatingSystem,
  //   architecture: data.Architecture,
  //   serverVersion: data.ServerVersion,
  // };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        System Information
      </h4>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            Total Containers
          </span>
          <span className="text-sm text-black dark:text-white">
            {systemData?.containers}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            Containers Running
          </span>
          <span className="text-sm text-black dark:text-white">
            {systemData?.containersRunning}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            Total Images
          </span>
          <span className="text-sm text-black dark:text-white">
            {systemData?.images}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            Total Memory
          </span>
          <span className="text-sm text-black dark:text-white">
            {(systemData?.memory / 1000000).toFixed(2)} MB
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            Operating System
          </span>
          <span className="text-sm text-black dark:text-white">
            {systemData?.operatingSystem}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            Architecture
          </span>
          <span className="text-sm text-black dark:text-white">
            {systemData?.architecture}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            Server Version
          </span>
          <span className="text-sm text-black dark:text-white">
            {systemData?.serverVersion}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TableOne;
