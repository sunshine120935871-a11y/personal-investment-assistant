import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { PostDetail } from "./pages/PostDetail";
import { Search } from "./pages/Search";
import { Consultation } from "./pages/Consultation";
import { Profile } from "./pages/Profile";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "post/:id", element: <PostDetail /> },
      { path: "search", element: <Search /> },
      { path: "consultation", element: <Consultation /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
