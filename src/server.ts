import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import axios from 'axios';
import { connectToDb } from "./database";
import { shopCardsRouter } from "./employee.routes";
import {
  SUBSCRIBER_KEY,
  xReferenceId,
  createUser,
  generateApiKey,
  generateAccessToken,
  generateXRef,
} from "./api";
import paystackRouter from './paystack.route';


const app = express();
const PORT = 9000;

app.use(express.json());
app.use(cors());

app.use('/paystack', paystackRouter);

app.post("/request-to-pay", async (req, res) => {
  try {
    const xReferenceId = await generateXRef();
    const apiKey = await generateApiKey();
    const accessToken = await generateAccessToken(apiKey);

    // Example Request to Pay data from the client-side
    const { amount, payerNumber, currency, externalId } = req.body;

    const requestToPayResponse = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
      {
        amount,
        currency,
        externalId,
        payer: {
          partyIdType: "MSISDN",
          partyId: payerNumber,
        },
        payeeNote: "Payment request",
        payerMessage: "You are requested to pay",
      },
      {
        headers: {
          "X-Reference-Id": xReferenceId, // Use a unique request id for every new request
          Authorization: `Bearer ${accessToken}`,
          "X-Target-Environment": "sandbox",
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": SUBSCRIBER_KEY,
        },
      }
    );

    console.log("MoMo API Response:", requestToPayResponse.data);

    // Handle the response and send back to the client
    res.json(requestToPayResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const INTERVAL_MS = 60 * 60 * 1000; // 1 hour in milliseconds

setInterval(async () => {
  try {
    const apiKey = await generateApiKey();
    const accessToken = await generateAccessToken(apiKey);

    // Optionally, update any logic using the new accessToken here
    // ...
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
  }
}, INTERVAL_MS);

// app.listen(PORT, () => {
//   console.log(`API Server is running on port ${PORT}`);
// });

dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been declared on config.env"
  );
  process.exit(1);
}

connectToDb(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());

    // app.use("/products", shopCardsRouter);
    // app.listen(5200, () => {
    //   console.log("Connected to http://localhost:5200...");
    // });
  })
  .catch((error) => console.error(error));

  app.use("/products", shopCardsRouter);
    app.listen(5200, () => {
      console.log("Connected to http://localhost:5200...");
    });