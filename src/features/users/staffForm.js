// Field names mirror the backend staff API payload.
export const EMPTY_STAFF_FORM = {
  first_name: "",
  second_name: "",
  last_name: "",
  second_last_name: "",
  email: "",
};

export function staffToForm(member) {
  return {
    first_name: member.first_name,
    second_name: member.second_name,
    last_name: member.last_name,
    second_last_name: member.second_last_name,
    email: member.email,
  };
}

export function fullName(person) {
  return [
    person.first_name,
    person.second_name,
    person.last_name,
    person.second_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}
