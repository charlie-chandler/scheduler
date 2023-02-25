import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "./DayList";
import Appointment from "./Appointment";
import getAppointmentsForDay from "helpers/selectors";

import "components/Application.scss";


export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  
  const setDay = day => setState({ ...state, day });
  //const setDays = days => setState({...state, days});
  
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  //Renders appt data
  // useEffect(() => {
  //   axios.get("/api/days")
  //   .then((response) => {
  //     console.log('response', response);
  //     setDays(response.data)
  //   })
  // }, []); 
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
    ])
    .then((all) => {
      console.log('all[0]', all[0])
      console.log('all[1]', all[1])
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data}))
    })
  }, []);

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
        {dailyAppointments.map((appointment) => {
          return <Appointment
            key={appointment.id}
            {...appointment} // we can spread if we want every key in an object to become a prop for this component
          />
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
