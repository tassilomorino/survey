import React from "react"
import Papa from "papaparse"


class FileReader extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      winner: ""
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    this.props.handleChange(
      event.target.files[0]
    );
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  updateData(result) {
    var data = result.data;

  }

  render() {
    return (
      <div className="App">
        <input
          required
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <p />

      </div>
    );
  }
}

export default FileReader;


