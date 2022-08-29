import ReactQuill from "react-quill";
import React from "react";
import { Field } from "formik";
export default class Description extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  render() {
    return (
      <Field name="desc">
        {({ field }) => (
          <ReactQuill
            theme="snow"
            value={field.value}
            onChange={field.onChange(field.name)}
            placeholder="Description"
          />
        )}
      </Field>
    );
  }
}
