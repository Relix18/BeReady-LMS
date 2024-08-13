import { redirect } from "next/navigation";
import useAuth from "./useAuth";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Protected({ children }: Props) {
  const isAuthenticated = useAuth();

  return isAuthenticated ? children : redirect("/");
}
