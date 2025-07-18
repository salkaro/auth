"use server";

import Stripe from 'stripe';


export async function createStripeCustomer({ email }: { email: string }) {
    const stripeAPIKey = process.env.STRIPE_API_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        let customer;

        // If customerId was not provided or customer was not found, check by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (customers.data.length > 0) {
            customer = customers.data[0];
            return customer.id;
        } else {
            // Create a new customer since one doesn't exist with the provided email
            customer = await stripe.customers.create({
                email: email
            });
            return customer.id;
        }
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
};