import React from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import '../style/filepond.css'
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import { authHeader } from '../../redux/helpers';
import { apiUrl } from '../../config';



registerPlugin(FilePondPluginFileRename); //Register plugin

class FileUpload extends React.Component {
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
        if (event.target.files.length > 0) {
            this.setState({ labelText: event.target.files[0].name })
            this.props.handlesubmitDocuments(event.target.files[0], event.target.id);
        }
    }

    resetState() {
        this.setState({
            documentsToSubmit: [],
            labelText: "Choose file..."
        });
    }

    render() {
        const { document, currentOrder } = this.props;
        return (
                <FilePond 
                    server={
                        process = {
                            url: `${apiUrl}/admin/order/documents`,
                            headers: { ...authHeader() },
                        }
                    }
                    allowDrop={false}
                    allowReplace={true}
                    labelIdle='<span class="filepond--label-action"> Upload file </span>'
                    fileRenameFunction={(file) => {
                        return `${currentOrder.orderRequestID}_${document.documentCode}${file.extension}`;
                    }
                    }
                    onupdatefiles={(files) => {
                        if (files.length > 0) {
                            files[0].setMetadata("documentCode", document.documentCode)
                            files[0].setMetadata("orderID", currentOrder.orderRequestID)
                        }
                    }
                    }
                >
                </FilePond>
        )
    }
}

export default FileUpload;  