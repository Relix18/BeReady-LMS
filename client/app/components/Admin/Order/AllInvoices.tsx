import React, { FC, useEffect, useState } from "react";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPI";
import { useGetOrdersQuery } from "@/redux/features/orders/orderAPI";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import Loader from "../../Loader/Loader";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AiOutlineMail } from "react-icons/ai";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices: FC<Props> = ({ isDashboard }) => {
  const { theme, setTheme } = useTheme();
  const { isLoading, data } = useGetOrdersQuery({});
  const { data: userData } = useGetAllUsersQuery({});
  const { data: courseData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const temp = data?.orders.map((item: any) => {
        const user = userData?.users?.find(
          (user: any) => user._id === item.userId
        );
        const course = courseData?.courses?.find(
          (course: any) => course._id === item.courseId
        );
        return {
          ...item,
          id: item._id,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.title,
          price: "$" + course?.price,
        };
      });
      setOrderData(temp);
    }
  }, [data, userData, courseData]);

  const columns: any = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.5 },
    ...(isDashboard
      ? [
          {
            field: "createdAt",
            headerName: "Created At",
            flex: 0.5,
          },
        ]
      : [
          {
            field: "",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => {
              return (
                <a
                  className="w-full flex  items-center justify-center h-full"
                  href={`mailto:${params.row.userEmail}`}
                >
                  <AiOutlineMail
                    className="text-black dark:text-white"
                    size={20}
                  />
                </a>
              );
            },
          },
        ]),
  ];

  const rows: any = [];

  orderData?.forEach((item: any) => {
    rows.push({
      id: item.id,
      userName: item.userName,
      userEmail: item.userEmail,
      title: item.title,
      price: item.price,
      createdAt: format(item.createdAt),
    });
  });

  console.log(data);

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m={isDashboard ? "0" : "40px"}>
          <Box
            m={isDashboard ? "0" : "40px 0 0 0"}
            height={isDashboard ? "35vh" : "90vh"}
            overflow={"hidden"}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30 !important"
                    : "1px solid #ccc !important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              " & .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
                background: "none !important",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#3e4396 " : "#A4A9FC ",
                borderBottom: "none",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1f2a40" : "#f2f0f0",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? "#b7ebde !important" : "#000 !important",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#fff !important",
              },
            }}
          >
            <DataGrid
              checkboxSelection={isDashboard ? false : true}
              rows={rows}
              columns={columns}
              components={isDashboard ? {} : { Toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
