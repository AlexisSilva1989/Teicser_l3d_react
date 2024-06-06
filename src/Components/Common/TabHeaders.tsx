import { Nav } from 'react-bootstrap';
import React, { ReactNode } from 'react';

interface IProps {
	activeKey?: string
	options: {
		key: string
		title: ReactNode
	}[]
}

export const TabHeaders = (props: IProps) => {
	return <Nav variant='tabs'>
		{props.options.map((x, i) => {
			return <Nav.Item key={i} className={x.key === props.activeKey ? 'border border-bottom-0 rounded-top' : ''}>
				<Nav.Link eventKey={x.key}>{x.title}</Nav.Link>
			</Nav.Item>;
		})}
	</Nav>;
};