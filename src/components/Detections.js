import React, {useState, useEffect} from 'react';
import UserService from '../services/user.service';
import 'jquery/dist/jquery.min.js';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import { faEllipsis} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from "react-validation/build/form";
import axios from 'axios';
import {CSVLink} from 'react-csv';
import './Detections.css';


const Detections = () => {
    const API_URL = "http://localhost:8080/";
    const[detectionsData, setDetectionsData] = useState([]);
    const[detection, setDetection] = useState({});
    const[error, setError] = useState(null);
    const[selectedId, setSelectedId] = useState(null);
    const[show, setShow] = useState(false);

    const[dateDetected, setDateDetected] = useState("");
    const[dobor,setDoborValue] = useState("")
    const[debrisType,setDebrisType] = useState("");
    const[debrisContainer, setContainer] = useState("");
    const[boatClaim, setBoatClaim] = useState("");
    const[biofoulingLevel, setBiofouling] = useState("");
    const[generalDebrisLoc, setGeneralDebrisLoc] = useState("");
    const[latitude, setLatitude] = useState("");
    const[longitude,setLongitude] = useState("");
    const[island, setIsland] = useState("");
    const[nearestLandmark, setNearestLandmark] = useState("");
    const[debrisRelLocation,setDebrisRelLocation] = useState("");
    const[debrisDescription, setDebrisDescription] = useState("");
    const[debrisImages, setDebrisImages] = useState("");

    const[geographicRegion, setGeographicRegion] = useState("");
    const[sciOrg, setSciOrg] = useState("");
    const[sciDocumenter, setSciDocumenter] = useState("");
    const[sciDebrisType, setSciDebrisType] = useState("");
    const[debrisPrimaryMaterial, setDebrisPrimaryMaterial] = useState("");
    const[dfadPart, setDfadPart] = useState("");
    const[docNotes, setDocNotes] = useState("");
    const[photographerName, setPhotographerName] = useState("");
    const[animalsPresent, setAnimalsPresent] = useState("");
    const[animalsPresentDescription, setAnimalsPresentDescription] = useState("");
    const[debrisLength, setDebrisLength] = useState("");
    const[debrisWidth, setDebrisWidth] = useState("");
    const[debrisAvgHeight, setDebrisAvgHeight] = useState("");
    const[debrisMaxHeight, setDebrisMaxHeight] = useState("");
    const[debrisCircumference, setDebrisCircumference] = useState("");
    const[debrisDimensionComments, setDebrisDimensionComments] = useState("");
    

    const handleClose = () => setShow(false);

    async function handleShow(e){
        console.log(e.currentTarget);
        const id = Number(e.currentTarget.id);
        await getDetectionById(id);
        setShow(true);
    }
    async function getDetectionById(id) {
        const results = await UserService.getDetectionById(id);
        setDetection(results.data);
        setDateDetected(results.data.date_detected);
        setDoborValue(results.data.dobor_designation);
        setDebrisType(results.data.debris_type_detected);
        setContainer(results.data.debris_container);
        setBoatClaim(results.data.boat_claim);
        setBiofouling(results.data.biofouling_level);
        setGeneralDebrisLoc(results.data.general_debris_location);
        setLatitude(results.data.latitude);
        setLongitude(results.data.longitude);
        setIsland(results.data.island);
        setNearestLandmark(results.data.nearest_landmark);

        setDebrisDescription(results.data.debris_description);
        setDebrisImages(results.data.debris_image_filenames);
        setDebrisRelLocation(results.data.debris_relative_location);
        setGeographicRegion(results.data.geographic_region);
        setSciOrg(results.data.scientific_organization);
        setSciDocumenter(results.data.scientific_documenter);
        setSciDebrisType(results.data.scientific_debris_type);
        setDebrisPrimaryMaterial(results.data.debris_primary_material);
        setDfadPart(results.data.dfad_part);
        setDocNotes(results.data.documentation_notes);
        setPhotographerName(results.data.photographer_name);
        setAnimalsPresent(results.data.animals_present);
        setAnimalsPresentDescription(results.data.animals_present_description);
        setDebrisLength(results.data.debris_length);
        setDebrisWidth(results.data.debris_width);
        setDebrisAvgHeight(results.data.debris_average_height);
        setDebrisMaxHeight(results.data.debris_max_height);
        setDebrisCircumference(results.data.debris_circumference);
        setDebrisDimensionComments(results.data.debris_dimension_comments);

    }
    const fetchData = async () => {
        try{
            const response = await UserService.getDetections();
            const detectionsData = response.data;
            setDetectionsData(detectionsData);
        }
        catch (err) {
            console.error('Error fetching detections data:', err);
            setError(err);
        }
    }

    
    useEffect(() => {
        fetchData();
    },[]);

    useEffect(() => {
        if (detectionsData.length > 0) {
            if($.fn.DataTable.isDataTable('#detections')) {
                $('#detections').DataTable().destroy();
            }
            $('#detections').DataTable();
        }
    },[detectionsData]);

    async function handleSubmit() {
        await axios.put(API_URL+"detections/" + detection.id, {
            dobor,
            debrisType,
            debrisContainer,
            boatClaim,
            biofoulingLevel,
            generalDebrisLoc,
            latitude,
            longitude,
            island,
            nearestLandmark,
            debrisRelLocation,
            debrisDescription,
            debrisImages,
            geographicRegion,
            sciOrg,
            sciDocumenter,
            sciDebrisType,
            debrisPrimaryMaterial,
            dfadPart,
            docNotes,
            photographerName,
            animalsPresent,
            animalsPresentDescription,
            debrisLength,
            debrisWidth,
            debrisAvgHeight,
            debrisMaxHeight,
            debrisCircumference,
            debrisDimensionComments

        });
        setShow(false);
    }
    return(
        <div>
            <h2>Detections Table</h2>
            <table id="detections" className="stripe">
                <CSVLink
                    data={detectionsData}
                    filename={'detections.csv'}
                    className="btn btn-primary"
                    style={{
                        marginTop: '10px',
                        marginBottom: '10px',
                        marginLeft:'20px'
                    }}
                >
                    Export to CSV
                </CSVLink>
            <thead>
                <tr>
                    <th>DOBOR</th>
                    <th>Debris Type</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Island</th>
                    <th></th>

                </tr>
            </thead>
            <tbody>
                {detectionsData.map((detection,index) => (
                    <tr key={index} id={detection.id}
                        onClick={(e) => handleShow(e)}
                    >
                        <td>{detection.dobor_designation}</td>
                        <td>{detection.debris_type_detected}</td>
                        <td>{detection.latitude}</td>
                        <td>{detection.longitude}</td>
                        <td>{detection.island}</td>
                        <td><FontAwesomeIcon icon={faEllipsis}/></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <Modal show={show} onHide={handleClose} backdrop="static" fullscreen={true}>
            <Modal.Header closeButton className="modal-header">
                <Modal.Title>Detection Data: ID {detection.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                <h4>DOBOR Report {detection.date_detected}</h4>
                </div>
                
                <hr/>
                <div className="row mb-4">
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">DOBOR Designation:&nbsp;</label>
                        <input className="detect-edit" type="text" value={dobor}
                            onChange={(e) => setDoborValue(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Debris Type Detected: &nbsp;</label>
                        <input className="detect-edit" type="text" value={debrisType}
                            onChange={(e) => setDebrisType(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Debris Container: &nbsp;</label>
                        <input className="detect-edit" type="text" value={debrisContainer}
                            onChange={(e) => setContainer(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Boat Claim: &nbsp;</label>
                        <input className="detect-edit" type="text" value={boatClaim}
                            onChange={(e) => setBoatClaim(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Biofouling Level: &nbsp;</label>
                        <input className="detect-edit" type="text" value={biofoulingLevel}
                            onChange={(e) => setBiofouling(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-2 pb-2">
                        <label className = "detect-label">Location Description: &nbsp;</label>
                        <input className="detect-edit" type="text" value={generalDebrisLoc}
                            onChange={(e) => setGeneralDebrisLoc(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Latitude: &nbsp;</label>
                        <input className="detect-edit" type="text" value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Longitude: &nbsp;</label>
                        <input className="detect-edit" type="text" value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-2 pb-2">
                        <label className = "detect-label">Island: &nbsp;</label>
                        <input className="detect-edit" type="text" value={island}
                            onChange={(e) => setIsland(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Nearest Landmark: &nbsp;</label>
                        <input className="detect-edit" type="text" value={nearestLandmark}
                            onChange={(e) => setNearestLandmark(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Debris Relative Location: &nbsp;</label>
                        <input className="detect-edit" type="text" value={debrisRelLocation}
                            onChange={(e) => setDebrisRelLocation(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Debris Description: &nbsp;</label>
                        <input className="detect-edit" type="text" value={debrisDescription}
                            onChange={(e) => setDebrisDescription(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-2 pb-2">
                        <label className = "detect-label">Image Names: &nbsp;</label>
                        <input className="detect-edit" type="text" value={debrisImages}
                            onChange={(e) => setDebrisImages(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                <h4>Scientific Evaulation</h4>
                </div>
                <hr/>
                <div className="row mb-4">
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Geographic Region: &nbsp;</label>
                        <input className="detect-edit" type="text" value={geographicRegion}
                            onChange={(e) => setGeographicRegion(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Scientific Organization: &nbsp;</label>
                        <input className="detect-edit" type="text" value={sciOrg}
                            onChange={(e) => setSciOrg(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-2 pb-2">
                        <label className = "detect-label">Scientific Documenter: &nbsp;</label>
                        <input className="detect-edit" type="text" value={sciDocumenter}
                            onChange={(e) => setSciDocumenter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Scientific Debris Type: &nbsp;</label>
                        <input className="detect-edit" type="text" value={sciDebrisType}
                            onChange={(e) => setSciDebrisType(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Debris Primary Material: &nbsp;</label>
                        <input className="detect-edit" type="text" value={debrisPrimaryMaterial}
                            onChange={(e) => setDebrisPrimaryMaterial(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-2 pb-2">
                        <label className = "detect-label">DFAD Part: &nbsp;</label>
                        <input className="detect-edit" type="text" value={dfadPart}
                            onChange={(e) => setDfadPart(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col">
                    <div>
                    <label className = "detect-label">Documentation Notes: &nbsp;</label>
                        <textarea className="document-notes" type="text" value={docNotes}
                            onChange={(e) => setDocNotes(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Scientific Photographer: &nbsp;</label>
                        <input className="detect-edit" type="text" value={photographerName}
                            onChange={(e) => setPhotographerName(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 pb-2">
                        <label className = "detect-label">Animals Present: &nbsp;</label>
                        <input className="detect-edit" type="text" value={animalsPresent}
                            onChange={(e) => setAnimalsPresent(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-2 pb-2">
                        <label className = "detect-label">Animals Description: &nbsp;</label>
                        <input className="detect-edit" type="text" value={animalsPresentDescription}
                            onChange={(e) => setAnimalsPresentDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-sm-2">
                        <label className = "dim-label">Debris Length: &nbsp;</label>
                        <input className="dim-edit" type="text" value={debrisLength}
                            onChange={(e) => setDebrisLength(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-2">
                        <label className = "dim-label">Debris Width: &nbsp;</label>
                        <input className="dim-edit" type="text" value={debrisWidth}
                            onChange={(e) => setDebrisWidth(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-2">
                        <label className = "dim-label">Debris Avg Height: &nbsp;</label>
                        <input className="dim-edit" type="text" value={debrisAvgHeight}
                            onChange={(e) => setDebrisAvgHeight(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-2">
                        <label className = "dim-label">Debris Max Height: &nbsp;</label>
                        <input className="dim-edit" type="text" value={debrisMaxHeight}
                            onChange={(e) => setDebrisMaxHeight(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-2">
                        <label className = "dim-label">Debris Circumference: &nbsp;</label>
                        <input className="dim-edit" type="text" value={debrisCircumference}
                            onChange={(e) => setDebrisCircumference(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col">
                    <div>
                    <label className = "dimension-label">Debris Dimension Comments: &nbsp;</label>
                        <textarea className="document-notes" type="text" value={debrisDimensionComments}
                            onChange={(e) => setDebrisDimensionComments(e.target.value)}
                        />
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
        </div>   
    );
};
export default Detections;