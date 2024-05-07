"use client";

import React, {useEffect, useRef, useState} from 'react';
import {asImageSrc, Content, isFilled} from "@prismicio/client";
import {MdArrowOutward} from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

type ContentListProps = {
    items: Content.BlogPostDocument[] | Content.ProjectsDocument[];
    contentType: Content.ContentIndexSlice['primary']['content_type'];
    fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
    viewMoreText: Content.ContentIndexSlice['primary']['view_more_text'];
}

const ContentList = ({
                         items,
                         contentType,
                        fallbackItemImage,
                         viewMoreText = "Read More",
                     }: ContentListProps) => {
    const component = useRef(null);
    const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

    // @ts-ignore
    const urlPrefix = contentType === "Blog" ? "/blog" : "/project";

    const revealRef = useRef(null);
    const [currentItem, setCurrentItem] = useState<null | number>(null);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        // Animate list-items in with a stagger
        let ctx = gsap.context(() => {
            itemsRef.current.forEach((item, index) => {
                gsap.fromTo(
                    item,
                    {
                        opacity: 0,
                        y: 60,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.3,
                        ease: "easeOut",
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: item,
                            start: "top bottom-=100px",
                            end: "bottom center",
                            toggleActions: "play none none none",
                        },
                    },
                );
            });

            return () => ctx.revert(); // cleanup
        }, component);
    }, []);

    const onMouseEnter = (index: number) => {
        setCurrentItem(index);
        if (!hovering) setHovering(true);
    };

    const onMouseLeave = () => {
        setHovering(false);
        setCurrentItem(null);
    };

    const contentImages = items.map((item) => {
        const image = isFilled.image(item.data.hover_image)
            ? item.data.hover_image
            : fallbackItemImage;
        return asImageSrc(image, {
            fit: "cover",
            exp: -10,
        });
    });

    // Preload images
    useEffect(() => {
        contentImages.forEach((url) => {
            if (!url) return;
            const img = new Image();
            img.src = url;
        });
    }, [contentImages]);



    return (
        <div>
            <ul
                ref={component}
                className="grid border-b border-b-slate-100"
                onMouseLeave={onMouseLeave}
            >
                {items.map((item, index) => (
                    <>
                        {isFilled.keyText(item.data.title) && (
                            <li
                                key={index}
                                ref={(el) => {
                                    itemsRef.current[index] = el
                                }}
                                onMouseEnter={() => onMouseEnter(index)}
                                className="list-item opacity-0 relative">
                                <Link
                                    href={urlPrefix + "/" + item.uid}
                                    className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
                                    aria-label={item.data.title}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-3xl font-bold">{item.data.title}</span>
                                        <div className="flex gap-3 text-yellow-400 text-lg font-bold">
                                            {item.tags.map((tag, index) => (
                                                <span key={index}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                                        {viewMoreText} <MdArrowOutward/>
                                    </span>
                                </Link>

                                {/* Hover element */}
                                {hovering && currentItem === index && (
                                <div
                                    className="hover-reveal pointer-events-none absolute left-[55%] top-1/2 -translate-y-1/2 h-[180px] w-[350px] rounded-lg bg-cover opacity-85 bg-center transition-[background] duration-300"
                                    style={{
                                        backgroundImage:
                                            currentItem !== null ? `url(${contentImages[index]})` : "",
                                    }}
                                    ref={revealRef}
                                ></div>
                                )}
                            </li>
                        )}

                    </>
                ))}
            </ul>
        </div>
    );
};

export default ContentList;