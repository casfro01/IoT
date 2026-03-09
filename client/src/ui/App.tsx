import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.tsx";
import {Toaster} from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <>
        <header><title>Turbine Lars</title></header>

        <RouterProvider
            router={createBrowserRouter([
                {
                    path: "/",
                    element: <Outlet />,
                    children: [
                        {
                            index: true,
                            element: <ProtectedRoute requiredRole="Operator"><DashboardPage/></ProtectedRoute>,
                        },
                        {
                            path: "login",
                            element: <LoginPage />,
                        },
                    ],
                },
            ])}
        />
        <Toaster position="top-center" reverseOrder={false}/>
    </>
  )
}

export default App
