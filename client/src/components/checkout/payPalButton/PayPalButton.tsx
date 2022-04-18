import React, { useState, useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { State } from "../../../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { getcurrentOrder, updatePayPal } from "../../../redux/actions/ordersUser";
import { useLocalStorage } from "../../../helpers/useLocalStorage";
import { useNavigate } from "react-router";
// import { getError } from '../helpers/utils';

export default function PayPalCheckoutButtons(props: any) {
  const [userInStorage , setuserInStorage] = useLocalStorage('USER_LOGGED','')
  const activeOrder = useSelector((state: State) => state.ordersUser.activeOrder);
  const user = useSelector((state: State) => state.user);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { order } = props;
  const dispatch = useDispatch();
  const [paidFor, setPaidFor] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    loadPayPalScript(process.env.REACT_APP_PAYPAL_CLIENT_ID);
  }, []);

  function createOrder(data: any, actions: any) {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: activeOrder.total_amount }, // agregar el monto correspondiente
        },
      ],
    });
  }
  const onApprove = async (data: any, actions: any) => {
    try {
      const order = await actions.order.capture();
      handleAprove(data.orderID);
    } catch (err) {
      // toast.error(getError(err));
    }
  };

  function handleAprove(orderID: any) {
    try {
      // Action to update the order with the data returned
      //despachar action con orderID de paypal y id de orden USAR FUNCION UPDATE ORDER
      // orderRouter.put("/auth/:id/pay", isLoggedIn, updatePaypalOrder);
      const info = {
        paymentMethod: "PayPal",
        shippingPrice: 0,
        taxPrice: 0,
        orderIdPayment: orderID,
        email_address: activeOrder.email_address,
      };
      console.log(activeOrder.id);
      
      dispatch(updatePayPal(activeOrder.id, info, user!.token));
      //if response is success

      navigate('/products')
      // setTimeout(()=> {
      //   dispatch(getcurrentOrder(userInStorage.token))
      // } , 500)
      setPaidFor(true);
    } catch (error) {
      // swal({
      //     title: "Wrong",
      //     text: "Something went wrong with the payment",
      //     icon: "warning",
      //     dangerMode: true,
      //     buttons: {
      //       confirm: true,
      //     },
      //   });
      alert("algo paso ");
      console.log(error);
    }

    //Refresh user's account or suscription status

    //if the response us an error
    //Alert with the right response.
  }

  // if (paidFor) {
  //     // display success message, modal or redirect to the succes pag
  //     alert("Thenk you for your purchase");
  // }


  function onCancel() {
    swal({
      title: "Wrong",
      text: "The payment was cancelled",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: true,
      },
    });
  }

  function onError(err: any) {
    swal({
        title: "Wrong",
        text: "There was an error during the payment",
        icon: "warning",
        dangerMode: true,
        buttons: {
          confirm: true,
        },
      });
  }

  const loadPayPalScript = async (clientId: any) => {
    paypalDispatch({
      type: "resetOptions",
      value: {
        "client-id": clientId,
        currency: "USD",
      },
    });
    // paypalDispatch({ type: 'setLoadingStatus', value: 'Pending' }); ver que onda el value
  };



  return (
    <PayPalButtons
      style={{
          color: "silver",
          layout: "horizontal",
          height: 48,
          tagline: false,
          shape: "pill"
      }}
      createOrder={createOrder}
      onApprove={onApprove}
      onCancel={onCancel}
      onError={onError}
    />
  );
}
