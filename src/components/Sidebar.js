import React from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBSidebarFooter,
} from 'cdbreact';

const Sidebar = () => {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <CDBSidebar textColor="#333" backgroundColor="#f0f0f0">
                <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
                    Contrast Light Mode
                </CDBSidebarHeader>
                <CDBSidebarContent>
                    <CDBSidebarMenu>
                        <CDBSidebarMenuItem icon="th-large">Dashboard</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="sticky-note">Components</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="chart-line" iconType="solid">
                            Metrics
                        </CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="user">User</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="envelope">Mail</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="calendar">Calendar</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="cog">Settings</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="bell">Notifications</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="file">File</CDBSidebarMenuItem>
                    </CDBSidebarMenu>
                </CDBSidebarContent>
                <CDBSidebarFooter style={{ textAlign: 'center' }}>
                    <div
                        className="sidebar-btn-wrapper"
                        style={{ padding: '20px 5px' }}
                    >
                        Sidebar Footer
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
};

export default Sidebar;
