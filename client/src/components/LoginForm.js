// see SignupForm.js for comments
import { useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Form, Button, Alert, FormCheck } from "react-bootstrap";

// import { loginUser } from "../utils/API";
import Auth from "../utils/auth";
import { LOGIN_USER } from "../utils/mutations";

const LoginForm = (props) => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  // const [validated] = useState(false);
  // const [showAlert, setShowAlert] = useState(false);

  const [login, { error, data }] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
    console.log({ ...formState });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // }

    // try {
    //   const response = await loginUser(userFormData);

    //   if (!response.ok) {
    //     throw new Error('something went wrong!');
    //   }

    //   const { token, user } = await response.json();
    //   console.log(user);
    //   Auth.login(token);
    // } catch (err) {
    //   console.error(err);
    //   setShowAlert(true);
    // }

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    setFormState({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form
        // noValidate
        // validated={validated}
        onSubmit={handleFormSubmit}
      >
        {/* <Alert
          // dismissible
          // onClose={() => setShowAlert(false)}
          // show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert> */}
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={formState.email}
            // required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={formState.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formState.email && formState.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
