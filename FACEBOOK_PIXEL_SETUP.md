# Pixel Tracking Setup for Sonexa

This guide will help you set up Facebook Pixel and TikTok Pixel to track ad conversions in your Sonexa app.

## 1. Create a Facebook Pixel

1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to **Events Manager** > **Data Sources** > **Pixels**
3. Click **Create a Pixel**
4. Name your pixel (e.g., "Sonexa Pixel")
5. Copy your Pixel ID

## 2. Optional: Get Facebook Access Token (For Advanced Server-Side Tracking)

_Note: This step is optional. The basic setup works with just the Pixel ID._

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add the **Facebook Login** product
4. Go to **Tools** > **Graph API Explorer**
5. Select your app and generate a token with the following permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
6. Copy the access token

## 3. Create a TikTok Pixel

1. Go to [TikTok Ads Manager](https://ads.tiktok.com/)
2. Navigate to **Assets** > **Events** > **Web Events**
3. Click **Create Pixel**
4. Name your pixel (e.g., "Sonexa TikTok Pixel")
5. Copy your Pixel ID

## 4. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Facebook Pixel Configuration (Required)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_facebook_pixel_id_here

# TikTok Pixel Configuration (Optional)
NEXT_PUBLIC_TIKTOK_PIXEL_ID=your_tiktok_pixel_id_here

# Optional: For advanced server-side tracking
# FACEBOOK_PIXEL_ID=your_facebook_pixel_id_here
# FACEBOOK_ACCESS_TOKEN=your_facebook_access_token_here
```

## 5. Events Being Tracked

The following events are automatically tracked for both Facebook and TikTok:

### Client-Side Events

- **PageView**: Tracks when users visit pages
- **ViewContent**: Tracks when users view the pricing page
- **InitiateCheckout**: Tracks when users start the checkout process
- **Purchase**: Tracks successful purchases (client-side backup)

### Server-Side Events

_Note: Server-side events require the access token setup above._

- **Purchase**: Tracks successful purchases via Stripe webhook
- **Subscribe**: Tracks subscription events

## 6. Testing Your Setup

1. Install the [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedmjlckhdkpoggiemg) Chrome extension
2. Install the [TikTok Pixel Helper](https://chrome.google.com/webstore/detail/tiktok-pixel-helper/ebjbfgdfnjofbpdgjpkgkkkhkjoaopmh) Chrome extension
3. Visit your pricing page and click on a plan
4. Check both Pixel Helpers to see if events are firing
5. Complete a test purchase to verify server-side events

## 7. Setting Up Conversion Tracking

### Facebook Ads Manager

1. In Facebook Ads Manager, go to **Events Manager**
2. Select your pixel
3. Go to **Aggregated Event Measurement**
4. Configure your conversion events:
   - **Purchase** (highest priority)
   - **InitiateCheckout** (medium priority)
   - **ViewContent** (low priority)

### TikTok Ads Manager

1. In TikTok Ads Manager, go to **Assets** > **Events**
2. Select your pixel
3. Go to **Event Configuration**
4. Configure your conversion events:
   - **Purchase** (highest priority)
   - **InitiateCheckout** (medium priority)
   - **ViewContent** (low priority)

## 8. Advanced Configuration

### Custom Events

You can add custom events by importing the tracking functions:

```typescript
import { trackEvent } from "@/components/PixelTracker";

// Track a custom event (works for both Facebook and TikTok)
trackEvent("CustomEvent", {
  custom_parameter: "value",
  value: 10.0,
  currency: "USD",
});
```

### Enhanced Conversions

For better conversion tracking, ensure you're passing user data:

```typescript
import { trackPurchase } from "@/components/PixelTracker";

trackPurchase(19.99, "USD", ["standard"]); // Works for both Facebook and TikTok
```

## 8. Troubleshooting

### Events Not Firing

- Check that `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` is set correctly
- Verify the pixel is active in Facebook Business Manager
- Check browser console for any JavaScript errors

### Server-Side Events Not Working

- Ensure `FACEBOOK_PIXEL_ID` and `FACEBOOK_ACCESS_TOKEN` are set
- Check server logs for any API errors
- Verify the access token has the correct permissions

### Conversion Tracking Issues

- Wait 24-48 hours for data to appear in Facebook Ads Manager
- Ensure your pixel is properly configured in Aggregated Event Measurement
- Check that your ad account is connected to the correct pixel

## 9. Privacy Considerations

- Ensure your privacy policy covers Facebook Pixel usage
- Consider implementing cookie consent if serving EU users
- Review Facebook's data usage requirements
- Implement proper data retention policies

## 10. Performance Monitoring

Monitor these metrics in Facebook Ads Manager:

- Conversion rate by ad set
- Cost per conversion
- Return on ad spend (ROAS)
- Attribution data

For questions or issues, refer to the [Facebook Pixel documentation](https://developers.facebook.com/docs/facebook-pixel/).
