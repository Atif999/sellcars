const mongoose = require("mongoose");

// Define schema for address
const addressSchema = new mongoose.Schema({
  company_name: String,
  country: { type: String, maxlength: 50 },
  city: { type: String, maxlength: 50 },
  zip: { type: String, maxlength: 5 },
  fax: { type: String, maxlength: 20, match: /^0049\d{8,17}$/ },
  phone: { type: String, maxlength: 20, match: /^0049\d{8,17}$/ },
  street: { type: String, maxlength: 100 },
  email: {
    type: String,
    maxlength: 50,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
});

// Define schema for contact person
const contactPersonSchema = new mongoose.Schema({
  first_name: { type: String, maxlength: 50 },
  last_name: { type: String, maxlength: 50 },
  email: {
    type: String,
    maxlength: 50,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  mobile_phone: { type: String, maxlength: 20, match: /^0049\d{8,17}$/ },
  birth_date: String,
  address: { type: mongoose.Schema.Types.ObjectId },
});

// Define schema for customer
const customerSchema = new mongoose.Schema({
  intnr: { type: String, maxlength: 10, unique: true, required: true },
  type: {
    type: String,
    enum: ["PRIVATE", "COMPANY", "DEALER"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  contact_persons: [contactPersonSchema], // Array of contact persons
  addresses: [addressSchema], // Array of addresses
});

// Create model for customer
const Customer = mongoose.model("Customer", customerSchema);
const Address = mongoose.model("Addresses", addressSchema);
const ContactPerson = mongoose.model("Contacts", contactPersonSchema);

module.exports = { Customer, Address, ContactPerson };
