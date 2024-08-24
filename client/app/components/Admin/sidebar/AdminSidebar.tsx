import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import {
  IoArrowBack,
  IoArrowForward,
  IoBarChartOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoMapOutline,
  IoPeople,
  IoReceipt,
  IoSettingsOutline,
} from "react-icons/io5";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { useSelector } from "react-redux";
import avatarDefault from "../../../../public/assets/user.png";
import {
  MdEventNote,
  MdManageHistory,
  MdOndemandVideo,
  MdPeopleOutline,
  MdQuiz,
  MdVideoCall,
  MdWeb,
} from "react-icons/md";

type itemProps = {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
};

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
      <Link href={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const logoutHandler = () => {
    setLogout(true);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${theme === "dark" ? "#111c43 !important" : "#fff "}`,
        },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item:hover": { color: "#868dfb !important" },
        "& .pro-menu-item.active": { color: "#6870fa !important" },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "& .pro-menu-item": { color: `${theme !== "dark" && "#000"}` },
      }}
      className={"!bg-white dark:bg-[#111c43]"}
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0%" : "16%",
        }}
      >
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <IoArrowForward /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Link href={"/"}>
                  <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                    BeReady
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block"
                >
                  <IoArrowBack className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  alt="profile-user"
                  width={100}
                  height={100}
                  className="cursor-pointer rounded-full border broder-[#5b6fe6]"
                  src={user.avatar ? user?.avatar?.url : avatarDefault}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  className="!text-[20px] text-black dark:text-[#ffffffc1]"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="h6"
                  className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize"
                  sx={{ m: "10px 0 0 0" }}
                >
                  - {user.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to={"/admin"}
              icon={<IoHomeOutline size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Data"}
            </Typography>
            <Item
              title="Users"
              to={"/admin/users"}
              icon={<IoPeople size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices"
              to={"/admin/invoices"}
              icon={<IoReceipt size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Content"}
            </Typography>
            <Item
              title="Create Course"
              to={"/admin/create-course"}
              icon={<MdVideoCall size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Live Courses"
              to={"/admin/courses"}
              icon={<MdOndemandVideo size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Customization"}
            </Typography>
            <Item
              title="Hero"
              to={"/admin/hero"}
              icon={<MdWeb size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ"
              to={"/admin/faq"}
              icon={<MdQuiz size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to={"/admin/categories"}
              icon={<MdEventNote size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Controllers"}
            </Typography>
            <Item
              title="Manage Team"
              to={"/admin/team"}
              icon={<MdPeopleOutline size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Analytics"}
            </Typography>
            <Item
              title="CourseAnalytics"
              to={"/admin/course-analytics"}
              icon={<IoBarChartOutline size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders Analytics"
              to={"/admin/orders-analytics"}
              icon={<IoMapOutline size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users Analytics"
              to={"/admin/users-analytics"}
              icon={<MdManageHistory size={isCollapsed ? 20 : 14} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Extras"}
            </Typography>

            <div onClick={logoutHandler}>
              <Item
                title="Logout"
                to={"/"}
                icon={<IoLogOutOutline size={isCollapsed ? 20 : 14} />}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
