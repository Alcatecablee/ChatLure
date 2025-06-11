import { Client, Environment, LogLevel } from '@paypal/paypal-server-sdk';
import { storage } from './storage';

interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  webhookId?: string;
}

interface CreatePaymentRequest {
  amount: number;
  currency: string;
  description: string;
  userId?: number;
  planId?: number;
  isSubscription?: boolean;
  guestCheckout?: boolean;
}

interface PaymentResult {
  id: string;
  status: string;
  approvalUrl?: string;
  amount: number;
  currency: string;
}

export class PayPalService {
  private client: Client | null = null;
  private config: PayPalConfig | null = null;
  private initialized = false;

  constructor() {
    // Don't initialize immediately, wait for reinitialize call
  }

  /**
   * Initialize PayPal service with credentials from database
   */
  private async initializeFromDatabase() {
    try {
      const settings = await storage.getSiteSettings();
      const paypalSettings = settings.paypal;
      
      if (!paypalSettings || !paypalSettings.clientId || !paypalSettings.clientSecret) {
        console.warn('PayPal credentials not configured in database');
        this.client = null;
        this.config = null;
        this.initialized = false;
        return;
      }

      this.config = {
        clientId: paypalSettings.clientId,
        clientSecret: paypalSettings.clientSecret,
        environment: paypalSettings.environment || 'sandbox',
        webhookId: paypalSettings.webhookId
      };

      const environment = this.config.environment === 'production' 
        ? Environment.Production 
        : Environment.Sandbox;

      this.client = new Client({
        clientCredentialsAuthCredentials: {
          oAuthClientId: this.config.clientId,
          oAuthClientSecret: this.config.clientSecret,
        },
        environment,
        logging: {
          logLevel: LogLevel.Info,
          logRequest: { logBody: true },
          logResponse: { logHeaders: true },
        },
      });

      this.initialized = true;
      console.log(`PayPal service initialized in ${this.config.environment} mode`);
    } catch (error) {
      console.error('Failed to initialize PayPal service from database:', error);
      this.client = null;
      this.config = null;
      this.initialized = false;
    }
  }

  /**
   * Reinitialize PayPal service when settings are updated
   */
  async reinitialize() {
    await this.initializeFromDatabase();
  }

  /**
   * Check if PayPal is properly configured
   */
  isConfigured(): boolean {
    return this.initialized && this.client !== null && this.config !== null;
  }

  /**
   * Test PayPal connection
   */
  async testConnection(): Promise<{ success: boolean, message: string }> {
    try {
      if (!this.isConfigured()) {
        return { success: false, message: 'PayPal not configured' };
      }

      // Try to get access token to test credentials
      const response = await this.client!.authenticationController.oAuthAuthorization({
        grantType: 'client_credentials'
      });

      if (response.statusCode === 200) {
        return { success: true, message: 'PayPal connection successful' };
      } else {
        return { success: false, message: 'PayPal connection failed' };
      }
    } catch (error) {
      return { success: false, message: `PayPal test failed: ${error}` };
    }
  }

  /**
   * Create a PayPal payment for one-time purchases or subscriptions
   */
  async createPayment(request: CreatePaymentRequest): Promise<PaymentResult> {
    try {
      if (!this.isConfigured()) {
        throw new Error('PayPal service not configured. Please set up PayPal credentials in admin settings.');
      }

      const createOrderRequest = {
        body: {
          intent: 'CAPTURE',
          purchaseUnits: [
            {
              amount: {
                currencyCode: request.currency,
                value: (request.amount / 100).toFixed(2), // Convert cents to dollars
              },
              description: request.description,
            },
          ],
          applicationContext: {
            returnUrl: `${process.env.BASE_URL}/api/paypal/success`,
            cancelUrl: `${process.env.BASE_URL}/api/paypal/cancel`,
            brandName: 'ChatLure',
            landingPage: 'LOGIN',
            userAction: 'PAY_NOW',
            shippingPreference: 'NO_SHIPPING',
          },
          // Enable guest checkout if requested
          ...(request.guestCheckout && {
            paymentSource: {
              paypal: {
                experienceContext: {
                  userAction: 'PAY_NOW',
                  paymentMethodPreference: 'NO_PREFERENCE',
                },
              },
            },
          }),
        },
      };

      const { body, ...httpResponse } = await this.client!.ordersController.ordersCreate(createOrderRequest);
      
      if (httpResponse.statusCode !== 201) {
        throw new Error(`PayPal API error: ${httpResponse.statusCode}`);
      }

      const approvalUrl = body.links?.find(link => link.rel === 'approve')?.href;

      return {
        id: body.id || '',
        status: body.status || 'CREATED',
        approvalUrl,
        amount: request.amount,
        currency: request.currency,
      };
    } catch (error) {
      console.error('PayPal create payment error:', error);
      throw new Error('Failed to create PayPal payment');
    }
  }

  /**
   * Capture a PayPal payment after approval
   */
  async capturePayment(orderId: string): Promise<PaymentResult> {
    try {
      const captureOrderRequest = {
        id: orderId,
        body: {},
      };

      const { body, ...httpResponse } = await this.client.ordersController.ordersCapture(captureOrderRequest);
      
      if (httpResponse.statusCode !== 201) {
        throw new Error(`PayPal capture error: ${httpResponse.statusCode}`);
      }

      const captureDetails = body.purchaseUnits?.[0]?.payments?.captures?.[0];
      
      return {
        id: body.id || '',
        status: body.status || 'COMPLETED',
        amount: parseFloat(captureDetails?.amount?.value || '0') * 100, // Convert to cents
        currency: captureDetails?.amount?.currencyCode || 'USD',
      };
    } catch (error) {
      console.error('PayPal capture payment error:', error);
      throw new Error('Failed to capture PayPal payment');
    }
  }

  /**
   * Create a PayPal subscription plan
   */
  async createSubscriptionPlan(planData: {
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'monthly' | 'yearly';
  }) {
    try {
      const createPlanRequest = {
        body: {
          productId: await this.getOrCreateProduct(),
          name: planData.name,
          description: planData.description,
          status: 'ACTIVE',
          billingCycles: [
            {
              frequencyInterval: {
                intervalUnit: planData.interval === 'monthly' ? 'MONTH' : 'YEAR',
                intervalCount: 1,
              },
              tenureType: 'REGULAR',
              sequence: 1,
              totalCycles: 0, // Infinite
              pricingScheme: {
                fixedPrice: {
                  value: (planData.price / 100).toFixed(2),
                  currencyCode: planData.currency,
                },
              },
            },
          ],
          paymentPreferences: {
            autoBillOutstanding: true,
            setupFeeFailureAction: 'CONTINUE',
            paymentFailureThreshold: 3,
          },
        },
      };

      const { body } = await this.client.subscriptionsController.plansCreate(createPlanRequest);
      return body;
    } catch (error) {
      console.error('PayPal create subscription plan error:', error);
      throw new Error('Failed to create PayPal subscription plan');
    }
  }

  /**
   * Create a PayPal subscription
   */
  async createSubscription(planId: string, userId: number) {
    try {
      const createSubscriptionRequest = {
        body: {
          planId,
          subscriber: {
            name: {
              givenName: 'ChatLure',
              surname: 'User',
            },
          },
          applicationContext: {
            brandName: 'ChatLure',
            locale: 'en-US',
            shippingPreference: 'NO_SHIPPING',
            userAction: 'SUBSCRIBE_NOW',
            paymentMethod: {
              payerSelected: 'PAYPAL',
              payeePreferred: 'IMMEDIATE_PAYMENT_REQUIRED',
            },
            returnUrl: `${process.env.BASE_URL}/api/paypal/subscription/success`,
            cancelUrl: `${process.env.BASE_URL}/api/paypal/subscription/cancel`,
          },
        },
      };

      const { body } = await this.client.subscriptionsController.subscriptionsCreate(createSubscriptionRequest);
      
      const approvalUrl = body.links?.find(link => link.rel === 'approve')?.href;
      
      return {
        id: body.id,
        status: body.status,
        approvalUrl,
      };
    } catch (error) {
      console.error('PayPal create subscription error:', error);
      throw new Error('Failed to create PayPal subscription');
    }
  }

  /**
   * Cancel a PayPal subscription
   */
  async cancelSubscription(subscriptionId: string, reason: string = 'User requested cancellation') {
    try {
      const cancelSubscriptionRequest = {
        subscriptionId,
        body: {
          reason,
        },
      };

      await this.client.subscriptionsController.subscriptionsCancel(cancelSubscriptionRequest);
      return { success: true };
    } catch (error) {
      console.error('PayPal cancel subscription error:', error);
      throw new Error('Failed to cancel PayPal subscription');
    }
  }

  /**
   * Process PayPal webhook events
   */
  async processWebhook(webhookData: any) {
    try {
      const eventType = webhookData.event_type;
      const resource = webhookData.resource;

      switch (eventType) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          // Handle successful payment
          return {
            type: 'payment_completed',
            orderId: resource.id,
            amount: parseFloat(resource.amount.value) * 100,
            currency: resource.amount.currency_code,
            payerId: resource.payer?.payer_id,
          };

        case 'BILLING.SUBSCRIPTION.ACTIVATED':
          // Handle subscription activation
          return {
            type: 'subscription_activated',
            subscriptionId: resource.id,
            planId: resource.plan_id,
            subscriberId: resource.subscriber?.payer_id,
          };

        case 'BILLING.SUBSCRIPTION.CANCELLED':
          // Handle subscription cancellation
          return {
            type: 'subscription_cancelled',
            subscriptionId: resource.id,
            reason: resource.reason,
          };

        case 'PAYMENT.CAPTURE.DENIED':
          // Handle failed payment
          return {
            type: 'payment_failed',
            orderId: resource.id,
            reason: resource.reason_code,
          };

        default:
          console.log(`Unhandled webhook event: ${eventType}`);
          return { type: 'unhandled', eventType };
      }
    } catch (error) {
      console.error('PayPal webhook processing error:', error);
      throw new Error('Failed to process PayPal webhook');
    }
  }

  /**
   * Refund a PayPal payment
   */
  async refundPayment(captureId: string, amount?: number, currency: string = 'USD') {
    try {
      const refundRequest = {
        captureId,
        body: {
          ...(amount && {
            amount: {
              value: (amount / 100).toFixed(2),
              currencyCode: currency,
            },
          }),
          noteToPayer: 'Refund processed by ChatLure',
        },
      };

      const { body } = await this.client.paymentsController.capturesRefund(refundRequest);
      
      return {
        id: body.id,
        status: body.status,
        amount: parseFloat(body.amount?.value || '0') * 100,
        currency: body.amount?.currencyCode || currency,
      };
    } catch (error) {
      console.error('PayPal refund error:', error);
      throw new Error('Failed to process PayPal refund');
    }
  }

  /**
   * Get or create a PayPal product for subscriptions
   */
  private async getOrCreateProduct(): Promise<string> {
    try {
      // First try to get existing product
      const existingProducts = await this.client.catalogProductsController.productsGet({
        pageSize: 100,
      });

      const chatLureProduct = existingProducts.body.products?.find(
        product => product.name === 'ChatLure Subscription'
      );

      if (chatLureProduct) {
        return chatLureProduct.id!;
      }

      // Create new product if none exists
      const createProductRequest = {
        body: {
          name: 'ChatLure Subscription',
          description: 'Premium access to ChatLure stories and features',
          type: 'SERVICE',
          category: 'SOFTWARE',
          imageUrl: `${process.env.BASE_URL}/images/logo.png`,
          homeUrl: process.env.BASE_URL,
        },
      };

      const { body } = await this.client.catalogProductsController.productsCreate(createProductRequest);
      return body.id!;
    } catch (error) {
      console.error('PayPal product error:', error);
      throw new Error('Failed to create PayPal product');
    }
  }

  /**
   * Validate PayPal webhook signature
   */
  async validateWebhookSignature(headers: any, body: string): Promise<boolean> {
    try {
      // PayPal webhook signature validation would go here
      // This is a simplified version - in production, you'd want to verify the signature
      return true;
    } catch (error) {
      console.error('PayPal webhook validation error:', error);
      return false;
    }
  }
}

export const paypalService = new PayPalService(); 