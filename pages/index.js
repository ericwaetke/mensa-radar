import { useEffect, useState } from "react";

import Head from "next/head";
import Link from 'next/link'

import 'tailwindcss/tailwind.css'
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
    <div className="mx-5 mt-12 space-y-6 lg:w-1/2">
      <Head>
        <title>Guckst du Essen — Mensen Potsdam</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="font-display text-4xl mt-5">
          Guckst du Essen
        </h1>
        <p className="mt-3">Die (etwas bessere) Mensa Übersicht für Potsdam</p>

        <h2 className="font-display text-xl mt-16 mb-8">Mensen</h2>
        <div className="space-y-2 flex flex-col divide-y-2 divide-green-border border-y-2 border-green-border bg-green-3 rounded-xl">
          {
            mensen.map(mensa => {
              return <Link href={'/'+mensa.url}>
                      <a className="flex flex-initial py-4 justify-between px-4">
                        <h3 className="text-xl font-bold flex self-center">{mensa.name}</h3>
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
                            <span className="bg-white py-1.5 px-4 boder rounded-full inline-flex text-green-w7">
                              {mensa.distance}km
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
