import { HomePageData } from '../lib/constants/HomePageData';
import '../Css/pages/Home.css';

const Home = () => {
	return (
		<>
			<section className="homepage-banner"></section>
			<section>
				<div className="homepage-greetings">
					<p>
						Chaman Antique Rugs is in its 2nd Generation of business
						in the wholesale and trade Handmade Oriental Rug
						Industry. With over 30 years experience in this field, a
						of team of World renowned experts, specialist and
						carpets consultants are confident that they can assist
						you in selecting the perfect piece. Moreover, Mr.
						Daryoosh Chaman is a Certified Rug Appraiser with the
						Oriental Rug Retailers Association. You can visit
						www.orrainc.com for more details. Omid Chaman has joined
						the team for more than a decade. He has taken the
						business to the next level with technology, digital
						skills, advertisement and a special eye for color in and
						Oriental Rug. Omid has both the knowledge and the
						experience of an international carpet consultant in New
						and Antique Rugs. Our gallery features an eclectic array
						of antique, semi-antique, new rugs, early 17th - 19th
						century tapestries, exemplary room-size carpets and
						collector pieces. All available to decorate any room
						imaginable.
					</p>
				</div>
			</section>
			<section className="display-images">
				<div className="display-images-cards">
					{HomePageData.map(({ id, title, desc, image }) => (
						<article key={id}>
							<img src={image} alt={title} />
							<h4>{title}</h4>
							<p>{desc}</p>
						</article>
					))}
				</div>
			</section>
		</>
	);
};

export default Home;
