"use client";

import { useState, FormEvent } from "react";
import { Navbar } from "@/components/navbar";

export default function ContactPage() {
    const [issueType, setIssueType] = useState("Membership and payment issue");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");

    const isDisabled = description.trim().length === 0 || email.trim().length === 0;

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        // No backend wiring yet
    }

    return (
        <div className="relative z-10 min-h-screen bg-white">
            <Navbar />

            <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">Feedback</h1>

                {/* Card */}
                <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
                    <form onSubmit={onSubmit} className="p-5 sm:p-7 md:p-8">
                        {/* Issue type */}
                        <label className="block text-sm font-semibold text-black mb-2">Issue type</label>
                        <div className="relative mb-6">
                            <select
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                className="w-full appearance-none rounded-md border border-black/10 bg-black/[0.02] px-3.5 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                            >
                                <option>Feature request</option>
                                <option>Issue report</option>
                                <option>Phone number verification</option>
                                <option>Membership and payment issue</option>
                                <option>Account issue</option>
                                <option>Cannot be shared publicly</option>
                                <option>Other</option>
                            </select>
                            {/* Chevron */}
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-black/50"
                            >
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Issue description */}
                        <label className="block text-sm font-semibold text-black mb-2">Issue description</label>
                        <div className="mb-6">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={8}
                                placeholder="Please tell us what you were trying to do, what unexpected behavior you noticed, and whether you saw any error messages along the way."
                                className="w-full resize-y rounded-md border border-black/10 bg-black/[0.02] px-3.5 py-3 text-sm text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
                            />

                            {/* Attachment tile */}
                            <div className="mt-4 inline-flex items-center justify-center rounded-md border border-dashed border-black/20 bg-black/[0.02] w-24 h-16">
                                <div className="flex items-center justify-center w-8 h-8 rounded-md border border-black/10 bg-white text-black/60">+</div>
                            </div>
                        </div>

                        {/* Email */}
                        <label className="block text-sm font-semibold text-black mb-2">Your email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mb-6 w-full rounded-md border border-black/10 bg-black/[0.02] px-3.5 py-3 text-sm text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isDisabled}
                            className="inline-flex items-center justify-center rounded-md bg-black text-white text-sm font-medium px-5 py-2.5 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}



