import * as mongodb from 'mongodb';

export interface ShopCardsDetails {
    productImg: string;
    subImages: string[];
    productName: string;
    ingredients: string;
    preparation: string[];
    productPrice: number;
    inStock: boolean;
    hasSizes: boolean;
    productQuantity: number;
    _id?: string | mongodb.ObjectId;
}

export interface cartProduct{
    productImg: string;
    productName: string;
    productPrice: number;
    productQuantity: number;
    _id?: string | mongodb.ObjectId;
}

// src/interfaces/paystack.interface.ts

export interface PaystackResponse {
    status: boolean;
    message: string;
    data?: any;
  }
  