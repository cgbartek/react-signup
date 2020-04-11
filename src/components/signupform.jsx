import React, { Component } from 'react';

const fieldState = {
  value: "",
  valid: true,
  typeMismatch: false,
  errMsg: ""
};

const ErrorValidationLabel = ({ txtLbl }) => (
  <label htmlFor="" class="alert alert-danger" role="alert">
    {txtLbl}
  </label>
);

class SignupForm extends Component {
  // Set up state
  state = {
    email: {
      ...fieldState,
      fieldName: "Email",
      required: true,
      requiredTxt: "Email is required",
      formatErrorTxt: "Incorrect email format."
    },
    firstname: {
      ...fieldState,
      fieldName: "First Name",
      required: true,
      requiredTxt: "First Name required."
    },
    lastname: {
      ...fieldState,
      fieldName: "Last Name",
      required: false,
      requiredTxt: "Last Name required."
    },
    npi: {
      ...fieldState,
      fieldName: "NPI Number",
      required: false,
      requiredTxt: "NPI required."
    },
    addr1: {
      ...fieldState,
      fieldName: "Address",
      required: false,
      requiredTxt: "Address required."
    },
    addr2: {
      ...fieldState,
      fieldName: "Address 2",
      required: false,
      requiredTxt: "Address 2 required."
    },
    city: {
      ...fieldState,
      fieldName: "City",
      required: false,
      requiredTxt: "City required."
    },
    state: {
      ...fieldState,
      fieldName: "State",
      required: false,
      requiredTxt: "State required."
    },
    zip: {
      ...fieldState,
      fieldName: "Zip Code",
      required: false,
      requiredTxt: "Zip code required."
    },
    phone: {
      ...fieldState,
      fieldName: "Phone Number",
      required: false,
      requiredTxt: "Phone number required."
    },
    allFieldsValid: false
  };

  reduceFormValues = formElements => {
    // Convert inputs to array
    const arrElements = Array.prototype.slice.call(formElements);

    // Extract specific properties in HTML5 Constraint Validation API
    const formValues = arrElements
      .filter(e => e.name.length > 0)
      .map(x => {
        const { typeMismatch } = x.validity;
        const { name, type, value } = x;

        return {
          name,
          type,
          typeMismatch,
          value,
          valid: x.checkValidity()
        };
      })
      .reduce((acc, currVal) => {
        const { value, valid, typeMismatch, type } = currVal;
        const { fieldName, requiredTxt, formatErrorTxt } = this.state[
          currVal.name
        ];

        // Map these properties back to state
        acc[currVal.name] = {
          value,
          valid,
          typeMismatch,
          fieldName,
          requiredTxt,
          formatErrorTxt
        };

        return acc;
      }, {});

    return formValues;
  };

  checkAllFieldsValid = formValues => {
    return !Object.keys(formValues)
      .map(x => formValues[x])
      .some(field => !field.valid);
  };

  // Submit handler
  handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const formValues = this.reduceFormValues(form.elements);
    const allFieldsValid = this.checkAllFieldsValid(formValues);

    this.setState({
      res: stringifyForm(data),
    });

    console.log(stringifyForm(data));

    // AJAX
    if(allFieldsValid) {
      fetch('/nonexistent_api', {
        method: 'POST',
        body: data,
      });
    }

    // Set state based on extracted values from HTML5 Constraint Validation API
    this.setState({ ...formValues, allFieldsValid });
  }

  render() {
    const {email, firstname, lastname, npi, addr1, city, state, zip, phone, allFieldsValid} = this.state;
    const successFormDisplay = allFieldsValid ? "block" : "none";
    const inputFormDisplay = !allFieldsValid ? "block" : "none";

    const renderEmailValidationErr = email.valid ? ("") : (
      <ErrorValidationLabel txtLbl={email.typeMismatch ? email.formatErrorTxt : email.requiredTxt} />
    );
    const renderLnameValidationErr = lastname.valid ? ("") : (
      <ErrorValidationLabel txtLbl={lastname.requiredTxt} />
    );
    const renderFnameValidationErr = firstname.valid ? ("") : (
      <ErrorValidationLabel txtLbl={firstname.requiredTxt} />
    );
    const renderNpiValidationErr = npi.valid ? ("") : (
      <ErrorValidationLabel txtLbl={npi.requiredTxt} />
    );
    const renderAddrValidationErr = addr1.valid ? ("") : (
      <ErrorValidationLabel txtLbl={addr1.requiredTxt} />
    );
    const renderCityValidationErr = city.valid ? ("") : (
      <ErrorValidationLabel txtLbl={city.requiredTxt} />
    );
    const renderStateValidationErr = state.valid ? ("") : (
      <ErrorValidationLabel txtLbl={state.requiredTxt} />
    );
    const renderZipValidationErr = zip.valid ? ("") : (
      <ErrorValidationLabel txtLbl={zip.requiredTxt} />
    );
    const renderPhoneValidationErr = phone.valid ? ("") : (
      <ErrorValidationLabel txtLbl={phone.requiredTxt} />
    );

    return (
      <>
      <div className="m-2" style={{ display: successFormDisplay }}>
        <h1 className="text-center">Success!</h1>
        <p className="text-center">
          Form submitted successfully.
        </p>
        {this.state.res && (
        	<div className="card">
            <h6>Data:</h6>
            <pre>{this.state.res}</pre>
        	</div>
        )}
      </div>
      <form className="card-body" onSubmit={this.handleSubmit} style={{ display: inputFormDisplay }} noValidate>
        <div className="form-group">
          <label htmlFor="field-first">First and Last Name</label>
          <div className="form-group form-inline">
          <input type="text" className="form-control" id="field-first" name="firstname" placeholder="First" required /> &nbsp; {renderFnameValidationErr}
          <input type="text" className="form-control" id="field-last" name="lastname" placeholder="Last" required /> &nbsp; {renderLnameValidationErr}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="field-npi">NPI Number</label>
          <input type="text" maxLength="10" className="form-control" id="field-npi" name="npi" placeholder="NPI" required /> &nbsp; {renderNpiValidationErr}
        </div>
        <div className="form-group">
          <label htmlFor="field-address">Address</label>
          <div className="form-group form-inline">
          <input type="text" className="form-control" id="field-address" name="addr1" placeholder="Line 1" required /> &nbsp; {renderAddrValidationErr}
          <input type="text" className="form-control" id="field-address2" name="addr2" placeholder="Line 2" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="field-city">City, State, Zip</label>
          <div className="form-group form-inline">
          <input type="text" className="form-control" id="field-city" name="city" placeholder="City" required /> &nbsp; {renderCityValidationErr}
          <select className="form-control" id="field-state" name="state" required>
            <option value="">State...</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select> &nbsp; {renderStateValidationErr}
          <input type="text" className="form-control" id="field-zip" name="zip" placeholder="Zip" required /> &nbsp; {renderZipValidationErr}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="field-phone">Phone Number</label>
          <input type="phone" className="form-control" id="field-phone" name="phone" placeholder="Phone" required /> &nbsp; {renderPhoneValidationErr}
        </div>
        <div className="form-group">
          <label htmlFor="field-email">Email Address</label>
          <input type="email" className="form-control" id="field-email" name="email" placeholder="example@email.com" required /> &nbsp; {renderEmailValidationErr}
        </div>
        <div className="form-group">
          <input type="submit" className="form-control btn btn-primary" id="field-submit" value="Submit" />
        </div>
      </form>
      </>
    );
  }
}

export default SignupForm;


function stringifyForm(fd) {
    const data = {};
      for (let k of fd.keys()) {
        data[k] = fd.get(k);
    }
    return JSON.stringify(data,null,2);
  }
