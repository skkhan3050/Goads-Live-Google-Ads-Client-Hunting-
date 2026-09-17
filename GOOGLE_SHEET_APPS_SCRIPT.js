/**
 * ==============================================================================
 * GoAdsLive - Google Apps Script Code
 * Connects Website Forms to Google Sheet:
 * "GoAds Live Client Hunting Lead Google Ads"
 * Sheet ID: 1z6xW1_OY3t47J0v0HaI8wVobEIwVgGjOCgQY2A9BntQ
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // 1. Automatically create Header Row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date & Time",
        "Full Name",
        "Phone / WhatsApp",
        "Email",
        "Service Requested",
        "Business Category / Budget",
        "Project Message / Website",
        "Lead Source"
      ]);

      // Style the header row
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground("#0f1117");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
    }

    // 2. Parse incoming JSON or Form data
    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    // 3. Extract Fields
    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var name = data.name || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var service = data.service || "";
    var category = data.category || data.budget || "";
    var message = data.message || data.website || "";
    var source = data.source || "Website Form";

    // 4. Append Lead Row
    sheet.appendRow([
      timestamp,
      name,
      phone,
      email,
      service,
      category,
      message,
      source
    ]);

    // 5. Return Success Response
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("GoAdsLive Google Sheets Webhook is active and running!")
    .setMimeType(ContentService.MimeType.TEXT);
}
