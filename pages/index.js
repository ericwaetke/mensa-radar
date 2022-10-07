import { useEffect, useState } from "react";

import Head from "next/head";
import Link from 'next/link'

import Footer from "../components/footer";

export const mensaData = [
  {
    name: "Golm",
    url: "golm",
    coords: {
      latitude: 52.40795670687466, 
      longitude: 12.978685326538164
    },
    opening: 11,
    closing: 14.5
  },
  {
    name: "Neues Palais",
    url: "neues-palais",
    coords: {
      latitude: 52.402868541881624, 
      longitude: 13.011995232289776
    },
    opening: 11,
    closing: 14.5
  },
  {
    name: "FHP",
    url: "fhp",
    coords: {
      latitude: 52.41324028310374, 
      longitude: 13.051182387706824 
    },
    opening: 11,
    closing: 14.5
  },
  {
    name: "Brandenburg an der Havel",
    url: "brandenburg",
    coords: {
      latitude: 52.41159566949572,
      longitude: 12.539779153390663
    },
    opening: 11,
    closing: 14
  },
  {
    name: "Filmuniversität",
    url: "filmuniversitaet",
    coords: {
      latitude: 52.38889031847045, 
      longitude: 13.116692300009127
    },
    opening: 11,
    closing: 14.5
  },
  {
    name: "Griebnitzsee",
    url: "griebnitzsee",
    coords: {
      latitude: 52.393549668399444, 
      longitude: 13.12775872728105
    },
    opening: 11,
    // TODO: Freitag nur bis 14 Uhr
    closing: 14.5
  },
  {
    name: "Wildau",
    url: "wildau",
    coords: {
      latitude: 52.31913645920946, 
      longitude: 13.632358896246892
    },
    opening: 8,
    closing: 15
  }
]

export default function Home(props) {
  const d = new Date();
  const currentTime = d.getHours() + d.getMinutes()/60
  const currentDay = d.getDay()

  const [mensen, setMensen] = useState([])
  const [locationPermission, setLocationPermission] = useState(false)

  const getLocation = () => {
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      const earthRadius = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2-lat1);
      const dLon = deg2rad(lon2-lon1);
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  
      return earthRadius * c;
    }
    
    const deg2rad = (deg) => deg * (Math.PI/180)
    
    const success = (data) => {
      setLocationPermission(true)
      // User Coords
      const {latitude, longitude} = data.coords

      let tempMensen = []
      mensaData.map((mensa) => {
        const distance = getDistanceFromLatLonInKm(latitude, longitude, mensa.coords.latitude, mensa.coords.longitude)
        tempMensen.push({
          ...mensa,
          distance: Math.round(distance * 10) / 10
        })
      })

      // Sorting Mensas from closest to furthest
      tempMensen.sort((firstItem, secondItem) => firstItem.distance - secondItem.distance)
      
      // Setting the State so the data gets updated
      setMensen(tempMensen)
    }

    if(!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, (e) => console.log(e));
    }
  }

  useEffect(() => {
    // TODO: Check if user wants to give location data

    getLocation()
    setMensen(mensaData)
  }, [])


  return (
    <div className="mx-5 mt-12 space-y-6 lg:w-1/2 lg:mx-auto">
      <Head>
        <title>Mensa Radar — Mensen Potsdam</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="font-display text-4xl mt-5">
          Mensa Radar
        </h1>

        <h2 className="font-display text-xl mt-16 mb-8">Mensen</h2>
        <div className="space-y-2 flex flex-col divide-y-2 border-y-2 divide-main-black/20 bg-green-3 rounded-xl bg-background-container
        ">
          {
            mensen.map(mensa => {
              return <Link href={'/mensa/'+mensa.url}>
                      <a className="flex flex-initial py-4 justify-between px-4">
                        <h3 className="text-xl font-normal flex self-center">{mensa.name}</h3>
                        <div className="space-x-4">
                          {
                            // Checking if current time is between opening times and the day is between monday and friday
                            mensa.opening < currentTime && mensa.closing > currentTime && currentDay > 0 && currentDay < 6 ? <>
                            <div className="font-medium bg-green-3 py-1.5 px-4 rounded-full inline-flex items-center gap-2">
                              <span className="bg-green-2 w-2 h-2 rounded-full"></span>
                              offen
                            </div>
                            </> : null
                          }
                          {
                            // Display Distance if Location Permissions are granted
                            locationPermission ? <>
                            <span className="bg-main-white py-1.5 px-4 boder rounded-full inline-flex text-green-w7 items-center gap-2">
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.75781 6.05078L5.23926 6.06055C5.2653 6.06055 5.27995 6.06217 5.2832 6.06543C5.28971 6.06543 5.29297 6.08008 5.29297 6.10937L5.29785 9.57617C5.29785 9.77799 5.3418 9.94727 5.42969 10.084C5.52083 10.2207 5.63802 10.32 5.78125 10.3818C5.92448 10.4469 6.07585 10.4714 6.23535 10.4551C6.39811 10.4421 6.55111 10.3851 6.69434 10.2842C6.83757 10.1833 6.95313 10.0368 7.04102 9.84473L10.6201 2.04687C10.7373 1.78646 10.7812 1.55208 10.752 1.34375C10.7259 1.13216 10.6445 0.961263 10.5078 0.831055C10.3711 0.700846 10.1969 0.624349 9.98535 0.601562C9.77376 0.578776 9.53939 0.625977 9.28223 0.743164L1.45996 4.32227C1.27441 4.4069 1.13281 4.51921 1.03516 4.65918C0.940755 4.79915 0.885417 4.94889 0.869141 5.1084C0.85612 5.2679 0.882161 5.41927 0.947266 5.5625C1.01237 5.70573 1.11165 5.82292 1.24512 5.91406C1.38184 6.00521 1.55273 6.05078 1.75781 6.05078Z" fill="black"/>
                              </svg>

                              <span>{mensa.distance}km</span>
                            </span>
                            </> : null
                          }
                        </div>
                      </a>
                    </Link>
            })
          }
        </div>
      </main>
          <Footer />
    </div>
  );
}
