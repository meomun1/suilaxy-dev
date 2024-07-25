import './MobileSite.css'

export const MobileSite = () => {
	return (
		<div className="mobile-container">
			{/* Top Section */}
			<div className="mobile-top"></div>

			{/* Middle Section */}
			<div className="mobile-middle">
				<div className="special-text">
					<h1>SUILAXY</h1>
				</div>
				<a href="#" className="animated-button">
					Visit us on desktop <img src="/desktop-icon.svg" alt="desktop icon" />
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</a>
				<h1 className="middle-barcode">this is suilaxy</h1>
			</div>

			{/* Bottom Section */}
			<div className="mobile-bottom">
				<div className="telegram">
					<a href="https://t.me/+ztRgoqUMLA9lMDQ1">
						<img src="/logo-tele.svg" alt="logo telegram" />
					</a>
				</div>

				<div className="x">
					<a href="https://x.com/suilaxy_game">
						<img src="/logo-x.svg" alt="logo x" />
					</a>
				</div>

				<div className="gitbook">
					<a href="https://suilaxy.gitbook.io/suilaxy">
						<img src="/logo-gitbook.svg" alt="logo gitbook" />
					</a>
				</div>
			</div>
		</div>
	)
}
