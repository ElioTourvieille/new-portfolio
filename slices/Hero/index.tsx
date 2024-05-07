"use client"

import {Content, KeyTextField} from "@prismicio/client";
import {SliceComponentProps} from "@prismicio/react";
import { gsap } from "gsap";
import React, {useEffect, useRef} from "react";
import Bounded from "@/components/Bounded";
import Shapes from "@/slices/Hero/Shapes";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({slice}: HeroProps): JSX.Element => {
    const component = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline()

            tl.fromTo(".name-animation", {
                    x: -100,
                    opacity: 0,
                    rotate: -10
                },
                {
                    x: 0,
                    opacity: 1,
                    rotate: 0,
                    ease: "elastic.out(1, 0.3)",
                    duration: 0.75,
                    delay: 0.5,
                    transformOrigin: "left top",
                    stagger: {
                        each: 0.1,
                        from: "random",
                    },
                }
            )

            tl.fromTo(".job-title",
                {
                    y: 20,
                    opacity: 0,
                    scale: 1.2,
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    ease: "elastic.out(1, 0.3)",
                    duration: 1,
                })
        }, component)
        return () => ctx.revert();
    }, []);

    const renderLetters = (name: KeyTextField, key: string) => {
        if (!name) return;
        return name.split("").map((letter, index) => (
            <span
                key={index}
                className={`name-animation name-animation-${key} inline-block opacity-0`}>{letter}</span>
        ));
    }

    return (
        <Bounded
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            ref={component}
        >
            <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center">
                <Shapes/>
                <div className="col-start-1 md:row-start-1">
                    <h1 className="mb-8 text-7xl font-extrabold leading-none tracking-tighter xl:text-9xl"
                        aria-label={slice.primary.first_name + " " + slice.primary.last_name}
                    >
                        <span className="block text-blue-200">
                            {renderLetters(slice.primary.first_name, "first")}
                        </span>
                        <span className="-mt-[.2em] block text-blue-500">
                            {renderLetters(slice.primary.last_name, "last")}
                        </span>
                    </h1>
                    <span
                        className="job-title block bg-gradient-to-br from-amber-500 to-amber-200 bg-clip-text text-transparent text-3xl font-bold uppercase tracking-[.2em] opacity-0">
                        {slice.primary.tag_line}
                    </span>
                </div>
            </div>
        </Bounded>
    );
};

export default Hero;
