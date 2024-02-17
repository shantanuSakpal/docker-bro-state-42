"use client";
import React, { useState } from "react";
import ChartOne from "../Charts/ChartOne";


const ECommerce: React.FC = () => {

  const [timeArr, setTimeArr] = useState<string[]>([
    '17:10:31',
    '17:10:32',
    '17:10:34',
    '17:10:35',
    '17:10:36',
    '17:10:37',
    '17:10:38',
    '17:10:39',
    '17:10:40',
    '17:10:41',
    '17:10:42',
    '17:10:43',
    '17:10:44',
    '17:10:45',
    '17:10:46',
    '17:10:47',
    '17:10:48',
    '17:10:49',
    '17:10:50',
    '17:10:51',
    '17:10:52',
    '17:10:53',
    '17:10:54',
    '17:10:55',
    '17:10:56',
    '17:10:57',
    '17:10:58',
    '17:10:59',
    '17:11:00',
    '17:11:01',
    '17:11:02',
    '17:11:03',
    '17:11:04',
    '17:11:05',
    '17:11:06',
    '17:11:07',
    '17:11:08',
    '17:11:09',
    '17:11:10',
    '17:11:11',
    '17:11:12',
    '17:11:13',
    '17:11:14',
    '17:11:15',
    '17:11:16',
    '17:11:17',
    '17:11:18',
    '17:11:19',
    '17:11:20',
    '17:11:21',
    '17:11:22',
    '17:11:23',
    '17:11:24',
    '17:11:25',
    '17:11:26',
    '17:11:27',
    '17:11:28',
    '17:11:29',
    '17:11:30',
    '17:11:31',
    '17:11:32',
    '17:11:33',
    '17:11:34',
    '17:11:35',
    '17:11:36',
    '17:11:37',
    '17:11:38',
    '17:11:39',
    '17:11:40',
    '17:11:41',
    '17:11:42',
    '17:11:43',
    '17:11:44',
    '17:11:45',
    '17:11:46',
    '17:11:47',
    '17:11:48',
    '17:11:49',
    '17:11:50',
    '17:11:51',
    '17:11:52',
    '17:11:53',
    '17:11:54',
    '17:11:55',
    '17:11:56',
    '17:11:57',
    '17:11:58',
    '17:11:59',
    '17:12:00',
    '17:12:01',
    '17:12:02',
    '17:12:03',
    '17:12:04',
    '17:12:05',
    '17:12:06',
    '17:12:07',
    '17:12:08',
    '17:12:09',
    '17:12:10',
    '17:12:11',
  ])

  const [dataArr, setDataArr] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 20, 30, 25, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ])
  return (
    <>


      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="">
          <ChartOne
            timeArr={timeArr}
            dataArr={dataArr}
          />
          <ChartOne
            timeArr={timeArr}
            dataArr={dataArr}
          />
        </div>

      </div>
    </>
  );
};

export default ECommerce;
