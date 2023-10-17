import * as mongodb from "mongodb";
import { ShopCardsDetails } from "./employee";

export const collections: {
    products?: mongodb.Collection<ShopCardsDetails>;
} = {};

export async function connectToDb(uri: string) {
  const client = new mongodb.MongoClient(uri);

  await client.connect();

  const db = client.db("mpampaWebsite");
//   await applySchemaValidation(db);

  const shopCardsCollection = db.collection<ShopCardsDetails>("products");
  collections.products = shopCardsCollection;
}

// YWZmcolpJQmnUZdT