import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap'

export const Checkbox = ({ isChecked, label, checkHandler, index }) => {

   return(
      <div>
         <input
            type="checkbox"
            id={`checkbox-${index}`}
            checked={isChecked}
            onChange={checkHandler}
         />
      </div>
   );
}

const ApproveUsers = () => {
    const [users,setUsers] = useState([]);
    const [selectedUsers,setSelectedUsers] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/unapprovedusers")
            .then((res) => res.json())
            .then((data) => setUsers(data));
    }, [JSON.stringify(users)]);
    users.map((user) => {
        user.checked = false;
    });
    
    const updateCheckboxStatus = (index) => {
        const updatedUsers = [...users];
        updatedUsers[index] = {...updatedUsers[index], checked: !updatedUsers[index].checked};
        setUsers(updatedUsers);
    };
    
    return (
        <div>
        <Container>
        <div>
            <table id="table">
                <thead>
                <tr>
                    <th>First Name</th><th>Last Name</th><th>email</th>
                    <th>Company</th><th>Approve?</th>
                </tr>
                </thead>
                <tbody>
                {
                    users.map((user, index) => (
                        <tr key={user.id}>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.company}</td>
                        <th>
                            <Checkbox
                                key={user.id}
                                isChecked={user.checked}
                                checkHandler={() => updateCheckboxStatus(index)}
                                label={user.id}
                                index={index}
                            />
                        </th>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
        </Container>
        </div>
    );
};

export default ApproveUsers;

