import React, { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import 'jquery/dist/jquery.min.js';

import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';

const DetectionStorage = () => {
    //const API_URL = 'https://manaotech.xyz/';
   const API_URL = 'http://localhost:8080/';
   const [detectionStorage, setDetectionStorage] = useState([]);
   const [detection, setDetection] = useState({});
   
   async function getData() {
      const results = await UserService.getDetectionStorage();
      const data = results.data;
      setDetectionStorage(data);
   }
   const [show1, setShow1] = useState(false);
   const handleClose1 = () => setShow1(false);
   const [show2, setShow2] = useState(false);
   const handleClose2 = () => setShow2(false);
   const [detectionOneStorage, setDetectionOneStorage] = useState({});
   const [storage, setStorage] = useState({});
   
   useEffect(() => { getData(); });
   
   /* ***** storage dialog variables ********** */
   const [detection_id, setDetectionID] = useState(0);
   const [contractor_email, setContractorEmail] = useState('');
   const [location, setLocation] = useState('');
   const [date_wet_mass, setDateWetMass] = useState(null);
   const [wet_mass, setWetMass] = useState('');
   const [date_dry_mass, setDateDryMass] = useState(null);
   const [dry_mass, setDryMass] = useState('');
   const [disposal_method, setDisposalMethod] = useState('');
   
   function setLoc(event) {
      setLocation(event.target.value);
   }
   function setDateWet(event) {
      setDateWetMass(event.target.value);
   }
   function setWMass(event) {
      setWetMass(event.target.value);
   }
   function setDateDry(event) {
      setDateDryMass(event.target.value);
   }
   function setDMass(event) {
      setDryMass(event.target.value);
   }
   function setDispMethod(event) {
      setDisposalMethod(event.target.value);
   }
   /* ******end removal dialog variables ***************** */
   
   /* ********* detection info dialog variables ************/
   const [debris_type, set_debris_type] = useState('');
   const [dobor, setDobor] = useState('');
   const [debris_container, set_debris_container] = useState('');
   const [boat_claim, set_boat_claim] = useState('');
   const [bio_level, set_bio_level] = useState(0);
   const [gen_location, set_gen_location] = useState('');
   const [lat, set_lat] = useState(0);
   const [long, set_long] = useState(0);
   const [island, set_island] = useState('');
   const [nearest_landmark, set_nearest_landmark] = useState('');
   const [debris_relative_location, set_debris_relative_location] = useState('');
   const [debris_description, set_debris_description] = useState('');
   const [debris_image_filenames, set_debris_image_filenames] = useState('');
   const [date_detected, set_date_detected] = useState('');
   
   /* ********** end detection info dialog variables ***** */
   
   async function handleMoreInfo(event) {
      //console.log(event.target);
      const id_string = event.target.id;
      const tokens = id_string.split("-");
      const id = Number(tokens[1]);
      await getDetectionById(id);
      setShow2(true);
   }
   
   async function getDetectionById(id) {
      const results = await UserService.getDetectionById(id);
      setDetection(results.data);
      set_debris_type(results.data.debris_type_detected);
      setDobor(results.data.dobor_designation);
      set_debris_container(results.data.debris_container);
      set_boat_claim(results.data.boat_claim);
      set_bio_level(results.data.biofouling_level);
      set_gen_location(results.data.general_debris_location);
      set_lat(results.data.latitude);
      set_long(results.data.longitude);
      set_island(results.data.island);
      set_nearest_landmark(results.data.nearest_landmark);
      set_debris_relative_location(results.data.debris_relative_location);
      set_debris_description(results.data.debris_description);
      set_debris_image_filenames(results.data.debris_image_filenames);
      set_date_detected(results.data.date_detected);      
   }
   
   async function getStorageById(id) {
      const results = await UserService.getStorageById(id);
      setStorage(results.data);
      setLocation(results.data.location);
      setDateWetMass(results.data.date_wet_mass_measured);
      setWetMass(results.data.wet_mass);
      setDateDryMass(results.data.date_dry_mass_measured);
      setDryMass(results.data.dry_mass);
      setDisposalMethod(results.data.disposal_method);
   }
   async function handleShow(event) {
      //console.log(event.target);
      clearFields();
      const user = JSON.parse(localStorage.getItem("user"));
      const id_string = event.target.id;
      const tokens = id_string.split("-");
      //console.log("detection id: " + tokens[1]);
      setDetectionID(Number(tokens[1]));
      setContractorEmail(user.email);
      //console.log("handleShow, detection_id: " + tokens[1]);
      const detection = await UserService.getDetectionById(Number(tokens[1]));
      if (detection.data.storage_id !== null) {
          await getStorageById(detection.data.storage_id);
      }
      //console.log(user.email);
      setShow1(true);
   }
   
   function clearFields() {
      setDetectionID(0);
      setContractorEmail('');
      setLocation('');
      setDateWetMass('');
      setWetMass('');
      setDateDryMass('');
      setDryMass('');
      setDisposalMethod('');
   }
   async function handleSubmit() {
      if (date_wet_mass.trim() === '') {
          setDateWetMass(null);
      }
      if (date_dry_mass.trim() === '') {
          setDateDryMass(null);
      }
      const storage_id = await axios.post(API_URL + "storage", {
         detection_id,
         contractor_email,
         location,
         date_wet_mass,
         wet_mass,
         date_dry_mass,
         dry_mass,
         disposal_method,
      });
      clearFields();
      setShow1(false);
   }
   $(document).ready(function() {
      setTimeout(function() {
         $('#table').DataTable();
      }, 1000);
   });
   
   return(
      <div>
         <table id="table" >
            <thead>
               <tr>
                  <th>Dobor</th><th>Debris type</th><th>Island</th>
                  <th>Contractor email</th><th>Date Stored</th>
                  <th>Company</th><th>View</th><th>Choose</th>
               </tr>
            </thead>
            <tbody>
               {detectionStorage.map((detectionStorage, index) => (
                  <tr key={index}>
                     <td>{detectionStorage.dobor_designation}</td>
                     <td>{detectionStorage.debris_type_detected}</td>
                     <td>{detectionStorage.island}</td>
                     <td>{detectionStorage.contractor_email}</td>
                     <td>{detectionStorage.date_wet_mass_measured}</td>
                     <td>{detectionStorage.company}</td>
                     <td>
                        <button
                           id={`info-${detectionStorage.det_id}`}
                           onClick={handleMoreInfo}
                        >Info</button>
                     </td>
                     <td>
                        <button
                           id={`select-${detectionStorage.det_id}`}
                           onClick={handleShow}
                        >Select</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <Modal show={show1} onHide={handleClose1}
            backdrop="static" fullscreen={true}
         >
            <Modal.Header closeButton>
               <Modal.Title>Add Storage</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               contractor_mail: &nbsp;
               <b>{contractor_email}</b><br/>
               Location: &nbsp;
               <input
                  type="text"
                  value={location}
                  onChange={setLoc}
               /><br/>
               Date Wet Mass Measured: &nbsp;
               <input
                  type="text"
                  value={date_wet_mass}
                  onChange={setDateWet}
               /><br/>
               Wet mass (kg): &nbsp;
               <input
                  type="text"
                  value={wet_mass}
                  onChange={setWMass}
                  size="5"
               /><br/>
               Date Dry Mass Measured: &nbsp;
               <input
                  type="text"
                  value={date_dry_mass}
                  onChange={setDateDry}
               /><br/>
               Dry mass (kg): &nbsp;
               <input
                  type="text"
                  value={dry_mass}
                  onChange={setDMass}
                  size="5"
               /><br/>
               Disposal Method: &nbsp;
               <input
                  type="text"
                  value={disposal_method}
                  onChange={setDispMethod}
                  size="55"
               /><br/>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" onClick={handleSubmit}>
                  Save Changes
               </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={show2} onHide={handleClose2}
            backdrop="static" fullscreen={true}
         >
            <Modal.Header closeButton>
               <Modal.Title>View Detection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               DOBOR designation: &nbsp;
               <b>{dobor}</b><br/>
               Debris type detected: &nbsp;
               <b>{debris_type}</b><br/>
               Boat Claim: &nbsp;
               <b>{boat_claim}</b><br/>
               Biofouling Level: &nbsp;
               <b>{bio_level}</b><br/>
               General Location: &nbsp;
               <b>{gen_location}</b><br/>
               Latitude: &nbsp;
               <b>{lat}</b> &nbsp;
               Longitude: &nbsp;
               <b>{long}</b><br/>
               Island: &nbsp;
               <b>{island}</b><br/>
               Nearest Landmark: &nbsp;
               <b>{nearest_landmark}</b><br/>
               Debris Removal Urgency: &nbsp;
               <b>{debris_relative_location}</b><br/>
               Debris Additional Description: &nbsp;
               <b>{debris_description}</b><br/>
               Debris image filename(s): &nbsp;
               <b>{debris_image_filenames}</b><br/>
               Date Detected: &nbsp;
               <b>{date_detected}</b><br/>
            </Modal.Body>
         </Modal>
      </div>
   );
};

export default DetectionStorage;
