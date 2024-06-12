const { Customer, Order, CommunicationLog } = require("../models/models");
// import { OAuth2Client } from "google-auth-library";
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client({
  clientId:
    "1042211534366-p85jct9354qm95ob6lmopktbsdpos50o.apps.googleusercontent.com",
});

// Customer Controllers
const addCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Order Controllers
const addOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    const customer = await Customer.findById(order.customerId);
    customer.totalSpends += order.amount;
    customer.visits += 1;
    customer.lastVisit = new Date();
    await customer.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Campaign Controllers
const createCampaign = async (req, res) => {
  try {
    const { message, conditions } = req.body;

    // Build the query based on conditions
    const query = buildQuery(conditions);

    // Find customers based on the query
    const customers = await Customer.find(query);

    const logs = await Promise.all(
      customers.map(async (customer) => {
        const log = new CommunicationLog({ customerId: customer._id, message });
        return log.save();
      })
    );

    res.status(201).json(logs);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(400).json({ error: error.message });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await CommunicationLog.find().sort({ _id: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  console.log(req.body);

  // Verify the token
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience:
      "1042211534366-p85jct9354qm95ob6lmopktbsdpos50o.apps.googleusercontent.com",
  });
  const { email_verified, name, email, picture } = ticket.getPayload();
  return res.status(200).json({
    success: true,
    message: "Google login successful",
    email_verified,
    name,
    email,
    picture,
  });
};

// const googleCallback = async (req, res) => {
//   const code = req.query.code;
//   try {
//     const { tokens } = await client.getToken(code);
//     client.setCredentials(tokens);
//     const userInfo = await google.oauth2("v2").userinfo.get({ auth: client });
//     // Here you can save userInfo to your database or create a session token
//     res.send(userInfo.data);
//   } catch (error) {
//     console.error("Error retrieving access token", error);
//     res.status(500).send("Failed to authenticate user");
//   }
// };

module.exports = {
  addCustomer,
  getCustomers,
  addOrder,
  getOrders,
  createCampaign,
  getCampaigns,
  googleLogin,
  // googleCallback,
};
