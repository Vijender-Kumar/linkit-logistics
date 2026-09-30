/**
 * Linkit Logistics: receives the "Request a Partnership" form and saves each
 * submission as a new row in this Google Sheet.
 *
 * Setup: see README.md ("Send form data to Google Sheets").
 */
var SHEET_NAME = 'Partnership Requests';
var HEADERS = ['Timestamp', 'Company Name', 'Email', 'Contact No', 'Fleet Size',
               'Vehicle Type', 'Fuel Type', 'Pick City', 'Drop City'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.getRange('D:D').setNumberFormat('@'); // keep phone numbers as text
    }

    var p = (e && e.parameter) || {};
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
      new Date(),
      p.companyName || '',
      p.email || '',
      p.contactNo || '',
      p.fleetSize || '',
      p.vehicleType || '',
      p.fuelType || '',
      p.pickCity || '',
      p.dropCity || ''
    ]]);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Open the Web App URL in a browser to check that it is live.
function doGet() {
  return ContentService.createTextOutput('Linkit Logistics form endpoint is live.');
}
