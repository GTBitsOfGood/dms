import config from "config";
import { fetchRequestWithPayloadResponse } from "utils/util";
import { Donation } from "utils/types";

export const createPaymentIntent = async (amount: number): Promise<string> =>
  fetchRequestWithPayloadResponse<string>(config.apis.paymentIntents, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount })
  });

export const createDonation = async ({
  name,
  email,
  amount,
  nonprofitId
}: Omit<Donation, "timestamp">): Promise<boolean> =>
  fetchRequestWithPayloadResponse<boolean>(config.apis.createDonation, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, amount, nonprofitId })
  });
