import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsAPI";
import { styles } from "@/app/styles/style";

type Props = {};

const CourseAnalytics = (props: Props) => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});

  const analytics: any = [];

  data?.courses.last12Months.forEach((item: any) => {
    analytics.push({ name: item.month, uv: item.count });
  });

  console.log(data);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-[95vh]">
          <div className="mt-[35px]">
            <h1 className={`${styles.title} px-5 !text-start`}>
              Courses Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              Last 12 months analytics data
            </p>
          </div>
          <div className="w-full h-[85%] flex items-center justify-center">
            <ResponsiveContainer width={"90%"} height="50%">
              <BarChart width={150} height={300} data={analytics}>
                <XAxis dataKey="name">
                  <Label offset={0} position="insideBottom" />
                </XAxis>
                <YAxis domain={["auto"]} />
                <Bar dataKey={"uv"} fill="#3faf82">
                  <LabelList dataKey="uv" position={"top"} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
