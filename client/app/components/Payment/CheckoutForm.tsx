import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/orderAPI";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  data: any;
  setOpen: (open: boolean) => void;
};

const CheckoutForm = ({ data, setOpen }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery({ skip: loadUser ? false : true });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message as string);
      setIsLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      setIsLoading(false);
      createOrder({
        courseId: data._id,
        payment_info: paymentIntent,
      });
    }
  };

  useEffect(() => {
    if (orderData) {
      setLoadUser(true);
      redirect("/courses/" + data._id);
    }

    if (error) {
      const err = error as any;
      toast.error(err.data.message);
    }
  }, [orderData, error]);

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full"
        id="submit"
      >
        <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
          {isLoading ? (
            <div
              className="loader border-[4px] border-solid border-[#19cec6] border-t-[4px] border-t-[#fff] rounded-full w-[30px] h-[30px] animate-spin"
              id="spinner"
            ></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>

      {message && (
        <div id="payment-message" className="text-red-500 font-Poppins pt-2">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
