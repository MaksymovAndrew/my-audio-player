import * as d3 from 'd3';
import type { IOptions } from './interface';

class Drawer {
  private buffer: AudioBuffer;
  private parent: HTMLElement;

  private svg?: d3.Selection<SVGSVGElement, undefined, null, undefined>;
  private graphGroup?: d3.Selection<SVGGElement, undefined, null, undefined>;
  private cursorGroup?: d3.Selection<SVGGElement, undefined, null, undefined>;

  private graphWidth = 0;
  private graphHeight = 0;
  private margin = { top: 0, bottom: 0, left: 10, right: 10 };

  private onCursorDragCallback?: (time: number) => void;
  private isDragging = false;
  private cursorPosition = 0;

  private get duration(): number {
    return this.buffer.duration;
  }

  constructor(buffer: AudioBuffer, parent: HTMLElement, onCursorDrag?: (time: number) => void) {
    this.buffer = buffer;
    this.parent = parent;
    this.onCursorDragCallback = onCursorDrag;
  }

  private getTimeDomain() {
    const step = 15; // 15 seconds
    const steps = Math.ceil(this.duration / step);

    return [...new Array(steps)].map((_, index) => {
      const date = new Date(1970, 0, 1, 0, 0, 0, 0);
      date.setSeconds(index * step);

      let minutes = date.getMinutes().toString();
      if (minutes.length === 1) {
        minutes = `0${minutes}`;
      }

      let seconds = date.getSeconds().toString();
      if (seconds.length === 1) {
        seconds = `0${seconds}`;
      }

      return `${minutes}:${seconds}`;
    });
  }

  public generateWaveform(
    audioData: number[],
    options: IOptions = {}
  ) {
    const {
      margin = this.margin,
      height = this.parent.clientHeight,
      width = this.parent.clientWidth,
      padding = 1
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
      .domain(domain.map(i => Number(i)))
      .range([margin.top, margin.top + this.graphHeight]);

    const svg = d3.create('svg');

    svg
      .style('width', width)
      .style('height', height)
      .style('display', 'block');

    const graphGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`);

    graphGroup // grid
      .append('g')
      .attr('stroke-width', 0.5)
      .attr('stroke', '#ffd6edb0')
      .call(g =>
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
      .call(g =>
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

    graphGroup // drag everywhere
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
      .attr('height', d => yScale(d))
      .attr('width', () => band * padding)
      .attr('x', (_, i) => xScale(i))
      .attr('y', d => -yScale(d) / 2)
      .attr('rx', band / 2)
      .attr('ry', band / 2);

    const bands = this.getTimeDomain();

    const bandScale = d3
      .scaleBand()
      .domain(bands)
      .range([0, this.graphWidth]);

    graphGroup
      .append('g')
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .call(g => g.select('.domain').remove())
      .attr('stroke-width', 0)
      .style('color', '#930860ff')
      .style('font-size', 11)
      .style('font-weight', 400)
      .call(d3.axisBottom(bandScale.copy()));

    this.graphGroup = graphGroup;

    return svg;
  }

  public clearData() {
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
    return filteredData.map(n => n * multiplier);
  }

  public init() {
    const audioData = this.clearData();
    const node = this.generateWaveform(audioData);
    this.svg = node;
    this.parent.appendChild(node.node() as Element);
    this.createCursor();
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
      .call(g =>
        g.append('line')
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', 0)
          .attr('y2', this.graphHeight)
          .attr('stroke', '#ff1493')
          .attr('stroke-width', 2)
      )
      .call(g =>
        g.append('polygon')
          .attr('points', '-5,0 5,0 0,7')
          .attr('fill', '#ff1493')
      );

    this.setupDragBehavior();
  }

  private setupDragBehavior() {
    if (!this.cursorGroup || !this.onCursorDragCallback) return;

    const endDrag = () => {
      if (!this.isDragging) return;

      this.svg?.style('cursor', 'default');

      // final time when stopped dragging
      const time = (this.cursorPosition / this.graphWidth) * this.duration;
      this.onCursorDragCallback?.(time);

      this.isDragging = false;
    };

    const drag = d3.drag<SVGGElement, undefined>()
      .on('start', () => {
        this.isDragging = true;
        this.svg?.style('cursor', 'ew-resize');
      })
      .on('drag', (event: d3.D3DragEvent<SVGGElement, undefined, undefined>) => {
        let newX = this.cursorPosition + event.dx;
        newX = Math.max(0, Math.min(newX, this.graphWidth)); // graph dimension

        this.cursorPosition = newX;
        this.cursorGroup?.attr('transform', `translate(${newX}, 0)`)
      })
      .on('end', endDrag);

    this.cursorGroup.call(drag);
  }

  public updateCursor(currentTime: number) {
    if (!this.cursorGroup) return;
    if (this.isDragging) return;

    const position = (currentTime / this.duration) * this.graphWidth;
    this.cursorPosition = position;
    this.cursorGroup.attr('transform', `translate(${position}, 0)`);
  }

  public resetCursor() {
    if (!this.cursorGroup) return;

    this.cursorPosition = 0;
    this.cursorGroup.attr('transform', `translate(${this.cursorPosition}, 0)`);
  }

  public destroy() {
    this.cursorGroup?.on('.drag', null);
    this.svg?.remove();

    this.svg = undefined;
    this.graphGroup = undefined;
    this.cursorGroup = undefined;
  }
}

export default Drawer;