# Admin Dashboard Setup Guide (Google Sheets)

This is the "Magic" part. We will turn a Google Sheet into your Admin Panel.

## 1. Create the Sheet
1. Open [Google Sheets](https://sheets.new).
2. Name it "ProTracking Admin".
3. Rename the first tab (sheet) to **`Orders`** (Case sensitive!).

## 2. Add the Code
1. In the Google Sheet, go to **Extensions** > **Apps Script**.
2. **Delete** any code there.
3. **Copy & Paste** the code from the file `apps_script_automation.js` (located in your project folder `d:\xampp\htdocs\Tracking`).
4. **Save** (Floppy disk icon).

## 3. Run Setup
1. In the Apps Script toolbar, make sure `initialSetup` is selected in the dropdown.
2. Click **Run**.
   - It will ask for permission (Review Permissions -> Choose Account -> Advanced -> Go to ... (unsafe) -> Allow).
   - This script creates the Header Columns for you (OrderID, Status, etc.).

## 4. Test the Magic
1. Go back to the Sheet. You should see columns like `OrderID`, `CustomerName`, etc.
2. Enter a new row:
   - **OrderID**: `ORD-555`
   - **Status**: `In Transit`
   - **Progress**: `50`
   - **Latitude**: `13.75`
   - **Longitude**: `100.50`
3. Wait 1-2 seconds (the script runs automatically on edit).
4. Go to your **Tracking App** (localhost) and search `ORD-555`.
5. **Magic!** The data you just typed is now live on the app.
