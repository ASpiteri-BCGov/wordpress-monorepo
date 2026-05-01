import { __ } from '@wordpress/i18n';
import {
    InnerBlocks,
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
/* eslint-disable import/no-extraneous-dependencies -- @wordpress/components is provided in the monorepo workspace */
import {
    BaseControl,
    Button,
    PanelBody,
    RadioControl,
    SearchControl,
    SelectControl,
    TextControl,
    ToggleControl,
} from '@wordpress/components';
/* eslint-enable import/no-extraneous-dependencies */
import { useState } from '@wordpress/element';
import {
    getIconGlyphA11yProps,
    getIconWrapperA11yProps,
} from '../icon/icon-accessibility';
import { ICON_ALLOWLIST, ICON_ALLOWLIST_MAP } from '../icon/icon-allowlist';
import { getIconWrapperClasses } from '../icon/icon-classes';
import './editor.scss';

const TEMPLATE = [
    [ 'core/heading' ],
    [ 'core/paragraph' ],
    [ 'core/list' ],
    [ 'core/buttons' ],
];
const ALLOWED_TEXT_BLOCKS = [
    'core/heading',
    'core/paragraph',
    'core/list',
    'core/buttons',
];

const Edit = ( { attributes = {}, setAttributes = () => {} } = {} ) => {
    const { accessibleName, iconId, iconSize, isDecorative, layout } =
        attributes;
    const [ iconQuery, setIconQuery ] = useState( '' );

    const supportedLayouts = [ 'icon-left', 'icon-top' ];
    const normalizedLayout = supportedLayouts.includes( layout )
        ? layout
        : 'icon-left';
    const layoutClass = `is-layout-${ normalizedLayout }`;
    const selectedIcon = ICON_ALLOWLIST_MAP[ iconId ];

    const sizeSelectOptions = [
        {
            value: 'small',
            label: __( 'Small', 'bcgov-wordpress-blocks' ),
        },
        {
            value: 'medium',
            label: __( 'Medium', 'bcgov-wordpress-blocks' ),
        },
        {
            value: 'large',
            label: __( 'Large', 'bcgov-wordpress-blocks' ),
        },
        {
            value: 'xlarge',
            label: __( 'XLarge', 'bcgov-wordpress-blocks' ),
        },
    ];

    const filteredIcons = ICON_ALLOWLIST.filter( ( option ) => {
        const query = iconQuery.trim().toLowerCase();
        if ( ! query ) {
            return true;
        }

        return (
            option.label.toLowerCase().includes( query ) ||
            option.id.toLowerCase().includes( query )
        );
    } );

    const blockProps = useBlockProps( {
        className: `bcgov-wp-blocks-icon-text-block ${ layoutClass }`,
    } );

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
                <PanelBody
                    title={ __( 'Icon', 'bcgov-wordpress-blocks' ) }
                    initialOpen
                >
                    <BaseControl
                        id="bcgov-wp-blocks-icon-text-search"
                        label={ __( 'Pick an icon', 'bcgov-wordpress-blocks' ) }
                        __nextHasNoMarginBottom
                    >
                        <SearchControl
                            __nextHasNoMarginBottom
                            value={ iconQuery }
                            onChange={ setIconQuery }
                            placeholder={ __(
                                'Search icons',
                                'bcgov-wordpress-blocks'
                            ) }
                        />
                        <div className="bcgov-wp-blocks-icon-picker-list">
                            { filteredIcons.map( ( { id, label, faClass } ) => (
                                <Button
                                    key={ id }
                                    variant={
                                        iconId === id ? 'primary' : 'secondary'
                                    }
                                    className="bcgov-wp-blocks-icon-picker-item"
                                    onClick={ () =>
                                        setAttributes( { iconId: id } )
                                    }
                                >
                                    <i className={ faClass } aria-hidden />
                                    <span>{ label }</span>
                                </Button>
                            ) ) }
                        </div>
                    </BaseControl>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Icon size', 'bcgov-wordpress-blocks' ) }
                        value={ iconSize }
                        options={ sizeSelectOptions }
                        onChange={ ( value ) =>
                            setAttributes( { iconSize: value } )
                        }
                    />
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( 'Decorative', 'bcgov-wordpress-blocks' ) }
                        checked={ true === isDecorative }
                        onChange={ ( value ) =>
                            setAttributes( { isDecorative: value } )
                        }
                    />
                    { true !== isDecorative ? (
                        <TextControl
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                            label={ __(
                                'Accessible name',
                                'bcgov-wordpress-blocks'
                            ) }
                            value={ accessibleName }
                            onChange={ ( value ) =>
                                setAttributes( { accessibleName: value } )
                            }
                            placeholder={
                                selectedIcon?.label ||
                                __(
                                    'Uses icon label if empty',
                                    'bcgov-wordpress-blocks'
                                )
                            }
                        />
                    ) : null }
                </PanelBody>
            </InspectorControls>
            <div { ...blockProps }>
                <div className="bcgov-wp-blocks-icon-text-block__layout-shell">
                    <div
                        className={ `bcgov-wp-blocks-icon-text-block__icon-section ${ getIconWrapperClasses(
                            {
                                iconSize,
                            }
                        ) }` }
                        { ...getIconWrapperA11yProps( attributes ) }
                    >
                        { selectedIcon ? (
                            <i
                                className={ `bcgov-wp-blocks-icon__preview ${ selectedIcon.faClass }` }
                                { ...getIconGlyphA11yProps( attributes ) }
                            />
                        ) : (
                            <span className="bcgov-wp-blocks-icon__preview">
                                { __( 'Icon', 'bcgov-wordpress-blocks' ) }
                            </span>
                        ) }
                    </div>
                    <div className="bcgov-wp-blocks-icon-text-block__text-section">
                        <InnerBlocks
                            template={ TEMPLATE }
                            allowedBlocks={ ALLOWED_TEXT_BLOCKS }
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
