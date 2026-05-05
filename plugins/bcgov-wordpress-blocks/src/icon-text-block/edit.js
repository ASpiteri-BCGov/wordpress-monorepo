import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
} from '@wordpress/block-editor';
/* eslint-disable import/no-extraneous-dependencies -- @wordpress/components is provided in the monorepo workspace */
import { PanelBody, RadioControl } from '@wordpress/components';
/* eslint-enable import/no-extraneous-dependencies */
import './editor.scss';

const INNER_BLOCKS_TEMPLATE = [
    [
        'bcgov-wordpress-blocks/icon',
        {
            lock: {
                move: true,
                remove: true,
            },
        },
    ],
    [ 'core/heading' ],
    [ 'core/paragraph' ],
    [ 'core/list' ],
    [ 'core/buttons' ],
];

const ALLOWED_BLOCKS = [
    'bcgov-wordpress-blocks/icon',
    'core/heading',
    'core/paragraph',
    'core/list',
    'core/buttons',
];

/**
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Persisted attributes.
 * @param {Function} props.setAttributes Updates attributes.
 * @return {import('react').ReactElement} Editor element.
 */
const Edit = ( { attributes = {}, setAttributes = () => {} } = {} ) => {
    const { layout } = attributes;

    const supportedLayouts = [ 'icon-left', 'icon-top' ];
    const normalizedLayout = supportedLayouts.includes( layout )
        ? layout
        : 'icon-left';
    const layoutClass = `is-layout-${ normalizedLayout }`;

    const blockProps = useBlockProps( {
        className: `bcgov-wp-blocks-icon-text-block ${ layoutClass }`,
    } );

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'bcgov-wp-blocks-icon-text-block__layout-shell',
        },
        {
            template: INNER_BLOCKS_TEMPLATE,
            allowedBlocks: ALLOWED_BLOCKS,
            templateLock: false,
        }
    );

    return (
        <>
            <InspectorControls>
                <PanelBody
                    title={ __( 'Layout', 'bcgov-wordpress-blocks' ) }
                    initialOpen
                >
                    <RadioControl
                        label={ __(
                            'Icon/Text arrangement',
                            'bcgov-wordpress-blocks'
                        ) }
                        selected={ layout }
                        options={ [
                            {
                                label: __(
                                    'Icon left, content right',
                                    'bcgov-wordpress-blocks'
                                ),
                                value: 'icon-left',
                            },
                            {
                                label: __(
                                    'Icon top, content below',
                                    'bcgov-wordpress-blocks'
                                ),
                                value: 'icon-top',
                            },
                        ] }
                        onChange={ ( value ) =>
                            setAttributes( { layout: value } )
                        }
                    />
                </PanelBody>
            </InspectorControls>
            <div { ...blockProps }>
                <div { ...innerBlocksProps } />
            </div>
        </>
    );
};

export default Edit;
