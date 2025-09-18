"use client";
import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateStore() {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    image: null,
  });

  const onChangeHandler = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  const fetchSellerStatus = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('/api/store/create', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setAlreadySubmitted(true);
        setStatus(response.data.status);
        
        if (response.data.status === "approved") {
          setMessage("Your store has been approved! Redirecting to dashboard...");
          setTimeout(() => {
            router.push('/dashboard');
          }, 5000);
        } else if (response.data.status === "pending") {
          setMessage("Your store is under review. Please wait for admin approval.");
        } else if (response.data.status === "rejected") {
          setMessage("Your store application was rejected. Please contact support for more information.");
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Store not found - user can create one
        setAlreadySubmitted(false);
      } else {
        console.error("Error fetching store status:", error);
        toast.error("Failed to fetch store status");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Please login to continue");
    }
    
    // Validation des champs requis
    if (!storeInfo.name || !storeInfo.username || !storeInfo.description || 
        !storeInfo.email || !storeInfo.contact || !storeInfo.address || !storeInfo.image) {
      return toast.error("Please fill all required fields");
    }
    
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", storeInfo.name);
      formData.append("username", storeInfo.username);
      formData.append("description", storeInfo.description);
      formData.append("email", storeInfo.email);
      formData.append("contact", storeInfo.contact);
      formData.append("address", storeInfo.address);
      formData.append("image", storeInfo.image);
      
      const { data } = await axios.post('/api/store/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      toast.success("Store created successfully! Waiting for approval.");
      setAlreadySubmitted(true);
      setStatus("pending");
      setMessage("Your store is under review. Please wait for admin approval.");
      
    } catch (error) {
      console.error("Error creating store:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          toast.error("Unauthorized: Please login again");
        } else if (status === 400) {
          toast.error(data.message || "Missing required fields");
        } else if (status === 404) {
          toast.error("Store not found");
        } else if (status === 500) {
          toast.error("Server error: Please try again later");
        } else {
          toast.error(data.message || "An error occurred");
        }
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    fetchSellerStatus();
  }, []);

  return !loading ? (
    <>
      {!alreadySubmitted ? (
        <div className="mx-6 min-h-[70vh] my-16">
          <form
            onSubmit={onSubmitHandler}
            className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
          >
            {/* Title */}
            <div>
              <h1 className="text-3xl ">
                Add Your{" "}
                <span className="text-slate-800 font-medium">Store</span>
              </h1>
              <p className="max-w-lg">
                To become a seller on GoCart, submit your store details for
                review. Your store will be activated after admin verification.
              </p>
            </div>

            <label className="mt-10 cursor-pointer">
              Store Logo *
              <Image
                src={
                  storeInfo.image
                    ? URL.createObjectURL(storeInfo.image)
                    : assets.upload_area
                }
                className="rounded-lg mt-2 h-16 w-auto"
                alt=""
                width={150}
                height={100}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, image: e.target.files[0] })
                }
                hidden
                required
              />
            </label>

            <p>Username *</p>
            <input
              name="username"
              onChange={onChangeHandler}
              value={storeInfo.username}
              type="text"
              placeholder="Enter your store username"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
              required
            />

            <p>Name *</p>
            <input
              name="name"
              onChange={onChangeHandler}
              value={storeInfo.name}
              type="text"
              placeholder="Enter your store name"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
              required
            />

            <p>Description *</p>
            <textarea
              name="description"
              onChange={onChangeHandler}
              value={storeInfo.description}
              rows={5}
              placeholder="Enter your store description"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
              required
            />

            <p>Email *</p>
            <input
              name="email"
              onChange={onChangeHandler}
              value={storeInfo.email}
              type="email"
              placeholder="Enter your store email"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
              required
            />

            <p>Contact Number *</p>
            <input
              name="contact"
              onChange={onChangeHandler}
              value={storeInfo.contact}
              type="text"
              placeholder="Enter your store contact number"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
              required
            />

            <p>Address *</p>
            <textarea
              name="address"
              onChange={onChangeHandler}
              value={storeInfo.address}
              rows={5}
              placeholder="Enter your store address"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
              required
            />

            <button 
              type="submit"
              className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition "
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">
            {message}
          </p>
          {status === "approved" && (
            <p className="mt-5 text-slate-400">
              redirecting to dashboard in{" "}
              <span className="font-semibold">5 seconds</span>
            </p>
          )}
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
}