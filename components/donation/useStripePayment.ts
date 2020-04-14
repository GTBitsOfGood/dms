import { useCallback, useMemo } from "react";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import * as stripeJs from "@stripe/stripe-js";

const CENTS_IN_DOLLAR = 100;

const useStripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();

  const isReady = useMemo(() => stripe && elements, [stripe, elements]);
  /* eslint-disable @typescript-eslint/camelcase */
  const processPayment = useCallback(
    async (name: string, email: string, zipcode: string, amount: number) => {
      if (!elements || !stripe) {
        throw new Error("Not ready to process payments just yet!");
      }
      // TODO: Finalize the below code:

      // const card = elements.getElement("cardNumber");
      // if (!card) {
      //   throw new Error("Couldn't get cardNumber Stripe element!");
      // }

      // const billingDetails: stripeJs.PaymentMethodCreateParams.BillingDetails = {
      //   name,
      //   email,
      //   address: {
      //     postal_code: zipcode
      //   }
      // };

      // // NOTE: amount needs to be converted to cents via CENTS_IN_DOLLAR
      // const [paymentMethodReq, paymentIntentReq] = await Promise.all([
      //   stripe.createPaymentMethod({
      //     type: "card",
      //     card,
      //     billing_details: billingDetails
      //   }),
      //   fetch("TODO")
      // ]);

      // if (paymentMethodReq.error) {
      //   throw new Error(paymentMethodReq.error.message);
      // }

      // if (!paymentMethodReq.paymentMethod) {
      //   throw new Error(
      //     "createPaymentMethod returned an invalid payment method!"
      //   );
      // }

      // const { error } = await stripe.confirmCardPayment(paymentIntentReq.data, {
      //   payment_method: paymentMethodReq.paymentMethod.id
      // });

      // if (error) {
      //   throw error;
      // }
    },
    [elements, stripe]
  );
  /* eslint-enable @typescript-eslint/camelcase */

  return { isReady, processPayment };
};

export default useStripePayment;