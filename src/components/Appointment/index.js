import React from 'react'
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from 'hooks/useVisualMode';

import "./styles.scss";
import Form from './Form';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";


function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      <Header 
        time={props.time}
      />

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
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
          //onSave={() => transition(SAVING)}
          onCancel={() => back()}
        />
      )}

    </article>
  )
}

export default Appointment;