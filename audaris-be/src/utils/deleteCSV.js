const fs = require("fs");
const path = require("path");

function deleteCSVFile(filename) {
  const filePath = path.join(__dirname, "..", "..", "uploads/", filename);
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filename}`);
  } else {
    console.log(`File not found: ${filename}`);
  }
}

module.exports = { deleteCSVFile };
