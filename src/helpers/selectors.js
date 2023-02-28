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
  
   let interviewData = {
        student: interview.student,
        interviewer: state.interviewers[interview.interviewer]
};

  return interviewData;
}


function getInterviewersForDay(state, day) {
  //console.log('state', state)

  let targetDay = state.days.find(item => day ===   item.name
  )

  //If days data is empty or day not found
  if (state.days.length < 1 || !targetDay) {
    return [];
  }

  //Pull interview data from day item
  let interviewersForDay = 
    targetDay.interviewers.map(interview => state.interviewers[interview]
    )
  //console.log('interviewersForDay', interviewersForDay)

  return interviewersForDay;
};


 export { getAppointmentsForDay, getInterview, getInterviewersForDay };