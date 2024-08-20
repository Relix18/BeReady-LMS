import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { useTheme } from "next-themes";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineMailOutline } from "react-icons/md";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

type Props = {
  isTeam?: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const { theme, setTheme } = useTheme();
  const { isLoading, data } = useGetAllUsersQuery({});
  const [updateRole, { error, isSuccess }] = useUpdateUserRoleMutation();
  const [deleteUser, { error: delErr, isSuccess: delIsSuccess }] =
    useDeleteUserMutation();

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "User Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.8 },
    { field: "role", headerName: "Role", flex: 0.2 },
    { field: "purchased", headerName: "Purchased Courses", flex: 0.5 },
    { field: "createdAt", headerName: "Joined At", flex: 0.5 },

    {
      field: "",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
                setUserId(params.row.id);
              }}
            >
              <AiOutlineDelete
                className="text-black dark:text-white"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
    {
      field: " ",
      headerName: "Mail",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <a
              href={`mailto:${params.row.email}`}
              className="w-full flex  items-center justify-center h-full"
            >
              <MdOutlineMailOutline
                className="text-black dark:text-white"
                size={20}
              />
            </a>
          </>
        );
      },
    },
  ];

  const rows: any = [];

  if (isTeam) {
    const newData = data?.users.filter((item: any) => item.role === "admin");

    newData?.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        purchased: item.courses.length,
        createdAt: format(item.createdAt),
      });
    });
  } else {
    data?.users.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        purchased: item.courses.length,
        createdAt: format(item.createdAt),
      });
    });
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Role Updated");
    }
    if (error) {
      const err = error as any;
      toast.error(err.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (delIsSuccess) {
      toast.success("User Deleted");
    }
    if (delErr) {
      const err = delErr as any;
      toast.error(err.data.message);
    }
  }, [delIsSuccess, delErr]);

  const handleSubmit = async () => {
    await updateRole({ email, role });
    setRole("");
    setActive(false);
  };

  const deleteHanlder = async () => {
    await deleteUser(userId);
    setOpen(false);
  };

  console.log(role);

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          {isTeam && (
            <div className="w-full flex justify-end">
              <div
                className={`${styles.button} !rounded-[10px] !w-[200px] dark:bg-[#3e4396] bg-[#5662ff] `}
                onClick={() => setActive(!active)}
              >
                Add New Member
              </div>
            </div>
          )}
          <Box
            m="40px 0 0 0"
            height={"80vh"}
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
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email..."
                    className={`${styles.input}`}
                  />
                  <select
                    name=""
                    id=""
                    onChange={(e) => setRole(e.target.value)}
                    className={`${styles.input} dark:bg-gray-900  !mt-6`}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <br />
                  <div
                    className={`${styles.button} my-6 !h-[30px]}`}
                    onClick={handleSubmit}
                  >
                    Submit
                  </div>
                </div>
              </Box>
            </Modal>
          )}
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="mt-4 flex w-full items-center justify-between mb-6">
                  <div
                    className={`${styles.button} !w-[120px] my-6 !h-[30px]}`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] my-6 !h-[30px]} bg-[#ff0000]`}
                    onClick={deleteHanlder}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllUsers;
