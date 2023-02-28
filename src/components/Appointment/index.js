import React from 'react'
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from './Status';
import useVisualMode from 'hooks/useVisualMode';

import "./styles.scss";
import Form from './Form';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";


function Appointment(props) {
//console.log('props', props)
  const { mode, transition, back } = useVisualMode(
    props.interview && props.interview.interviewer ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    if (interviewer === null) {
      return;
    }
    //console.log('props', props)

    const interview = {
      student: name,
      interviewer
    };
    transition(SAVE);
    props.bookInterview(props.id, interview)
      .then(() => {transition(SHOW)})
  }

  function confirmDelete () {
      transition(CONFIRM)
    }

  return (
    <article className="appointment">
      <Header 
        time={props.time}
      />

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interviewers.find(interviewer => {
          return interviewer.id === props.interview.interviewer}
          )}
        />
      )}

      {mode === EMPTY && (
        <Empty 
          onAdd={() => transition(CREATE)}
        />
      )}

      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}

      {mode === SAVE && <Status message={"Saving"} />}
      {mode === DELETE && <Status message={"Deleting"} />}


    </article>
  )
}

export default Appointment;