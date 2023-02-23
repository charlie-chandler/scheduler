import React, { useState } from "react";
import classNames from "classnames";

import "./InterviewerListItem.scss";


export default function InterviewerListItem(props) {

  const [interviewer, setInterviewer] = useState(props.id);

  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });

  return (
    <li className={interviewerClass} onClick ={() => props.setInterviewer(props.id)}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.name}
    </li>
  );
}
