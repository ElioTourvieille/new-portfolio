import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import {PrismicNextImage, PrismicNextLink} from "@prismicio/next";

/**
 * Props for `ImageBlock`.
 */
export type ImageBlockProps = SliceComponentProps<Content.ImageBlockSlice>;

/**
 * Component for "ImageBlock" Slices.
 */
const ImageBlock = ({ slice }: ImageBlockProps): JSX.Element => {
  return (
    <PrismicNextImage className="w-2/3" field={slice.primary.image} imgixParams={{ w: 200 }} />
  );
};

export default ImageBlock;
