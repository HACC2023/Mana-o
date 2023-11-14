<div>
  <h2 align = "center">Manaʻo: Mālama Honua </h2>
</div>

### Deployment

Please go to test-03 branch for the latest code. (Note: 11/13/2023 3:24 am)
Our code is deployed at https://malamahonua.space/

To test out a regular user (Contractor) login, you can use jane.doe@gmail.com and password is "janepass".
You can also create your own regular user by registering. However, please contact the developers (Team: Mana-o; tarynet@hawaii.edu) if you want to be approved as a new user.
All new users must be approved by existing administrators (as shown in the Registration process below) for security purposes.

To test out an Admin, you can use tarynet@hawaii.edu and password is "tarynpass".

### Table of Contents
* [About Mālama Honua](#about-mālama-honua)
* [Technologies and Motivations for their Usage](#technologies)
* [How to Use](#how-to-use)


### About Mālama Honua
Our team name is Manaʻo meaning “thought” or “idea”, as our goal is to gain insight in solving complex real-world problems through software engineering. Our application, Mālama Honua, meaning “to take care of the Earth”, is a responsive web application with multiple levels of user access, allowing for real-time updates on large marine debris reports and the seven steps it takes to dispose or repurpose the trash into useful products. It features a relational database with an easy UI for administrative access and a chat feature that allows for communication between the removal organization staff. Technologies used: React with JWT Authentication, Node.js Express, PostgreSQL, Bootstrap and socket.io for the in-app chat.
### Technologies
#### Back-end: PostgreSQL Database
* Open-source

* Underlying scripting language, allowing solving at the database level
Replaces the need for middleware that blocks requests that cause the server to halt

* Why a Relational Database?
The data involves different kinds of objects so a relational database that links these objects makes it more efficient to query the data

#### Front-end: React.js, Bootstrap, CSS, DataTables
* React.js allows for pages that are responsive and highly user-interactive
* Can make changes on the Client side without needing to re-render from the backend, leading to a more satisfying user experience
* Bootstrap: Default styling gives uniform appearance that can be customized with CSS 
* DataTables: Allows for easy filtering and sorting without needing to query database directly

#### Security: Node.js, Express.js, JWT Authentication, PL/pgSQL functions
* Node.js Express server: Can configure service to only accept requests from a particular domain
* JWT Authentication: The access tokens created prevents visiting important pages without logging in, preventing CSRF attacks. Can control which pages each type of user can access.
* When inserting into the PostgreSQL database, PL/pgSQL functions filter any text input from users to prevent SQL injection attacks
* Database is being served on a different server from the application server
* Passwords are salted and hashed

#### Chat Functionality: socket.io, WhatsApp
* Built a simple chat application using Socket.io and Express.js to allow users to converse with each other more easily.This is to fulfil the sponsor’s request for a dispatch communication tool
* Also allow for accessing WhatsApp because this is what the sponsor used to use for communications

### How To Use
The following is a walk-through guide of Mālama Honua's features.

## Landing Page
On the landing page, public users of the app will be able to view an interactive map (map is still in progress) and be able to go to an "About" page describing the app and navigate to a Login page.

 <img src="https://github.com/HACC2023/Mana-o/assets/70203199/a25abf83-edd0-43f8-a0bd-e097858d70d2" alt="Landing Page" width="250px"/>
 <img src="https://github.com/HACC2023/Mana-o/assets/70203199/9ededed9-c1bb-4b56-bda3-ef2320bb5b13" alt="About Page" width="250px" />
 <img src="https://github.com/HACC2023/Mana-o/assets/70203199/0ec573a7-30fe-4e7a-b9b7-b7f025d7f2a0" alt="Login Page" width="250px" />

## Reset Password
Users can request to reset their password. They will receive a verification code via email. They can enter in this code and are able to reset their password.

<img src="https://github.com/HACC2023/Mana-o/assets/70203199/7d2896f4-0b87-47d3-ba63-526cf454dd05" alt="Reset Password Step 1" width="250px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/8ca03ff0-3126-4d62-980d-3bca05d0912f" alt="Reset Password Step 2" width="250px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/c63f77cd-3ef9-4de7-89a5-55f72359e14d" alt="Reset Password Step 3" width="250px"/>

## Registration (Requires Admin Approval for New User Access)
Users can register as a user if they want to be able to assist with debris removal themselves (i.e. Removal/Transport Contractors and Storage Contractors).
After filling out the registration form, users must undergo an approval process. Existing administrators can log in to Mālama Honua and view unapproved users. They can choose to approve a single user or multiple users at a time.

<img src="https://github.com/HACC2023/Mana-o/assets/70203199/a15fa256-030e-4ce3-95fd-a09a31c886e7" alt="Registration" width="250px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/1437c306-63ac-4e04-affb-ea5abddcad2a" alt="Unapproved Users" width="700px"/>

## DOBOR Form: Split the Results of Form into Multiple Records
Currently, marine debris is reported and handled by the DLNR Division of Boating and Ocean Recreation [DOBOR Form](https://dlnr.hawaii.gov/dobor/reportmarinedebrishawaii/). From the sponsor's request, we replicated this form. Since this is the only existing form that is used to gather initial debris reports, we were not allowed to change the DOBOR form.
But this posed an additional challenge for us in collecting the data for measurement purposes because the DOBOR can treat multiple items as a single report.
Whereas, CMDR needs to be able to quantify the type and quantity of each debris item.

We took the DOBOR Form and kept the form number. But we generated sub-reports with unique IDs for DOBOR submissions with multiple items.
For example, if OAH_1 is a debris reporting on Oahu with 2 debris items, we take the output of OAH_1 and store the 2 items as 2 separate item reports with the OAH_1 designation.

<img src="https://github.com/HACC2023/Mana-o/assets/70203199/898449f0-ab9e-4c34-9dda-f9d07b311cab" alt="DOBOR-form" width="700px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/21278686-fb5e-476c-a269-f8ef84776edc" alt="Detections" width="700px"/>

## Admin: View All Users and Edit Roles
Admins can view all users so that they contact contrators easily via phone or the built-in message system. Additionally, Admins can make someone an Admin.

(Note: New users are automatically added as a regular user. But existing admins can assign a new user to an admin role.)

Admins can also delete users from the system.

<img src="https://github.com/HACC2023/Mana-o/assets/70203199/82755882-30b1-4468-9514-442289d3a2f4" alt="All Users" width="700px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/ba8e5291-64f0-4371-8c5c-4969cc58a36a" alt="Edit User" width="700px"/>

## Admin: View All Detection Records, Modify Existing Values and Add Missing Values
CMDR requested flexibility in being able to modify and add to their records. Administrators can view all detection records, correct mistakes in records, and add to fields that are missing values.

<img src="https://github.com/HACC2023/Mana-o/assets/70203199/21278686-fb5e-476c-a269-f8ef84776edc" alt="Detections" width="700px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/b04d7a39-d789-4c14-a731-35cd637852cf" alt="Detections Edit" width="700px"/>

## Chat: Two-person Chats and Multiple-Person Chats in Rooms
CMDR requested the ability to keep track of their chats more easily. So, we built an in-app chat system.

#### Users can choose to chat with another user (Two-person Chat).

<img src="https://github.com/HACC2023/Mana-o/assets/70203199/f1d278bd-45e9-48ce-bc97-1b0b6d23e060" alt="In App Message Options" width="700px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/6d6580b2-9f22-400c-a4e2-f03d3e43e0dd" alt="Person 1 Chat" width="700px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/d51a1c5e-3786-42ce-8f76-4333e9f0494a" alt="Person 2 Chat" width="700px" />

#### Users can also chat with multiple other users in Rooms.

<img src="https://github.com/HACC2023/Mana-o/assets/70203199/7c1c1ae6-5381-4f0b-a32a-972ccb67b3ad" alt="Room Chat" width="700px"/>

#### WhatsApp
Additionally, CMDR mentioned that they used WhatsApp previously for communicating with contractors. So, we also allow for the ability to bring up WhatsApp from our App.

<img src="https://github.com/HACC2023/Mana-o/assets/70203199/82755882-30b1-4468-9514-442289d3a2f4" alt="All Users" width="700px"/>
<img src="https://github.com/HACC2023/Mana-o/assets/70203199/a308ce8f-6230-4292-b353-5cbb9b4c3ce4" alt="WhatsApp open" width="700px"/>

