const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  totalSpends: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  lastVisit: { type: Date },
});

const OrderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const CommunicationLogSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  message: { type: String, required: true },
  status: { type: String, default: "PENDING" },
});

const CampaignSchema = new Schema({
  audienceId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Audience ID is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [10, "Message must be at least 10 characters long"],
    maxlength: [500, "Message must be less than 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["SENT", "FAILED"],
    default: "SENT",
  },
});

CampaignSchema.pre("save", function (next) {
  console.log(`Campaign with message "${this.message}" is being saved.`);
  next();
});

const Customer = mongoose.model("Customer", CustomerSchema);
const Order = mongoose.model("Order", OrderSchema);
const CommunicationLog = mongoose.model(
  "CommunicationLog",
  CommunicationLogSchema
);
const Campaign = mongoose.model("Campaign", CampaignSchema);

module.exports = { Customer, Order, CommunicationLog, Campaign };
