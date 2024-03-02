export default function Footer() {
	return (
		<div className="flex-center border light-border-2 space-y-4 text-dark400_light500 mt-8 py-5 px-4">
			<div className="md:space-y-2 max-md:space-y-4">
				<div className="text-light400_light500 body-regular">
					<p className="uppercase inline">©️ moriarity. </p>
					<p className="inline ml-2">
						This is a practise project aimed to learn
					</p>
					<span className="body-semibold tracking-wider mx-2 text-dark400_light500">
						MERN
					</span>
					stack and
					<span className="body-semibold mx-2 text-dark400_light500 uppercase tracking-normal">
						socket io
					</span>
					.
				</div>
				<div className="font-mono tracking-tighter md:space-y-2 max-md:space-y-4 max-md:paragraph-medium">
					<div className="max-sm:text-[13px]">
						I am
						<span className="font-semibold mx-2 capitalize">
							Surya Teja
						</span>
						. I am from a tier 3 college (2022 passout). I am
						actively looking for a job ( SDE - fresher).
					</div>
					<div>
						Please reach out to
						<a
							href="mailto:someone@example.com"
							className="text-docs-blue-hover font-bold mx-2"
						>
							Mail:
						</a>
						<span className="font-poppins tracking-wide mx-2 text-dark400_light500 ">
							suryatejagorle1@gmail.com
						</span>
						for any
						<span className="font-semibold mx-2">referrals</span>.
					</div>
				</div>
			</div>
		</div>
	);
}
