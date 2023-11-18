import React, { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import 'jquery/dist/jquery.min.js';

import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';

const DetectionRemovals = () => {
   const API_URL = 'http://localhost:8080/';
   const [detectionRemovals, setDetectionRemovals] = useState([]);
   const [detection, setDetection] = useState({});
   
   async function getData() {
      const results = await UserService.getDetectionRemovals();
      const data = results.data;
      setDetectionRemovals(data);
   }
   const [show1, setShow1] = useState(false);
   const handleClose1 = () => setShow1(false);
   const [show2, setShow2] = useState(false);
   const handleClose2 = () => setShow2(false);
   const [detectionRemoval, setDetectionRemoval] = useState({});
   const [removal, setRemoval] = useState({});
   
   useEffect(() => { getData(); });
   
   /* ***** removal dialog variables ********** */
   const [detection_id, setDetectionID] = useState(0);
   const [contractor_email, setContractorEmail] = useState('');
   const [date_removed, setDateRemoved] = useState('');
   const [latitude, setLatitude] = useState('');
   const [longitude, setLongitude] = useState('');
   const [general_location, setGeneralLocation] = useState('');
   const [environment, setEnvironment] = useState('');
   const [visual_estimate, setVisualEstimate] = useState('');
   const [wildlife_entanglement, setWildlifeEntanglement] = useState('');
   const [number_people_involved, setNumberPeopleInvolved] = useState(0);
   const [fisherman_time_lost, setFishermanTimeLost] = useState(0);
   const [removal_technique, setRemovalTechnique] = useState('');
   const [removal_photos_exist, setRemovalPhotosExist] = useState(false);
   
   function setDateRem(event) {
      setDateRemoved(event.target.value);
   }
   function setLat(event) {
      setLatitude(event.target.value);
   }
   function setLong(event) {
      setLongitude(event.target.value);
   }
   function setGenLoc(event) {
      setGeneralLocation(event.target.value);
   }
   function setEnviro(event) {
      setEnvironment(event.target.value);
   }
   function setVisEst(event) {
      setVisualEstimate(event.target.value);
   }
   function setWildEnt(event) {
      setWildlifeEntanglement(event.target.value);
   }
   function setNumPeople(event) {
      setNumberPeopleInvolved(Number(event.target.value));
   }
   function setFishTimeLost(event) {
      setFishermanTimeLost(Number(event.target.value));
   }
   function setRemTech(event) {
      setRemovalTechnique(event.target.value);
   }
   function setRemPhExist(event) {
      setRemovalTechnique(event.target.value);
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
   
   async function getRemovalById(id) {
      const results = await UserService.getRemovalById(id);
      setRemoval(results.data);
      setDateRemoved(results.data.date_removed);
      setLatitude(results.data.latitude);
      setLongitude(results.data.longitude);
      setGeneralLocation(results.data.general_location);
      setEnvironment(results.data.environment);
      setVisualEstimate(results.data.visual_estimate);
      setWildlifeEntanglement(results.data.wildlife_entanglement);
      setNumberPeopleInvolved(results.data.number_people_involved);
      setFishermanTimeLost(results.data.fisherman_time_lost);
      setRemovalTechnique(results.data.removal_technique);
      setRemovalPhotosExist(results.data.removal_photos_exist);
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
      if (detection.data.removal_id !== null) {
          await getRemovalById(detection.data.removal_id);
      }
      //console.log(user.email);
      setShow1(true);
   }
   
   function clearFields() {
      setDetectionID(0);
      setContractorEmail('');
      setDateRemoved('');
      setLatitude('');
      setLongitude('');
      setGeneralLocation('');
      setEnvironment('');
      setVisualEstimate('');
      setWildlifeEntanglement('');
      setNumberPeopleInvolved('')
      setFishermanTimeLost('');
      setRemovalTechnique('');
   }
   async function handleSubmit() {
      const removal_id = await axios.post(API_URL + "removals", {
         detection_id,
         contractor_email,
         date_removed,
         latitude,
         longitude,
         general_location,
         environment,
         visual_estimate,
         wildlife_entanglement,
         number_people_involved,
         fisherman_time_lost,
         removal_technique,
         removal_photos_exist,
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
         <table id="table" class="table">
            <thead>
               <tr>
                  <th>Dobor</th><th>Debris type</th><th>Island</th>
                  <th>Contractor email</th><th>Date Removed</th>
                  <th>Company</th><th>View</th><th>Choose</th>
               </tr>
            </thead>
            <tbody>
               {detectionRemovals.map((detectionRemoval, index) => (
                  <tr key={index}>
                     <td>{detectionRemoval.dobor_designation}</td>
                     <td>{detectionRemoval.debris_type_detected}</td>
                     <td>{detectionRemoval.island}</td>
                     <td>{detectionRemoval.contractor_email}</td>
                     <td>{detectionRemoval.date_removed}</td>
                     <td>{detectionRemoval.company}</td>
                     <td>
                        <button
                           id={`info-${detectionRemoval.det_id}`}
                           onClick={handleMoreInfo}
                        >Info</button>
                     </td>
                     <td>
                        <button
                           id={`select-${detectionRemoval.det_id}`}
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
               <Modal.Title>Add Removal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               contractor_mail: &nbsp;
               <b>{contractor_email}</b><br/>
               Date Removed: &nbsp;
               <input
                  type="text"
                  value={date_removed}
                  onChange={setDateRem}
               /><br/>
               Latitude: &nbsp;
               <input
                  type="text"
                  value={latitude}
                  onChange={setLat}
                  size="5"
               /><br/>
               Longitude: &nbsp;
               <input
                  type="text"
                  value={longitude}
                  onChange={setLong}
                  size="5"
               /><br/>
               General Location: &nbsp;
               <input
                  type="text"
                  value={general_location}
                  onChange={setGenLoc}
                  size="55"
               /><br/>
               Environment: &nbsp;
               <input
                  type="text"
                  value={environment}
                  onChange={setEnviro}
                  size="55"
               /><br/>
               Visual Estimate: &nbsp;
               <input
                  type="text"
                  value={visual_estimate}
                  onChange={setVisEst}
                  size="55"
               /><br/>
               Wildlife Entanglement: &nbsp;
               <input
                  type="text"
                  value={wildlife_entanglement}
                  onChange={setWildEnt}
                  size="55"
               /><br/>
               Number of people involved: &nbsp;
               <input
                  type="text"
                  value={number_people_involved}
                  onChange={setNumPeople}
                  size="5"
               />
               &nbsp;Fisherman time lost (hrs): &nbsp;
               <input
                  type="text"
                  value={fisherman_time_lost}
                  onChange={setFishTimeLost}
                  size="5"
               /><br/>
               Removal Technique: &nbsp;
               <input
                  type="text"
                  value={removal_technique}
                  onChange={setRemTech}
                  size="55"
               /><br/>
               Removal Photos exist? (true or false): &nbsp;
               <input
                  type="text"
                  value={removal_photos_exist}
                  onChange={setRemPhExist}
                  size="5"
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

export default DetectionRemovals;
