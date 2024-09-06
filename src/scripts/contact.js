'use strict';

       // Function to validate form on change
        function validateFormOnChange() {
            var firstName = document.getElementById('firstName').value.trim();
            var lastName = document.getElementById('lastName').value.trim();
            var isValid = true;
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(function(errorMsg) {
                errorMsg.style.display = 'none';
            });

            var nameRegex = /^[a-zA-Z\s]+$/;

            if (firstName === '' || !nameRegex.test(firstName)) {
                document.getElementById('firstName').focus();
                document.getElementById('firstNameError').style.display = 'inline-block';
                isValid = false;
            }

            if (lastName === '' || !nameRegex.test(lastName)) {
                document.getElementById('lastNameError').style.display = 'inline-block';
                isValid = false;
            }
            return isValid;
        }

        // Attach onchange event listeners to input fields
        document.getElementById('firstName').addEventListener('input', validateFormOnChange);
        document.getElementById('lastName').addEventListener('input', validateFormOnChange);





// create eventListener to submit the contactInfo       
const submitButton = document.getElementById('submit').addEventListener('click',async function(event){
    event.preventDefault();
    
    const formData = document.getElementById('contactForm') ;
   
    const newContactInfo = {
        firstname:formData.elements.namedItem("firstName").value,
        lastname: formData.elements.namedItem('lastName').value,
        email: formData.elements.namedItem('emailadd').value,
        subject: formData.elements.namedItem('Subject').value,
        message: formData.elements.namedItem('message').value
    };
    try{
        const response = await fetch('/insertContact', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(newContactInfo)
            
        });

        const data = await response.json();
        alert(data.message);
        document.getElementById('contactForm').reset();
    } catch(error){
        console.error('Submission error: ', error);
        alert('An error occurred.Please try again later.');
    }  
});

