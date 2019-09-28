import cloneDeep  from "lodash/cloneDeep";

export async function documentHandler(documents, currentOrder) {
    const docs = await dochandler(documents, currentOrder);
    return docs;
}

function dochandler(docs, currentOrder) {
    let nudoc = cloneDeep(docs);
    return new Promise((resolve, reject) => {
        if (currentOrder.documents && docs) {
            nudoc.map((idoc) => {
                currentOrder.documents.map((odoc) => {
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

