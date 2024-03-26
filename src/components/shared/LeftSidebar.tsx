import React, { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { Button } from "../ui";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { TNavLink } from "@/types";

const LeftSidebar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {isSuccess, mutateAsync: signOutAccount} = useSignOutAccount()

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/">
          <img src="/assets/images/logo.svg" alt="logo" />
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile icon"
            className="rounded-full h-14 w-14"
          />
          <div className="flex flex-col items">
            <p className="body-bold">{user.fullname}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>
      </div>

      <ul className="flex flex-col gap-6">
        {
         sidebarLinks.map((link: TNavLink) =>{
          const isActive = pathname === link.route
          return(
            <li key={link.label} className={`leftsidebar-link ${isActive && "bg-primary-500"}` }>
              <NavLink to={link.route} className="flex gap-4 items-center p-4 group">
              <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                {link.label}
              </NavLink>
            </li>
          )
         })
        }
      </ul>
      <Button className="shad-button_ghost"
      variant="ghost"
      onClick={() => signOutAccount()}>
        <img src="/assets/icons/logout.svg" alt="" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
