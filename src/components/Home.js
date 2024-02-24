import React from 'react'
import {useState, useEffect} from 'react'
import axios from "axios";


const Home = () => {
    const [planets, setPlanets] = useState([]);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [residents, setResidents] = useState([]);

    useEffect(()=>{
        async function fetchPlanets(){
            try {
                const response = await axios.get('https://swapi.dev/api/planets/?format=json')
                setPlanets(response.data.results)
            } catch (error) {
                console.error("Error loading planets:", error)
            }
        }
        fetchPlanets()
    }, [])

    async function fetchResidents(residentUrls){
        const residentPromises = residentUrls.map(url => axios.get(url))
        try {
            const responses = await Promise.all(residentPromises);
            const residentData = responses.map(response => response.data);
            setResidents(residentData);
          } catch (error) {
            console.error('Error fetching residents:', error);
          }
    }
    async function handleResidentClick(residentUrl) {
      try {
        const response = await axios.get(residentUrl);
        const residentData = response.data;
        console.log('Resident data:', residentData);
        const { name, gender, birth_year } = residentData;
      // Updating the UI with the resident data
      alert(`Name: ${name}\nGender: ${gender}\nBirth Year: ${birth_year}`);
      } catch (error) {
        console.error('Error fetching resident data:', error);
      }
    }
    async function handlePlanetClick(planet) {
        setSelectedPlanet(planet);
        if (planet.residents.length > 0) {
          fetchResidents(planet.residents);
        }
      }
  return (
    <div className='box'>
    <h1>Star Wars Planets</h1>
      <div className="planets-list">
        {planets.map(planet => (
          <div
            key={planet.name}
            onClick={() => handlePlanetClick(planet)}
            className="planet-card"
          >
            {planet.name}
          </div>
        ))}
      </div>
      {selectedPlanet && (
        <div className="planet-details">
          <h2>{selectedPlanet.name}</h2>
          <p>Climate: {selectedPlanet.climate}</p>
          <p>Terrain: {selectedPlanet.terrain}</p>
          <p>Population: {selectedPlanet.population}</p>
          {residents.length > 0 && (
            <div className='residents-data'>
              <h3>Notable Residents:</h3>
              <ul className='residents-list'>
                {residents.map(resident => (
                  <li className='name-list' key={resident.name} onClick={() => handleResidentClick(resident.url)}>
                    <h4>Name:{resident.name}</h4>
                    <p>Height:{resident.height} </p>
                    <p>Color: {resident.skin_color}</p>
                    <p>Gender: {resident.gender}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home