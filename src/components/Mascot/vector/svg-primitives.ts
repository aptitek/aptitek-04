import { createElement, type FC, type SVGProps } from 'react';

export const Svg: FC<SVGProps<SVGSVGElement>> = (props) => createElement('svg', props);
export const G: FC<SVGProps<SVGGElement>> = (props) => createElement('g', props);
export const Path: FC<SVGProps<SVGPathElement>> = (props) => createElement('path', props);
export const Circle: FC<SVGProps<SVGCircleElement>> = (props) => createElement('circle', props);
export const Ellipse: FC<SVGProps<SVGEllipseElement>> = (props) => createElement('ellipse', props);
export const SvgImage: FC<SVGProps<SVGImageElement>> = (props) => createElement('image', props);
