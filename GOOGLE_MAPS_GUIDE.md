# How to Get a Google Maps API Key (Free Tier)

Google Maps Platform is a paid service, but they give you **$200 free credit every month**. Use this guide to set it up.

## 1. Is it free?
- **Yes**, for most small apps.
- $200 credit = **~28,000 map loads per month**.
- You must add a **Credit Card** to verify, but you won't be charged unless you exceed the free limit.

## 2. How to get the Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a **New Project** (e.g., "Tracking App").
3. Go to **"APIs & Services" > "Library"**.
4. Search for and **Enable** these APIs:
   - **Maps JavaScript API** (for the web map)
   - **Directions API** (for drawing routes)
   - **Distance Matrix API** (for calculating time)
5. Go to **"Credentials"** and click **"Create Credentials" > "API Key"**.
6. **Copy the Key** (starts with `AIza...`).

## 3. Alternative (100% Free, No Card)
If you don't want to put in a credit card, we can use **OpenStreetMap (Leaflet)** instead.
- **Pros**: Totally free, no limit.
- **Cons**: Not as pretty, no "Google Traffic" data, calculating routes is harder.

**Recommendation**: Use Google Maps for the "Premium" feel you wanted.
