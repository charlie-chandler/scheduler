import React from "react";

import { render, cleanup, fireEvent } from "@testing-library/react";

import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {

  const interviewers = [
    {
      id: 1,
      student: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];



  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });



  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} student="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });



  it("validates that the student name is not blank", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();

    /* 2. Render the Form  without student prop */
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );
    
    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));

    expect(getByText(/Student name cannot be blank/i,)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });



  it("validates that the interviewer cannot be null", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();

    /* 2. Render the Form with interviewer not selected */
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} student="Lydia Miller-Jones" />
    );

    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));

    expect(getByText(/Please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });



  it("can successfully save after trying to submit an empty student name", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();

    /* 2. Render the Form without student name input*/
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} interviewer={1} />
    );

    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));

    /* 4. Display correct error message */
    expect(getByText(/Student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    /* 5. Input student name */
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    /* 6. Click the save button */
    fireEvent.click(getByText("Save"));

    /* 7. Error message does not display; appointment saves */
    expect(queryByText(/Student name cannot be blank/i)).toBeNull();

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });



  it("calls onCancel and resets the input field", () => {
    /* 1. Create the mock onSave function */
    const onCancel = jest.fn();

    /* 2. Render the Form */
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        student="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );

    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));

    /* 4. Input student name */
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    /* 5. Click the cancel button */
    fireEvent.click(getByText("Cancel"));

    /* 6. Reset Form fields */
    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

});