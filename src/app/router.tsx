import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      const { DashboardRoute } = await import("./routes/app/dashboard");
      return { Component: DashboardRoute };
    },
  },
  {
    path: "*",
    lazy: async () => {
      const { NotFoundRoute } = await import("./routes/not-found");
      return { Component: NotFoundRoute };
    },
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
