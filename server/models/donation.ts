import { Schema, model, models, Model } from "mongoose";
import { IDonationDocument } from "utils/types";

// Keep in sync with utils/types Donation
const donationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  nonprofitId: {
    type: String,
    ref: "Nonprofit",
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const donationModel: Model<IDonationDocument> =
  models?.Donation || model("Donation", donationSchema);

export default donationModel;
