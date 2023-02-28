import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = (() => {

const [state, setState] = useState({
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {},
});

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