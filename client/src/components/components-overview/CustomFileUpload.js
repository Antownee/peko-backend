import React from "react";

class CustomFileUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documentsToSubmit: [],
      labelText: "Choose file..."
    }

    this.submitDocuments = this.submitDocuments.bind(this);
    this.resetState = this.resetState.bind(this);
  }


  submitDocuments(event) {
    this.setState({ labelText: event.target.files[0].name })
    this.props.handlesubmitDocuments(event.target.files[0], event.target.id);
  }

  resetState() {
    this.state({
      documentsToSubmit: [],
      labelText: "Choose file..."
    })
  }

  render() {
    const document = this.props.document;
    return (
      <div className="custom-file">
        <input type="file" className="custom-file-input" id={document.documentCode} onChange={this.submitDocuments} />
        <label className="custom-file-label" htmlFor="customFile2">
          {this.state.labelText}
        </label>
      </div>
    )
  }
}

export default CustomFileUpload;
