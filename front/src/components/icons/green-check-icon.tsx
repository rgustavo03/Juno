
interface size {
	height: string;
}

export const GreenCheck = (props: size) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" height={props.height} viewBox="0 0 256 256" xmlSpace="preserve">
			<defs></defs>
			<g style={{ stroke: 'none', strokeWidth: '0', strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: '10', fill: 'none', fillRule: 'nonzero', opacity: '1' }} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
				<path d="M 32 77 c -1.536 0 -3.071 -0.586 -4.243 -1.758 l -26 -26 c -2.343 -2.343 -2.343 -6.142 0 -8.485 c 2.343 -2.343 6.143 -2.343 8.485 0 L 32 62.515 l 47.758 -47.757 c 2.342 -2.343 6.143 -2.343 8.484 0 c 2.344 2.343 2.344 6.142 0 8.485 l -52 52 C 35.071 76.414 33.536 77 32 77 z" style={{ stroke: 'none', strokeWidth: '1', strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: '10', fill: 'rgb(77,191,71)', fillRule: 'nonzero', opacity: '1' }} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
			</g>
		</svg>
	)
}
