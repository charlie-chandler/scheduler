import React from 'react'
import useVisualMode from 'hooks/useVisualMode';

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from './Status';
import Confirm from './Confirm';

import "./styles.scss";
import Form from './Form';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


function Appointment(props) {
//console.log('props', props)

  const { mode, transition, back } = useVisualMode(
    props.interview && props.interview.interviewer ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    if (interviewer === null) {
      return;
    }

    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE);

    props.bookInterview(props.id, interview)
      .then(() => {transition(SHOW)
      })
      .catch(() => {transition(ERROR_SAVE, true)
      });
  };

  function confirmDelete() {
      transition(CONFIRM)
    };

  function deleteAppointment() {
      transition(DELETE, true)
      props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY)
      })
      .catch(() => {transition(ERROR_DELETE, true)
      });
  };
  
  function editAppointment() {
    transition(EDIT);
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
          onDelete={confirmDelete}
          onEdit={editAppointment}
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

      {mode === EDIT && (
        <Form 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}

      {mode === SAVE && <Status message={"Saving"} />}
      {mode === DELETE && <Status message={"Deleting"} />}

      {mode === CONFIRM && <Confirm 
        message={"Are you sure you want to delete this appointment?"} 
        onCancel={() => back()}
        onConfirm={() => deleteAppointment(props.id)}
        />
      }


    </article>
  )
}

export default Appointment;