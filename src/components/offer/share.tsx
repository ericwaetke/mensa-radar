"use client"
import Image from 'next/image';
import { useState } from 'react';
import { isIOS, isMacOs } from 'react-device-detect';
import { toast } from 'react-hot-toast';

export const ShareButton = ({title, url} : {title: string, url: string}) => {
	// Get Device Type to show iOS icons or Android icons

	const share = () => {
		if(navigator.canShare) {
			navigator.share({
				title: title,
				url
			}).then(() => {

			}).catch((error) => {
				copyToClipboard();
			})
		} else {
			copyToClipboard();
		}
	}

	const copyToClipboard = () => {
		if(typeof navigator.clipboard.writeText !== "undefined") {
			navigator.clipboard.writeText(url);
			toast.success("Link zum Essen kopiert!");
		} else {
			toast.error("Link konnte nicht geteilt werden!");
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