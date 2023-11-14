import React, {useState, useEffect} from "react";
import Form from "react-validation/build/form";
import {Container, Row, Col} from "react-bootstrap";
import './Dobor.css';
import { icon } from "leaflet";
import axios from "axios";

const Dobor = () =>{
    
   
    const [question1, setQuestion1] = useState({
        debrisFound: [],
        otherDebris:""
    })

    const [question2, setQuestion2] = useState({
        selectedOption:""
    })

    const [question3, setQuestion3] = useState({
        selectedOption: ""
    })

    const [question4, setQuestion4] = useState({
        foulingLevel:""
    })
    const [question5, setQuestion5] = useState({
        locationOnshore:"",
        locationOffshore:""
    })

    const [question6, setQuestion6] = useState("");

    const [question7, setQuestion7] = useState({
        selectedIsland:""
    })

    const [question8, setQuestion8] = useState("");

    const [question9, setQuestion9] = useState({
        debrisDescription:"",
        customDescription:""
    })
    const [reportImages,setReportedImages] = useState([]); //Question10
    const [imageFileNames,setImageFileNames] = useState([]); //Question10
    const [imageCount, setImageCount] = useState(0);
    const [question11, setQuestion11] = useState(""); //last name
    const [question12, setQuestion12] = useState(""); //first name
    const [question13, setQuestion13] = useState(""); //email address
    const [question14, setQuestion14] = useState("");//confirm email address
    const [question15, setQuestion15] = useState("");//mailing address
    const [question16, setQuestion16] = useState("");//city
    const [question17, setQuestion17] = useState("");//state
    const [question18, setQuestion18] = useState("");//zip code
    const [question19, setQuestion19] = useState("");//phone number
    
    const [errorQuestion1, setErrorQuestion1] = useState(null);
    const [errorQuestion4, setErrorQuestion4] = useState(null);
    const [errorQuestion5, setErrorQuestion5] = useState(null);
    const [errorQuestion7, setErrorQuestion7] = useState(null);
    const [errorQuestion9, setErrorQuestion9] = useState(null);
    const [errorQuestion11, setErrorQuestion11] = useState(null);
    const [errorQuestion12, setErrorQuestion12] = useState(null);
    const [errorQuestion13, setErrorQuestion13] = useState(null);
    const [errorQuestion14, setErrorQuestion14] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const [showDescriptionTextarea, setShowQuestion5] = useState(false);
    
    const handleQ1CheckboxChange = (event) => {
        const {name, checked} = event.target;
        let updatedDebrisFound;
        if (name === 'other') {
            updatedDebrisFound = checked
            ?[...question1.debrisFound, name]
            : question1.debrisFound.filter((item) => item !== name);
        }
        else {
            updatedDebrisFound = checked
            ? [...question1.debrisFound,name]
            : question1.debrisFound.filter((item) => item !== name);
        };
        if(!updatedDebrisFound.includes('Other - describe below')) {
            setQuestion1((prevQuestion1) => ({
                ...prevQuestion1,
                debrisFound: updatedDebrisFound,
                otherDebris:''
            }));
        }
        else {
            setQuestion1((prevQuestion1) => ({
                ...prevQuestion1,
                debrisFound: updatedDebrisFound
            }));
        }  
    };

    const handleQ1OtherDescriptionChange = (event) => {
        if(event.target.value === "") {
            setQuestion1((prevQuestion1) => ({
                ...prevQuestion1
            }));
        }
        else {
            setQuestion1((prevQuestion1) => ({
            ...prevQuestion1,
            otherDebris: event.target.value
            }));
        }
    };
    useEffect(() => {
       if(!question1.debrisFound.includes(debrisTypeOptions[2])) {
        setQuestion2({selectedOption: containerOptions[0]});
       }
       if(question1.debrisFound.includes(debrisTypeOptions[2])) {
        setQuestion2({selectedOption: containerOptions[1]});
       }
       else {
        setQuestion2({selectedOption:""});
       }
    }, [question1.debrisFound]);

    const handleQ2SelectChange = (event) => {
        setQuestion2({selectedOption: event.target.value});
    }
    useEffect(() => {
        if(!question1.debrisFound.includes(debrisTypeOptions[1])) {
            setQuestion3({selectedOption:boatOptions[2]});
        }
    }, [question1.debrisFound]);


    const handleQ3RadioChange = (event) => {
        setQuestion3({selectedOption: event.target.value});
    }
    const handleQ4SelectChange = (event) => {
        const selectedOption = event.target.value;
        setQuestion4({foulingLevel: selectedOption});
    }
    const handleQ5RadioChange = (event) => {
        const value = event.target.value;
        setQuestion5((prevQuestion5) => ({
            ...prevQuestion5,
            selectedOption: value,
            locationOnshore: value !== "other" ? value: "N/A",
            locationOffshore: ""
        }));
 
    }
    const handleQ6InputChange = (event) => {
        setQuestion6(event.target.value);
    }
    useEffect(() => {
        if(question7.selectedOption === locationOptions[5]) {
            setQuestion7({selectedIsland:island[0]});
        }
        else {
            setQuestion7({selectedIsland:""});
        }
    }, [question7.selectedOption]);

    const handleQ7SelectChange = (event) => {
        setQuestion7({selectedIsland: event.target.value});
    }
    
    const handleQ8InputChange = (event) => {
        setQuestion8(event.target.value);
    }

    const handleQ9RadioChange = (event) => {
        const value = event.target.value;
        if (value === "Other - please explain how urgent recovery/removal is") {
            setQuestion9((prevQuestion9) => ({
                ...prevQuestion9,
                selectedOption: value
            }));
        }
        else {
            setQuestion9((prevQuestion9) => ({
                ...prevQuestion9,
                selectedOption:value,
                customDescription:""
            }));
        }
 
    }

    const handleQ10ImageChange = (event) => {
        const imageFiles = event.target.files;
        const imagesArray = [...reportImages];
        const maxImages = 6;
        const maxSizeInBytes = 30 * 1024 * 1024; //30MB
        const fileNamesArray = [...imageFileNames];

        for (let i=0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            if (file.size > maxSizeInBytes){
                alert("Image size exceeds 30MB. Please choose a smaller image.");
            }
            else if (imagesArray.length + i < maxImages) {
                const imageUrl = URL.createObjectURL(file);
                imagesArray.push(imageUrl);
                fileNamesArray.push(file.name);
            }
            else {
                break;
            }
        }
        setReportedImages(imagesArray);
        setImageFileNames(fileNamesArray);
    }


    const removeImage = (index) => {
        const updatedImages = [...reportImages];
        updatedImages.splice(index,1);
        setReportedImages(updatedImages);
        setImageCount(imageCount -1)
    };

    const handleQ11InputChange = (event) => {
        setQuestion11(event.target.value);
    }
    const handleQ12InputChange = (event) => {
        setQuestion12(event.target.value);
    }
    const handleQ13InputChange = (event) => {
        setQuestion13(event.target.value);
    }
    const handleQ14InputChange = (event) => {
        setQuestion14(event.target.value);
    }
    const handleQ15InputChange = (event) => {
        setQuestion15(event.target.value);
    }
    const handleQ16InputChange = (event) => {
        setQuestion16(event.target.value);
    }
    const handleQ17InputChange = (event) => {
        setQuestion17(event.target.value);
    }
    const handleQ18InputChange = (event) => {
        setQuestion18(event.target.value);
    }
    const handleQ19InputChange = (event) => {
        setQuestion19(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        
        if (question1.debrisFound.includes('Other - describe below')) {
           const filteredDebris = question1.debrisFound.filter(option => option !== 'Other - describe below');

           if (filteredDebris.length === 0) {
            setErrorQuestion1("Please select at least one option or describe in 'Other'");
            }
            else {
                setErrorQuestion1(null);
            }
        }
        
        
        if(!question2.selectedOption) {
            setQuestion2({selectedOption: containerOptions[0]});
        }

        if(!question4.foulingLevel){
            setErrorQuestion4("Please select a biofouling level")
        }
        else {
            setErrorQuestion4(null);
        }
        
        if(!question5.selectedOption) {
            setErrorQuestion5("Location field is required");
        }
        else {
            setErrorQuestion5(null);
        }
        if (!question7.selectedIsland) {
            setErrorQuestion7("Must indicate which Hawaiian island");
        }
        else {
            setErrorQuestion7(null);
        }
        if(!question9.selectedOption) {
            setErrorQuestion9("Debris description is required");
        }
        else {
            setErrorQuestion9(null);
        }

        if (!question11) {
            setErrorQuestion11("Last name is required");
        }
        else {
            setErrorQuestion11(null);
        }
        if (!question12) {
            setErrorQuestion12("First name is required");
        }
        else {
            setErrorQuestion12(null);
        }
        if (!question13) {
            setErrorQuestion13("Email address is required");
        }
        else {
            setErrorQuestion13(null);
        }
        if (!question14) {
            setErrorQuestion14("You must confirm email address");
        }
        else {
            setErrorQuestion14(null);
        }
        if (question13 !== question14) {
            setErrorQuestion14("Email addresses don't match");
        }
        let locationOutput = question5.locationOnshore || (question5.locationOffshore !== "" ? question5.locationOffshore : "");
        let output = question1.debrisFound.includes('Other - describe below')
            ? [...question1.debrisFound.filter(option => option !== 'Other - describe below')]
            : question1.debrisFound.join(',');
        if (question1.otherDebris === "") {
            output += question1.otherDebris;
        }
        else {
            output += "," + question1.otherDebris;
        }
        const debris_type_detected = output;
        //output += "," + question1.otherDebris
        output += ";" + question2.selectedOption
        const debris_container = question2.selectedOption;
        output += ";" + question3.selectedOption
        const boat_claim = question3.selectedOption;
        output += ";" + question4.foulingLevel;
        const bio_level = question4.foulingLevel;
        output += ";" + locationOutput + question5.locationOffshore;
        const gen_debris_location = locationOutput + question5.locationOffshore;
        output += ";" + question6;
        const lat_long = question6;
        output += ";" + question7.selectedIsland;
        const island = question7.selectedIsland;
        output += ";" + question8;
        const near_landmark = question8;
        let tempout = '';
        if (question9.selectedOption === 'Other - please explain how urgent recovery/removal is') {
            output += ";" + 'Other - removal urgency: ' + question9.customDescription;
            tempout += ";" + 'Other - removal urgency: '+ question9.customDescription;
        }
        else {
            output += ";" + question9.selectedOption;
            tempout += question9.selectedOption
        }
        const debris_desc = tempout;
        output += ";" + imageFileNames;
        const image_filenames = imageFileNames;
        output += ";" + question11;
        const last_name = question11;
        output += ";" + question12;
        const first_name = question12;
        output += ";" + question13;
        const email = question13;
        output += ";" + question15;
        const address = question15;
        output += ";" + question16;
        const city = question16;
        output += ";" + question17;
        const state = question17;
        output += ";" + question18;
        const zip = question18;
        output += ";" + question19;
        const phone = question19;
        console.log(output);
        axios.post('http://localhost:8080/detections', {
           debris_type_detected,
           debris_container,
           boat_claim,
           bio_level,
           gen_debris_location,
           lat_long,
           island,
           near_landmark,
           debris_desc,
           image_filenames,
           last_name,
           first_name,
           email,
           address,
           city,
           state,
           zip,
           phone,
        });
        /*console.log('Question 1 - Other Debris:', question1.otherDebris);
        console.log('Question 2 - Container:', question2.selectedOption);
        console.log('Question 3 - Boat:', question3.selectedOption);
        console.log('Question 4 - Marine Growth:', question4.foulingLevel);
        console.log('Question 5 - Location Onshore:', question5.locationOnshore);
        console.log('Question 5 - Location Offshore:', question5.locationOffshore);
        console.log('Question 6 - Island:', question6.selectedIsland);*/
        
    };
    const debrisTypeOptions = [
        "A mass of netting and/or other fishing gear",
        "An abandoned/derelict boat",
        "A container/drum/cylinder",
        "A large concentration of plastics",
        "Potential Japan tsunami debris",
        "A large concentration of miscellaneous trash",
        "Other - describe below"
    ];
    const containerOptions = [
        "Did not find a container/drum/cylinder",
        "Empty",
        "Partially filled",
        "Full"
    ]
    const boatOptions = [
        "Yes, I want to claim it for personal use",
        "Yes, but I don't want the boat",
        "No boat was found"
    ];
    const foulingLevels = [
        "----",
        "1 - no algae or marine life at all",
        "2",
        "3",
        "4",
        "5",
        "6 - patches of dense algae and presence of barnacle colonies",
        "7",
        "8",
        "9",
        "10 - abundant, healthy growth of algae and barnacles covering submerged areas"
    ]
    const locationOptions = [
        "Federal Waters: At sea, BEYOND three miles from nearest land",
        "State Waters: At sea, WITHIN three miles from nearest land",
        "In the shore break",
        "On the beach BELOW the high wash of the waves",
        "On the beach ABOVE the high wash of the waves",
        "None of the above, a description follows below"
    ]
    const island = [
        "Offshore",
        "Midway Atoll",
        "Big Island",
        "Kauai",
        "Lanai",
        "Maui",
        "Molokai",
        "Oahu"
    ]
    const debrisDescription = [
        "Caught on the reef or is partially buried in sand",
        "Loose in the shore break or on the shoreline and could go back out to sea",
        "trapped in a tide pool and cannot escape",
        "loose on the shore but caught in the vegetation line",
        "Tied to a fixed object so it cannot be swept away",
        "Pushed inland above the high wash of the waves so it cannot be swept away",
        "Other - please explain how urgent recovery/removal is"
    ]
    return(
        <div className = "dobor">
            <div className = "responsive">
                <Container className = "py-3">
                    <div className = "card">
                        <Row>
                            <Col className="d-flex align-items-center">
                                <img
                                    src="/images/Dobor.png"
                                    alt="Dobor-logo-img"
                                    width="80%"
                                    height="auto"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={9} className="d-flex align-items-center">
                            <Form onSubmit = {handleSubmit} id="doborQ">
                            <div className="newline-label">
                                <label>1. I found/located the following:<span className="text-danger">*</span></label>
                            </div>
                            {debrisTypeOptions.map((option, index) => (
                                <div key={index} className="newline-label">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={question1.debrisFound.includes(option)}
                                            onChange={(event) => {
                                                handleQ1CheckboxChange({
                                                    target: {
                                                        name:option,
                                                        checked: event.target.checked
                                                    },
                                                });
                                                if (!event.target.checked) {
                                                    handleQ1OtherDescriptionChange({target: {value:""}});
                                                }
                                            }}
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                            {question1.debrisFound.includes('Other - describe below') && (
                                <textarea
                                    rows="10"
                                    cols="20"
                                    value={question1.otherDebris}
                                    onChange = {handleQ1OtherDescriptionChange}
                                />
                            )}
                            {errorQuestion1 && <div className="alert alert-danger" role="alert">{errorQuestion1}</div>}
                            <div className="newline-label">
                                <label>
                                    2. Did you find a container, a drum, or cylinder? If yes, how full is it?
                                </label>
                            </div>
                            <div className="newline-label">
                                <select
                                    id="question-2"
                                    name="question-2"
                                    value={
                                        question1.debrisFound.includes(debrisTypeOptions[2])
                                        ? question2.selectedOption || containerOptions[0]
                                        : containerOptions[0]
                                    }
                                    onChange={handleQ2SelectChange}
                                    className="custom-dropdown"
                                >
                                    {question1.debrisFound.includes(debrisTypeOptions[2]) ? (
                                        containerOptions.slice(1).map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))
                                    ): (
                                        <option value={containerOptions[0]}>{containerOptions[0]}</option>
                                    )}
                                </select>
                            </div>
                            <div className = "newline-label">
                                <label>
                                    3. Did you find a boat? If yes, do you want to claim it for personal use?
                                    <span className="text-danger">*</span>
                                </label>
                            </div>
                            {question1.debrisFound.includes(debrisTypeOptions[1]) ? (
                                boatOptions.slice(0,2).map((option,index) => (
                                    <div className="newline-label" key={index}>
                                        <input
                                            type="radio"
                                            id={`option-${index}`}
                                            name="question-3"
                                            value={option}
                                            checked={question3.selectedOption === option}
                                            onChange={handleQ3RadioChange}
                                        />
                                        <label>{option}</label>
                                    </div>
                                ))
                            ): (
                                <div className="newline-label">
                                    <input
                                        type="radio"
                                        id={`option-2`}
                                        name="question-3"
                                        value={boatOptions[2]}
                                        checked={question3.selectedOption === boatOptions[2]}
                                        onChange={handleQ3RadioChange}
                                    />
                                    <label>{boatOptions[2]}</label>
                                </div>
                            )}
                            <div className="newline-label">
                                <label>
                                    4. On a scale of one to ten (one represents no marine growth and ten
                                    represents significant marine life covering all submerged surfaces)
                                    how much biofouling is on the item you found?
                                    <span className="text-danger">*</span>
                                </label>
                            </div>
                            <div className="newline-label">
                                <select
                                    id="question-4"
                                    name="question-4"
                                    value={question4.foulingLevel || ""}
                                    onChange={handleQ4SelectChange}
                                    className="custom-dropdown"
                                >
                                    <option value="">Choose an option</option>
                                    {foulingLevels.slice(1).map((option,index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errorQuestion4 && (
                                <div className="alert alert-danger" role="alert">{errorQuestion4}</div>
                            )}
                            <div className="newline-label">
                                <label>
                                    5. This debris is located:
                                    <span className="text-danger">*</span>
                                </label>
                            </div>
                            {locationOptions.map((option,index) => (
                                <div className="newline-label" key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="location"
                                            value={option}
                                            checked={question5.selectedOption === option}
                                            onChange={handleQ5RadioChange}
                                            id={"location-" + index}
                                        />
                                        {option}
                                    </label>
                                    {option === "None of the above, a description follows below"}
                                </div>
                            ))}
                            
                            {question5.selectedOption === 'None of the above, a description follows below' && (
                                <textarea
                                    rows="10"
                                    cols="20"
                                    value={question5.locationOffshore}
                                    onChange={(event) => {
                                        const updatedLocation = event.target.value
                                        setQuestion5((prevQuestion5) => ({
                                            ...prevQuestion5,
                                            locationOffshore:updatedLocation
                                        }));
                                    }}
                                />
                            )}
                            {errorQuestion5 && <div className="alert alert-danger" role="alert">{errorQuestion5}</div>}
                            <div className ="newline-label">
                            </div>
                            {submitted && (errorQuestion1 || errorQuestion5) && (
                                <div className="alert alert-danger" role="alert">Please check the form for errors.</div>
                            )}
                            <div className="newline-label">
                                <label>6. Enter latitude and longitude (i.e. 21.3161 -157.8906)
                                    or provide a position description and any information on currents and winds that could help in relocating the debris.
                                    <span className="text-danger">*</span>
                                </label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question6}
                                onChange={handleQ6InputChange}
                            />
                            <div className="newline-label">
                                <label>
                                    7. If on land or in the nearshore waters - indicate which island
                                    <span className="text-danger">*</span>
                                </label>
                            </div>
                            <div className="newline-label">
                                <select
                                    id="question-7"
                                    name="question-7"
                                    value={question7.selectedIsland}
                                    onChange={handleQ7SelectChange}
                                    className="custom-dropdown"
                                >
                                    <option value="" disabled>Indicate the island</option>
                                    <option value={island[0]}>Offshore</option>
                                        {island.slice(1).map((option,index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            {errorQuestion7 && <div className="alert alert-danger" role="alert">{errorQuestion7}</div>}
                            <div className="newline-label">
                                <label>8. Nearest town, street address, nearby landmarks:<span className="text-danger">*</span></label>
                                <br/>
                                <textarea
                                    rows="4"
                                    cols="20"
                                    value={question8}
                                    onChange={handleQ8InputChange}
                                />
                            </div>
                            <div className="newline-label">
                                <label>
                                    9. The debris is best described as:
                                    <span className="text-danger">*</span>
                                </label>
                            </div>
                            {debrisDescription.map((option,index) => (
                                <div className="newline-label" key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="description"
                                            value={option}
                                            checked={question9.selectedOption === option}
                                            onChange={handleQ9RadioChange}
                                            id={"description-" + index}
                                        />
                                        {option}
                                    </label>
                                    {option === "Other - please explain how urgent recovery/removal is" && question9.selectedOption === option &&(
                                        <textarea
                                            rows="10"
                                            cols="20"
                                            value={question9.customDescription}
                                            onChange={(event) => {
                                                const updatedDescription = event.target.value
                                                setQuestion9((prevQuestion9) => ({
                                                    ...prevQuestion9,
                                                    customDescription:updatedDescription
                                                }));
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                            {errorQuestion9 && (
                                            <div className="alert alert-danger" role="alert">{errorQuestion9}</div>
                            )}
                            <div className="newline-label">
                                <label>
                                    10. If you can take a photograph, please turn on the locator/GPS
                                    of your device, take the picture and attach it (Six image/30MB maximum)
                                </label>
                            </div>
                            {reportImages.map((image,index) => (
                                <div key={index}>
                                    <img alt="not found" width={"250px"} src={image}/>
                                    <br/>
                                    <button onClick={() => removeImage(index)} className="remove-button">Remove</button>
                                </div>
                            ))}
                            <br/>
                            <br/>
                            <input
                                type="file"
                                name="reportImages"
                                onChange={handleQ10ImageChange}
                                multiple
                            />
                            <div className = "newline-label">
                                <label>11. Your Last Name:<span className="text-danger">*</span></label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question11}
                                onChange={handleQ11InputChange}
                            />
                            <div className = "newline-label">
                                <label>12. Your First Name:<span className="text-danger">*</span></label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question12}
                                onChange={handleQ12InputChange}
                            />
                            <div className = "newline-label">
                                <label>13. Your Email Address:<span className="text-danger">*</span></label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question13}
                                onChange={handleQ13InputChange}
                            />
                            {errorQuestion13 && <div className="error-message">{errorQuestion13}</div>}
                            <div className = "newline-label">
                                <label>14. Confirm Email Address:<span className="text-danger">*</span></label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question14}
                                onChange={handleQ14InputChange}
                            />
                            {errorQuestion14 && <div className="error-message" role="alert">{errorQuestion14}</div>}
                            <div className = "newline-label">
                            <label>15. Your mailing address (optional):</label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question15}
                                onChange={handleQ15InputChange}
                            />
                            <div className = "newline-label">
                            <label>16. Your city (optional):</label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question16}
                                onChange={handleQ16InputChange}
                            />
                            <div className = "newline-label">
                            <label>17. Your state (optional):</label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question17}
                                onChange={handleQ17InputChange}
                            />
                            <div className = "newline-label">
                            <label>18. Your zip code (optional):</label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question18}
                                onChange={handleQ18InputChange}
                            />
                            <div className = "newline-label">
                            <label>19. Your phone number (with area code):<span className="text-danger">*</span></label>
                            </div>
                            <textarea
                                rows="2"
                                cols="20"
                                value={question19}
                                onChange={handleQ19InputChange}
                            />
                            
                            <button type="submit">Submit</button>
                        </Form>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </div>
    )
}
export default Dobor;
