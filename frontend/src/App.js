import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    address: '',
    phone: '',
    email: '',
    aadharcard: '',
    pancard: '',
    accounttype: '',
    branchid: '',
    document: null
  });
  const [message, setMessage] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAadhar = (aadhar) => {
    return /^\d{12}$/.test(aadhar);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let error = '';
    // Validate fields as they're being typed
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
      }
    }
    else if (name === 'aadharcard' && value) {
        if (!validateAadhar(value)) {
            error = 'Aadhar card must be exactly 12 digits';
        }
    }
    else if (name === 'pancard' && value) {
        if (!validatePAN(value)) {
            error = 'PAN must be in format: ABCDE1234F';
        }
    }

    setFormData(prevState => ({
        ...prevState,
        [name]: value,
        [name]: files ? files[0] : value
    }));

    // Update error state
    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error
    }));
  };
  const [errors, setErrors] = useState({
    email: '',
    aadharcard: '',
    pancard: ''
  });
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();


    // const formDataToSend = new FormData();
    // Validate all fields before submission
    const validationErrors = {
      email: !validateEmail(formData.email) ? 'Invalid email address' : '',
      aadharcard: !validateAadhar(formData.aadharcard) ? 'Invalid Aadhar number' : '',
      pancard: !validatePAN(formData.pancard) ? 'Invalid PAN format' : ''
    };

    setErrors(validationErrors);

    // Check if there are any errors
    if (Object.values(validationErrors).some(error => error !== '')) {
        setMessage('Please fix the validation errors before submitting.');
        return;
    }

    const formDataToSend = new FormData();
    
    // Convert aadhar to string and ensure PAN is uppercase
    const dataToSend = {
        ...formData,
        aadharcard: formData.aadharcard.toString(),
        pancard: formData.pancard.toUpperCase()
    };
    // Append all form data fields
    Object.keys(dataToSend).forEach(key => {
      formDataToSend.append(key, dataToSend[key]);
    });




    // Append all form data fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://127.0.0.1:5000/open_account', {
        method: 'POST',
        body: formDataToSend
      });
      const data = await response.json();
      if (response.ok) {
          // Check if both message and customer_id exist
          if (data.message && data.customer_id) {
            setMessage(`${data.message} Your Customer ID is: ${data.customer_id}`);
          } else {
              setMessage(data.message || 'Account created successfully!');
          }
          const accountTypeFormatted = formData.accounttype.charAt(0).toUpperCase() + formData.accounttype.slice(1);
          setMessage(`Your ${accountTypeFormatted} Account has been created successfully! Your Customer ID is: ${data.customer_id}`);
          // Clear form
          setFormData({
              firstname: '',
              lastname: '',
              dob: '',
              address: '',
              phone: '',
              email: '',
              aadharcard: '',
              pancard: '',
              document: null
            });
      } else {
            setMessage(data.error || 'An error occurred');
        }
        // Log the response for debugging
        console.log('Server response:', data);
    } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred while creating the account.');
      }
  };


  return (
    <div className='container'>
      <h1>Welcome to Anonymous Bank!</h1>
      <h2>Proceed with your account opening process</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group"></div>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">DOB</label>
            <input
              type="date"
              id="dob"
              name="dob"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={handleChange}
              required
            />
            
          </div>
          <div className="form-group">
            <label htmlFor="aadharcard">Aadhar Card Number</label>
            <input
              type="number"
              id="aadharcard"
              name="aadharcard"
              onChange={handleChange}
              className={errors.aadharcard ? 'error' : ''}
              maxLength="12"
              required
            />
            {errors.aadharcard && <span className="error-message">{errors.aadharcard}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="pancard">Pan Card Number</label>
            <input
              type="text"
              id="pancard"
              name="pancard"
              onChange={handleChange}
              className={errors.pancard ? 'error' : ''}
              maxLength="10"
              required
            />
            {errors.pancard && <span className="error-message">{errors.pancard}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="document">Upload Document</label>
            <input
              type="file"
              id="document"
              name="document"
              accept=".pdf,.jpg"
              onChange={handleChange}
              required
            />
          </div>




          {/* Account Type Selection */}
          <div className="dropdown-group">
              <label htmlFor="accounttype" className="required">Account Type</label>
              <div className="radio-group">
                  <div className={`radio-item ${formData.accounttype === 'savings' ? 'active' : ''}`}>
                      <input
                          type="radio"
                          id="savings"
                          name="accounttype"
                          value="savings"
                          checked={formData.accounttype === 'savings'}
                          onChange={handleChange}
                          required
                      />
                      <label htmlFor="savings">Savings</label>
                  </div>
                  <div className={`radio-item ${formData.accounttype === 'current' ? 'active' : ''}`}>
                      <input
                          type="radio"
                          id="current"
                          name="accounttype"
                          value="current"
                          checked={formData.accounttype === 'current'}
                          onChange={handleChange}
                          required
                      />
                      <label htmlFor="current">Current</label>
                  </div>
              </div>
          </div>

          {/* Branch Selection */}
          <div className="branch-container">
            <label htmlFor="branchid" className="required">Branch</label>
            <select
                id="branchid"
                name="branchid"
                value={formData.branchid}
                onChange={handleChange}
                required
                className="select-input"
            >
                <option value="">Select Branch</option>
                {[...Array(10)].map((_, index) => (
                    <option key={index + 101} value={`${index + 101}`}>
                        Branch {index + 101}
                    </option>
                ))}
            </select>
        </div>

            <button type="submit">Open Account</button>
        </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
