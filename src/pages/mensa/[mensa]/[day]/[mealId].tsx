/* eslint-disable react-hooks/exhaustive-deps */
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { supabase } from "../../../../lib/getSupabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const meal: FoodOffering = await supabase.from("food_offerings").select("*").eq("id", context.params.mealId).single().then((res) => res.data as FoodOffering);
	return {
		props: {
			meal
		}
	}
};

export default function SharedMeal ({meal}: {meal: FoodOffering}) {
	const router = useRouter()
	const { mensa, day } = router.query !== undefined ? router.query : { mensa: "Mensa not Found", day: "freitag" };

	useEffect(() => {
		router.push(`/mensa/${mensa}/${day}`)
	}, [])

	const foodType = meal.vegetarian ? "Vegetarisch" : meal.vegan ? "Vegan" : meal.fish ? "Fischhaltig" : "Fleischhaltig"

	return <>
		<Head>
			<title>{meal.food_title} - Mensa Radar</title>
			<meta property="twitter:domain" content="mensa-radar.de" />
			<meta property="og:url" content={`https://mensa-radar.de/mensa/${mensa}/${day}`} /> :
			<meta property="twitter:url" content={`https://mensa-radar.de/mensa/${mensa}/${day}`} />
			<meta property="og:image" content={`${process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://mensa-radar.de/"}api/og/singleMeal?id=${meal.id}`} />
			<meta name="twitter:image" content={`${process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://mensa-radar.de/"}api/og/singleMeal?id=${meal.id}`} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta property="og:image:alt" content={`${meal.food_title}`} />
			<meta property="og:image:type" content="image/png" />
			<meta property="og:title" content={`${meal.food_title}`} />
			<meta name="twitter:title" content={`${meal.food_title}`} />
			<meta property="og:site_name" content="Mensa Radar" />
			<meta property="og:description" content={`${foodType} - Essen vom ${meal.date} in der Mensa ${meal.mensa}!`} />
			<meta name="twitter:description" content={`${foodType} - Essen vom ${meal.date} in der Mensa ${meal.mensa}!`} />
			<meta property="og:type" content="website" />

		</Head>
	</>
}