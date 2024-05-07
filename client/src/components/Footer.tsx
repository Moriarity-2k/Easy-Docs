import "./Footer.css";

export default function Footer() {
	return (
		// <div className="flex-center border light-border-2 space-y-4 text-dark400_light500 mt-8 py-16 px-4 md:w-2/3 mx-auto">
		// 	<div className="md:space-y-2 max-md:space-y-4">
		// 		<div className="text-light400_light500 body-regular">
		// 			<p className="uppercase inline">©️ moriarity. </p>
		// 			<p className="inline ml-2">
		// 				This is a practise project aimed to learn
		// 			</p>
		// 			<span className="body-semibold tracking-wider mx-2 text-dark400_light500">
		// 				MERN
		// 			</span>
		// 			stack and
		// 			<span className="body-semibold mx-2 text-dark400_light500 uppercase tracking-normal">
		// 				socket io
		// 			</span>
		// 			.
		// 		</div>
		// 		<div className="font-mono tracking-tighter md:space-y-2 max-md:space-y-4 max-md:paragraph-medium">
		// 			<div className="max-sm:text-[13px]">
		// 				I am
		// 				<span className="font-semibold mx-2 capitalize">
		// 					Surya Teja
		// 				</span>
		// 			</div>
		// 			<div>
		// 				I am actively looking for SDE 1 roles and internship
		// 				opportunities . Please reach out to
		// 				<a
		// 					href="mailto:someone@example.com"
		// 					className="text-docs-blue-hover font-bold mx-2"
		// 				>
		// 					Mail:
		// 				</a>
		// 				<span className="font-poppins tracking-wide mx-2 text-dark400_light500 ">
		// 					suryatejagorle1@gmail.com
		// 				</span>
		// 				for any
		// 				<span className="font-semibold mx-2">
		// 					referrals
		// 				</span>
		// 				.
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>

		<footer className="footer">
			<div className="footer__addr">
				<h1 className="footer__logo text-orange-600 uppercase font-mono font-bold tracking-widest">
					Easy DOCS
				</h1>

				<h2>
					I've actively looking for SDE 1 role as well as Internship opportunities
				</h2>

				<address>
					<br />
					<a
						className="footer__btn"
						href="mailto:suryatejagorle1.gmail.com"
					>
						Email Us
					</a>
				</address>
			</div>

			<ul className="footer__nav">
				<li className="nav__item">
					<h2 className="nav__title">Profiles</h2>

					<ul className="nav__ul">
						<li>
							<a href="https://linkedin.com/in/surya-teja-g">LinkedIn</a>
						</li>

						<li>
							<a href="https://leetcode.com/surya_105">Leetcode</a>
						</li>

						<li>
							<a href="https://geeksforgeeks.org/user/moriarity2k">GFG</a>
						</li>
					</ul>
				</li>

				<li className="nav__item nav__item--extra">
					<h2 className="nav__title">Tech Stack Used</h2>

					<ul className="nav__ul nav__ul--extra flex flex-col">
						<li>
							<a href="#">Socket IO </a>
						</li>

						<li>
							<a href="#">ReactJS with Typescript</a>
						</li>

						<li>
							<a href="#">Mongoose ( MongoDB )</a>
						</li>

						<li>
							<a href="#">Express Js</a>
						</li>

					</ul>
				</li>

				<li className="nav__item">
					<h2 className="nav__title">Legal</h2>

					<ul className="nav__ul">
						<li>
							<a href="#">Privacy Policy</a>
						</li>

						<li>
							<a href="#">Terms of Use</a>
						</li>

						<li>
							<a href="#">Sitemap</a>
						</li>
					</ul>
				</li>
			</ul>

			<div className="legal">
				<p>&copy; 2024 comic stash. All rights reserved.</p>

				<div className="legal__links">
					<span>
						Made with <span className="heart font-bold text-lg">♥</span>
					</span>
				</div>
			</div>
		</footer>
	);
}
