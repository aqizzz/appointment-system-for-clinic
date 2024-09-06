// getAppointments from the database filtering by customerId. Example, will get all appointments for customer with customerId, 1.
export async function getAppointments(customerId) {
    let url = '/getAppointment?customerId=' + customerId;
    const response = await fetch(url, {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
    }
    return response.json();
}

/* ************************************************************************************************************************** */
/* getAppointment for a specific day to be used when creating an appointment depending on the date and serviceName.
This gives a list of all appointments for one day for a specific service. Each of these appointments you can get the time
using apptTime. */

export async function getAppointmentTimes(apptDate, serviceName) {
    let url = '/getAppointmentTime?apptDate=' + apptDate + '&&serviceName=' + serviceName;
    const response = await fetch(url, {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
    }
    const data = await response.json();
    let timeList = [];
    for (let appt of data) {
        timeList.push(appt.apptTime);
    }
    return timeList;
}


/* ************************************************************************************************************************** */

export async function createAppointment(createdApptData) {
    // creates a new appointment object and saves it into the database.
    try {
        const response = await fetch('/insertAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createdApptData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

/* ************************************************************************************************************************** */
/* delete an appointment given the appointmentId */

export async function deleteAppointment(appointmentId) {
    let url = '/deleteAppointment?appointmentId=' + appointmentId;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

/* ************************************************************************************************************************** */

export async function updateAppointment(appointmentId, updatedData) {
    let url = '/updateAppointment/' + appointmentId;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    });
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
    } else {
        console.log(response.json());
        console.log('Appointment updated successfully');
    }
}

export async function feedbackCompleted(appointmentId) {
    let url = '/feedbackCompleted/' + appointmentId;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
    } else {
        console.log('Feedback Registered');
    }
}


  