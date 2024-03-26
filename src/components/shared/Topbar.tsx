import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useAuth } from "@/context/AuthContext";

const Topbar = () => {
  const { user } = useAuth()
  const navigate = useNavigate();
  const { mutateAsync: signOutAccount, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo.svg" alt=""
          height={150}
          width={150} />
        </Link>
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOutAccount()}
          >
            <img src="/assets/icons/logout.svg" alt="" />
          </Button>
          <Link to={"/profile"}>
            <img
              src={user.imageUrl||"/assets/icons/profile-placeholder.svg"}
              alt=""
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
