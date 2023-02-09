import { useState, useEffect, useRef } from "react";

const useScrollPosition = (offset: number) => {
	const [scrollPosition, setScrollPosition] = useState(0);
	const prevScrollPosition = useRef(scrollPosition - 1);

	useEffect(() => {
		const updatePosition = () => {
			const tempScrollPosition = window.pageYOffset;
			setScrollPosition(tempScrollPosition);
			
			if (tempScrollPosition > prevScrollPosition.current) {
				prevScrollPosition.current = tempScrollPosition;
			} else {
				prevScrollPosition.current = tempScrollPosition + 1;
			}
		}
		window.addEventListener("scroll", updatePosition);
		updatePosition();
		return () => {
			window.removeEventListener("scroll", updatePosition);
		}
	}, []);

	const isScrollingUp = scrollPosition < prevScrollPosition.current;
	return isScrollingUp || scrollPosition < offset;
};

export default useScrollPosition;