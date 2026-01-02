// Google Apps Script: "The Magic Link" (Sheets -> Firebase)
// 1. Extensions > Apps Script
// 2. Paste this code
// 3. Save & Run 'initialSetup'

const CONFIG = {
    PROJECT_ID: "tracking-app-71665", // From your Firebase Console
    COLLECTION_NAME: "orders",
    SHEET_NAME: "Orders"
};

// --- MAIN TRIGGER ---
function onEdit(e) {
    const sheet = e.source.getActiveSheet();
    const range = e.range;

    // Only run if editing the 'Orders' sheet
    if (sheet.getName() !== CONFIG.SHEET_NAME) return;

    // Get the whole row data
    const row = range.getRow();
    if (row < 2) return; // Skip header

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Convert Array to Object
    const data = {};
    headers.forEach((header, index) => {
        data[header] = rowData[index];
    });

    // Validate OrderID
    if (!data['OrderID']) return;

    // Sync to Firestore
    syncToFirestore(data['OrderID'], data);
}

// --- FIRESTORE SYNC ---
function syncToFirestore(docId, data) {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${CONFIG.PROJECT_ID}/databases/(default)/documents/${CONFIG.COLLECTION_NAME}/${docId}`;

    // Transform Data to Firestore Format (Everything is a string/field for simplicity)
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        // Basic mapping: Map 'Latitude'/'Longitude' to numbers for the map
        if (key === 'Latitude' || key === 'Longitude' || key === 'Progress') {
            fields[key.toLowerCase()] = { doubleValue: Number(value) };
        } else if (key === 'Steps') {
            // Skip complex array for simple sync, or implement JSON parsing if needed
            continue;
        } else {
            fields[key.toLowerCase()] = { stringValue: String(value) };
        }
    }

    // Add Lat/Lng explicitly if using our Schema names
    if (data['Latitude'] && data['Longitude']) {
        fields['lat'] = { doubleValue: Number(data['Latitude']) };
        fields['lng'] = { doubleValue: Number(data['Longitude']) };
    }
    if (data['Status']) fields['status'] = { stringValue: data['Status'] };
    if (data['ETA']) fields['eta'] = { stringValue: String(data['ETA']) };
    if (data['Progress']) fields['progress'] = { integerValue: Number(data['Progress']) };
    // Map ProofPhoto explicitly
    if (data['ProofPhoto']) fields['proofPhoto'] = { stringValue: String(data['ProofPhoto']) };

    const payload = {
        fields: fields
    };

    const options = {
        method: 'patch',
        contentType: 'application/json',
        payload: JSON.stringify(payload)
    };

    try {
        UrlFetchApp.fetch(firestoreUrl, options);
        Logger.log(`Synced ${docId} to Firestore`);
    } catch (e) {
        Logger.log(`Error syncing: ${e.message}`);
    }
}

// --- SETUP HELPER ---
function initialSetup() {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(CONFIG.SHEET_NAME);
    }

    // Force write headers if A1 is empty
    if (sheet.getRange(1, 1).getValue() === "") {
        const headers = ["OrderID", "CustomerName", "Status", "ETA", "Progress", "Latitude", "Longitude", "Driver", "ProofPhoto"];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        Logger.log("Headers created!");
    } else {
        Logger.log("Headers already exist.");
    }
}

// --- APPSHEET INTEGRATION ---
// Map this function in AppSheet Automation
function appSheetSync(orderId, status, lat, lng, proofPhoto, eta) {
    // Setup data object with essential fields
    const data = {
        'OrderID': orderId,
        'Status': status,
        // Add default values if missing to prevent errors
        'Latitude': lat || 0,
        'Longitude': lng || 0,
        'ProofPhoto': proofPhoto || "",
        'ETA': eta || ""
    };

    // Call the main sync function
    syncToFirestore(orderId, data);
}

// --- DEBUG HELPER (Run this to Force Permission Dialog) ---
function testConnection() {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${CONFIG.PROJECT_ID}/databases/(default)/documents/${CONFIG.COLLECTION_NAME}/TEST-CONN`;
    const options = { method: 'get' };
    UrlFetchApp.fetch(firestoreUrl, options);
    Logger.log("Connection OK! Permissions are valid.");
}
