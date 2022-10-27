'use client';
import { useEffect, useState } from "react";

export const DistanceToMensa = ({mensaLat, mensaLong}: {mensaLat: number, mensaLong}) => {
	const [locationPermission, setLocationPermission] = useState(false)

	const [distance, setDistance] = useState(0);

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
			const distance = getDistanceFromLatLonInKm(latitude, longitude, mensaLat, mensaLong)
			setDistance(Math.round(distance * 10) / 10)
		}
		
		if(!navigator.geolocation) {
			console.error('Geolocation is not supported by your browser');
			setLocationPermission(false)
			
		} else {
			navigator.geolocation.getCurrentPosition(success, (e) => console.log(e));
			setLocationPermission(true);
		}
	}

	useEffect(() => {
		getLocation()
	}, [])

	if(locationPermission) {
		return (
			<span className="bg-main-white py-0 rounded-full inline-flex text-green-w7 px-3 gap-2 m-auto">
				<img src="location.svg"></img><span> { distance }km</span>		
			</span>
		)
	} else {
		return (<></>)
	}
}