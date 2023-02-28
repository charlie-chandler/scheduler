import React from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

import "components/Application.scss";


export default function Application(props) {
  
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();


  // Example state:
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
    //console.log('interview', interview)      

    return <Appointment
    key={appointment.id}
    interview={interview}
    interviewers={dailyInterviewers}
    {...appointment} // we can spread if we want every key in an object to become a prop for this component
    bookInterview={bookInterview}
    cancelInterview={cancelInterview}
    />
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
        <Appointment key="last" time="5pm"/>
      </section>
    </main>
  );
}