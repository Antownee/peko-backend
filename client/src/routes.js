import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { UserLayout, LoginRegisterLayout, AdminLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/common/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import UserPlaceOrder from "./views/user/UserPlaceOrder";
import AdminAddAssets from "./views/admin/AdminAddAssets";
import Dashboard from "./views/common/Dashboard";
import OrderList from "./views/common/OrderList";


const routes = [
  {
    path: "/",
    exact: true,
    layout: UserLayout,
    component: () => <Redirect to="/login" />
  },
  {
    path: "/blog-overview",
    layout: UserLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile-lite",
    layout: UserLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-post",
    layout: UserLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: UserLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: UserLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: UserLayout,
    component: Tables
  },
  {
    path: "/blog-posts",
    layout: UserLayout,
    component: BlogPosts
  },
  {
    path: "/user/place-order",
    exact: true,
    layout: UserLayout,
    component: UserPlaceOrder
  },
  {
    path: "/user/order-status",
    exact: true,
    layout: UserLayout,
    component: OrderList
  },
  {
    path: "/user/dashboard",
    exact: true,
    layout: UserLayout,
    component: Dashboard
  },
  {
    path: "/admin/dashboard",
    exact: true,
    layout: AdminLayout,
    component: Dashboard
  },
  {
    path: "/admin/orders",
    exact: true,
    layout: AdminLayout,
    component: OrderList
  },
  {
    path: "/admin/assets",
    exact: true,
    layout: AdminLayout,
    component: AdminAddAssets
  }
];

export default routes
