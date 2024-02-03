const fs = require("fs");
const csv = require("fast-csv");

const {
  processCustomerData,
  processContactsData,
  processAddressData,
  getAllCustomers,
  deleteCustomer,
  updateCustomer,
} = require("../services/customerService");

async function uploadCustomerData(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the uploaded file and parse CSV data
    const customers = [];
    console.log(req.file.path);
    console.log(req.file);

    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: false })) // Parse CSV with headers enabled
      .on("data", (row) => {
        // Process each row and add it to the customers array
        customers.push(row);
      })
      .on("end", async () => {
        // Process the customer data
        await processCustomerData(customers, req.file.filename);
        // Send response after processing
        res
          .status(200)
          .json({ message: "Customer data uploaded successfully" });
      });
  } catch (error) {
    console.error("Error uploading customer data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function uploadContactsData(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the uploaded file and parse CSV data
    const contacts = [];
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: false })) // Parse CSV with headers enabled
      .on("data", (row) => {
        // Process each row and add it to the customers array
        contacts.push(row);
      })
      .on("end", async () => {
        // Process the customer data
        await processContactsData(contacts, req.file.filename);
        // Send response after processing
        res
          .status(200)
          .json({ message: "Contacts data uploaded successfully" });
      });
  } catch (error) {
    console.error("Error uploading contacts data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function uploadAddressData(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the uploaded file and parse CSV data
    const address = [];
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: false })) // Parse CSV with headers enabled
      .on("data", (row) => {
        // Process each row and add it to the customers array
        address.push(row);
      })
      .on("end", async () => {
        // Process the customer data
        await processAddressData(address, req.file.filename);
        // Send response after processing
        res.status(200).json({ message: "Address data uploaded successfully" });
      });
  } catch (error) {
    console.error("Error uploading address data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getCustomers(req, res) {
  try {
    const customers = await getAllCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteCustomerById = async (req, res) => {
  const { intnr } = req.params;

  try {
    await deleteCustomer(intnr);
    res.status(200).json({ message: "Customer deleted successfully." });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

async function updateCustomerById(req, res, next) {
  try {
    console.log(req.body);
    const updateData = req.body; // Data to be updated

    // Call the service function to update the customer
    const updatedCustomer = await updateCustomer(updateData);

    if (updatedCustomer) {
      res.status(200).json("message:Updated Customer Successfully");
    }
    // Send back the updated customer data
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadCustomerData,
  uploadContactsData,
  uploadAddressData,
  getCustomers,
  deleteCustomerById,
  updateCustomerById,
};
