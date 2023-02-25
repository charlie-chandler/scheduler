
export function getAppointmentsForDay(state, day) {
  let selectAppts = [];
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
    selectAppts.push(state.appointments[appt]);
  }

  return selectAppts;

};

export default getAppointmentsForDay;