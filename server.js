const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Define Mongoose schema and model
const auctionSchema = new mongoose.Schema({
  AuctionNo: String,
  AuctionDate: String,
  SubscriberName: String,
  PoolOfFundsFromCollection: String,
  CummulativeBalanceBeforeAuction: String,
  WinningBid: String,
  PrizedAmount: String,
  ForemanCommission: String,
  WalletContribution: String,
  CummulativeBalanceAfterAuction: String,
});

const Auction = mongoose.model("Auction", auctionSchema);

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://sakthikumar:5ZCd3N3mdBhB5Esi@cluster0.adfvmtw.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Express route to handle adding new auction data
app.post("/addAuction", async (req, res) => {
  try {
    const auctionData = req.body;
    console.log("auctionData", auctionData);
    const auctions = await Auction.find();
    const a = auctionData.PoolOfFundsFromCollection;
    const f = 5000;
    const d = auctionData.PrizedAmount;
    let c = a - d;
    let after = 0;
    let auctionNumber = 0;

    if (auctions.length !== 0) {
      after = parseInt(
        auctions[auctions.length - 1].CummulativeBalanceAfterAuction
      );
      auctionNumber = auctions[auctions.length - 1].AuctionNo;
    }
    let b = a;
    if (auctions.length === 0) {
      b = a;
    } else {
      b = a + after;
    }

    if (parseInt(auctionNumber) == auctionData.AuctionNo) {
      c = auctions[auctions.length - 1].PoolOfFundsFromCollection - d;
    }
    const e = c - f;

    let g = 0;
    if (auctions.length === 0) {
      g = c - f;
    } else {
      g = e + after;
    }
    console.log("a", a);
    console.log("d", d);
    console.log("g", g);
    console.log("c", c);
    console.log("e", e);
    console.log("b", b);
    console.log(
      " parseInt(auctionNumber) == auctionData.AuctionNo",
      parseInt(auctionNumber) == auctionData.AuctionNo
    );
    console.log(" parseInt(auctionNumber) ", parseInt(auctionNumber));
    const Request = {
      AuctionNo: auctionData.AuctionNo,
      AuctionDate: auctionData.AuctionDate,
      SubscriberName: auctionData.SubscriberName,
      PoolOfFundsFromCollection: auctionData.PoolOfFundsFromCollection,
      CummulativeBalanceBeforeAuction: b,
      WinningBid: c,
      PrizedAmount: auctionData.PrizedAmount,
      ForemanCommission: f,
      WalletContribution: e,
      CummulativeBalanceAfterAuction:
        parseInt(auctionNumber) == auctionData.AuctionNo ? b - d - f : g,
    };

    const newAuction = new Auction(Request);
    await newAuction.save();
    res.status(201).send("Added Successfully");
  } catch (error) {
    console.error("Error adding auction:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Express route to fetch all auction data
app.get("/auctions", async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.status(200).json(auctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Root route
app.get("/", function (req, res) {
  res.send("Welcome to Chit");
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
