import { createLazyFileRoute, Navigate } from "@tanstack/react-router";
import { useUserStore } from "../zustand/user";
import { Home } from "../pages/Home";

const Index = () => {
  const { token } = useUserStore();
  return <Home />;
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
