import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = (() => {

const [state, setState] = useState({
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {},
});


function spotsRemaining (state) {
  //Find current day
  const currentDay = state.days.find(day => day.name === state.day)

  //Pull out the appt IDs for that specific day
  const apptIdArray = currentDay.appointments;
  const apptList = Object.values(state.appointments);

  //Find null appts from the week's appt list
  const allNullAppts = apptList.filter(appt => appt.interview === null)
  
  //Filter all null appts to show only those on the current day
  const todayNullAppts = allNullAppts.filter(appt => apptIdArray.includes(appt.id))

  const spots = todayNullAppts.length;

  return spots;
}

function updateSpots () {
  const spots = spotsRemaining(state);
  const currentDay = state.days.find(day => day.name === state.day)
  //console.log('currentDay and spots', currentDay, spots)

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
  
  return axios.put(`/api/appointments/${id}`, {interview})
  .then((response) => {
    updateSpots()
    setState({
      ...state,
      appointments
    });
    return response
  })
    .catch(err => {
      console.log('err', err)
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
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          appointments
        });
      })
      .catch(err => {
        console.log('err', err)
      });
  };

//Get data

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('api/interviewers')
    ])
    .then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, []);


// Set day state

  const setDay = day => setState({ ...state, day });
  


  return { state, bookInterview, cancelInterview, setDay}

});


export default useApplicationData;