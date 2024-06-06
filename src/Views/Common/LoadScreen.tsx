import React from 'react';
import { BounceLoader } from 'react-spinners';
import { useLocalization } from '../../Common/Hooks/useLocalization';

interface Props {
	background?: string
	foreground?: string
}

export const LoadScreen = (props: Props) => {
	const { message } = useLocalization();
	return	<div style={{ background: props.background ?? 'var(--primary)', height: '100vh', width: '100vw', position: 'absolute', zIndex: 999999 }}>
		<div style={{ position: 'relative', top: '35vh' }}>
			<BounceLoader size={100} color={props.foreground ?? 'white'} css={{ margin: '0px auto' } as any} />
			<p className='text-center display-4 mt-4 loading-text' style={{ color: props.foreground ?? 'white' }}>
				{message('meta.loading')}
			</p>
		</div>
	</div>;
};
