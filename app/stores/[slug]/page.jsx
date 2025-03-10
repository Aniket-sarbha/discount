"use client";
import Navbar from "@/app/components/Navbar";
import React from "react";
import "./page.module.css";
import Banner from "./components/Banner";
import Payment from "./components/Payment";
import ProductSelection from "./components/ProductSelection";
import Footer from "@/app/components/Footer";
import { useParams, useRouter } from 'next/navigation';

const page = () => {

  const { slug } = useParams();

  return (
    <>
      <div>
        <div>
          <Navbar />
        </div>
        <div>
          <Banner slug={slug} />
        </div>
        <div className="bg-gray-800">
        </div>
        <div className="w-full px-4 md:px-8 lg:px-16 my-4">
          <div className="flex flex-col md:flex-row ">
            <div className="w-full md:w-1/2">
              <ProductSelection />
            </div>
            <div className="w-full md:w-1/2">
              <Payment />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default page;
