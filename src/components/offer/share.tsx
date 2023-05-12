"use client"
import Image from 'next/image';
import { useState } from 'react';
import { isIOS, isMacOs } from 'react-device-detect';
import { toast } from 'react-hot-toast';

export const ShareButton = ({url} : {url: string}) => {
	// Get Device Type to show iOS icons or Android icons

	const share = () => {
		if(navigator.canShare) {
			navigator.share({
				title: "2",
				text: "3",
				url
			}).then(() => {

			}).catch((error) => {

			})
		} else {
			toast.error("Your browser doesn't support sharing");
			toast.error(JSON.stringify(navigator.share));
		}
	}

	return <div className='flex h-full px-4' onClick={() => share()}>
		{isIOS || isMacOs ? (
			<Image src="/icons/share/share-ios.svg" width={16} height={16} alt="Share" />
		) : (
			<Image src="/icons/share/share-android.svg" width={16} height={16} alt="Share" />
		)}
	</div>
}