"use client";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useUser } from "@clerk/nextjs";

export default function PublicLayout({ children }) {
  const { user } = useUser();
  const {getToken}
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, []);
  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
