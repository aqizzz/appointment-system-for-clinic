

/* ************************************************************************************************************************** */
/* get data from the HTML page when creating an payment */
export async function createPayment(data){
  return fetch('/insertPayment', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
      }
      return response.json();
  })
  .then(data => {
    console.log("This payment is inserted into database successfully."); // return paymentId
    return data;
  })
  .catch(error => {
      console.error('Error saving data:', error);
  });
}

//createPayment(createdPaymentData);// returns: paymentId

/* ************************************************************************************************************************** */
/* get data from the HTML page when creating an payment */
export async function refundPayment(paymentId){
  let url = '/updatePayment/' + paymentId;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok: ' + response.status);
  } else {
    console.log('Payment updated successfully');
  }
}




