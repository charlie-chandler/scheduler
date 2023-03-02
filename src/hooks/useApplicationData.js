import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = (() => {

const [state, setState] = useState({
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {},
});


function spotsRemaining (appointments) {
  //Find current day
  const currentDay = state.days.find(day => day.name === state.day)

  //Pull out the appt IDs for that specific day
  const apptIdArray = currentDay.appointments;
 // const apptList = Object.values(state.appointments);

  //Find null appts from the week's appt list
  //const allNullAppts = apptList.filter(appt => appt.interview === null)
  
  //Filter all null appts to show only those on the current day
  const todayNullAppts = apptIdArray.filter(appt => appointments[appt].interview === null)

  const spots = todayNullAppts.length;

  return spots;
}

function updateSpots (appointments) {
  const spots = spotsRemaining(appointments);
  const currentDay = state.days.find(day => day.name === state.day)

  //Add spots value to currentDay object
  const updatedCurrentDay = {...currentDay, spots};
  const updatedDays = [...state.days]; 
  
  //Update state 
  const currentDayIndex = updatedDays.findIndex((day) => day.name === state.day);
  updatedDays[currentDayIndex] = updatedCurrentDay;

   const updatedState = {...state, days: updatedDays}

  return updatedState
}

//Book Interview

function bookInterview(id, interview) {
  const appointment = {
    ...state.appointments[id],
    interview: { ...interview }
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };
  const updatedState = updateSpots(appointments);

  
  return axios.put(`/api/appointments/${id}`, {interview})
  .then((response) => {
    setState({
      ...state,
      ...updatedState,
      appointments
    });
    return response
  })
    .catch(err => {
      throw new Error(err);
    })
};


//Cancel Interview

function cancelInterview (id) {
  
  const appointment = {
    ...state.appointments[id],
    interview: null
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };
  
  const updatedState = updateSpots(appointments);

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          ...updatedState,
          appointments
        });
      })
      .catch(err => {
        throw new Error(err);
      });
  };

//Get data

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  },[]);


// Set day state

  const setDay = day => setState({ ...state, day });
  


  return { state, bookInterview, cancelInterview, setDay}

});


export default useApplicationData;