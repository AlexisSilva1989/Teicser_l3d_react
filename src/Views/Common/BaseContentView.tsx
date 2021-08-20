import { PropsWithChildren } from 'react';
import React from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { Row, Col } from 'react-bootstrap';

interface Props {
	title?: string
}

export const BaseContentView = (props: PropsWithChildren<Props>) => {
	const { capitalize: caps } = useFullIntl();
	return (
		<Row className='p-3 bg-white'>
			{props.title && (
				<Col sm={12} className='mb-4'>
					<h3>{caps(props.title)}</h3>
				</Col>
			)}
			{props.children}
		</Row>
	);
};
