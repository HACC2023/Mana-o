import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger custom-alert" role="alert">
          Required field!
        </div>
      );
    }
};
const [isChecked, setIsChecked] = useState(false);

const Dobor = () =>{
    const [debrisFound, setDebrisFound] = useState([]);

    const onCheckboxChange = (event) => {
        const {name, checked} = event.target;
        if (checked) {
            setDebrisFound([...foundItems, name]);
        }
        else {
            setDebrisFound()
        }
    }
    return(
        <div className = "dobor">
            <div className = "responsive">
                <Container className = "py-3">
                    <div className = "card">
                        
                    </div>
                </Container>
            </div>
        </div>
    )
}
export default Dobor;
