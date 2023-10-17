// momoApi.ts
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const MTN_API_BASE_URL = 'https://sandbox.momodeveloper.mtn.com';
export const SUBSCRIBER_KEY = '9df4c53aa3e64cbda4ca2d91983b016d'; // Replace with your MoMo API subscriber key
export let xReferenceId = "";

export async function generateXRef(){
try{
    const response = await axios.get(
        'https://www.uuidgenerator.net/api/version4',
        {},
    
    );
      xReferenceId = response.data; // Update xReferenceId with the generated user reference
      console.log('X-Ref:', xReferenceId);
      return xReferenceId;
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
}

export async function createUser(): Promise<void> {
  try {
    // await generateXRef();
    const response = await axios.post(
      `${MTN_API_BASE_URL}/v1_0/apiuser`,
      {
        providerCallbackHost: 'https://your-callback-url.com', // Replace with your callback URL
      },
      {
        headers: {
          'Ocp-Apim-Subscription-Key': SUBSCRIBER_KEY,
          'X-Reference-Id': xReferenceId,
          'Content-Type': 'application/json',
        },
      }
    );

    // xReferenceId = response.data.apiuserreference; // Update xReferenceId with the generated user reference
    console.log('New User created!');
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
}

export async function generateApiKey(): Promise<string | undefined> {
  try {
    await createUser();

    const response = await axios.post(
      `${MTN_API_BASE_URL}/v1_0/apiuser/${xReferenceId}/apikey`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': SUBSCRIBER_KEY,
          'X-Reference-Id': xReferenceId,
          Accept: 'application/json',
        },
      }
    );

    const apiKey: string = response.data.apiKey;
    console.log('API Key:', apiKey);
    return apiKey;
  } catch (error) {
    console.error('Error generating API Key:', error.message);
  }
}

export async function generateAccessToken(apiKey: string): Promise<string | null> {
  try {
    const response = await axios.post(
      `${MTN_API_BASE_URL}/collection/token/`,
      {},
      {
        auth: {
          username: xReferenceId,
          password: apiKey,
        },
        headers: {
          'Ocp-Apim-Subscription-Key': SUBSCRIBER_KEY,
        },
      }
    );

    const accessToken: string = response.data.access_token;
    console.log('New access token generated:', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error generating access token:', error.message);
    return null;
  }
}
