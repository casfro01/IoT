import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <>
        <header><title>Turbine Lars</title></header>

        <RouterProvider router={createBrowserRouter([
            {
                path: "/",
                element: <Outlet></Outlet>,
                children:[
                    {
                        path: "/login",
                        element: <LoginPage/>
                    },
                ]
            }
        ])}
        />
        <Toaster position="top-center" reverseOrder={false}/>
    </>
  )
}

export default App
