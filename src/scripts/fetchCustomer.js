
// Login function
export async function login(email, password) {
  try {
    // Send login request
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Check if response is not ok
    if (!response.ok) {
      // If login fails, check the status code and extract the error message
      if (response.status === 400) {
        // Extract error message from response body
        const errorMessage = data.error || 'Login failed';
        console.error('Login failed:', errorMessage);
        throw new Error(errorMessage);
      } else {
        // Handle other types of errors
        throw new Error('Login failed: ' + response.statusText);
      }
    }

    // If login successful, store JWT in local storage
    
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('firstname', data.firstname);
    console.log('Login successful');
    return response;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error; // re-throw the error so that calling code can handle it
  }
}

// Send request for customer information
export async function getCustomerInfo() {
  try {
    // Get JWT from local storage
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('Not logged in');
      return;
    }
    
    // Send request with JWT
    const response = await fetch('/getCustomerByJwt', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Set the Authorization request header with the acquired JWT
      }
    })
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to fetch customer data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Send request to create new customer
export async function insertCustomer(userData){
  fetch('/insertCustomer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to create customer');
    }
  })
  .then(data => {
    console.log(data); 
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Check whether the email exists in database
export async function checkCustomerEmail(email){
  try {
    const emailData = { email: email };
    const response = await fetch('/checkCustomerEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to check customer email');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateCustomer(customerId, updatedData) {
  let url = '/updateCustomer/' + customerId;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status);
    }

    console.log('Customer updated successfully');

    // Get new JWT token
    const responseData = await response.json();
    const { token } = responseData;

    // Save new JWT into local storage
    localStorage.setItem('jwt', token);
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}