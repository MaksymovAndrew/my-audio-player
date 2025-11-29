import * as d3 from 'd3';
import type {
    DrawerOptions,
    D3SvgSelection,
    D3GroupSelection,
    D3TextSelection,
    D3Timer,
} from '../../../types/drawerTypes';
import type { ThrottledFunction } from '../../../types/utilitiesTypes';
import { formatTime } from '../../../utils/formatTime';
import { throttle } from '../../../utils/throttle';

class Drawer {
    private buffer: AudioBuffer;
    private parent: HTMLElement;

    private svg?: D3SvgSelection;
    private graphGroup?: D3GroupSelection;
    private cursorGroup?: D3GroupSelection;
    private cursorText?: D3TextSelection;
    private animationTimer?: D3Timer;
    private throttledCursorUpdate?: ThrottledFunction<[number]>;

    private graphWidth = 0;
    private graphHeight = 0;
    private margin = { top: 0, bottom: 25, left: 20, right: 20 };

    private cursorPosition = 0;
    private isDragging = false;
    private onCursorDragCallback?: (time: number) => void;

    constructor(buffer: AudioBuffer, parent: HTMLElement, onCursorDrag?: (time: number) => void) {
        this.buffer = buffer;
        this.parent = parent;
        this.onCursorDragCallback = onCursorDrag;
    }

    private get duration(): number {
        return this.buffer.duration;
    }

    public init() {
        const audioData = this.clearData();
        const node = this.generateWaveform(audioData);
        this.svg = node;
        this.parent.appendChild(node.node() as Element);
        this.createCursor();
    }

    public updateCursor(currentTime: number) {
        if (!this.cursorGroup || this.isDragging) return;

        const position = (currentTime / this.duration) * this.graphWidth;
        this.cursorPosition = position;
        this.cursorGroup.attr('transform', `translate(${position}, 0)`);
        this.cursorText?.text(formatTime(currentTime));
    }

    public startAnimation(getCurrentTime: () => number) {
        this.stopAnimation(); // no duplicate timers if called multiple times (just in case)

        this.animationTimer = d3.timer(() => {
            this.updateCursor(getCurrentTime());
        });
    }

    public stopAnimation() {
        if (this.animationTimer) {
            this.animationTimer.stop();
            this.animationTimer = undefined;
        }
    }

    public resetCursor() {
        if (!this.cursorGroup) return;

        this.cursorPosition = 0;
        this.cursorGroup.attr('transform', `translate(${this.cursorPosition}, 0)`);
        this.cursorText?.text(formatTime(0));
    }

    public destroy() {
        this.stopAnimation();
        this.throttledCursorUpdate?.cancel();
        this.cursorGroup?.on('.drag', null);
        this.svg?.remove();

        this.svg = undefined;
        this.graphGroup = undefined;
        this.cursorGroup = undefined;
        this.throttledCursorUpdate = undefined;
    }

    private generateWaveform(audioData: number[], options: DrawerOptions = {}) {
        const {
            margin = this.margin,
            height = this.parent.clientHeight,
            width = this.parent.clientWidth,
            padding = 1,
        } = options;

        this.graphWidth = width - margin.left - margin.right;
        this.graphHeight = height - margin.top - margin.bottom;

        const domain = d3.extent(audioData);

        const xScale = d3
            .scaleLinear()
            .domain([0, audioData.length - 1])
            .range([0, this.graphWidth]);

        const yScale = d3
            .scaleLinear()
            .domain(domain.map((i) => Number(i)))
            .range([margin.top, margin.top + this.graphHeight]);

        const svg = d3.create('svg');

        svg.style('width', width).style('height', height).style('display', 'block');

        const graphGroup = svg.append('g').attr('transform', `translate(${margin.left}, 0)`);

        graphGroup // grid
            .append('g')
            .attr('stroke-width', 0.5)
            .attr('stroke', '#ffd6edb0')
            .call((g) =>
                g
                    .append('g')
                    .selectAll('line')
                    .data(xScale.ticks())
                    .join('line')
                    .attr('x1', (d: d3.NumberValue) => 0.5 + xScale(d))
                    .attr('x2', (d: d3.NumberValue) => 0.5 + xScale(d))
                    .attr('y1', 0)
                    .attr('y2', height)
            )
            .call((g) =>
                g
                    .append('g')
                    .selectAll('line')
                    .data(yScale.ticks())
                    .join('line')
                    .attr('y1', (d: d3.NumberValue) => yScale(d))
                    .attr('y2', (d: d3.NumberValue) => yScale(d))
                    .attr('x1', 0)
                    .attr('x2', width)
            );

        graphGroup // click everywhere
            .append('rect')
            .attr('width', this.graphWidth)
            .attr('height', height)
            .attr('fill', 'rgba(255, 255, 255, 0)');

        const g = graphGroup // center graph
            .append('g')
            .attr('transform', `translate(0, ${height / 2})`)
            .attr('fill', '#ff1493');

        const band = this.graphWidth / audioData.length;

        g.selectAll('rect')
            .data(audioData)
            .join('rect')
            .attr('fill', '#ff1493')
            .attr('height', (d) => yScale(d))
            .attr('width', () => band * padding)
            .attr('x', (_, i) => xScale(i))
            .attr('y', (d) => -yScale(d) / 2)
            .attr('rx', band / 2)
            .attr('ry', band / 2);

        // scale seconds -> pixels
        const timeScale = d3.scaleLinear().domain([0, this.duration]).range([0, this.graphWidth]);

        const step = 15; // 15 seconds
        const tickValues = [0]; // always show start time

        for (let i = step; i < this.duration; i += step) {
            tickValues.push(i);
        }

        // always show end time
        if (this.duration > 0 && tickValues[tickValues.length - 1] !== this.duration) {
            tickValues.push(this.duration);
        }

        graphGroup // time scale
            .append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call((g) => g.select('.domain').remove())
            .attr('stroke-width', 0)
            .style('color', '#930860ff')
            .style('font-size', 11)
            .style('font-weight', 400)
            .call(
                d3
                    .axisBottom(timeScale) // use timeScale for calc correct points position
                    .tickValues(tickValues) // points
                    .tickFormat((d) => formatTime(Number(d)))
            );

        this.graphGroup = graphGroup;

        return svg;
    }

    private clearData() {
        const rawData = this.buffer.getChannelData(0); // We only need to work with one channel of data
        const samples = this.buffer.sampleRate; // Number of samples we want to have in our final data set
        const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
        const filteredData = [];
        for (let i = 0; i < samples; i += 1) {
            const blockStart = blockSize * i; // the location of the first sample in the block
            let sum = 0;
            for (let j = 0; j < blockSize; j += 1) {
                sum += Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
            }
            filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
        }
        const multiplier = Math.max(...filteredData) ** -1;
        return filteredData.map((n) => n * multiplier);
    }

    private createCursor() {
        if (!this.graphGroup) return;

        this.cursorPosition = 0;

        this.cursorGroup = this.graphGroup
            .append('g')
            .attr('transform', `translate(${this.cursorPosition}, 0)`)
            .style('will-change', 'transform') // creates separate gpu layer for performance
            .style('isolation', 'isolate') //  prevents color blending artifacts
            .style('cursor', 'ew-resize')
            .call((g) =>
                g
                    .append('rect') // invisible drag area (hitbox)
                    .attr('x', -10)
                    .attr('y', 0)
                    .attr('width', 20)
                    .attr('height', this.graphHeight)
                    .attr('fill', 'transparent')
                    .style('cursor', 'ew-resize')
            )
            .call((g) =>
                g
                    .append('line')
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('y1', 20)
                    .attr('y2', this.graphHeight)
                    .attr('stroke', '#ff1493')
                    .attr('stroke-width', 2)
            )
            .call((g) =>
                g.append('polygon').attr('points', '-5,20 5,20 0,27').attr('fill', '#ff1493')
            );

        this.cursorText = this.cursorGroup
            .append('text')
            .attr('x', 0)
            .attr('y', 17)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ff1493')
            .attr('font-size', '12px')
            .attr('font-weight', '600')
            .style('pointer-events', 'none')
            .style('user-select', 'none')
            .text(formatTime(0));

        this.setupDragBehavior();
    }

    private getTimeFromPosition(position: number): number {
        return (position / this.graphWidth) * this.duration;
    }

    private setupDragBehavior() {
        if (!this.cursorGroup || !this.onCursorDragCallback) return;

        const endDrag = () => {
            if (!this.isDragging) return;

            this.svg?.style('cursor', 'default');
            document.body.classList.remove('dragging-cursor');

            // final time when stopped dragging
            const time = this.getTimeFromPosition(this.cursorPosition);
            this.onCursorDragCallback?.(time);

            this.isDragging = false;
        };

        this.throttledCursorUpdate = throttle((position: number) => {
            const time = this.getTimeFromPosition(position);
            this.cursorText?.text(formatTime(time));
            this.cursorGroup?.attr('transform', `translate(${position}, 0)`);
        }, 8);

        const drag = d3
            .drag<SVGGElement, undefined>()
            .on('start', () => {
                this.isDragging = true;
                this.svg?.style('cursor', 'ew-resize');
                document.body.classList.add('dragging-cursor');
            })
            .on('drag', (event: d3.D3DragEvent<SVGGElement, undefined, undefined>) => {
                let newX = this.cursorPosition + event.dx;
                newX = Math.max(0, Math.min(newX, this.graphWidth)); // graph dimension

                this.cursorPosition = newX;
                this.throttledCursorUpdate?.(newX);
            })
            .on('end', endDrag);

        this.cursorGroup.call(drag);
    }
}

export default Drawer;
