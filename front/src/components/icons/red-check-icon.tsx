
interface size {
	height: string;
}

export const RedCheck = (props: size) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" height={props.height} viewBox="0 0 256 256" xmlSpace="preserve">
			<defs></defs>
			<g style={{ stroke: 'none', strokeWidth: '0', strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: '10', fill: 'none', fillRule: 'nonzero', opacity: '1' }} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
				<path d="M 7 90 c -1.792 0 -3.583 -0.684 -4.95 -2.05 c -2.734 -2.734 -2.734 -7.166 0 -9.9 l 76 -76 c 2.734 -2.733 7.166 -2.733 9.9 0 c 2.733 2.733 2.733 7.166 0 9.899 l -76 76 C 10.583 89.316 8.792 90 7 90 z"   style={{stroke: 'none', strokeWidth: '1', strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: '10', fill: 'rgb(236,0,0)', fillRule: 'nonzero', opacity: '1'}}   transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
				<path d="M 83 90 c -1.791 0 -3.583 -0.684 -4.95 -2.05 l -76 -76 c -2.734 -2.733 -2.734 -7.166 0 -9.899 c 2.733 -2.733 7.166 -2.733 9.899 0 l 76 76 c 2.733 2.734 2.733 7.166 0 9.9 C 86.583 89.316 84.791 90 83 90 z"  style={{stroke: 'none', strokeWidth: '1', strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: '10', fill: 'rgb(236,0,0)', fillRule: 'nonzero', opacity: '1'}}   transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
			</g>
		</svg>
	)
}
