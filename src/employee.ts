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
    // profileImage: string;
    // userName: string;
    emailAddress: number;
    password: number;
    _id?: string | mongodb.ObjectId;
}

export interface reviews{
    rating: number;
    reviewMessage : string;
    photo: string;
    _id?: string | mongodb.ObjectId;
}

// src/interfaces/paystack.interface.ts

export interface PaystackResponse {
    status: boolean;
    message: string;
    data?: any;
  }
  