import React, {useState, useEffect} from "react";
import Form from "react-validation/build/form";
import {Container} from "react-bootstrap";
import './Dobor.css';

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

    const [question6, setQuestion6] = useState({
        selectedIsland:""
    })

    const [errorQuestion1, setErrorQuestion1] = useState(null);
    const [errorQuestion5, setErrorQuestion5] = useState(null);
    const [errorQuestion6, setErrorQuestion6] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleQ1CheckboxChange = (event) => {
        const {name, checked} = event.target;
        if (name === 'other' && !checked) {
            setQuestion1((prevQuestion1) => ({
                ...prevQuestion1,
                debrisFound: prevQuestion1.debrisFound.filter((item) => item !== name),
                otherDebris:'N/A'
            }));
        }
        else {
            const updatedDebrisFound = checked
            ?[...question1.debrisFound, name]
            : question1.debrisFound.filter((item) =>item !== name);

            const otherDebris = updatedDebrisFound.includes('Other - describe below')
            ? question1.otherDebris
            : 'N/A';

            setQuestion1((prevQuestion1) => ({
                ...prevQuestion1,
                debrisFound:updatedDebrisFound,
                otherDebris
            }));

        }
        
    };

    const handleQ1OtherDescriptionChange = (event) => {
        setQuestion1((prevQuestion1) => ({
            ...prevQuestion1,
            otherDebris: event.target.value
        }));
    };
    useEffect(() => {
       if(!question1.debrisFound.includes(debrisTypeOptions[2])) {
        setQuestion2({selectedOption: containerOptions[0]});
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
            locationOffshore: value !== "other" ? "N/A" : ""
        }));
 
    }
    useEffect(() => {
        if(question5.selectedOption === locationOptions[5]) {
            setQuestion6({selectedIsland:island[0]});
        }
        else {
            setQuestion6({selectedIsland:""});
        }
    }, [question5.selectedOption]);

    const handleQ6SelectChange = (event) => {
        setQuestion6({selectedIsland: event.target.value});
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (question1.debrisFound.length === 0 && question1.otherDebris.trim() === "") {
            setErrorQuestion1("Please select at least one option or describe in 'Other'");
        }
        else {
            setErrorQuestion1(null);
        }
        if(!question2.selectedOption) {
            setQuestion2({selectedOption: containerOptions[0]});
        }
        
        if(!question5.selectedOption) {
            setErrorQuestion5("Location field is required");
        }
        else {
            setErrorQuestion5(null);
        }
        if (!question6.selectedIsland) {
            setErrorQuestion6("Must indicate which Hawaiian island");
        }
        else {
            setErrorQuestion6(null);
        }
        console.log('Question 1 - Debris Types:', question1.debrisFound);
        console.log('Question 1 - Other Debris:', question1.otherDebris);
        console.log('Question 2 - Container:', question2.selectedOption);
        console.log('Question 3 - Boat:', question3.selectedOption);
        console.log('Question 4 - Marine Growth:', question4.foulingLevel);
        console.log('Question 5 - Location Onshore:', question5.locationOnshore);
        console.log('Question 5 - Location Offshore:', question5.locationOffshore);
        console.log('Question 6 - Island:', question6.selectedIsland);
        
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
        "Full",
        "Multiple empty containers",
        "Multiple partially filled containers",
        "Multiple full containers"
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
        "At sea, BEYOND three miles from nearest land",
        "At sea, WITHIN three miles from nearest land",
        "In the shore break",
        "On the beach BELOW the high wash of the waves",
        "On the beach ABOVE the high wash of the waves",
        "None of the above, a description follows below"
    ]
    const island = [
        "Offshore",
        "Big Island",
        "Kauai",
        "Lanai",
        "Maui",
        "Molokai",
        "Oahu"
    ]
    return(
        <div className = "dobor">
            <div className = "responsive">
                <Container className = "py-3">
                    <div className = "card">
                        <Form onSubmit = {handleSubmit}>
                            <div className="newline-label">
                                <label>1. I found/located the following:</label>
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
                            {!question4.foulingLevel && (
                                <div className="alert alert-danger" role="alert">Please select a biofouling level.</div>
                            )}
                            <div className="newline-label">
                                <label>
                                    5. This debris is located:
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
                                        />
                                        {option}
                                    </label>
                                    {option === "None of the above, a description follows below" && (
                                        <p>
                                            If located offshore, enter latitude and longitude (i.e. 21.3161
                                            -157.8906) or provide a position description and any information on currents
                                            and winds that could help in relocating the debris.
                                        </p>
                                    )}
                                </div>
                            ))}
                            {question5.selectedOption === 'None of the above, a description follows below' && (
                                <textarea
                                    rows="10"
                                    cols="20"
                                    value={question5.locationOffshore}
                                    onChange={(event) => {
                                        setQuestion5({
                                            ...question5,
                                            locationOffshore:event.target.value
                                        });
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
                                <label>
                                    6. If on land or in the nearshore waters - indicate which island
                                </label>
                            </div>
                            <div className="newline-label">
                                <select
                                    id="question-6"
                                    name="question-6"
                                    value={question6.selectedIsland}
                                    onChange={handleQ6SelectChange}
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
                            {errorQuestion6 && <div className="alert alert-danger" role="alert">{errorQuestion6}</div>}
                            <button type="submit">Submit</button>
                        </Form>
                    </div>
                </Container>
            </div>
        </div>
    )
}
export default Dobor;
