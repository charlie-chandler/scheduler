import React from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";

import "components/Application.scss";

import useApplicationData from "hooks/useApplicationData";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();


  // Example state object:
  // {
  //   day: "",
  //   days: [],
  //   appointments: {
  //     "1": {
  //       id: 1,
  //       time: "12pm",
  //       interview: null
  //     }
  //   },
  //   interviewers: {}
  // }


  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return <Appointment
      key={appointment.id}
      interview={interview}
      interviewers={dailyInterviewers}
      {...appointment}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
    />;
  });


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
};