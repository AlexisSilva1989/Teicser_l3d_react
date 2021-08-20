import React, { ReactNode } from 'react';
import { Col, Button, Accordion, Card } from 'react-bootstrap';
import { useLocalization } from '../../Common/Hooks/useLocalization';
import { IDataTableColumn } from 'react-data-table-component';
import { JumpLabel } from './JumpLabel';
import { ApiTable } from '../Api/ApiTable';

interface Props<T> {
    mainTitle: string
    subTitle?: string
    hasButtonAdd: boolean
	onClickAddButton?: () => void
    reload?: boolean
    dataColumuns: IDataTableColumn<T>[]
    source: string | T[]
    onSelect?: (row: T) => void
    children?: ReactNode
}

export const AccordionSection = <T extends unknown = any>(props: Props<T>) => {

	const { title, input, meta } = useLocalization();

    return (
        <Accordion defaultActiveKey='0'>
            <Card>
                <Accordion.Toggle style={{ cursor: 'pointer' }} as={Card.Header} eventKey='0'>
                    <b className='text-primary'>{title(props.mainTitle)}</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='0'>
                    <Card.Body className='row'>
                        {props.hasButtonAdd && <><Col sm={6} className='mb-2'>
                            <JumpLabel />
                            <label><b>{props.subTitle && input(props.subTitle)}:</b></label>
                        </Col>
                            <Col sm={6} className='mb-2 text-right'>
                                <Button variant='outline-primary' onClick={props.onClickAddButton}>
                                    <i className='fas fa-plus mr-3' />
                                    {meta('add')}
                                </Button>
                            </Col></>
                        }
                        <Col sm={12} className='mb-3'>
                            <ApiTable<T>
                                columns={props.dataColumuns} 
                                source={props.source} 
                                reload={props.reload} 
                                onSelect={props.onSelect} 
                            />
                        </Col>
                        {props.children}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}