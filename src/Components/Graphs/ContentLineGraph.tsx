import React, { useEffect, useRef } from 'react';
import { Col } from 'react-bootstrap';
import LineGraph, { serieData } from './LineGraph';

interface ContentLineGraphProps {
  index: number
  title: string
  dataLine: ApexAxisChartSeries | serieData[]
  dataMedicion: ApexAxisChartSeries | serieData[]
  timestamps: string[]
  dataSelected:  {
    x?: string | number | undefined;
    y?: number | null | undefined;
    date?: string | undefined;
    position?: number | undefined;
  }
  fecha_medicion: string
  showMediciones: boolean
  puntoCritico: number | undefined
  onImageRef?: (ref: HTMLDivElement) => void
}

const ContentLineGraph: React.FC<ContentLineGraphProps> = ({ 
  index,
  title,
  dataLine,
  dataMedicion,
  timestamps,
  dataSelected,
  fecha_medicion,
  showMediciones,
  puntoCritico,
  onImageRef
}) => {
  const imageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (onImageRef && imageRef.current) {
      onImageRef(imageRef.current);
    }
  }, [onImageRef, imageRef]);

  return (
    <Col sm={4} 
      id={`graph-content-${index}`} 
      style={{ height: '36vh' }} 
      ref={imageRef} 
      className='py-3' 
      key={`graph-component-${index}`
    }>
      <Col className='h-100 p-0'>
        <LineGraph 
          title={title}
          dataLine={dataLine}
          dataMedicion={dataMedicion}
          timestamps={timestamps}
          dataSelected={dataSelected}
          fecha_medicion={fecha_medicion}
          showMediciones={showMediciones}
          puntoCritico={puntoCritico}
        />
      </Col>
    </Col>
  );
};

export default ContentLineGraph;