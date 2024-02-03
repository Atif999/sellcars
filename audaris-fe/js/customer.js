document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const customerTable = document.getElementById("customerTable");
  let customers = [];
  let currentPage = 1;
  const pageSize = 10;

  fetchData()
    .then((data) => {
      customers = data;
      renderTable(customers);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");

  // Event listener for previous page button
  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable(customers);
    }
  });

  nextPageButton.addEventListener("click", () => {
    const totalPages = Math.ceil(customers.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable(customers);
    }
  });

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();
    const filteredCustomers = customers.filter(
      (customer) =>
        customer.intnr.toLowerCase().includes(searchTerm) ||
        customer.first_name.toLowerCase().includes(searchTerm) ||
        customer.last_name.toLowerCase().includes(searchTerm) ||
        customer.company_name.toLowerCase().includes(searchTerm) ||
        customer.country.toLowerCase().includes(searchTerm) ||
        customer.zip_city.toLowerCase().includes(searchTerm) ||
        customer.street.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderTable(filteredCustomers);
  });

  // Sort functionality
  const columnSelect = document.getElementById("columnSelect");
  const sortOrderSelect = document.getElementById("sortOrderSelect");

  columnSelect.addEventListener("change", function () {
    const columnIndex = this.value;
    const sortOrder = sortOrderSelect.value;
    sortTable(columnIndex, sortOrder);
  });

  sortOrderSelect.addEventListener("change", function () {
    const columnIndex = columnSelect.value;
    const sortOrder = this.value;
    sortTable(columnIndex, sortOrder);
  });

  function renderTable(data) {
    customerTable.innerHTML = ""; // Clear the table first
    const tableHeader = document.createElement("thead");
    tableHeader.innerHTML = `
            <tr>
                <th>Internal number</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Company name</th>
                <th>Country</th>
                <th>Zip/City</th>
                <th>Address</th>
                <th>Actions</th>
            </tr>
        `;
    customerTable.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");

    // data.forEach((customer) => {
    //   const row = document.createElement("tr");
    //   row.innerHTML = `
    //             <td>${customer.intnr}</td>
    //             <td>${customer.first_name}</td>
    //             <td>${customer.last_name}</td>
    //             <td>${customer.company_name || ""}</td>
    //             <td>${customer.country}</td>
    //             <td>${customer.zip_city}</td>
    //             <td>${customer.street}</td>
    //     <td>
    //             <button class="btn btn-sm btn-primary edit-btn" data-id="${
    //               customer.intnr
    //             }">
    //                 <i class="bi bi-pencil-square"></i> Edit
    //             </button>
    //             <button class="btn btn-sm btn-danger delete-btn" data-id="${
    //               customer.intnr
    //             }">
    //                 <i class="bi bi-trash"></i> Delete
    //             </button>
    //         </td>
    //         `;
    //   tableBody.appendChild(row);
    // });
    // customerTable.appendChild(tableBody);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    for (let i = startIndex; i < endIndex; i++) {
      const customer = data[i];
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${customer.intnr}</td>
                <td>${customer.first_name}</td>
                <td>${customer.last_name}</td>
                <td>${customer.company_name || ""}</td>
                <td>${customer.country}</td>
                <td>${customer.zip_city}</td>
                <td>${customer.street}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${
                      customer.intnr
                    }">
                        <i class="bi bi-pencil-square"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${
                      customer.intnr
                    }">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            `;
      tableBody.appendChild(row);
    }
    customerTable.appendChild(tableBody);

    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", handleEdit);
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", handleDelete);
    });

    const totalPages = Math.ceil(customers.length / pageSize);
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  }

  async function fetchData() {
    try {
      const response = await fetch(
        "http://localhost:3000/customer/allCustomers"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  function fetchDataAndRenderTable() {
    fetchData()
      .then((data) => {
        customers = data;
        renderTable(customers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function sortTable(columnIndex, sortOrder) {
    const sortOrderFactor = sortOrder === "asc" ? 1 : -1;
    customers.sort((a, b) => {
      const x = a[columnIndex];
      const y = b[columnIndex];
      return sortOrderFactor * x.localeCompare(y);
    });
    renderTable(customers);
  }

  function handleDelete(event) {
    const customerId = event.target.dataset.id;
    const confirmation = confirm(
      "Are you sure that you want to delete this customer?"
    );

    if (confirmation) {
      deleteCustomer(customerId)
        .then((response) => {
          console.log(response);
          alert("Customer deleted successfully.");
          fetchDataAndRenderTable();
        })
        .catch((error) => {
          console.log(error);
          console.error("Error deleting customer:", error);
          alert("Error deleting customer.");
        });
    }
  }

  async function deleteCustomer(customerId) {
    try {
      const response = await fetch(
        `http://localhost:3000/customer/${customerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      throw new Error("Error deleting customer:", error);
    }
  }

  ///edit

  function handleEdit(event) {
    const customerId = event.target.dataset.id;
    const row = event.target.closest("tr");
    openEditModal(customerId, row);
  }

  async function updateCustomer(updateData) {
    try {
      const response = await fetch(
        "http://localhost:3000/customer/updateCustomer",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting customer:", error);
    }
  }

  let editingCustomerId = null;

  function openEditModal(customerId, row) {
    editingCustomerId = customerId;

    const firstName = row.cells[1].textContent.trim();
    const lastName = row.cells[2].textContent.trim();
    const companyName = row.cells[3].textContent.trim();
    const country = row.cells[4].textContent.trim();
    const zipCity = row.cells[5].textContent.trim();
    const zipCityParts = zipCity.split("/");
    const zip = zipCityParts[0].trim();
    const city = zipCityParts[1].trim();
    const street = row.cells[6].textContent.trim();

    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editCompanyName").value = companyName;
    document.getElementById("editCountry").value = country;
    document.getElementById("editZip").value = zip;
    document.getElementById("editCity").value = city;
    document.getElementById("editStreet").value = street;

    const editModal = document.getElementById("editModal");

    if (editModal) {
      editModal.classList.add("show");
      editModal.style.display = "block";
    }
  }

  document.getElementById("submitEdit").addEventListener("click", function () {
    const firstName = document.getElementById("editFirstName").value;
    const lastName = document.getElementById("editLastName").value;
    const companyName = document.getElementById("editCompanyName").value;
    const country = document.getElementById("editCountry").value;
    const city = document.getElementById("editCity").value;
    const zip = document.getElementById("editZip").value;
    const street = document.getElementById("editStreet").value;

    const updateData = {
      editingCustomerId,
      firstName,
      lastName,
      companyName,
      country,
      city,
      zip,
      street,
    };

    console.log(updateData);
    updateCustomer(updateData)
      .then(() => {
        alert("Customer data updated successfully.");
        const editModal = document.getElementById("editModal");

        if (editModal) {
          editModal.classList.remove("show");
          editModal.style.display = "none";
        }
        fetchDataAndRenderTable(); // Reload the table after edit
      })
      .catch((error) => {
        console.error("Error updating customer data:", error);
        alert("Error updating customer data.");
      });
  });

  const editModal = document.getElementById("editModal");
  const closeButton = editModal.querySelector('[data-dismiss="modal"]');

  if (closeButton) {
    console.log("da");
    closeButton.addEventListener("click", function () {
      console.log("dawsd");

      if (editModal) {
        editModal.classList.remove("show");
        editModal.style.display = "none";
      }
    });
  }

  document
    .getElementById("uploadCustomers")
    .addEventListener("click", function () {
      document.getElementById("fileInput1").click();
    });

  document
    .getElementById("uploadContactPersons")
    .addEventListener("click", function () {
      document.getElementById("fileInput2").click();
    });

  document
    .getElementById("uploadAddresses")
    .addEventListener("click", function () {
      document.getElementById("fileInput3").click();
    });

  document.getElementById("fileInput1").addEventListener("change", function () {
    handleUpload("http://localhost:3000/customer/upload", "fileInput1");
  });

  document.getElementById("fileInput2").addEventListener("change", function () {
    handleUpload("http://localhost:3000/customer/upload-contact", "fileInput2");
  });

  document.getElementById("fileInput3").addEventListener("change", function () {
    handleUpload("http://localhost:3000/customer/upload-address", "fileInput3");
  });

  function handleUpload(apiEndpoint, input) {
    const fileInput = document.getElementById(input);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      displayError("Please select a file.");
      return;
    }
    const file = fileInput.files[0];

    if (!file) {
      displayError("Please select a file.");
      return;
    }

    // Check file extension
    if (!file.name.toLowerCase().endsWith(".csv")) {
      displayError("Please select a CSV file.");
      return;
    }

    // Check file size (in bytes)
    if (file.size > 500 * 1024) {
      displayError("File size must be less than 500KB.");
      return;
    }

    // File is valid, proceed with upload
    const formData = new FormData();
    formData.append("file", file);

    // Send the file data to the server using fetch or XMLHttpRequest
    fetch(apiEndpoint, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload file.");
        }
        // File uploaded successfully
        alert("File uploaded successfully.");
        fetchDataAndRenderTable();
      })
      .catch((error) => {
        console.error("Error uploading file:", error.message);
        alert("Error uploading file. Please try again.", error.message);
      });
  }

  function displayError(message) {
    const errorContainer = document.getElementById("errorMessage");
    errorContainer.textContent = message;
    const errorModal = new bootstrap.Modal(
      document.getElementById("errorModal")
    );
    errorModal.show();
  }
});

function getQueryParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

// Get the email from query parameters

async function getCustomerInfo() {
  const queryParams = getQueryParams();
  const email = queryParams.email;
  try {
    const response = await fetch(
      `http://localhost:3000/user/getUser?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const customerName = document.getElementById("customerName");
    const lastLogin = document.getElementById("lastLoginId");
    const details = await response.json();
    customerName.textContent = details.name;
    lastLogin.textContent = details.lastLogin;
    //return await response.json();
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting customer:", error);
  }
}
getCustomerInfo();
