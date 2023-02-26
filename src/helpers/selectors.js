function getAppointmentsForDay(state, day) {
  let apptsForDay = [];
  let targetAppts = null;

  //If days data is empty
  if (state.days.length < 1) {
    return [];
  }

  //Match the days
  for (let element of state.days) {
    if (element.name === day) {
      targetAppts = element.appointments;
    }
  }

  //If day not not found
  if (!targetAppts) {
    return [];
  }

  //Push appt info into empty array
  for (let appt of targetAppts) {
    apptsForDay.push(state.appointments[appt]);
  }

  return apptsForDay;

};



function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  
  let interviewData = {};

  for (let interviewerId in state.interviewers){
    if (state.interviewers[interviewerId].id === interview.interviewer) {
      interviewData.student = interview.student;
      interviewData.interviewer = state.interviewers[interviewerId];
    }
  }
  return interviewData;
}



function getInterviewersForDay(state, day) {
  
  let interviewersForDay = [];
  let targetAppts = null;

  //If days data is empty
  if (state.days.length < 1) {
    return [];
  }

  //Match the days
  for (let element of state.days) {
    if (element.name === day) {
      targetAppts = element.appointments;
    }
  }

  //If day not not found
  if (!targetAppts) {
    return [];
  }

  //Push appt info into empty array
  for (let appt of targetAppts) {
    interviewersForDay.push(state.appointments[appt]);
  }

  return interviewersForDay;

};


export { getAppointmentsForDay, getInterview, getInterviewersForDay };