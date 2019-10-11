import React from "react";
import {
    Card,
    CardHeader,
    CardBody, ListGroup,
    ListGroupItem,
    Progress, Col
} from "shards-react";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import '../style/filepond.css'
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import { authHeader } from '../../redux/helpers';
import { apiUrl } from '../../config';
import { format, parse } from 'date-fns';


registerPlugin(FilePondPluginFileRename); //Register plugin

class UploadContract extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { currentOrder, user } = this.props;
        let uploadUrl = `${apiUrl}/admin/order/documents`;
        return (
            <Col lg="4" className="text-center">
                <Card small className="mb-4 pt-3 text-center">
                    <CardHeader className="border-bottom ">
                        <h4 className="mb-0">{currentOrder.orderRequestID}</h4>
                        <span className="text-muted d-block mb-2">{format(currentOrder.requestDate, 'MMMM Do, YYYY')}</span>
                    </CardHeader>
                    <CardBody className="text-center">
                        <FilePond
                            server={
                                process = {
                                    url: uploadUrl,
                                    headers: { ...authHeader() },
                                }
                            }
                            allowDrop={false}
                            allowReplace={true}
                            labelIdle='<span class="filepond--label-action"> UPLOAD CONTRACT </span>'
                            fileRenameFunction={(file) => {
                                return `${currentOrder.orderRequestID}_CONTRACT${file.extension}`;
                            }}
                            onupdatefiles={(files) => {
                                if (files.length > 0) {
                                    files[0].setMetadata("documentCode", "CONTRACT")
                                    files[0].setMetadata("orderID", currentOrder.orderID)
                                }
                            }}
                            onprocessfile={(err, file) => {
                                if (file) {
                                    //update order status by saying contract has been uploaded
                                }
                            }}
                        >
                        </FilePond>

                    </CardBody>
                </Card>
            </Col>
        )
    }
}

export default UploadContract;  