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

export interface users{
    email: string;
    password: string;
    _id?: string | mongodb.ObjectId;
}

export interface reviews{
    ratingValue: number;
    reviewMessage : string;
    photo: string;
    _id?: string | mongodb.ObjectId;
    reviewId: any;
}

// src/interfaces/paystack.interface.ts

export interface PaystackResponse {
    status: boolean;
    message: string;
    data?: any;
  }
  