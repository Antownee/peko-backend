import cloneDeep  from "lodash/cloneDeep";

export async function documentHandler(documents, currentShipment) {
    const docs = await dochandler(documents, currentShipment);
    return docs;
}

function dochandler(docs, currentShipment) {
    let nudoc = cloneDeep(docs);
    return new Promise((resolve, reject) => {
        if (currentShipment.documents && docs) {
            nudoc.map((idoc) => {
                currentShipment.documents.map((odoc) => {
                    const code = odoc.documentCode;

                    let updateddoc = nudoc.find((d) => { return d.documentCode === code })
                    if (updateddoc) {
                        updateddoc.submitted = true;
                        updateddoc.fileName = odoc.fileName;
                        updateddoc.dateAdded = odoc.dateAdded;
                    }
                })
            })
            resolve(nudoc);
        }
    })
}

