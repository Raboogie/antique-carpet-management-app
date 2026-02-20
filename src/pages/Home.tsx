import { HomePageData } from '../lib/constants/HomePageData';
import '../Css/pages/Home.css';

const Home = () => {
	return (
		<div className="home-container">
			<section className="hero-section">
				<h1 className="hero-title">
					Timeless elegance for <br />
					<span>your modern home.</span>
				</h1>
				<p className="hero-subtitle">
					Discover our curated collection of antique and handmade rugs. 
					Each piece tells a story of craftsmanship and heritage.
				</p>
				<a href="/shop" className="cta-button">
					Explore Collection
				</a>
			</section>
			<section className="carpets-section">
				<h2 className="section-title">Featured Masterpieces</h2>
				<div className="carpets-grid">
					{HomePageData.map(({ id, title, desc, image }) => (
						<article key={id} className="carpet-card">
							<div className="carpet-image-container">
								<img src={image} alt={title} className="carpet-image" />
							</div>
							<div className="carpet-details">
								<h4 className="carpet-title">{title}</h4>
								<p className="carpet-desc">{desc}</p>
								<a href={`/product/${id}`} className="carpet-link">View Details</a>
							</div>
						</article>
					))}
				</div>
			</section>
			<section className="proof-section">
				<div className="proof-content">
					<h2 className="proof-quote">
						"The <span>finest</span> collection of antique rugs I've ever seen."
					</h2>
					<div className="proof-image-container">
						<img 
							src="/images/antique-rugs-footer.jpg" 
							alt="Gallery Interior" 
							className="proof-image"
						/>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
