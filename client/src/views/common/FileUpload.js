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

        this.resetState = this.resetState.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    updateState() {
        this.props.onSubmit();
    }

    resetState() {
        this.setState({
            documentsToSubmit: [],
            labelText: "Choose file..."
        });
    }

    render() {
        let { document, currentShipment, user } = this.props;
        let uploadUrl = user.role === "Admin" ? `${apiUrl}/admin/order/documents` : `${apiUrl}/users/order/documents`;
        return (
            <FilePond
                server={
                    process = {
                        url: uploadUrl,
                        headers: { ...authHeader() },
                    }
                }
                allowDrop={false}
                allowReplace={true}
                labelIdle='<span class="filepond--label-action"> Upload file </span>'
                fileRenameFunction={(file) => {
                    return `${currentShipment.shipmentID}_${document.documentCode}${file.extension}`;
                }}
                onupdatefiles={(files) => {
                    if (files.length > 0) {
                        files[0].setMetadata("documentCode", document.documentCode)
                        files[0].setMetadata("orderID", currentShipment.orderID)
                        files[0].setMetadata("shipmentID", currentShipment.shipmentID)
                    }
                }}
                onprocessfile={(err, file) => {
                    if (file) {
                        this.props.updateShipmentDocuments(document.documentCode, file.filename)
                    }
                }}
                labelFileProcessingError={(serverError) => { return serverError; }}



            >
            </FilePond>
        )
    }
}

export default FileUpload;  