import { useEffect, useState } from "react";

import 'tailwindcss/tailwind.css'

import clientPromise from '../lib/mongodb'

async function run() {
  try {
    await client.connect();
    // database and collection code goes here
    // find code goes here
    // iterate code goes here
    const db = client.db("fhp");
    const coll = db.collection("202224");

    const docs = [

        {name: "Halley's Comet", officialName: "1P/Halley", orbitalPeriod: 75, radius: 3.4175, mass: 2.2e14},
  
        {name: "Wild2", officialName: "81P/Wild", orbitalPeriod: 6.41, radius: 1.5534, mass: 2.3e13},
  
        {name: "Comet Hyakutake", officialName: "C/1996 B2", orbitalPeriod: 17000, radius: 0.77671, mass: 8.8e12}
  
      ];
  
      const result = await coll.insertMany(docs);
      console.log(result)

    const cursor = coll.find();
    await cursor.forEach(console.log);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

export default function Home(props) {
  const d = new Date();
  const currentTime = d.getHours() + d.getMinutes()/60
  const currentDay = d.getDay()

  const [mensen, setMensen] = useState([])
  const [locationPermission, setLocationPermission] = useState(false)

  
  return (
    <div className="mx-5 mt-12 space-y-6 lg:w-1/2">
      
    </div>
  );
}

export async function getServerSideProps(context) {
    try {
        const client = await clientPromise;
        const db = client.db("guckstDuEssen");

        const coll = db.collection("fhp");
    
        const result = await coll.insertMany(docs);
        console.log(result)

        const cursor = coll.find();
        await cursor.forEach(console.log);

    } catch (e) {
      console.error(e)
    }
  }


//uZrVCQIyDmO1DD0l