import Table from "./RequestsTable";
import { useState } from "react";
import AssignForm from "./AssignForm";
export default function Requests() {
  const [assignment, setAssignment] = useState(false);
  const toggleAssignment = () => setAssignment((ass) => !ass);
  return (
    <div>
      {!assignment && <Table toggleAssignment={toggleAssignment} />}
      {assignment && <AssignForm toggleAssignment={toggleAssignment} />}
    </div>
  );
}
