import mongoose, { Document, Schema } from 'mongoose';

interface ShopCardsDetails extends Document {
  productImg: string;
  subImages: string[];
  productName: string;
  ingredients: string;
  preparation: string[];
  productPrice: number;
  inStock: boolean;
  hasSizes: boolean;
  productQuantity: number;
  _id?: string | mongoose.Types.ObjectId;
}


const shopCardsDetailsSchema = new Schema<ShopCardsDetails>({
  productImg: { type: String, required: true },
  subImages: [{ type: String }],
  productName: { type: String, required: true },
  ingredients: { type: String, required: true },
  preparation: [{ type: String }],
  productPrice: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  hasSizes: { type: Boolean, default: false },
  productQuantity: { type: Number, default: 0 },
  _id: { type: Schema.Types.ObjectId, required: false },
});

const ShopCardsDetailsModel = mongoose.model<ShopCardsDetails>('Products', shopCardsDetailsSchema);

export { ShopCardsDetails, ShopCardsDetailsModel };
