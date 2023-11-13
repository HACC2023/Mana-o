import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBSidebarFooter,
} from 'cdbreact';

const Sidebar = ({ current_user_type }) => {
    const navigate = useNavigate();
    const [openBasic, setOpenBasic] = useState(false);

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <CDBSidebar textColor="#333" backgroundColor="#f0f0f0">
                <CDBSidebarHeader prefix={<i className="fa fa-bars"/>}>
                    Contrast Light Mode
                </CDBSidebarHeader>
                <CDBSidebarContent>
                    <CDBSidebarMenu>
                        <CDBSidebarMenuItem icon="home" onClick={() => navigate('/home')}>Home</CDBSidebarMenuItem>
                        {current_user_type.length > 0 && current_user_type.includes('admin') ? (
                            <div>
                            <CDBSidebarMenuItem icon="users" onClick={() => navigate('/users')}>Users</CDBSidebarMenuItem>
                            <CDBSidebarMenuItem icon="th-large" onClick={() => navigate('/unapprovedusers')}>
                                Unapproved Users
                            </CDBSidebarMenuItem>
                            </div>
                        ) : <></>}

                        <CDBSidebarMenuItem icon="file" onClick={() => navigate('/dobor')}>Dobor Form</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="file" onClick={() => navigate('/detection_removals')}>Sign-up for a Removal</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="user" onClick={() => navigate('/profile')}>profile</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="far fa-comment-dots" onClick={() => navigate('/message')}>Message</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="sticky-note">Components</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="chart-line" iconType="solid">
                            Metrics
                        </CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="user">User</CDBSidebarMenuItem>

                        <CDBSidebarMenuItem icon="envelope">Mail</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="calendar">Calendar</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="cog">Settings</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="bell">Notifications</CDBSidebarMenuItem>
                    </CDBSidebarMenu>
                </CDBSidebarContent>
                <CDBSidebarFooter style={{textAlign: 'center'}}>
                    <div
                        className="sidebar-btn-wrapper"
                        style={{padding: '20px 5px'}}
                    >
                        Logout
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
};

export default Sidebar;
