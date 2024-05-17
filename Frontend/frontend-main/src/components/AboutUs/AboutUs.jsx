import React from 'react';
import './AboutUs.css'; 
import aniImage from '../../Assets/ani.png'; 
import karanImage from '../../Assets/karan.jpeg';
import lalithImage from '../../Assets/lalith.jpeg';
import sachinImage from '../../Assets/sachin.png';
import govardhanImage from '../../Assets/gopi.jpeg';
import praddyImage from '../../Assets/praddy.png';

const teamMembers = [

  {
    name: "Govardhan NM",
    team: "Frontend/Devops",
    email: "ngovardhan566@gmail.com ",
    linkedin: "https://www.linkedin.com/in/govardhan-murthy",
    image: govardhanImage
  },
  {
    name: "Sachin Rathod",
    team: "Backend/Devops",
    email: "sara6215@colorado.edu ",
    linkedin: "https://www.linkedin.com/in/sachin097",
    image: sachinImage
  },
  {
    name: "Pradyumna C",
    team: "Frontend",
    email: "prch4538@colorado.edu",
    linkedin: "https://www.linkedin.com/in/pradyumna-c-a652b117a/",
    image: praddyImage
  },
  {
    name: "Karan Bantia R",
    team: "Backend",
    email: "Karan.bantiar@colorado.edu",
    linkedin: "https://www.linkedin.com/in/karanbantia/",
    image: karanImage
  },

  {
    name: "Anirudh K",
    team: "Backend",
    email: "anka5129@colorado.edu",
    linkedin: "https://www.linkedin.com/in/anirudhkalghatkar",
    image: aniImage
  },
  {
    name: "Lalith Sai Reddy",
    team: "Data/Design",
    email: "laka2272@colorado.edu",
    linkedin: "https://www.linkedin.com/in/lalithsaireddy-k",
    image: lalithImage
  }
];

const AboutUs = () => {
    return (
      <div className="about-us-wrapper">
        <div className="team-container">
          <h1>Our Team</h1>
          <div className="row">
            {teamMembers.map((member, index) => (
              <div key={member.email} className="team-member">
                <img src={member.image} alt={member.name} />
                <h2>{member.name}</h2>
                <p>{member.team} Team</p>
                <p>Email: <a href={`mailto:${member.email}`}>{member.email}</a></p>
                <p>LinkedIn: <a href={member.linkedin} target="_blank" rel="noopener noreferrer">View Profile</a></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default AboutUs;