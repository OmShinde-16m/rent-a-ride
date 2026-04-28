import { toast } from "sonner";
import {
  setLatestBooking,
  setisPaymentDone,
} from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert, setPageLoading } from "../../redux/user/userSlice";
import { API_BASE_URL } from "../../constants/api";

export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export const fetchLatestBooking = async (user_id, dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/latestbookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch latest booking");
    }

    const data = await response.json();
    dispatch(setLatestBooking(data));
    dispatch(setisPaymentDone(true));
    return data;
  } catch (error) {
    console.error("Error fetching latest booking:", error);
    return null;
  }
};

export async function displayRazorpay(values, navigate, dispatch) {
  try {
    let refreshToken = localStorage.getItem("refreshToken");
    let accessToken = localStorage.getItem("accessToken");

    const dbData = {
      ...values,
      razorpayPaymentId: "PAYMENT_BYPASSED_" + Date.now(),
      razorpayOrderId: "ORDER_BYPASSED_" + Date.now(),
    };

    const result = await fetch(`${API_BASE_URL}/api/user/bookCar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dbData),
    });
    const successStatus = await result.json();
    if (successStatus) {
      dispatch(setIsSweetAlert(true));
      await fetchLatestBooking(values.user_id, dispatch);
      navigate("/");
      dispatch(setPageLoading(false));
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}

const Razorpay = () => {
  return <div></div>;
};

export default Razorpay;