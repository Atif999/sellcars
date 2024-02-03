const { ObjectId } = require("mongoose").Types;
const { Customer } = require("../models/customer");
const { deleteCSVFile } = require("../utils/deleteCSV");
function validateCustomerData(customerData) {
  const [
    intnr,
    type,
    firstName,
    lastName,
    email,
    mobilePhone,
    birthDate,
    companyName,
    country,
    city,
    zip,
    fax,
    phone,
    street,
    addressEmail,
  ] = customerData;

  let errors = [];

  if (
    intnr.length > 10 ||
    type.length === 0 ||
    type.length > 50 ||
    firstName.length > 50 ||
    lastName.length > 50 ||
    email.length > 50 ||
    mobilePhone.length > 20 ||
    birthDate.length !== 10 ||
    companyName.length > 100 ||
    country.length > 50 ||
    city.length > 50 ||
    zip.length > 5 ||
    fax.length > 20 ||
    phone.length > 20 ||
    street.length > 100 ||
    addressEmail.length > 50
  ) {
    errors.push(`Invalid character length for customer data: ${intnr}`);
  }

  if (!["PRIVATE", "COMPANY", "DEALER"].includes(type)) {
    errors.push(`Invalid type for customer data: ${type}`);
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.match(emailRegex)) {
    errors.push(`Invalid email for customer data: ${email}`);
  }

  const phoneFaxRegex = /^0049\d{8,17}$/;
  if (
    !mobilePhone.match(phoneFaxRegex) ||
    !fax.match(phoneFaxRegex) ||
    !phone.match(phoneFaxRegex)
  ) {
    errors.push(`Invalid phone/fax/mobile for customer data`);
  }

  return errors;
}

function createCustomerObject(customerData) {
  // Extract customer data from customerData array
  const [
    intnr,
    type,
    firstName,
    lastName,
    email,
    mobilePhone,
    birthDate,
    companyName,
    country,
    city,
    zip,
    fax,
    phone,
    street,
    addressEmail,
  ] = customerData;

  // Create unique ObjectId for address
  const addressId = new ObjectId();

  // Create unique ObjectId for contact person
  const contactId = new ObjectId();
  let address = null;
  // Construct address object
  if (type === "COMPANY" || type === "DEALER") {
    address = {
      _id: addressId,
      company_name: companyName,
      country: country,
      city: city,
      zip: zip,
      fax: fax,
      phone: phone,
      street: street,
      email: addressEmail,
    };
  } else if (type === "PRIVATE") {
    address = {
      _id: addressId,
      country: country,
      city: city,
      zip: zip,
      fax: fax,
      phone: phone,
      street: street,
      email: addressEmail,
    };
  }
  // Construct contact person object
  const contactPerson = {
    _id: contactId,
    first_name: firstName,
    last_name: lastName,
    email: email,
    mobile_phone: mobilePhone,
    birth_date: birthDate,
    address: addressId, // Reference to address object
  };

  // Construct customer object
  const customer = new Customer({
    intnr: intnr,
    type: type,
    created_at: new Date(),
    updated_at: new Date(),
    addresses: [address], // Add address object to customer addresses array
    contact_persons: [contactPerson], // Add contact person object to customer contact_persons array
  });

  return customer;
}
async function processCustomerData(customers, filename) {
  try {
    // Validate all rows first
    for (const customerData of customers) {
      const validationErrors = validateCustomerData(customerData);
      if (validationErrors.length > 0) {
        throw new Error(
          `Validation errors for customer: ${validationErrors.join(", ")}`
        );
      }
    }

    for (const customerData of customers) {
      const intnr = customerData[0];
      const existingCustomer = await Customer.findOne({ intnr: intnr });
      if (existingCustomer) {
        console.log(`Customer with intnr ${intnr} already exists. Skipping.`);
        continue;
      }
      const customer = createCustomerObject(customerData);

      await customer.save();
    }

    console.log("Customer data processed successfully");
    deleteCSVFile(filename);
  } catch (error) {
    console.error("Error processing customer data:", error);
    throw error;
  }
}

async function processContactsData(contacts, filename) {
  try {
    // Validate all rows first
    // for (const contactsData of contacts) {
    //   const validationErrors = validateCustomerData(contactsData);
    //   if (validationErrors.length > 0) {
    //     throw new Error(
    //       `Validation errors for customer: ${validationErrors.join(", ")}`
    //     );
    //   }
    // }

    for (const contactsData of contacts) {
      const intnr = contactsData[0];
      const firstName = contactsData[1];
      const lastName = contactsData[2];
      const email = contactsData[3];
      const mobilePhone = contactsData[4];
      const birthDate = contactsData[5];

      const existingCustomer = await Customer.findOne({ intnr: intnr });
      if (!existingCustomer) {
        console.log(`Customer with intnr ${intnr} don't exists. Skipping.`);
        continue;
      }
      existingCustomer.contact_persons.push({
        _id: new ObjectId(),
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile_phone: mobilePhone,
        birth_date: birthDate,
      });

      await existingCustomer.save();
    }

    console.log("Contacts data processed successfully");
    deleteCSVFile(filename);
  } catch (error) {
    console.error("Error processing Contacts data:", error);
    throw error;
  }
}

async function processAddressData(address, filename) {
  try {
    // Validate all rows first
    // for (const contactsData of contacts) {
    //   const validationErrors = validateCustomerData(contactsData);
    //   if (validationErrors.length > 0) {
    //     throw new Error(
    //       `Validation errors for customer: ${validationErrors.join(", ")}`
    //     );
    //   }
    // }

    for (const addressData of address) {
      const intnr = addressData[0];
      const companyName = addressData[1];
      const country = addressData[2];
      const city = addressData[3];
      const zip = addressData[4];
      const fax = addressData[5];
      const phone = addressData[6];
      const street = addressData[7];
      const email = addressData[8];

      const existingCustomer = await Customer.findOne({ intnr: intnr });
      if (!existingCustomer) {
        console.log(`Customer with intnr ${intnr} don't exists. Skipping.`);
        continue;
      }
      if (existingCustomer.type === "PRIVATE") {
        existingCustomer.addresses.push({
          _id: new ObjectId(),
          country: country,
          city: city,
          zip: zip,
          fax: fax,
          email: email,
          phone: phone,
          street: street,
        });
      } else if (
        existingCustomer.type === "DEALER" ||
        existingCustomer === "COMPANY"
      ) {
        existingCustomer.addresses.push({
          _id: new ObjectId(),
          company_name: companyName,
          country: country,
          city: city,
          zip: zip,
          fax: fax,
          email: email,
          phone: phone,
          street: street,
        });
      }

      await existingCustomer.save();
    }

    console.log("Addresses data processed successfully");
    deleteCSVFile(filename);
  } catch (error) {
    console.error("Error processing Addresses data:", error);
    throw error;
  }
}

async function getAllCustomers() {
  try {
    const customers = await Customer.find({}).exec();
    return customers.map((customer) => ({
      intnr: customer.intnr,
      first_name:
        customer.contact_persons.length > 0
          ? customer.contact_persons[0].first_name
          : "",
      last_name:
        customer.contact_persons.length > 0
          ? customer.contact_persons[0].last_name
          : "",
      company_name:
        customer.addresses.length > 0 ? customer.addresses[0].company_name : "",
      country:
        customer.addresses.length > 0 ? customer.addresses[0].country : "",
      zip_city:
        customer.addresses.length > 0
          ? `${customer.addresses[0].zip}/${customer.addresses[0].city}`
          : "",
      street: customer.addresses.length > 0 ? customer.addresses[0].street : "",
    }));
  } catch (error) {
    throw new Error(error.message);
  }
}

const deleteCustomer = async (intnr) => {
  try {
    await Customer.deleteOne({ intnr });
  } catch (error) {
    throw new Error("Error deleting customer:", error);
  }
};

async function updateCustomer(updateData) {
  try {
    // Find the customer by intnr
    const customer = await Customer.findOne({
      intnr: updateData.editingCustomerId,
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Update customer contact_persons and addresses
    if (updateData) {
      customer.contact_persons[0].first_name = updateData.firstName;
      customer.contact_persons[0].last_name = updateData.lastName;
      customer.addresses[0].country = updateData.country;
      customer.addresses[0].zip = updateData.zip;
      customer.addresses[0].city = updateData.city;
      customer.addresses[0].street = updateData.street;
    }

    // Update company name only if customer type is not PRIVATE
    if (customer.type !== "PRIVATE" && updateData) {
      customer.addresses[0].company_name = updateData.companyName;
    }

    // Save the updated customer
    const updatedCustomer = await customer.save();
    return updatedCustomer;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  processCustomerData,
  processContactsData,
  processAddressData,
  getAllCustomers,
  deleteCustomer,
  updateCustomer,
};
