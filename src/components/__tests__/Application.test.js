import React from "react";
import axios from "axios";


import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, getAllByDisplayValue } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    // debug();
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    //console.log(prettyDOM(day));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });



  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the first appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4 Wait for confirmation message to show up 
    //console.log(prettyDOM(container));
    await waitForElement(() => getByText(appointment, "Are you sure you want to delete this appointment?"));

    // 5. Click "Confirm"
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that "Deleting" text shows up
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until Add button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));
    //console.log(prettyDOM(container));

    // 8. Check that DayListItem with the text "Monday" has 2 spots remaining
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    //console.log(prettyDOM(day));

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  });



  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4 Wait for appt form to show up 
    await waitForElement(() => getAllByDisplayValue(appointment, "Archie Cohen"));

    // 5. Make change
    fireEvent.change(getAllByTestId(appointment, "student-name-input")[0], {
      target: { value: "Lydia Miller-Jones" }
    });

    // 6. Click "Save"
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that "Saving" text shows up
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until "Lydia Miller-Jones" is displayed
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    //console.log(prettyDOM(container));

    // 9. Check that DayListItem with the text "Monday" still has 1 spot remaining
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    //console.log(prettyDOM(day));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });



  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Add" button to book appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // 4. Load the appointment form.
    fireEvent.click(getByAltText(appointment, "Add"));

    // 5. Input student name.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 6. Select a interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 7. Click Save
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(container, "Error"));

    //debug();
    expect(getByText(container, "Error saving")).toBeInTheDocument();

  });



  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the first appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4 Wait for confirmation message to show up 
    await waitForElement(() => getByText(appointment, "Are you sure you want to delete this appointment?"));

    // 5. Click "Confirm"
    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 6. Wait until Error message displayed
    await waitForElement(() => getByText(appointment, "Error"));

    expect(getByText(appointment, "Error deleting")).toBeInTheDocument();

  });

});