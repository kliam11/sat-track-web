<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kliam11/sat-tracker-web">
    <img src="public/img/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">CanaTrak: Satellite Tracker</h3>

  <p align="center">
    A simple, web-based visualizer for Canadian satellites in Earth orbit. 
    <br />
    <br />
    <a href="https://canatrak.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/kliam11/sat-tracker-web/issues">Report Bug</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![CanaTrak Screen Shot][product-screenshot]

I have always been a huge space nerd, and I decided to take an older desktop-based satellite tracker I built in Python some time ago and rebuild
it as a web application! This application predicts and shows daily orbits of some of the 85 Canadian-operated or Canadian-supported satellites currenlty in orbit using orbital data provided by [Space-Track.org](https://www.space-track.org/). Users can see the orbital paths of satellites by using the interactive 3D globe, as well as investigate the raw parameters, which are prompty displayed in a table. From Alouette-1 to RADARSAT, the Kepler network and more, Canada's great work in space is shown here! This project began April 25th, 2022. 

### Built With

* Express.js 
* Bootstrap 
* CesiumJS 

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Should you choose to take advantage of this codebase, here is what you need to know. 

### Prerequisites

Data retrieval is performed using the following library. The [Spacetrack](https://www.npmjs.com/package/spacetrack) package, while old, is purposely built for querying Space-Track given your login information after regstering with the site: 
  ```sh
  npm install spacetrack 
  ```

Calculations are complex and mathematically intensive. Predicting vehicle orbits requires the use of the unclassified SGP4/SDP4 General Pertubations method. A package has been developed for use by JavaScript developers, called [satellite.js](https://github.com/shashwatak/satellite-js): 
  ```sh 
  npm install satellite.js 
  ```
  
To visualize satellite orbits and the globe, [CesiumJS](https://cesium.com/platform/cesiumjs/) is used on the front-end to make plots. It uses a public-client API token, which is available when signing up with Cesium Ion, and can be scope limited to a specific URL: 
```sh 
npm install cesium
  ```
  
Other general prerequisites can be viewed in the package.json folder in this repo. 

### Installation

Please clone the repo should you choose to build off this code. API tokens or keys can be acquired by visiting the sites mentioned above. It is up to you where you would like to store these assets, whether it be a config or env file. 
   ```sh
   git clone https://github.com/kliam11/sat-track-web.git
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

<!--_For more examples, please refer to the [Documentation](https://example.com)_ 
### FAQ 
Realtime? No 

view about.html page... 

-->

<p align="right">(<a href="#top">back to top</a>)</p>       



<!-- ROADMAP -->
## Roadmap

### Phase 1 (Completed May 7th)
- [x] Develop back-end for data retrieval 
    - [x] Scheduled server tasks for updating dataset for the day 
    - [x] Prepare backup data for when data retrieval fails 
- [x] Front-end display start 
    - [x] Show the date of the current dataset and if the data being used is actually a backup 
    - [x] Satellite selector 
    - [x] Orbital visualization on Cesium globe  
    - [x] TLE parsing and display in table 
    - [x] Path outlines of the orbit  
- [x] Non-LEO orbits (needs SDP4 to work) 

### Phase 2 (In progress) 
- [x] Search function 
- [x] Improve client for mobile
- [ ] Allow users to edit descriptions of a satellite 
- [x] Show all satellites, not just select one at a time 

### Phase 3 
- [ ] Dynamic PDF generation for selected satellite data ("data exports") 
- [ ] Field of View (FOV) for satellite 

### Phase 4 
- [ ] About/FAQ page 

<!-- See the [open issues](https://github.com/kliam11/sat-track-web/issues) for a full list of proposed features (and known issues). --> 

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Liam Kelly - [LinkedIn][linkedin-url]

Project Link: [https://github.com/kliam11/sat-track-web](https://github.com/kliam11/sat-track-web)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://camo.githubusercontent.com/111148992d0253f8d5e36b62087d48a9eabb1d7244b2b7316214f47d5c9a8781/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f6f74686e65696c647265772f426573742d524541444d452d54656d706c6174652e7376673f7374796c653d666f722d7468652d6261646765
[license-url]: https://github.com/kliam11/sat-tracker-web/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/liamakelly
[product-screenshot]: example.png
