import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { RADIUS, drawNetwork, Data, Link, Node } from './draw-network';

type NetworkDiagramProps = {
  width: number;
  height: number;
  data: Data;
  collideRadius: number;
  manyBodyStrength: number;
  forceYStrength: number;
};

export const NetworkDiagram = ({
  width,
  height,
  data,
  collideRadius,
  manyBodyStrength,
  forceYStrength,
}: NetworkDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) {
      return;
    }

    const links: Link[] = data.links.map((d: any) => ({ ...d }));
    const nodes: Node[] = data.nodes.map((d: any) => ({ ...d }));

    d3.forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink<Node, Link>(links).id((d: { id: any; }) => d.id)
      )
      .force('collide', d3.forceCollide().radius(collideRadius).strength(1))
      .force('charge', d3.forceManyBody().strength(manyBodyStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceY(0).strength(forceYStrength))
      .on('tick', () => {
        drawNetwork(context, width, height, nodes, links);
      });
  }, [
    width,
    height,
    data,
    collideRadius,
    manyBodyStrength,
    forceYStrength,
  ]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          width,
          height,
        }}
        width={width}
        height={height}
      />
    </div>
  );
};
