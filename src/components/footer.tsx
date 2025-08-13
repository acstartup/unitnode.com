"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="relative z-10 bg-white text-black border-t border-black/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-10">
					{/* Left: logo + address + socials */}
					<div className="flex-1 min-w-0">
						<Link href="/" aria-label="UnitNode">
							<Image
								src="/unitnode-full.svg"
								alt="UnitNode"
								width={140}
								height={32}
								className="h-7 w-auto"
								priority
							/>
						</Link>

						<div className="mt-4 space-y-1 text-sm text-black/70">
							<div>© {new Date().getFullYear()} UnitNode</div>
							{/* Optional location line; remove if not needed */}
							{/* <div>123 Main St, City</div> */}
						</div>

						<div className="mt-4 flex items-center gap-4 text-black">
							<a
								href="https://www.linkedin.com/company/unitnode" // update URL
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
								className="hover:opacity-80 transition-opacity"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4zM8.5 8.5h3.8v1.98h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V23h-4v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.68-2.49 3.42V23h-4V8.5z" />
								</svg>
							</a>
							<a
								href="https://x.com/unitnode" // update URL
								target="_blank"
								rel="noopener noreferrer"
								aria-label="X"
								className="hover:opacity-80 transition-opacity"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M18.9 2H22l-7.7 8.8L23.2 22H16l-5-6-5.7 6H2.2l8.2-9.2L1.2 2h7l4.6 5.6L18.9 2zM16.9 20h2.1L7.2 4H5.1l11.8 16z" />
								</svg>
							</a>
						</div>
					</div>

					{/* Right: Policy column aligned to the far right */}
					<div className="w-full md:w-auto">
						<div className="grid grid-cols-1 gap-3 justify-items-start md:justify-items-end">
							<div className="text-sm font-semibold tracking-tight">Policy</div>
							<Link href="/terms" className="text-sm text-black/80 hover:text-black transition-colors">
								Terms of service
							</Link>
							<Link href="/privacy" className="text-sm text-black/80 hover:text-black transition-colors">
								Privacy policy
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}