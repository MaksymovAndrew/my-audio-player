import type * as d3 from 'd3';

export interface DrawerOptions {
    margin?: { top: number; bottom: number; left: number; right: number };
    height?: number;
    width?: number;
    padding?: number;
}

export type D3SvgSelection = d3.Selection<SVGSVGElement, undefined, null, undefined>;
export type D3GroupSelection = d3.Selection<SVGGElement, undefined, null, undefined>;
export type D3TextSelection = d3.Selection<SVGTextElement, undefined, null, undefined>;
export type D3Timer = d3.Timer;
