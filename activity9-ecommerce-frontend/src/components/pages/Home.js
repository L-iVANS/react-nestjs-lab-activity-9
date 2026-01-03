import React from "react";
import Header from "../layout/header";
import SideNav from "../layout/sideNav";

const Home = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <SideNav />
        <div className="flex-1"></div>
      </div>
    </>
  );
};

export default Home;
