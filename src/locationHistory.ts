import { Storage } from "@google-cloud/storage";
import { BigQuery } from "@google-cloud/bigquery";


const BUCKET_NAME = 'coronical_locations';
const FILE_NAME = 'locations.csv';
const DATASET_ID = 'infected_people_locations';
const TABLE_ID = 'locations';

// Instantiates a client
const storage = new Storage();
const bigquery = new BigQuery();


interface SaveLocationsBody {
    locations: Location[];
}

interface Location {

}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

export const saveLocations = (req, res) => {
    let message = 'Thank you for informing us!';
    if (req.get('content_type') !== 'application-json') {
        res.status(401);
        return;
    }
    const { locations } = req.body as SaveLocationsBody;
    savingToFile(locations);
    loadFile();
    res.status(200).send(message);
};

function savingToFile(locations: Location[]) {
    storage.bucket(BUCKET_NAME).create()
}

function loadFile() {
    const jobMetadata = {
        skipLeadingRows: 1,
        writeDisposition: 'WRITE_APPEND'
    };

    // Loads data from a Google Cloud Storage file into the table
    bigquery
        .dataset(DATASET_ID)
        .table(TABLE_ID)
        .load(storage.bucket(BUCKET_NAME).file(FILE_NAME), jobMetadata)
        .catch(err => {
            console.error('ERROR:', err);
        });

    console.log(`Loading from gs://${BUCKET_NAME}/${FILE_NAME} into ${DATASET_ID}.${TABLE_ID}`);
}