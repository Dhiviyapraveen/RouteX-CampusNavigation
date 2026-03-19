# Smart Campus Navigation System-RouteX

## Overview

The **Smart Campus Navigation System** is a web-based application that helps students, staff, and visitors easily navigate a college campus. Large campuses can be confusing for new users, so this system provides an interactive digital map with location markers and simple navigation between buildings.

The application displays campus locations on an interactive map and allows users to search for places and view routes between them.

## Problem Statement

Large educational campuses often lack a centralized digital navigation system. New students and visitors struggle to locate important facilities such as libraries, departments, hostels, and cafeterias.

This project aims to solve this problem by creating an easy-to-use campus navigation platform.

## Features

* Interactive campus map
* Location markers for important buildings
* Search functionality for campus locations
* Simple route visualization between two locations
* Responsive user interface

## Tech Stack

### Frontend

* React
* React Leaflet
* Leaflet
* HTML5
* CSS3
* JavaScript

### Map Provider

* OpenStreetMap

## Project Structure

campus-navigation
│
├── public
│
├── src
│   ├── components
│   │   ├── MapView.js
│   │   ├── SearchBar.js
│   │   └── LocationList.js
│   │
│   ├── data
│   │   └── locations.js
│   │
│   ├── App.js
│   ├── index.js
│   └── App.css
│
└── README.md

## Installation

1. Clone the repository

git clone https://github.com/your-username/campus-navigation.git

2. Navigate to the project folder

cd campus-navigation

3. Install dependencies

npm install

4. Start the development server

npm run dev

## How It Works

1. The application loads an interactive map.
2. Campus locations are stored as coordinates.
3. Markers are displayed for each location.
4. Users can click a marker to view location details.
5. Users can select two locations to visualize a route.



## Future Improvements

* Indoor navigation support
* Real-time user location tracking
* Voice-based navigation
* Admin panel for adding campus locations
* AI chatbot for campus queries


## Use Case

* New students finding classrooms
* Visitors locating campus facilities
* Staff navigating large campuses


## License
Frontend (deployed): https://route-x-campus-navigation.vercel.app
Backend (deployed): https://routex-campusnavigation.onrender.com

This project is developed for educational and hackathon purposes.




