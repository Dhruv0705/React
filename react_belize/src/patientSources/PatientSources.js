import tropicalBanner from './images/tropicalBanner2.png'
import belize1 from './images/belize1.jpeg'
import belize2 from './images/belize2.jpeg'

import './patientSources.css';

function PatientSources() {
  return (
    <html>
    <head>
        <title>Patient Source Tab</title>
    </head>
    <body>
        <h1>Welcome to HelpAge Belize</h1>
        <nav>
        <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Our Services</a></li>
            <li><a href="#resources">Patient Resources</a></li>
            <li><a href="#contact">Contact Us</a></li>
        </ul>
        </nav>
        <div id="resources">
        <h2>Patient Resources</h2>
        <p>Here are some resources to help you manage your health:</p>
        <ul>
            <li><a href="#">Health Conditions</a></li>
            <li><a href="#">Treatment Options</a></li>
            <li><a href="#">Self-Care Practices</a></li>
            <li><a href="#">Ask a Healthcare Professional</a></li>
            <li><a href="#">Patient Stories</a></li>
        </ul>
        </div>
    </body>
    </html>

  );
}

export default PatientSources;